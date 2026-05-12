const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const connectDB = async () => {
  try {
    let uri = (process.env.MONGODB_URI || '').trim();
    const isProduction = process.env.NODE_ENV === 'production';
    let connectWithMemory = false;

    if (!uri) {
      if (isProduction) {
        console.error('MONGODB_URI required in production');
        process.exit(1);
      }
      connectWithMemory = true;
    } else {
      // Try production connection with longer timeout
      try {
        await mongoose.connect(uri, {
          serverSelectionTimeoutMS: 30000,
          socketTimeoutMS: 30000,
          connectTimeoutMS: 30000,
        });
        await mongoose.connection.db.admin().ping();
      } catch (err) {
        console.warn('MongoDB connection failed, falling back to in-memory:', err.message);
        if (isProduction) {
          console.error('Production database connection failed and cannot fallback to memory');
          process.exit(1);
        }
        connectWithMemory = true;
      }
    }

    if (connectWithMemory) {
      if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
      }
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create({ instance: { port: 0 } });
      const memoryUri = mongod.getUri();
      console.log('Using in-memory MongoDB:', memoryUri);
      await mongoose.connect(memoryUri, {
        serverSelectionTimeoutMS: 30000,
        socketTimeoutMS: 30000,
        connectTimeoutMS: 30000,
      });
    }

    const User = require('../models/User');
    const adminExists = await User.findOne({ role: 'admin' });
    const defaultAdminPassword = process.env.DEFAULT_ADMIN_PASSWORD || 'admin123';

    if (!adminExists) {
      const hashed = await bcrypt.hash(defaultAdminPassword, 10);
      await User.create({
        name: 'Admin',
        email: 'admin@artflow.studio',
        password: hashed,
        company: 'ArtFlow Studio',
        role: 'admin',
      });
    }

  } catch (err) {
    console.error('DB connection error:', err.message);
    process.exit(1);
  }
};

module.exports = { connectDB };
