const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const connectDB = async () => {
  try {
    let uri = process.env.MONGODB_URI;

    if (!uri && process.env.NODE_ENV === 'production') {
      console.error('MONGODB_URI required in production');
      process.exit(1);
    }

    if (!uri) {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      uri = mongod.getUri();
    }

    await mongoose.connect(uri);

    const User = require('../models/User');
    const adminExists = await User.findOne({ role: 'admin' });

    if (!adminExists) {
      const hashed = await bcrypt.hash('Dhuzy@200819', 10);
      await User.create({
        name: 'Admin',
        email: 'admin@artflow.studio',
        password: hashed,
        company: 'ArtFlow Studio',
        role: 'admin',
      });
    } else {
      const hashed = await bcrypt.hash('Dhuzy@200819', 10);
      await User.findByIdAndUpdate(adminExists._id, { password: hashed });
    }

  } catch (err) {
    console.error('DB connection error:', err.message);
    process.exit(1);
  }
};

module.exports = { connectDB };
