const express = require('express');
const cors = require('cors');
const db = require('./database');

const app = express();
app.use(cors());
app.use(express.json());

const MOCK_AGENTS = [
  { id: 'AGT-HR-001', name: 'HR Agent', trustLevel: 'Trusted', permissions: ['View employee details', 'Search employees', 'Read HR records'], status: 'ACTIVE' },
  { id: 'AGT-FIN-001', name: 'Finance Agent', trustLevel: 'Trusted', permissions: ['View financial records', 'Generate reports', 'Read transaction data'], status: 'ACTIVE' },
  { id: 'AGT-CRM-001', name: 'CRM Agent', trustLevel: 'Trusted', permissions: ['View customer details', 'Update customer records'], status: 'ACTIVE' },
  { id: 'AGT-IT-001', name: 'IT Operations Bot', trustLevel: 'Trusted', permissions: ['View server status', 'Provision new server'], status: 'ACTIVE' },
  { id: 'AGT-SM-001', name: 'Sales & Marketing Bot', trustLevel: 'Trusted', permissions: ['View campaign metrics', 'Export lead contact list', 'Launch mass email campaign'], status: 'ACTIVE' },
  { id: 'AGT-UNKNOWN', name: 'Unknown Agent', trustLevel: 'Untrusted', permissions: [], status: 'BLOCKED' }
];

// Helper to get system state
const getSystemState = () => {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM system_state WHERE id = 1', (err, row) => {
      if (err) reject(err);
      else resolve({ lockdown: row.lockdown === 1, postureScore: row.postureScore });
    });
  });
};

// Risk Engine Service
const evaluateRequestLogic = async (agentName, action, targetApi, network, sensitive, outsideHours) => {
  const agent = MOCK_AGENTS.find(a => a.name === agentName) || MOCK_AGENTS.find(a => a.name === 'Unknown Agent');
  const systemState = await getSystemState();
  
  const result = {
    authnResult: false,
    authzResult: false,
    anomalyDetected: false,
    riskScore: 0,
    status: 'Blocked',
    reason: '',
    factors: []
  };

  if (systemState.lockdown) {
    return {
      ...result,
      agentId: agent.id,
      riskScore: 100,
      status: 'Blocked',
      reason: 'EMERGENCY GATEWAY LOCKDOWN IS ACTIVE. All requests are suspended.',
      factors: [{ factor: 'Gateway Lockdown Active', points: 100 }]
    };
  }

  // 1. Authenticate
  if (agent.trustLevel === 'Trusted') {
    result.authnResult = true;
  } else {
    result.authnResult = false;
    result.factors.push({ factor: 'Untrusted agent identity', points: 40 });
    result.riskScore += 40;
  }

  // 2. Authorize
  if (agent.permissions.includes(action)) {
    result.authzResult = true;
  } else {
    result.authzResult = false;
    result.factors.push({ factor: 'Unauthorized action attempted', points: 50 });
    result.riskScore += 50;
  }

  // 3. Active Honeypot Defense
  if (targetApi.includes('Honeypot')) {
    result.riskScore = 100;
    result.factors.push({ factor: 'CRITICAL ALARM: Interacted with Honeypot API', points: 100 });
    result.anomalyDetected = true;
    result.status = 'Blocked';
    result.reason = 'Agent triggered Active Honeypot Defense. This API is a decoy. Immediate quarantine initiated.';
    return { ...result, agentId: agent.id };
  }

  // 4. Action Sensitivity Risk & Anomalies
  if (action.includes('Delete') || action.includes('Update salary')) {
    result.riskScore += 45;
    result.factors.push({ factor: `High sensitivity operation (${action})`, points: 45 });
    
    // Mock Anomaly for high risk actions by trusted agents
    if (agent.trustLevel === 'Trusted' && action.includes('Delete')) {
      result.anomalyDetected = true;
      result.riskScore += 20;
      result.factors.push({ factor: 'Behavioral Anomaly: Destructive action unusual for this agent', points: 20 });
    }
  } else if (action.includes('Update') || action.includes('Provision') || action.includes('Launch') || action.includes('Export')) {
    result.riskScore += 25;
    result.factors.push({ factor: `Medium sensitivity (${action})`, points: 25 });
  } else {
    result.riskScore += 10;
    result.factors.push({ factor: `Routine read operation`, points: 10 });
  }

  // 5. Modifiers
  if (sensitive) {
    result.riskScore += 20;
    result.factors.push({ factor: 'Sensitive data access requested', points: 20 });
  }
  if (outsideHours) {
    result.riskScore += 15;
    result.factors.push({ factor: 'Operation outside standard business hours', points: 15 });
  }

  // 6. Network Context (Zero-Trust)
  if (network && network.includes('Tor')) {
    result.riskScore = 100;
    result.factors.push({ factor: 'CRITICAL: Connection from Tor Anonymity Network', points: 100 });
    result.anomalyDetected = true;
  } else if (network && network.includes('Malicious Subnet')) {
    result.riskScore = 100;
    result.factors.push({ factor: 'CRITICAL: Connection from Known Malicious Subnet', points: 100 });
    result.anomalyDetected = true;
  } else if (network && network.includes('Public Wi-Fi')) {
    result.riskScore += 30;
    result.factors.push({ factor: 'Insecure Network Origin (Public Wi-Fi)', points: 30 });
  } else if (network && network.includes('Corporate VPN')) {
    result.riskScore -= 10;
    result.factors.push({ factor: 'Trusted Network Origin (Corporate VPN)', points: -10 });
  }

  // 7. Decision
  if (!result.authnResult || !result.authzResult) {
    result.status = 'Blocked';
    result.reason = 'Request blocked due to failed Zero-Trust verification (AuthN/AuthZ mismatch).';
  } else if (result.riskScore >= 100) {
    result.status = 'Blocked';
    result.reason = 'Request blocked automatically due to CRITICAL policy violation (Risk Score >= 100).';
  } else if (result.riskScore > 85) {
    result.status = 'Blocked';
    result.reason = 'Request blocked automatically due to excessive risk score.';
  } else if (result.riskScore >= 50) {
    result.status = 'Pending Approval';
    result.reason = 'High-impact operation intercepted. Awaiting Human-in-the-Loop review.';
  } else {
    result.status = 'Allowed';
    result.reason = 'Request passed all Zero-Trust and Risk checks.';
  }

  return { ...result, agentId: agent.id, network };
};

// API Endpoints

app.get('/api/requests', (req, res) => {
  db.all('SELECT * FROM requests ORDER BY timestamp DESC', (err, rows) => {
    if (err) res.status(500).json({ error: err.message });
    else {
      // Parse factors JSON
      rows.forEach(r => {
        r.factors = JSON.parse(r.factors || '[]');
        r.authnResult = r.authnResult === 1;
        r.authzResult = r.authzResult === 1;
      });
      res.json(rows);
    }
  });
});

app.get('/api/logs', (req, res) => {
  db.all('SELECT * FROM logs ORDER BY time DESC', (err, rows) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(rows);
  });
});

app.post('/api/evaluate', async (req, res) => {
  const { agent, action, targetApi, network, sensitive, outsideHours } = req.body;
  try {
    const evalResult = await evaluateRequestLogic(agent, action, targetApi, network, sensitive, outsideHours);
    
    const timestamp = new Date().toISOString();
    const reqId = `REQ-${Math.floor(Math.random() * 10000)}`;
    const logId = `LOG-${Math.floor(Math.random() * 10000)}`;

    const newReq = {
      id: reqId,
      agent,
      action,
      targetApi,
      riskScore: evalResult.riskScore,
      status: evalResult.status,
      timestamp,
      authnResult: evalResult.authnResult,
      authzResult: evalResult.authzResult,
      reason: evalResult.reason
    };

    // Save to SQLite
    db.run(
      `INSERT INTO requests (id, agent, action, targetApi, riskScore, status, timestamp, authnResult, authzResult, reason, factors) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [newReq.id, newReq.agent, newReq.action, newReq.targetApi, newReq.riskScore, newReq.status, newReq.timestamp, newReq.authnResult ? 1 : 0, newReq.authzResult ? 1 : 0, newReq.reason, JSON.stringify(evalResult.factors)]
    );

    db.run(
      `INSERT INTO logs (logId, time, agent, action, targetSystem, riskScore, decision, reason) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [logId, timestamp, agent, action, targetApi, newReq.riskScore, newReq.status, newReq.reason]
    );

    res.json({ newReq, factors: evalResult.factors });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/system-state', async (req, res) => {
  try {
    const state = await getSystemState();
    res.json(state);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/system-state/lockdown', (req, res) => {
  const { active } = req.body;
  db.run(`UPDATE system_state SET lockdown = ? WHERE id = 1`, [active ? 1 : 0], (err) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json({ success: true, lockdown: active });
  });
});

app.post('/api/reset', (req, res) => {
  db.run('DELETE FROM requests');
  db.run('DELETE FROM logs');
  db.run('UPDATE system_state SET lockdown = 0');
  res.json({ success: true });
});

app.post('/api/requests/:id/status', (req, res) => {
  const { status, logReason } = req.body;
  const { id } = req.params;
  db.run('UPDATE requests SET status = ? WHERE id = ?', [status, id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    db.run('INSERT INTO logs (logId, time, agent, action, targetSystem, riskScore, decision, reason) SELECT ?, ?, ?, ?, ?, riskScore, ?, ? FROM requests WHERE id = ?',
      [`LOG-${Math.floor(Math.random() * 10000)}`, new Date().toISOString(), 'Human Admin', 'Updated Request', id, status, logReason, id],
      (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
      }
    );
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});