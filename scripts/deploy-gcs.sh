#!/bin/bash

# Google Cloud Storage Deployment Script
# This script deploys the static website to Google Cloud Storage

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Get the directory of this script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$( cd "$SCRIPT_DIR/.." && pwd )"

# Check if gsutil is installed
if ! command -v gsutil &> /dev/null; then
    echo -e "${RED}Error: gsutil is not installed${NC}"
    echo "Install Google Cloud SDK from: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Check if deploy-config.json exists
if [ ! -f "$PROJECT_ROOT/deploy-config.json" ]; then
    echo -e "${RED}Error: deploy-config.json not found${NC}"
    exit 1
fi

# Read configuration
BUCKET=$(node -e "const config = require('$PROJECT_ROOT/deploy-config.json'); console.log(config.gcs.bucket || '')")
REGION=$(node -e "const config = require('$PROJECT_ROOT/deploy-config.json'); console.log(config.gcs.region || 'us-central1')")
INDEX_DOC=$(node -e "const config = require('$PROJECT_ROOT/deploy-config.json'); console.log(config.gcs.website.mainPageSuffix || 'index.html')")
ERROR_DOC=$(node -e "const config = require('$PROJECT_ROOT/deploy-config.json'); console.log(config.gcs.website.notFoundPage || 'index.html')")

if [ -z "$BUCKET" ]; then
    echo -e "${RED}Error: GCS bucket name not configured${NC}"
    echo "Please set gcs.bucket in deploy-config.json"
    exit 1
fi

echo -e "${GREEN}Deploying to Google Cloud Storage${NC}"
echo "Bucket: $BUCKET"
echo "Region: $REGION"

# Check if bucket exists, create if it doesn't
if ! gsutil ls -b "gs://$BUCKET" &> /dev/null; then
    echo -e "${YELLOW}Creating bucket: $BUCKET${NC}"
    gsutil mb -l "$REGION" "gs://$BUCKET"
fi

# Configure bucket for static website hosting
echo -e "${YELLOW}Configuring static website hosting...${NC}"
gsutil web set -m "$INDEX_DOC" -e "$ERROR_DOC" "gs://$BUCKET"

# Set bucket to be publicly readable
echo -e "${YELLOW}Setting public access...${NC}"
gsutil iam ch allUsers:objectViewer "gs://$BUCKET"

# Upload files with appropriate cache control
echo -e "${YELLOW}Uploading files...${NC}"

# Upload static assets with long cache
gsutil -m rsync -r -x "\.git/|\.gitignore|node_modules/|backend/|.*\.md|deploy-config\.json|\.env.*|.*\.sh|Dockerfile|docker-compose\.yml|nginx\.conf" \
    -h "Cache-Control:public, max-age=31536000" \
    "$PROJECT_ROOT" "gs://$BUCKET"

# Upload HTML, CSS, JS with shorter cache
gsutil -m cp -r "$PROJECT_ROOT"/*.html "gs://$BUCKET/" 2>/dev/null || true
gsutil -m cp -r "$PROJECT_ROOT"/*.css "gs://$BUCKET/" 2>/dev/null || true
gsutil -m cp -r "$PROJECT_ROOT"/*.js "gs://$BUCKET/" 2>/dev/null || true

# Set content types
echo -e "${YELLOW}Setting content types...${NC}"
gsutil -m setmeta -h "Content-Type:text/html" "gs://$BUCKET/**/*.html"
gsutil -m setmeta -h "Content-Type:text/css" "gs://$BUCKET/**/*.css"
gsutil -m setmeta -h "Content-Type:application/javascript" "gs://$BUCKET/**/*.js"

# Get website URL
WEBSITE_URL="https://storage.googleapis.com/$BUCKET/index.html"

echo -e "${GREEN}Deployment complete!${NC}"
echo -e "${GREEN}Website URL: $WEBSITE_URL${NC}"
echo -e "${YELLOW}Note: For custom domain, configure it in Google Cloud Console${NC}"
