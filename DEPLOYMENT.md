# Deployment Guide

This guide covers deploying the RTX Web static website to cloud storage services and setting up the backend API for contact form handling.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Backend Setup](#backend-setup)
3. [Cloud Storage Deployment](#cloud-storage-deployment)
   - [AWS S3](#aws-s3)
   - [Google Cloud Storage](#google-cloud-storage)
   - [Azure Blob Storage](#azure-blob-storage)
4. [Backend Deployment](#backend-deployment)
5. [Traditional Server Deployment](#traditional-server-deployment)
6. [Configuration](#configuration)
7. [Troubleshooting](#troubleshooting)

## Prerequisites

### Required Tools

- Node.js (v14 or higher) and npm
- Git
- Cloud provider CLI tools (choose based on your provider):
  - **AWS**: [AWS CLI](https://aws.amazon.com/cli/)
  - **Google Cloud**: [Google Cloud SDK](https://cloud.google.com/sdk/docs/install)
  - **Azure**: [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli)

### Accounts Needed

- Cloud storage account (AWS, Google Cloud, or Azure)
- Email service account (for contact form submissions)
- Domain name (optional, for custom domain)

## Backend Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` and configure:

- **SMTP settings**: For sending emails from contact form
- **CORS origins**: Allowed origins for API requests
- **Contact email**: Where to send form submissions

### 3. Test Locally

```bash
npm run dev
```

The backend will run on `http://localhost:3000`. Test the health endpoint:

```bash
curl http://localhost:3000/health
```

### 4. Email Configuration

#### Gmail Setup

1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password: [Google Account Settings](https://myaccount.google.com/apppasswords)
3. Use the App Password as `SMTP_PASS` in `.env`

#### Other SMTP Providers

Update the SMTP settings in `.env`:
- `SMTP_HOST`: Your SMTP server
- `SMTP_PORT`: Usually 587 for TLS, 465 for SSL
- `SMTP_SECURE`: "true" for SSL, "false" for TLS
- `SMTP_USER`: Your SMTP username
- `SMTP_PASS`: Your SMTP password

## Cloud Storage Deployment

### Configuration

1. Edit `deploy-config.json` in the project root
2. Set your chosen provider: `"provider": "aws"` (or "gcs", "azure")
3. Configure provider-specific settings (bucket name, region, etc.)

### AWS S3

#### Prerequisites

1. Install AWS CLI: `pip install awscli` or download from [AWS website](https://aws.amazon.com/cli/)
2. Configure AWS credentials:
   ```bash
   aws configure
   ```
   Enter your Access Key ID, Secret Access Key, and default region.

#### Deployment Steps

1. **Update Configuration**

   Edit `deploy-config.json`:
   ```json
   {
     "provider": "aws",
     "aws": {
       "bucket": "your-bucket-name",
       "region": "us-east-1"
     }
   }
   ```

2. **Deploy**

   ```bash
   ./scripts/deploy.sh
   ```

   Or directly:
   ```bash
   ./scripts/deploy-aws.sh
   ```

3. **Get Website URL**

   After deployment, the script will output your website URL:
   ```
   Website URL: http://your-bucket-name.s3-website-us-east-1.amazonaws.com
   ```

#### Custom Domain Setup

1. Create a CloudFront distribution pointing to your S3 bucket
2. Configure your domain's DNS to point to the CloudFront distribution
3. Update `deploy-config.json` with CloudFront distribution ID for cache invalidation

#### CloudFront CDN (Optional)

1. Create CloudFront distribution in AWS Console
2. Set origin to your S3 bucket
3. Update `deploy-config.json`:
   ```json
   {
     "aws": {
       "cloudfront": {
         "enabled": true,
         "distributionId": "E1234567890ABC"
       }
     }
   }
   ```

### Google Cloud Storage

#### Prerequisites

1. Install Google Cloud SDK: [Installation Guide](https://cloud.google.com/sdk/docs/install)
2. Authenticate:
   ```bash
   gcloud auth login
   gcloud config set project YOUR_PROJECT_ID
   ```

#### Deployment Steps

1. **Update Configuration**

   Edit `deploy-config.json`:
   ```json
   {
     "provider": "gcs",
     "gcs": {
       "bucket": "your-bucket-name",
       "region": "us-central1"
     }
   }
   ```

2. **Deploy**

   ```bash
   ./scripts/deploy.sh
   ```

   Or directly:
   ```bash
   ./scripts/deploy-gcs.sh
   ```

3. **Get Website URL**

   ```
   Website URL: https://storage.googleapis.com/your-bucket-name/index.html
   ```

#### Custom Domain Setup

1. Configure custom domain in Google Cloud Console
2. Set up DNS records as instructed
3. Enable HTTPS with Google-managed SSL certificate

### Azure Blob Storage

#### Prerequisites

1. Install Azure CLI: [Installation Guide](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli)
2. Authenticate:
   ```bash
   az login
   az account set --subscription YOUR_SUBSCRIPTION_ID
   ```

#### Deployment Steps

1. **Update Configuration**

   Edit `deploy-config.json`:
   ```json
   {
     "provider": "azure",
     "azure": {
       "storageAccount": "yourstorageaccount",
       "container": "$web",
       "resourceGroup": "your-resource-group",
       "location": "eastus"
     }
   }
   ```

2. **Deploy**

   ```bash
   ./scripts/deploy.sh
   ```

   Or directly:
   ```bash
   ./scripts/deploy-azure.sh
   ```

3. **Get Website URL**

   The script will output your website URL after deployment.

#### Custom Domain Setup

1. Configure custom domain in Azure Portal
2. Set up DNS records
3. Enable HTTPS with Azure-managed certificate

## Backend Deployment

### Option 1: Docker Deployment

#### Build and Run

```bash
# Build image
docker build -t rtx-web-backend .

# Run container
docker run -d \
  --name rtx-web-backend \
  -p 3000:3000 \
  --env-file backend/.env \
  rtx-web-backend
```

#### Docker Compose

```bash
docker-compose up -d
```

### Option 2: Serverless Functions

#### AWS Lambda

1. Install Serverless Framework:
   ```bash
   npm install -g serverless
   ```

2. Create `serverless.yml`:
   ```yaml
   service: rtx-web-backend
   
   provider:
     name: aws
     runtime: nodejs18.x
     region: us-east-1
   
   functions:
     api:
       handler: server.handler
       events:
         - http:
             path: /{proxy+}
             method: ANY
             cors: true
   ```

3. Deploy:
   ```bash
   serverless deploy
   ```

#### Google Cloud Functions

1. Deploy function:
   ```bash
   gcloud functions deploy rtx-web-contact-api \
     --runtime nodejs18 \
     --trigger-http \
     --allow-unauthenticated \
     --source backend
   ```

#### Azure Functions

1. Install Azure Functions Core Tools
2. Initialize function app:
   ```bash
   func init backend --javascript
   ```
3. Deploy:
   ```bash
   func azure functionapp publish YOUR_FUNCTION_APP_NAME
   ```

### Option 3: Traditional Server (VPS)

1. **Install Node.js** on your server
2. **Clone repository**:
   ```bash
   git clone <your-repo-url>
   cd RTX_Web
   ```
3. **Install dependencies**:
   ```bash
   cd backend
   npm install --production
   ```
4. **Set up environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env with your settings
   ```
5. **Use PM2 for process management**:
   ```bash
   npm install -g pm2
   pm2 start server.js --name rtx-backend
   pm2 save
   pm2 startup
   ```
6. **Set up reverse proxy** with nginx (see nginx.conf)

## Traditional Server Deployment

### Full Stack with Nginx

1. **Deploy static files** to `/usr/share/nginx/html`
2. **Deploy backend** using Docker or PM2
3. **Configure nginx**:
   ```bash
   sudo cp nginx.conf /etc/nginx/nginx.conf
   sudo nginx -t  # Test configuration
   sudo systemctl reload nginx
   ```

### SSL Certificate (Let's Encrypt)

```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

## Configuration

### Frontend API Endpoint

Update the API endpoint in your frontend code. You can set it via:

1. **Environment variable** (if using build process):
   ```javascript
   const API_URL = process.env.API_URL || 'http://localhost:3000/api/contact';
   ```

2. **Direct configuration** in `scripts/main.js`:
   ```javascript
   const API_URL = 'https://api.yourdomain.com/api/contact';
   ```

3. **Runtime configuration** via script tag:
   ```html
   <script>
     window.API_URL = 'https://api.yourdomain.com/api/contact';
   </script>
   <script src="scripts/main.js"></script>
   ```

### CORS Configuration

Update `ALLOWED_ORIGINS` in backend `.env`:
```
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

## Troubleshooting

### Deployment Script Issues

**Problem**: Script fails with "command not found"
- **Solution**: Make scripts executable: `chmod +x scripts/*.sh`

**Problem**: AWS CLI not found
- **Solution**: Install AWS CLI and ensure it's in your PATH

**Problem**: Permission denied errors
- **Solution**: Check your cloud provider credentials and permissions

### Backend Issues

**Problem**: Backend won't start
- **Solution**: Check `.env` file exists and has all required variables
- Check port 3000 is not already in use

**Problem**: Emails not sending
- **Solution**: Verify SMTP credentials in `.env`
- Check firewall/security group allows outbound SMTP (port 587/465)
- For Gmail, ensure App Password is used, not regular password

**Problem**: CORS errors
- **Solution**: Update `ALLOWED_ORIGINS` in backend `.env` to include your frontend domain

### Frontend Issues

**Problem**: Form submissions fail
- **Solution**: Check browser console for errors
- Verify API_URL is correctly set
- Check backend is running and accessible
- Verify CORS is configured correctly

**Problem**: Assets not loading
- **Solution**: Check file paths are relative (not absolute)
- Verify MIME types are set correctly in cloud storage
- Check cache settings

### Cloud Storage Issues

**Problem**: Website shows 403 Forbidden
- **Solution**: Ensure bucket/container has public read access
- Check bucket policy (AWS) or IAM permissions (GCS/Azure)

**Problem**: Changes not appearing
- **Solution**: Clear browser cache
- Check CDN cache invalidation (if using CloudFront)
- Verify files were uploaded correctly

## Security Considerations

1. **Environment Variables**: Never commit `.env` files to version control
2. **API Keys**: Use environment variables, not hardcoded values
3. **HTTPS**: Always use HTTPS in production
4. **Rate Limiting**: Backend includes rate limiting; adjust as needed
5. **CORS**: Restrict `ALLOWED_ORIGINS` to your actual domains
6. **Input Validation**: Backend validates all form inputs

## Monitoring

### Health Checks

The backend includes a health check endpoint:
```bash
curl https://api.yourdomain.com/health
```

### Logs

- **Docker**: `docker logs rtx-web-backend`
- **PM2**: `pm2 logs rtx-backend`
- **Cloud Functions**: Check provider's logging dashboard

## Support

For issues or questions:
1. Check this documentation
2. Review error logs
3. Check cloud provider documentation
4. Verify all configuration files are correct
