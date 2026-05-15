const fs = require('fs');
const path = require('path');
const { logger } = require('../utils/logger');

const DB_PATH = process.env.DATABASE_PATH || './data/slack.json';

let db = null;

function loadDb() {
  const dbDir = path.dirname(DB_PATH);
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  if (fs.existsSync(DB_PATH)) {
    const data = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(data);
  }
  
  return {
    installations: [],
    conversations: [],
    messages: []
  };
}

function saveDb(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

function initializeDatabase() {
  db = loadDb();
  logger.info('Database initialized successfully');
  return db;
}

function getDb() {
  if (!db) {
    throw new Error('Database not initialized. Call initializeDatabase() first.');
  }
  return db;
}

function closeDatabase() {
  if (db) {
    saveDb(db);
    db = null;
    logger.info('Database connection closed');
  }
}

function addInstallation(install) {
  const data = getDb();
  const existing = data.installations.findIndex(i => i.team_id === install.team_id);
  
  if (existing >= 0) {
    data.installations[existing] = { ...data.installations[existing], ...install, updated_at: new Date().toISOString() };
  } else {
    data.installations.push({ ...install, installed_at: new Date().toISOString(), updated_at: new Date().toISOString() });
  }
  
  saveDb(data);
  return install;
}

function getInstallation(teamId) {
  const data = getDb();
  return data.installations.find(i => i.team_id === teamId);
}

function addMessage(msg) {
  const data = getDb();
  const message = { ...msg, created_at: new Date().toISOString() };
  data.messages.push(message);
  saveDb(data);
  return message;
}

function addConversation(conv) {
  const data = getDb();
  const existing = data.conversations.findIndex(c => c.channel_id === conv.channel_id);
  
  if (existing >= 0) {
    data.conversations[existing] = { ...data.conversations[existing], ...conv, updated_at: new Date().toISOString() };
  } else {
    data.conversations.push({ ...conv, created_at: new Date().toISOString(), updated_at: new Date().toISOString() });
  }
  
  saveDb(data);
  return conv;
}

module.exports = { 
  initializeDatabase, 
  getDb, 
  closeDatabase,
  addInstallation,
  getInstallation,
  addMessage,
  addConversation
};