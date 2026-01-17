# Backend API Service

This is the backend API service for handling contact form submissions from the RTX Web website.

## Features

- RESTful API endpoint for contact form submissions
- Email notifications using SMTP
- Input validation
- CORS support
- Error handling

## Setup

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Copy the environment file:
```bash
cp .env.example .env
```

3. Configure your environment variables in `.env`:
   - Set up SMTP credentials for email sending
   - Configure allowed origins for CORS
   - Set contact email address

### Running the Server

**Development mode:**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on port 3000 by default (or the port specified in `PORT` environment variable).

## API Endpoints

### POST /api/contact

Submit a contact form.

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "businessEmail": "john.doe@example.com",
  "companyName": "Example Corp",
  "phoneNumber": "+1234567890",
  "country": "United States",
  "industry": "Technology"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Your message has been sent successfully. We will contact you within 24 business hours."
}
```

**Error Response (400/500):**
```json
{
  "success": false,
  "error": "Error message"
}
```

### GET /health

Health check endpoint.

**Response (200):**
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Email Configuration

The service uses Nodemailer for sending emails. You can configure it using SMTP settings or use a service like SendGrid.

### SMTP Configuration

Set the following environment variables:
- `SMTP_HOST`: SMTP server hostname
- `SMTP_PORT`: SMTP server port (usually 587 for TLS)
- `SMTP_SECURE`: Set to "true" for SSL, "false" for TLS
- `SMTP_USER`: SMTP username
- `SMTP_PASS`: SMTP password
- `SMTP_FROM`: From email address

### Gmail Setup

For Gmail, you'll need to:
1. Enable 2-factor authentication
2. Generate an App Password
3. Use the App Password as `SMTP_PASS`

## Deployment

See the main `DEPLOYMENT.md` file for deployment instructions.

## Environment Variables

See `.env.example` for all available environment variables.
