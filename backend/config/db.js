// backend/config/db.js
import mongoose from 'mongoose';
import dns from 'node:dns';

// Force Cloudflare + Google DNS — fixes Atlas SRV resolution on some ISPs
dns.setServers(['1.1.1.1', '8.8.8.8']);

export async function connectDB() {
  const uri = process.env.MONGO_URI_ATLAS;

  if (!uri) {
    throw new Error('MONGO_URI_ATLAS is not set in .env');
  }

  mongoose.set('strictQuery', true);

  await mongoose.connect(uri, {
    autoIndex: process.env.NODE_ENV !== 'production',
  });

  console.log('MongoDB connected => ATLAS');
}