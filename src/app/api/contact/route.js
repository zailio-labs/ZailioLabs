// src/app/api/contact/route.js
import createContact from '@/models/Contact';
import { sendEmail } from '@/lib/email';

export async function POST(request) {
  try {
    const body = await request.json();
    
    const { name, email, subject, message, service } = body;
    
    // Validation
    if (!name || !email || !subject || !message) {
      return Response.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Save to database
    const contactId = await createContact({
      name,
      email,
      subject,
      message,
      service: service || '',
    });

    // Send confirmation email to user
    await sendEmail({
      to: email,
      subject: 'Thank you for contacting Zailio Labs',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #2f9158, #2969a7); color: white; padding: 20px; text-align: center;">
            <h1>Zailio Labs</h1>
          </div>
          <div style="padding: 20px; background: #f9f9f9;">
            <h2>Thank you for your message, ${name}!</h2>
            <p>We have received your inquiry and will get back to you within 24 hours.</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Message:</strong><br>${message}</p>
            <p>Best regards,<br>The Zailio Labs Team</p>
          </div>
        </div>
      `,
    });

    return Response.json({
      success: true,
      message: 'Contact form submitted successfully',
      id: contactId
    });

  } catch (error) {
    console.error('Contact API error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
