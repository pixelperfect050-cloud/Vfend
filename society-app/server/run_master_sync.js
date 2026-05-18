const path = require('path');
const mongoose = require('mongoose');

// Load environment variables
require('dotenv').config();

const Society = require('./src/models/Society');
const googleSheetsService = require('./src/services/googleSheetsService');

async function run() {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error('MONGO_URI is not defined in .env file!');
    }

    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(mongoUri);
    console.log('Successfully connected to MongoDB Atlas!');

    // Fetch all societies
    const societies = await Society.find({});
    console.log(`Found ${societies.length} societies in the database.`);

    console.log('\n----------------------------------------');
    console.log('Generating and updating Master Sheet (All Societies + Demo Leads tabs)...');
    
    const masterResult = await googleSheetsService.syncMasterSheet();
    console.log('Master Sheet Sync Result:', JSON.stringify(masterResult, null, 2));

    console.log('\n----------------------------------------');
    console.log('Sync process completed successfully!');
  } catch (error) {
    console.error('Master Sync Script Error:', error);
  } finally {
    mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  }
}

run();
