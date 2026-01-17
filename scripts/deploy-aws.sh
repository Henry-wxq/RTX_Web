#!/bin/bash

# AWS S3 Deployment Script
# This script deploys the static website to AWS S3

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Get the directory of this script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$( cd "$SCRIPT_DIR/.." && pwd )"

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo -e "${RED}Error: AWS CLI is not installed${NC}"
    echo "Install it from: https://aws.amazon.com/cli/"
    exit 1
fi

# Check if deploy-config.json exists
if [ ! -f "$PROJECT_ROOT/deploy-config.json" ]; then
    echo -e "${RED}Error: deploy-config.json not found${NC}"
    exit 1
fi

# Read configuration
BUCKET=$(node -e "const config = require('$PROJECT_ROOT/deploy-config.json'); console.log(config.aws.bucket || '')")
REGION=$(node -e "const config = require('$PROJECT_ROOT/deploy-config.json'); console.log(config.aws.region || 'us-east-1')")
INDEX_DOC=$(node -e "const config = require('$PROJECT_ROOT/deploy-config.json'); console.log(config.aws.website.indexDocument || 'index.html')")
ERROR_DOC=$(node -e "const config = require('$PROJECT_ROOT/deploy-config.json'); console.log(config.aws.website.errorDocument || 'index.html')")

if [ -z "$BUCKET" ]; then
    echo -e "${RED}Error: AWS bucket name not configured${NC}"
    echo "Please set aws.bucket in deploy-config.json"
    exit 1
fi

echo -e "${GREEN}Deploying to AWS S3${NC}"
echo "Bucket: $BUCKET"
echo "Region: $REGION"

# Check if bucket exists, create if it doesn't
if ! aws s3 ls "s3://$BUCKET" 2>&1 | grep -q 'NoSuchBucket'; then
    echo -e "${YELLOW}Bucket exists${NC}"
else
    echo -e "${YELLOW}Creating bucket: $BUCKET${NC}"
    aws s3 mb "s3://$BUCKET" --region "$REGION"
fi

# Configure bucket for static website hosting
echo -e "${YELLOW}Configuring static website hosting...${NC}"
aws s3 website "s3://$BUCKET" \
    --index-document "$INDEX_DOC" \
    --error-document "$ERROR_DOC"

# Upload files
echo -e "${YELLOW}Uploading files...${NC}"
aws s3 sync "$PROJECT_ROOT" "s3://$BUCKET" \
    --exclude "*.git/*" \
    --exclude "*.gitignore" \
    --exclude "node_modules/*" \
    --exclude "backend/*" \
    --exclude "*.md" \
    --exclude "deploy-config.json" \
    --exclude ".env*" \
    --exclude "*.sh" \
    --exclude "Dockerfile" \
    --exclude "docker-compose.yml" \
    --exclude "nginx.conf" \
    --delete \
    --cache-control "public, max-age=31536000" \
    --exclude "*.html" \
    --exclude "*.css" \
    --exclude "*.js"

# Upload HTML, CSS, JS with shorter cache
aws s3 sync "$PROJECT_ROOT" "s3://$BUCKET" \
    --exclude "*" \
    --include "*.html" \
    --include "*.css" \
    --include "*.js" \
    --cache-control "public, max-age=3600"

# Set proper content types
echo -e "${YELLOW}Setting content types...${NC}"
aws s3 cp "s3://$BUCKET" "s3://$BUCKET" \
    --recursive \
    --exclude "*" \
    --include "*.html" \
    --content-type "text/html" \
    --metadata-directive REPLACE

aws s3 cp "s3://$BUCKET" "s3://$BUCKET" \
    --recursive \
    --exclude "*" \
    --include "*.css" \
    --content-type "text/css" \
    --metadata-directive REPLACE

aws s3 cp "s3://$BUCKET" "s3://$BUCKET" \
    --recursive \
    --exclude "*" \
    --include "*.js" \
    --content-type "application/javascript" \
    --metadata-directive REPLACE

# Set bucket policy for public read access
echo -e "${YELLOW}Setting bucket policy...${NC}"
cat > /tmp/bucket-policy.json <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::$BUCKET/*"
    }
  ]
}
EOF

aws s3api put-bucket-policy --bucket "$BUCKET" --policy file:///tmp/bucket-policy.json
rm /tmp/bucket-policy.json

# Get website URL
WEBSITE_URL=$(aws s3api get-bucket-website --bucket "$BUCKET" --query 'WebsiteConfiguration.RedirectAllRequestsTo' --output text 2>/dev/null || echo "")
if [ -z "$WEBSITE_URL" ]; then
    WEBSITE_URL="http://$BUCKET.s3-website-$REGION.amazonaws.com"
fi

echo -e "${GREEN}Deployment complete!${NC}"
echo -e "${GREEN}Website URL: $WEBSITE_URL${NC}"

# CloudFront deployment (if configured)
CLOUDFRONT_ENABLED=$(node -e "const config = require('$PROJECT_ROOT/deploy-config.json'); console.log(config.aws.cloudfront?.enabled || false)")
if [ "$CLOUDFRONT_ENABLED" = "true" ]; then
    DISTRIBUTION_ID=$(node -e "const config = require('$PROJECT_ROOT/deploy-config.json'); console.log(config.aws.cloudfront.distributionId || '')")
    if [ -n "$DISTRIBUTION_ID" ]; then
        echo -e "${YELLOW}Invalidating CloudFront cache...${NC}"
        aws cloudfront create-invalidation --distribution-id "$DISTRIBUTION_ID" --paths "/*"
    fi
fi
