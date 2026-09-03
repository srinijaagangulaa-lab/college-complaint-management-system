const mongoose = require('mongoose');
const { MONGO_URI, NODE_ENV } = require('./env');
const { dbState, seedMemoryData } = require('../utils/memoryStore');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    dbState.isInMemory = false;
    return conn;
  } catch (error) {
    console.warn(`[Database] Warning: Could not connect to primary MongoDB at ${MONGO_URI}.`);
    console.warn(`[Database] Activating zero-dependency In-Memory Database engine with auto-seeded demo accounts.`);
    
    dbState.isInMemory = true;
    await seedMemoryData();
    return null;
  }
};

const closeDB = async () => {
  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
  } catch (err) {
    console.error('[Database] Error closing DB:', err.message);
  }
};

module.exports = { connectDB, closeDB };
