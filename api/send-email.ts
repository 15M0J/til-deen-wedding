import nodemailer from 'nodemailer';

export default async function handler(req: any, res: any) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { toEmail, guestName, itemTitle, category, itemUrl, itemPrice, message } = req.body || {};

  if (!toEmail) {
    return res.status(400).json({ error: 'Recipient email is required' });
  }

  const gmailUser = process.env.GMAIL_USER || 'tildeenjimoh@gmail.com';
  const gmailPassword = process.env.GMAIL_APP_PASSWORD;

  if (!gmailPassword) {
    console.warn('GMAIL_APP_PASSWORD is not configured in Vercel environment variables.');
    return res.status(200).json({
      success: true,
      warning: 'GMAIL_APP_PASSWORD pending in Vercel. Add GMAIL_APP_PASSWORD to enable live delivery.',
    });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: gmailUser,
      pass: gmailPassword,
    },
  });

  const isExperience = category === 'EXPERIENCE';
  const displayName = guestName && guestName !== 'Anonymous' ? guestName : 'Honoured Guest';

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #FAF8F5; color: #16274F; margin: 0; padding: 24px 12px; }
          .container { max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1.5px solid #16274F; overflow: hidden; box-shadow: 0 10px 30px rgba(22, 39, 79, 0.08); }
          .header { background: #16274F; padding: 32px 24px; text-align: center; color: #FAF8F5; }
          .header h1 { margin: 0; font-size: 26px; font-weight: 700; letter-spacing: 1px; color: #FAF8F5; }
          .header p { margin: 8px 0 0; font-size: 14px; opacity: 0.85; color: #E8B04E; }
          .content { padding: 32px 28px; line-height: 1.6; }
          .greeting { font-size: 18px; font-weight: 700; margin-bottom: 12px; color: #16274F; }
          .card { background: #FAF8F5; border: 1.2px solid #E8B04E; border-radius: 12px; padding: 20px; margin: 20px 0; }
          .card-title { font-size: 16px; font-weight: 700; color: #16274F; margin-bottom: 8px; }
          .badge { display: inline-block; background: #C4663E; color: #ffffff; padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: 700; text-transform: uppercase; margin-bottom: 10px; }
          .btn { display: inline-block; background: #16274F; color: #FAF8F5 !important; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 14px; margin-top: 14px; }
          .footer { background: #F4EFE6; padding: 20px; text-align: center; font-size: 12px; color: #16274F; opacity: 0.8; }
          .bank-box { background: #ffffff; border: 1px solid #16274F20; padding: 14px; border-radius: 8px; font-family: monospace; font-size: 13px; margin-top: 10px; line-height: 1.5; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Til &amp; Deen</h1>
            <p>Wedding Registry Confirmation · 18 December 2026</p>
          </div>
          <div class="content">
            <div class="greeting">Hello ${displayName},</div>
            <p>Thank you so much for your love and generosity in celebrating our marriage! We have received your gift reservation details.</p>
            
            <div class="card">
              <span class="badge">${category}</span>
              <div class="card-title">${itemTitle}</div>
              ${itemPrice ? `<p style="margin: 4px 0 10px; font-weight: 600; color: #C4663E;">Estimate / Value: ${itemPrice}</p>` : ''}
              
              ${isExperience ? `
                <p style="margin: 8px 0 4px; font-weight: 600;">Contribution Payment Options:</p>
                <div class="bank-box">
                  <b>Naira Direct Bank Transfer:</b><br>
                  Bank: Guaranty Trust Bank (GTBank)<br>
                  Account Name: Muyideen Jimoh<br>
                  Account Number: <b>0157951636</b><br><br>
                  <b>International (USD / GBP / EUR / PayPal):</b><br>
                  PayPal Email: tildeenjimoh@gmail.com<br>
                  PayPal Pool: <a href="https://www.paypal.com/pool/9rNISKnCNI?sr=accr">paypal.com/pool/9rNISKnCNI</a>
                </div>
              ` : `
                ${itemUrl ? `
                  <p style="margin: 8px 0;">You can view and purchase the item online at the retailer link below:</p>
                  <a href="${itemUrl}" target="_blank" class="btn">View Store Item</a>
                ` : ''}
                <div class="bank-box" style="margin-top: 14px;">
                  <b>Wedding Day Gift Station:</b><br>
                  Physical boxed gifts will be received at the secure Gift Station at <b>The Nest at Guzape Hills, Abuja</b> on Friday, 18 December 2026.
                </div>
              `}

              ${message ? `<p style="margin-top: 12px; font-style: italic; color: #555;">Your message: "${message}"</p>` : ''}
            </div>

            <p style="font-size: 14px;">If you have any questions or would like to check details, you can visit our wedding website anytime:</p>
            <p><a href="https://til-deen-wedding.vercel.app" style="color: #C4663E; font-weight: 700;">til-deen-wedding.vercel.app</a></p>
            
            <p style="margin-top: 24px; font-weight: 600;">With all our love,<br>Til &amp; Deen</p>
          </div>
          <div class="footer">
            Friday, 18 December 2026 · The Nest at Guzape Hills, Abuja, Nigeria
          </div>
        </div>
      </body>
    </html>
  `;

  try {
    await transporter.sendMail({
      from: `"Til & Deen Wedding" <${gmailUser}>`,
      to: toEmail,
      subject: `Gift Confirmation: ${itemTitle} · Til & Deen's Wedding`,
      html: htmlContent,
      text: `Hello ${displayName},\n\nThank you for reserving "${itemTitle}" for Til & Deen's Wedding on Friday, 18 December 2026!\n\nDetails: ${isExperience ? 'GTBank: 0157951636 (Muyideen Jimoh) | PayPal: tildeenjimoh@gmail.com' : (itemUrl || 'Physical gift drop-off at The Nest at Guzape Hills, Abuja')}\n\nWith all our love,\nTil & Deen`,
    });

    return res.status(200).json({ success: true, message: 'Email sent successfully via Nodemailer' });
  } catch (error: any) {
    console.error('Nodemailer error:', error);
    return res.status(500).json({ error: error.message || 'Failed to send email' });
  }
}
