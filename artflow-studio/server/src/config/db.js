const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const connectDB = async () => {
  try {
    let uri = (process.env.MONGODB_URI || '').trim();
    const isProduction = process.env.NODE_ENV === 'production';
    let connectWithMemory = false;

    if (!uri && isProduction) {
      console.error('MONGODB_URI required in production');
      process.exit(1);
    }

    if (!uri) {
      connectWithMemory = true;
    } else if (!isProduction) {
      try {
        await mongoose.connect(uri, {
          serverSelectionTimeoutMS: 10000,
          socketTimeoutMS: 10000,
          connectTimeoutMS: 10000,
        });
        await mongoose.connection.db.admin().ping();
      } catch (err) {
        console.warn('Unable to connect to provided MongoDB URI, falling back to in-memory MongoDB for development.');
        console.warn(err.message || err);
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
      console.log('Using in-memory MongoDB for development:', memoryUri);
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
    } else {
      const hashed = await bcrypt.hash(defaultAdminPassword, 10);
      await User.findByIdAndUpdate(adminExists._id, { password: hashed });
    }

  } catch (err) {
    console.error('DB connection error:', err.message);
    process.exit(1);
  }
};

module.exports = { connectDB };
