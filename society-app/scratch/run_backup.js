const path = require('path');
const mongoose = require('mongoose');

// Load environment variables from the server directory
require('dotenv').config({ path: path.join(__dirname, '../server/.env') });

const Society = require('../server/src/models/Society');
const googleSheetsService = require('../server/src/services/googleSheetsService');

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

    if (societies.length === 0) {
      console.log('No societies found to backup.');
      mongoose.disconnect();
      return;
    }

    for (const society of societies) {
      console.log(`\n----------------------------------------`);
      console.log(`Processing Society: ${society.name} (${society._id})`);
      
      if (society.googleSheetId) {
        console.log(`Google Sheet already exists: ${society.googleSheetUrl}`);
        console.log(`Triggering complete sync of all data...`);
        try {
          const syncResult = await googleSheetsService.syncAllData(society._id);
          console.log(`Sync Result for ${society.name}:`, syncResult);
        } catch (syncErr) {
          console.error(`Failed to sync data for ${society.name}:`, syncErr.message);
        }
      } else {
        console.log(`No Google Sheet found for this society. Creating a new backup sheet...`);
        try {
          const createResult = await googleSheetsService.createSheetForSociety(society._id);
          console.log(`Create Result for ${society.name}:`, createResult);
        } catch (createErr) {
          console.error(`Failed to create backup sheet for ${society.name}:`, createErr.message);
        }
      }
    }

    console.log(`\n----------------------------------------`);
    console.log('All backup processes triggered successfully!');
  } catch (error) {
    console.error('Backup Script Error:', error);
  } finally {
    mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  }
}

run();
