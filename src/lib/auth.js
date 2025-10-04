// src/lib/auth.js
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-fallback-secret-change-in-production';

// Mock admin data - replace with real database in production
const ADMIN_CREDENTIALS = {
  email: process.env.ADMIN_EMAIL || 'admin@zailiolabs.com',
  password: process.env.ADMIN_PASSWORD || 'admin123' // Change this!
};

export function authenticateAdmin(email, password) {
  if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
    return {
      email: ADMIN_CREDENTIALS.email,
      name: 'Admin',
      role: 'admin'
    };
  }
  return null;
}

export function createSessionToken(admin) {
  return jwt.sign(
    { 
      email: admin.email,
      name: admin.name,
      role: admin.role 
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
}

export function verifySessionToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}
