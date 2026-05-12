const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const connectDB = async () => {
  try {
    let uri = (process.env.MONGODB_URI || '').trim();
    const isProduction = process.env.NODE_ENV === 'production';
    let connectWithMemory = false;

    if (!uri) {
      console.warn('MONGODB_URI is missing');
      if (isProduction) {
        console.error('CRITICAL: MONGODB_URI required in production. Staying alive for health checks but DB features will fail.');
        return;
      }
      connectWithMemory = true;
    } else {
      // Ensure we have a database name in the URI to avoid 'test' default
      if (!uri.includes('mongodb.net/') || uri.split('mongodb.net/')[1].split('?')[0] === '') {
        const parts = uri.split('?');
        const base = parts[0].endsWith('/') ? parts[0] : parts[0] + '/';
        uri = `${base}artflow_studio${parts[1] ? '?' + parts[1] : ''}`;
        console.log('Appended default database name to URI');
      }

      try {
        console.log('Connecting to MongoDB Atlas...');
        await mongoose.connect(uri, {
          serverSelectionTimeoutMS: 5000,
          socketTimeoutMS: 45000,
          family: 4, // Force IPv4 to avoid potential DNS issues on some hosts
        });
        console.log('MongoDB Connected successfully to:', mongoose.connection.name);
      } catch (err) {
        console.error('MongoDB connection failed:', err.message);
        if (isProduction) {
          console.error('Production DB connection failed. Staying alive for health checks.');
          return;
        }
        connectWithMemory = true;
      }
    }

    if (connectWithMemory) {
      console.log('Falling back to memory DB...');
      try {
        const { MongoMemoryServer } = require('mongodb-memory-server');
        const mongod = await MongoMemoryServer.create();
        await mongoose.connect(mongod.getUri());
        console.log('Memory DB Connected');
      } catch (memErr) {
        console.error('Failed to start memory DB:', memErr.message);
      }
    }

    // Only check/create admin if connection was successful
    if (mongoose.connection.readyState === 1) {
      try {
        const User = require('../models/User');
        const adminExists = await User.findOne({ role: 'admin' });
        if (!adminExists) {
          const hashed = await require('bcryptjs').hash(process.env.DEFAULT_ADMIN_PASSWORD || 'admin123', 10);
          await User.create({
            name: 'Admin',
            email: 'admin@artflow.studio',
            password: hashed,
            company: 'ArtFlow Studio',
            role: 'admin',
          });
          console.log('Default admin created');
        }
      } catch (adminErr) {
        console.warn('Admin check failed:', adminErr.message);
      }
    } else {
      console.warn('Skipping admin check because DB is not ready');
    }
  } catch (err) {
    console.error('Fatal DB error during initialization:', err.message);
  }
};

module.exports = { connectDB };
