// src/models/Admin.js
import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';

let client;
let db;

async function init() {
  if (db) return;
  
  client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  db = client.db('zailio-labs');
}

export async function createAdminUser() {
  await init();
  
  const existingAdmin = await db.collection('admins').findOne({ email: process.env.ADMIN_EMAIL });
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12);
    await db.collection('admins').insertOne({
      email: process.env.ADMIN_EMAIL,
      password: hashedPassword,
      name: 'Admin',
      role: 'superadmin',
      createdAt: new Date()
    });
    console.log('Admin user created');
  }
}

export async function verifyAdmin(email, password) {
  await init();
  
  const admin = await db.collection('admins').findOne({ email });
  if (!admin) return null;
  
  const isValid = await bcrypt.compare(password, admin.password);
  return isValid ? admin : null;
}

export default {
  createAdminUser,
  verifyAdmin
};
