const path = require('path');
const mongoose = require('mongoose');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '.env') });

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

    if (societies.length === 0) {
      console.log('No societies found to backup.');
      mongoose.disconnect();
      return;
    }

    // Resetting existing Google Sheet references to create brand new ones
    console.log('Resetting and removing existing Google Sheet configurations from database...');
    await Society.updateMany({}, {
      $set: {
        googleSheetId: '',
        googleSheetUrl: '',
        googleFolderUrl: '',
        sheetEnabled: false
      }
    });
    console.log('Database references cleared successfully. Forcing new sheet creation...');

    // Fetch updated societies list
    const updatedSocieties = await Society.find({});

    for (const society of updatedSocieties) {
      console.log(`\n----------------------------------------`);
      console.log(`Processing Society: ${society.name} (${society._id})`);
      
      console.log(`Creating a brand new backup sheet...`);
      try {
        const createResult = await googleSheetsService.createSheetForSociety(society._id);
        console.log(`Create Result for ${society.name}:`, JSON.stringify(createResult, null, 2));
      } catch (createErr) {
        console.error(`Failed to create backup sheet for ${society.name}:`, createErr.message);
      }
    }

    console.log(`\n----------------------------------------`);
    console.log('Generating and updating Master Sheet...');
    try {
      const masterResult = await googleSheetsService.syncMasterSheet();
      console.log('Master Sheet Result:', JSON.stringify(masterResult, null, 2));
    } catch (masterErr) {
      console.error('Failed to update Master Sheet:', masterErr.message);
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
