# FREE Alternative to SendGrid: Using Resend

If you cannot create a SendGrid account, **Resend** is an excellent free alternative that's even easier to use!

## Why Resend?

✅ **100 emails/day** and **3,000 emails/month** on free tier  
✅ **No credit card required** for free tier  
✅ **Easier setup** than SendGrid  
✅ **Modern API** with excellent documentation  
✅ **Test email included** (`onboarding@resend.dev`) - no domain verification needed for testing  

---

## Quick Setup with Resend (15 minutes)

### Step 1: Create Resend Account

1. Go to https://resend.com
2. Click "Sign Up" (GitHub or email login)
3. No credit card required!

### Step 2: Get Your API Key

1. After login, go to **API Keys** in the dashboard
2. Click **Create API Key**
3. Give it a name (e.g., "Quickscan Notifications")
4. Select "Sending access" permission
5. Copy the API key (starts with `re_`)
6. **⚠️ IMPORTANT: Store this securely! Never commit it to version control.**

### Step 3: Choose Your Function File

You need to use the `-resend` version of the serverless function:

**For Netlify:**
- Rename `/netlify/functions/quickscan-notify-resend.js` to `/netlify/functions/quickscan-notify.js`
- OR update your code to use the resend version

**For Vercel:**
- Rename `/api/quickscan-notify-resend.js` to `/api/quickscan-notify.js`
- OR update your code to use the resend version

**Simple approach:**
```bash
# For Netlify
mv netlify/functions/quickscan-notify.js netlify/functions/quickscan-notify-sendgrid.js
mv netlify/functions/quickscan-notify-resend.js netlify/functions/quickscan-notify.js

# For Vercel
mv api/quickscan-notify.js api/quickscan-notify-sendgrid.js
mv api/quickscan-notify-resend.js api/quickscan-notify.js
```

### Step 4: Install Resend Package

```bash
npm install resend
```

Commit and push the changes.

### Step 5: Configure Environment Variables

⚠️ **SECURITY FIRST:** Never hardcode API keys in your code or documentation. Always use repository secrets or platform-specific environment variable management.

**In Netlify:**
1. Go to Site settings → Environment variables
2. Add the following variables with YOUR actual values:
   - `NOTIFICATION_EMAIL` = your email address where notifications are sent
   - `RESEND_API_KEY` = your Resend API key (obtain from Step 2)
   - `FROM_EMAIL` = test email for initial setup

**In Vercel:**
1. Go to Project Settings → Environment Variables
2. Add the same three variables with YOUR actual values

**Important Security Notes:**
- **Never** paste actual API keys in this documentation
- **Never** commit `.env` files to Git
- Use your platform's native secret management (Netlify/Vercel dashboard)
- Rotate API keys if they are ever accidentally exposed
- Use different API keys for development and production environments

### Step 6: Test It!

1. Deploy your site (Netlify/Vercel will auto-deploy on push)
2. Fill out the quickscan form
3. Check your email inbox!

**Note:** Initially, use `onboarding@resend.dev` as `FROM_EMAIL` for testing.

---

## Adding Your Own Domain (Optional)

Once testing works, you can add your own domain:

1. In Resend dashboard, go to **Domains**
2. Click **Add Domain**
3. Enter your domain (e.g., `example.com`)
4. Add the DNS records Resend provides to your domain registrar
5. Wait for verification (usually 5-15 minutes)
6. Update `FROM_EMAIL` environment variable to `noreply@yourdomain.com`

---

## Comparison: Resend vs SendGrid

| Feature | Resend (Free) | SendGrid (Free) |
|---------|---------------|-----------------|
| Emails/day | 100 | 100 |
| Emails/month | 3,000 | 3,000 |
| Credit card required | No | Yes (in some regions) |
| Test email included | Yes (`onboarding@resend.dev`) | No |
| Setup difficulty | Easier | More complex |
| API simplicity | Very simple | More complex |

---

## Troubleshooting

**"Error: Missing API key"**
- Make sure `RESEND_API_KEY` is set in your hosting platform's environment variables
- Verify the API key starts with `re_`
- Ensure the environment variable is deployed (may require a redeploy)

**"Error: Unauthorized"**
- Check that your API key has "Sending access" permission in Resend dashboard
- Regenerate the API key if needed and update environment variables

**"Emails not arriving"**
- Check spam/junk folder
- Verify `NOTIFICATION_EMAIL` is set correctly in environment variables
- Check function logs in Netlify/Vercel dashboard for specific errors
- For testing, ensure you're using `onboarding@resend.dev` as `FROM_EMAIL`

**"Domain not verified"**
- For testing, use `FROM_EMAIL=onboarding@resend.dev`
- For production, verify your domain in Resend dashboard first before updating `FROM_EMAIL`

---

## Code Example

The Resend code is simpler than SendGrid:

```javascript
/**
 * Sends an email notification using the Resend service
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject line
 * @param {string} html - HTML email content
 * @returns {Promise<Object>} Response object with data or error
 * @example
 * const result = await sendEmail(
 *   'user@example.com',
 *   'Hello',
 *   '<strong>It works!</strong>'
 * );
 */
async function sendEmail(to, subject, html) {
  // Input validation
  if (!to || !subject || !html) {
    return { error: 'Missing required parameters: to, subject, html' };
  }

  // Check for required environment variable
  if (!process.env.RESEND_API_KEY) {
    return { error: 'RESEND_API_KEY environment variable not configured' };
  }

  try {
    const { Resend } = require('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);

    const { data, error } = await resend.emails.send({
      from: process.env.FROM_EMAIL || 'onboarding@resend.dev',
      to: to,
      subject: subject,
      html: html,
    });

    // Early return for errors
    if (error) {
      return { error: error.message };
    }

    return { data };
  } catch (err) {
    return { error: err.message };
  }
}

module.exports = { sendEmail };
```

That's it! Much simpler than SendGrid.

---

## Other Free Alternatives

If Resend doesn't work for you either, here are more options:

### 1. **Brevo (formerly Sendinblue)**
- Free tier: 300 emails/day
- No credit card required
- Setup: https://www.brevo.com

### 2. **Mailgun**
- Free tier: 100 emails/day for 3 months, then paid
- Credit card required
- More complex setup

### 3. **Postmark**
- No free tier, but very affordable ($10/month)
- Excellent deliverability

### 4. **FormSubmit** (No backend needed!)
- Completely free
- No programming required
- Just send form data to their endpoint
- Setup: https://formsubmit.co

---

## Security Best Practices

### Environment Variables Management

**What to store as secrets:**
- `RESEND_API_KEY` - Your Resend API authentication token
- `NOTIFICATION_EMAIL` - Recipient email address (optional but recommended)

**Never commit to Git:**
- `.env` or `.env.local` files
- API keys or tokens
- Personal email addresses in code

**Repository Secrets Setup:**

**For GitHub Actions (if using CI/CD):**
1. Go to repository Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Add `RESEND_API_KEY` with your API key value
4. Reference in workflows: `${{ secrets.RESEND_API_KEY }}`

**For Netlify:**
- Use the dashboard UI (not Git)
- Settings → Environment variables
- Variables are encrypted at rest

**For Vercel:**
- Use the dashboard UI (not Git)
- Project Settings → Environment Variables
- Separate development and production values

### Code Safety

- Never log or expose API keys
- Validate email addresses before sending
- Rate-limit email sending to prevent abuse
- Use different API keys for staging and production
- Regularly audit and rotate API keys

---

## Support

For Resend-specific questions: https://resend.com/docs  
For this implementation: Check the repository's issue tracker
