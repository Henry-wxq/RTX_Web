# RTX Web - Win Trust Website

A modern, responsive website for Win Trust Information & Technology, showcasing smart supply chain solutions and services.

## Project Overview

This is a static website built with HTML, CSS, and JavaScript, featuring:
- Responsive design for all devices
- Modern UI/UX with smooth animations
- Contact form with backend API integration
- Multi-page navigation structure
- Optimized asset loading

## Project Structure

```
RTX_Web/
├── about/              # About section pages
├── advantages/         # Advantages section pages
├── contact/            # Contact section pages
├── partners/           # Partners section pages
├── solutions/          # Solutions section pages
├── images/             # Image assets
├── scripts/            # JavaScript files
├── styles/             # CSS stylesheets
├── backend/            # Backend API service
├── index.html          # Homepage
└── [other HTML files]  # Main section pages
```

## Features

- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Contact Form**: Integrated contact form with backend API for email submissions
- **Smooth Navigation**: Dropdown menus and smooth scrolling
- **Modern UI**: Clean, professional design with animations
- **SEO Friendly**: Semantic HTML structure
- **Performance Optimized**: Optimized images and efficient asset loading

## Getting Started

### Prerequisites

- A modern web browser
- Node.js (v14+) and npm (for backend development)
- Git (for version control)

### Local Development

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd RTX_Web
   ```

2. **Set up backend** (optional, for contact form):
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your SMTP settings
   npm run dev
   ```

3. **Configure frontend API endpoint** (if using backend):
   - Edit `scripts/main.js` and set `API_URL` to your backend URL
   - Or set `window.API_URL` in your HTML before loading `main.js`

4. **Open in browser**:
   - Simply open `index.html` in your browser
   - Or use a local server:
     ```bash
     # Python 3
     python -m http.server 8000
     
     # Node.js (with http-server)
     npx http-server -p 8000
     ```

5. **Access the website**:
   - Open `http://localhost:8000` in your browser

## Deployment

This website can be deployed to various cloud storage services or traditional web servers.

### Quick Start

1. **Configure deployment**:
   - Edit `deploy-config.json` with your cloud provider settings

2. **Deploy static site**:
   ```bash
   ./scripts/deploy.sh
   ```

3. **Deploy backend** (see [DEPLOYMENT.md](DEPLOYMENT.md) for details)

For detailed deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md).

### Deployment Options

- **Cloud Storage**: AWS S3, Google Cloud Storage, Azure Blob Storage
- **Traditional Server**: Nginx, Apache
- **Container**: Docker, Docker Compose

## Backend API

The backend API handles contact form submissions. See [backend/README.md](backend/README.md) for setup and configuration.

### API Endpoints

- `POST /api/contact` - Submit contact form
- `GET /health` - Health check

## Configuration

### Environment Variables

See `env.example` for available environment variables. Copy to `.env` and configure:

- Frontend: `API_URL` - Backend API endpoint
- Backend: See `backend/.env.example` for backend configuration

### Deployment Configuration

Edit `deploy-config.json` to configure:
- Cloud provider (AWS, GCS, Azure)
- Bucket/storage settings
- CDN configuration
- Cache settings

## Development

### Adding New Pages

1. Create HTML file in appropriate directory
2. Add corresponding CSS file in `styles/`
3. Add corresponding JavaScript file in `scripts/` (if needed)
4. Update navigation in main HTML files

### Styling

- Main stylesheet: `styles/main.css`
- Page-specific styles: `styles/[section]/[page].css`
- Follow existing CSS structure and naming conventions

### JavaScript

- Main script: `scripts/main.js`
- Page-specific scripts: `scripts/[section]/[page].js`
- Backend API integration: See `scripts/main.js` for contact form handling

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Node.js, Express.js
- **Email**: Nodemailer
- **Deployment**: AWS CLI, Google Cloud SDK, Azure CLI

## License

Copyright © 2024 Win Trust Information & Technology. All rights reserved.

## Support

For deployment issues, see [DEPLOYMENT.md](DEPLOYMENT.md).

For backend setup, see [backend/README.md](backend/README.md).

## Contributing

1. Follow existing code style and structure
2. Test changes locally before committing
3. Update documentation as needed

## Contact

For questions or support:
- Email: marketing@win-trust.com
- Website: [Your website URL]
