const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'gateway.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  } else {
    console.log('Connected to the SQLite database.');
    
    // Create tables if they don't exist
    db.run(`CREATE TABLE IF NOT EXISTS requests (
      id TEXT PRIMARY KEY,
      agent TEXT,
      action TEXT,
      targetApi TEXT,
      riskScore INTEGER,
      status TEXT,
      timestamp TEXT,
      authnResult BOOLEAN,
      authzResult BOOLEAN,
      reason TEXT,
      factors TEXT
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS logs (
      logId TEXT PRIMARY KEY,
      time TEXT,
      agent TEXT,
      action TEXT,
      targetSystem TEXT,
      riskScore INTEGER,
      decision TEXT,
      reason TEXT
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS system_state (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      lockdown BOOLEAN,
      postureScore INTEGER
    )`, () => {
      // Seed initial state if empty
      db.get('SELECT * FROM system_state WHERE id = 1', (err, row) => {
        if (!row) {
          db.run(`INSERT INTO system_state (id, lockdown, postureScore) VALUES (1, false, 87)`);
        }
      });
    });
  }
});

module.exports = db;
