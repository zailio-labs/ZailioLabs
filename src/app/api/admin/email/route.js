// src/app/api/admin/email/route.js
import { getContactById, updateContactStatus } from '../../../../models/Contact';
import { sendReplyEmail } from '../../../../lib/email';
import { verifySessionToken } from '../../../../lib/auth';

export async function POST(request) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const session = verifySessionToken(token);
    if (!session) {
      return Response.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { contactId, message } = await request.json();
    
    if (!contactId || !message) {
      return Response.json(
        { error: 'Contact ID and message are required' },
        { status: 400 }
      );
    }

    const contact = await getContactById(contactId);
    if (!contact) {
      return Response.json(
        { error: 'Contact not found' },
        { status: 404 }
      );
    }

    // Send email
    const emailResult = await sendReplyEmail(contact, message);
    
    if (emailResult.success) {
      // Mark as replied
      await updateContactStatus(contactId, {
        status: 'replied',
        repliedAt: new Date(),
        adminNotes: `Replied on ${new Date().toLocaleString()}`
      });

      return Response.json({
        success: true,
        message: 'Email sent successfully',
        messageId: emailResult.messageId
      });
    } else {
      return Response.json(
        { error: 'Failed to send email: ' + emailResult.error },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Email API error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
