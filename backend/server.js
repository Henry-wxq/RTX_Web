const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Contact form submission endpoint
app.post('/api/contact', async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      businessEmail,
      companyName,
      phoneNumber,
      country,
      industry
    } = req.body;

    // Validation
    if (!firstName || !lastName || !businessEmail || !companyName || !phoneNumber || !country || !industry) {
      return res.status(400).json({
        success: false,
        error: 'All fields are required'
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(businessEmail)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email address'
      });
    }

    // Create email transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    // Email content
    const mailOptions = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: process.env.CONTACT_EMAIL || process.env.SMTP_USER,
      replyTo: businessEmail,
      subject: `New Contact Form Submission from ${companyName}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${firstName} ${lastName}</p>
        <p><strong>Email:</strong> ${businessEmail}</p>
        <p><strong>Company:</strong> ${companyName}</p>
        <p><strong>Phone:</strong> ${phoneNumber}</p>
        <p><strong>Country/Region:</strong> ${country}</p>
        <p><strong>Industry:</strong> ${industry}</p>
        <hr>
        <p><small>Submitted at: ${new Date().toLocaleString()}</small></p>
      `,
      text: `
        New Contact Form Submission
        
        Name: ${firstName} ${lastName}
        Email: ${businessEmail}
        Company: ${companyName}
        Phone: ${phoneNumber}
        Country/Region: ${country}
        Industry: ${industry}
        
        Submitted at: ${new Date().toLocaleString()}
      `
    };

    // Send email
    await transporter.sendMail(mailOptions);

    // Optional: Send confirmation email to user
    if (process.env.SEND_CONFIRMATION === 'true') {
      const confirmationMail = {
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: businessEmail,
        subject: 'Thank you for contacting Win Trust',
        html: `
          <h2>Thank you for your inquiry</h2>
          <p>Dear ${firstName} ${lastName},</p>
          <p>We have received your contact form submission and will get back to you within 24 business hours.</p>
          <p>Best regards,<br>Win Trust Information & Technology</p>
        `,
        text: `
          Thank you for your inquiry
          
          Dear ${firstName} ${lastName},
          
          We have received your contact form submission and will get back to you within 24 business hours.
          
          Best regards,
          Win Trust Information & Technology
        `
      };
      
      await transporter.sendMail(confirmationMail);
    }

    res.json({
      success: true,
      message: 'Your message has been sent successfully. We will contact you within 24 business hours.'
    });

  } catch (error) {
    console.error('Error processing contact form:', error);
    res.status(500).json({
      success: false,
      error: 'An error occurred while processing your request. Please try again later.'
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
