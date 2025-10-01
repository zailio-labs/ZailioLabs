// src/app/api/admin/auth/route.js
import { authenticateAdmin, createSessionToken } from '../../../../lib/auth';

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    
    const admin = await authenticateAdmin(email, password);
    if (!admin) {
      return Response.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const token = createSessionToken(admin);
    
    return Response.json({
      success: true,
      token,
      admin: {
        email: admin.email,
        name: admin.name,
        role: admin.role
      }
    });

  } catch (error) {
    console.error('Auth error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
