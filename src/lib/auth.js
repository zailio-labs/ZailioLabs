// src/lib/auth.js
import { verifyAdmin } from '../models/Admin';

export async function authenticateAdmin(email, password) {
  return await verifyAdmin(email, password);
}

export function createSessionToken(admin) {
  // Simple session token (in production, use JWT)
  return Buffer.from(JSON.stringify({
    email: admin.email,
    name: admin.name,
    role: admin.role,
    timestamp: Date.now()
  })).toString('base64');
}

export function verifySessionToken(token) {
  try {
    const session = JSON.parse(Buffer.from(token, 'base64').toString());
    // Check if token is not expired (24 hours)
    if (Date.now() - session.timestamp > 24 * 60 * 60 * 1000) {
      return null;
    }
    return session;
  } catch {
    return null;
  }
}
