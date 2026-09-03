# Quick Start: Email Notifications

This is a quick reference guide. For detailed instructions, see [EMAIL_NOTIFICATION_SETUP.md](./EMAIL_NOTIFICATION_SETUP.md).

## ⚡ Cannot Use SendGrid?

**Use Resend instead - it's FREE and easier!**

📘 **[See RESEND_SETUP.md for complete guide](./RESEND_SETUP.md)**

Quick steps with Resend:
1. Sign up at https://resend.com (no credit card!)
2. Get API key from dashboard
3. Rename the `-resend` function file to replace the SendGrid version
4. Install: `npm install resend`
5. Set environment variables in Netlify/Vercel:
   - `NOTIFICATION_EMAIL=`
   - `RESEND_API_KEY=re_...`
   - `FROM_EMAIL=` (for testing)
6. Deploy and test!

---

## What You Need

1. A hosting platform that supports serverless functions (Netlify or Vercel)
2. An email service account (Resend or SendGrid - both have free tiers)
3. 15 minutes to set up

## Fastest Setup: Netlify with Resend

1. **Sign up**: Create account at https://netlify.com
2. **Deploy**: Connect your GitHub repo to Netlify
3. **Resend**: 
   - Sign up at https://resend.com (no credit card!)
   - Get API key from dashboard
   - Use `onboarding@resend.dev` for testing
4. **Switch to Resend function**:
   ```bash
   mv netlify/functions/quickscan-notify.js netlify/functions/quickscan-notify-sendgrid.js
   mv netlify/functions/quickscan-notify-resend.js netlify/functions/quickscan-notify.js
   npm install resend
   ```
5. **Configure Environment Variables** in Netlify:
   ```
   NOTIFICATION_EMAIL=
   RESEND_API_KEY=re_...
   FROM_EMAIL=
   ```
6. **Test**: Fill out the form on your deployed site!

## Alternative: SendGrid

If you prefer SendGrid:
1. Sign up at https://sendgrid.com
2. Create API key with "Mail Send" permission
3. Verify a sender email address
4. Install: `npm install @sendgrid/mail`
5. Configure environment variables (use `SENDGRID_API_KEY` instead)

## Alternative: Vercel

Same steps as Netlify, but:
1. Sign up at https://vercel.com
2. Import your GitHub repository
3. Switch the function file in `/api/` directory
4. Add same environment variables
5. Deploy!

## Already on GitHub Pages?

You have two options:
1. Keep GitHub Pages for the frontend, deploy just the backend to Netlify/Vercel
2. Move entirely to Netlify/Vercel (they also serve static sites)

See [EMAIL_NOTIFICATION_SETUP.md](./EMAIL_NOTIFICATION_SETUP.md) for details.

## Files Added

- `/netlify/functions/quickscan-notify.js` - Netlify serverless function (SendGrid)
- `/netlify/functions/quickscan-notify-resend.js` - Netlify serverless function (Resend)
- `/api/quickscan-notify.js` - Vercel serverless function (SendGrid)
- `/api/quickscan-notify-resend.js` - Vercel serverless function (Resend)
- `netlify.toml` - Netlify configuration
- `vercel.json` - Vercel configuration
- `.env.example` - Environment variables template

## Need Help?

Contact: 
