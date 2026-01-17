#!/bin/bash

# Azure Blob Storage Deployment Script
# This script deploys the static website to Azure Blob Storage

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Get the directory of this script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$( cd "$SCRIPT_DIR/.." && pwd )"

# Check if Azure CLI is installed
if ! command -v az &> /dev/null; then
    echo -e "${RED}Error: Azure CLI is not installed${NC}"
    echo "Install it from: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli"
    exit 1
fi

# Check if deploy-config.json exists
if [ ! -f "$PROJECT_ROOT/deploy-config.json" ]; then
    echo -e "${RED}Error: deploy-config.json not found${NC}"
    exit 1
fi

# Read configuration
STORAGE_ACCOUNT=$(node -e "const config = require('$PROJECT_ROOT/deploy-config.json'); console.log(config.azure.storageAccount || '')")
CONTAINER=$(node -e "const config = require('$PROJECT_ROOT/deploy-config.json'); console.log(config.azure.container || '$web')")
RESOURCE_GROUP=$(node -e "const config = require('$PROJECT_ROOT/deploy-config.json'); console.log(config.azure.resourceGroup || '')")
LOCATION=$(node -e "const config = require('$PROJECT_ROOT/deploy-config.json'); console.log(config.azure.location || 'eastus')")
INDEX_DOC=$(node -e "const config = require('$PROJECT_ROOT/deploy-config.json'); console.log(config.azure.website.indexDocument || 'index.html')")
ERROR_DOC=$(node -e "const config = require('$PROJECT_ROOT/deploy-config.json'); console.log(config.azure.website.errorDocument || 'index.html')")

if [ -z "$STORAGE_ACCOUNT" ]; then
    echo -e "${RED}Error: Azure storage account not configured${NC}"
    echo "Please set azure.storageAccount in deploy-config.json"
    exit 1
fi

echo -e "${GREEN}Deploying to Azure Blob Storage${NC}"
echo "Storage Account: $STORAGE_ACCOUNT"
echo "Container: $CONTAINER"
echo "Location: $LOCATION"

# Check if storage account exists, create if it doesn't
if ! az storage account show --name "$STORAGE_ACCOUNT" --resource-group "$RESOURCE_GROUP" &> /dev/null; then
    echo -e "${YELLOW}Creating storage account: $STORAGE_ACCOUNT${NC}"
    if [ -z "$RESOURCE_GROUP" ]; then
        echo -e "${RED}Error: Resource group not specified${NC}"
        exit 1
    fi
    az storage account create \
        --name "$STORAGE_ACCOUNT" \
        --resource-group "$RESOURCE_GROUP" \
        --location "$LOCATION" \
        --sku Standard_LRS \
        --kind StorageV2
fi

# Enable static website hosting
echo -e "${YELLOW}Enabling static website hosting...${NC}"
az storage blob service-properties update \
    --account-name "$STORAGE_ACCOUNT" \
    --static-website \
    --404-document "$ERROR_DOC" \
    --index-document "$INDEX_DOC"

# Get connection string
CONNECTION_STRING=$(az storage account show-connection-string \
    --name "$STORAGE_ACCOUNT" \
    --resource-group "$RESOURCE_GROUP" \
    --query connectionString \
    --output tsv)

# Create container if it doesn't exist (usually $web for static websites)
echo -e "${YELLOW}Ensuring container exists...${NC}"
az storage container create \
    --name "$CONTAINER" \
    --connection-string "$CONNECTION_STRING" \
    --public-access blob \
    --fail-on-exist false

# Upload files
echo -e "${YELLOW}Uploading files...${NC}"

# Upload all files except excluded ones
az storage blob upload-batch \
    --account-name "$STORAGE_ACCOUNT" \
    --destination "$CONTAINER" \
    --source "$PROJECT_ROOT" \
    --pattern "*" \
    --exclude-pattern "*.git/*;*.gitignore;node_modules/*;backend/*;*.md;deploy-config.json;.env*;*.sh;Dockerfile;docker-compose.yml;nginx.conf" \
    --content-cache-control "public, max-age=31536000" \
    --overwrite

# Upload HTML, CSS, JS with shorter cache
for file in "$PROJECT_ROOT"/*.html; do
    if [ -f "$file" ]; then
        az storage blob upload \
            --account-name "$STORAGE_ACCOUNT" \
            --container-name "$CONTAINER" \
            --name "$(basename "$file")" \
            --file "$file" \
            --content-type "text/html" \
            --content-cache-control "public, max-age=3600" \
            --overwrite
    fi
done

# Get website URL
WEBSITE_URL=$(az storage account show \
    --name "$STORAGE_ACCOUNT" \
    --resource-group "$RESOURCE_GROUP" \
    --query "primaryEndpoints.web" \
    --output tsv)

echo -e "${GREEN}Deployment complete!${NC}"
echo -e "${GREEN}Website URL: $WEBSITE_URL${NC}"
