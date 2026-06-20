/**
 * Netlify Function using Resend - FREE Alternative to SendGrid
 * 
 * Resend offers 100 emails/day and 3,000 emails/month on free tier
 * Sign up at: https://resend.com
 * 
 * Environment Variables Required:
 * - NOTIFICATION_EMAIL: The email address to send notifications to
 * - RESEND_API_KEY: Your Resend API key (starts with re_)
 * - FROM_EMAIL: Your verified sender email
 */

const { Resend } = require('resend');

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    const { to, name, email, pdfBase64 } = JSON.parse(event.body);

    // Validate required fields
    if (!to || !name || !email || !pdfBase64) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required fields' })
      };
    }

    // Get notification email from environment variable
    const notificationEmail = process.env.NOTIFICATION_EMAIL || to;
    const resendApiKey = process.env.RESEND_API_KEY;

    if (!resendApiKey) {
      console.error('RESEND_API_KEY not configured');
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Email service not configured' })
      };
    }

    // Initialize Resend
    const resend = new Resend(resendApiKey);

    // Extract base64 data from data URI
    const base64Data = pdfBase64.split(',')[1] || pdfBase64;

    // Escape HTML to prevent XSS
    const escapeHtml = (text) => {
      const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
      };
      return text.replace(/[&<>"']/g, m => map[m]);
    };

    // Sanitize filename - only allow alphanumeric, spaces, and hyphens
    const sanitizeFilename = (text) => {
      return text.replace(/[^a-zA-Z0-9\s-]/g, '').replace(/\s+/g, '-').substring(0, 50);
    };

    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeFilename = sanitizeFilename(name);

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: process.env.FROM_EMAIL || 'onboarding@resend.dev',
      to: notificationEmail,
      subject: `Nieuwe Quick Scan resultaten van ${safeName}`,
      html: `
        <h2>Nieuwe Quick Scan Logistieke Ketenvolwassenheid</h2>
        <p>Er is een nieuwe quick scan ingevuld.</p>
        <h3>Contactgegevens:</h3>
        <ul>
          <li><strong>Naam:</strong> ${safeName}</li>
          <li><strong>E-mail:</strong> ${safeEmail}</li>
          <li><strong>Datum:</strong> ${new Date().toLocaleString('nl-NL')}</li>
        </ul>
        <p>De volledige resultaten inclusief volwassenheidsprofiel en advies zijn bijgevoegd als PDF.</p>
      `,
      attachments: [
        {
          filename: `quickscan-${safeFilename}-${Date.now()}.pdf`,
          content: base64Data,
          type: 'application/pdf',
        }
      ]
    });

    if (error) {
      throw error;
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: 'Notification sent successfully', id: data.id })
    };

  } catch (error) {
    console.error('Error sending notification:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Failed to send notification',
        details: error.message 
      })
    };
  }
};
