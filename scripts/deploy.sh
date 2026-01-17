#!/bin/bash

# Main deployment script
# This script reads deploy-config.json and routes to the appropriate provider script

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Get the directory of this script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$( cd "$SCRIPT_DIR/.." && pwd )"

# Check if deploy-config.json exists
if [ ! -f "$PROJECT_ROOT/deploy-config.json" ]; then
    echo -e "${RED}Error: deploy-config.json not found${NC}"
    echo "Please create deploy-config.json in the project root"
    exit 1
fi

# Read provider from config
PROVIDER=$(node -e "const config = require('$PROJECT_ROOT/deploy-config.json'); console.log(config.provider || 'aws')")

echo -e "${GREEN}Deploying to: ${PROVIDER}${NC}"

# Route to appropriate deployment script
case $PROVIDER in
    aws)
        "$SCRIPT_DIR/deploy-aws.sh" "$@"
        ;;
    gcs|google|gcp)
        "$SCRIPT_DIR/deploy-gcs.sh" "$@"
        ;;
    azure)
        "$SCRIPT_DIR/deploy-azure.sh" "$@"
        ;;
    *)
        echo -e "${RED}Error: Unknown provider: ${PROVIDER}${NC}"
        echo "Supported providers: aws, gcs, azure"
        exit 1
        ;;
esac
