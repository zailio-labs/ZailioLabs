// src/lib/email.js
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.ZOHO_HOST,
  port: process.env.ZOHO_PORT,
  secure: false,
  auth: {
    user: process.env.ZOHO_EMAIL,
    pass: process.env.ZOHO_PASSWORD,
  },
});

export async function sendEmail({ to, subject, html, text }) {
  try {
    const mailOptions = {
      from: `Zailio Labs <${process.env.ZOHO_EMAIL}>`,
      to,
      subject,
      html,
      text,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
}

export async function sendReplyEmail(contact, replyMessage) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #2f9158, #2969a7); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 10px 10px; }
        .message { background: white; padding: 15px; border-left: 4px solid #2f9158; margin: 15px 0; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Zailio Labs</h1>
          <p>Response to Your Inquiry</p>
        </div>
        <div class="content">
          <p>Dear ${contact.name},</p>
          <p>Thank you for contacting Zailio Labs. Here's our response to your inquiry:</p>
          <div class="message">
            ${replyMessage.replace(/\n/g, '<br>')}
          </div>
          <p><strong>Your Original Message:</strong><br>${contact.message}</p>
          <p>If you have any further questions, please don't hesitate to reply to this email.</p>
          <p>Best regards,<br>The Zailio Labs Team</p>
        </div>
        <div class="footer">
          <p>&copy; 2024 Zailio Labs. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
    Dear ${contact.name},

    Thank you for contacting Zailio Labs. Here's our response to your inquiry:

    ${replyMessage}

    Your Original Message:
    ${contact.message}

    Best regards,
    The Zailio Labs Team
  `;

  return await sendEmail({
    to: contact.email,
    subject: `Re: ${contact.subject}`,
    html,
    text,
  });
}
