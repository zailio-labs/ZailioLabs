// src/models/Contact.js
import { MongoClient, ObjectId } from 'mongodb';

let client;
let db;

async function init() {
  if (db) return;
  
  client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  db = client.db('zailio-labs');
}

export async function createContact(request) {
  await init();
  
  const contact = {
    ...request,
    status: 'unread', // unread, read, replied
    createdAt: new Date(),
    updatedAt: new Date(),
    readAt: null,
    repliedAt: null,
    adminNotes: ''
  };
  
  const result = await db.collection('contacts').insertOne(contact);
  return result.insertedId;
}

export async function getContacts(filter = {}) {
  await init();
  return await db.collection('contacts')
    .find(filter)
    .sort({ createdAt: -1 })
    .toArray();
}

export async function getContactById(id) {
  await init();
  return await db.collection('contacts').findOne({ _id: new ObjectId(id) });
}

export async function updateContactStatus(id, updates) {
  await init();
  return await db.collection('contacts').updateOne(
    { _id: new ObjectId(id) },
    { 
      $set: { 
        ...updates,
        updatedAt: new Date()
      } 
    }
  );
}

export async function getUnreadCount() {
  await init();
  return await db.collection('contacts').countDocuments({ status: 'unread' });
}

export async function deleteContact(id) {
  await init();
  return await db.collection('contacts').deleteOne({ _id: new ObjectId(id) });
}
