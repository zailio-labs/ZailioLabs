// src/app/api/admin/requests/route.js
import { getContacts, updateContactStatus, getUnreadCount, deleteContact } from '@/models/Contact';
import { verifySessionToken } from '@/lib/auth';

function checkAuth(request) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) {
    return { error: 'Unauthorized', status: 401 };
  }
  
  const session = verifySessionToken(token);
  if (!session) {
    return { error: 'Invalid token', status: 401 };
  }
  
  return { session };
}

export async function GET(request) {
  try {
    const auth = checkAuth(request);
    if (auth.error) {
      return Response.json({ error: auth.error }, { status: auth.status });
    }

    const { searchParams } = new URL(request.url);
    const filter = searchParams.get('filter');
    const status = searchParams.get('status');
    
    let query = {};
    if (status === 'unread') {
      query.status = 'unread';
    } else if (status === 'read') {
      query.status = 'read';
    } else if (status === 'replied') {
      query.status = 'replied';
    }

    const contacts = await getContacts(query);
    const unreadCount = await getUnreadCount();

    return Response.json({
      success: true,
      contacts,
      unreadCount,
      total: contacts.length
    });

  } catch (error) {
    console.error('Admin requests error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const auth = checkAuth(request);
    if (auth.error) {
      return Response.json({ error: auth.error }, { status: auth.status });
    }

    const { id, action, notes } = await request.json();
    
    let updates = {};
    if (action === 'mark-read') {
      updates = { 
        status: 'read',
        readAt: new Date()
      };
    } else if (action === 'mark-replied') {
      updates = {
        status: 'replied',
        repliedAt: new Date()
      };
    } else if (action === 'add-notes') {
      updates = { adminNotes: notes };
    }

    await updateContactStatus(id, updates);

    return Response.json({
      success: true,
      message: 'Request updated successfully'
    });

  } catch (error) {
    console.error('Update request error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const auth = checkAuth(request);
    if (auth.error) {
      return Response.json({ error: auth.error }, { status: auth.status });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    await deleteContact(id);

    return Response.json({
      success: true,
      message: 'Request deleted successfully'
    });

  } catch (error) {
    console.error('Delete request error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
