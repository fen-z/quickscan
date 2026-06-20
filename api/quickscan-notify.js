/**
 * Vercel Serverless Function to send email notifications when someone completes the quickscan
 * 
 * Environment Variables Required (set in Vercel Dashboard):
 * - NOTIFICATION_EMAIL: The email address to send notifications to
 * - SENDGRID_API_KEY: Your SendGrid API key (or use another email service)
 * 
 * Alternative: You can use any email service (AWS SES, Mailgun, Postmark, etc.)
 * Just modify the sendEmail function below
 */

const sendgrid = require('@sendgrid/mail');

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { to, name, email, pdfBase64 } = req.body;

    // Validate required fields
    if (!to || !name || !email || !pdfBase64) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Get notification email from environment variable
    const notificationEmail = process.env.NOTIFICATION_EMAIL || to;
    const sendGridApiKey = process.env.SENDGRID_API_KEY;

    if (!sendGridApiKey) {
      console.error('SENDGRID_API_KEY not configured');
      return res.status(500).json({ error: 'Email service not configured' });
    }

    // Configure SendGrid
    sendgrid.setApiKey(sendGridApiKey);

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

    // Prepare email
    const msg = {
      to: notificationEmail,
      from: process.env.FROM_EMAIL || notificationEmail, // Use verified sender
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
          content: base64Data,
          filename: `quickscan-${safeFilename}-${Date.now()}.pdf`,
          type: 'application/pdf',
          disposition: 'attachment'
        }
      ]
    };

    // Send email
    await sendgrid.send(msg);

    return res.status(200).json({ success: true, message: 'Notification sent successfully' });

  } catch (error) {
    console.error('Error sending notification:', error);
    return res.status(500).json({ 
      error: 'Failed to send notification',
      details: error.message 
    });
  }
}
