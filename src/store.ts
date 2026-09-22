import type { AgentRequest, LogEntry } from './types';

export const MOCK_AGENTS = [
  { id: 'AGT-HR-001', name: 'HR Agent', trustLevel: 'Trusted', permissions: ['View employee details', 'Search employees', 'Read HR records'], status: 'ACTIVE' },
  { id: 'AGT-FIN-001', name: 'Finance Agent', trustLevel: 'Trusted', permissions: ['View financial records', 'Generate reports', 'Read transaction data'], status: 'ACTIVE' },
  { id: 'AGT-CRM-001', name: 'CRM Agent', trustLevel: 'Trusted', permissions: ['View customer details', 'Update customer records'], status: 'ACTIVE' },
  { id: 'AGT-UNKNOWN', name: 'Unknown Agent', trustLevel: 'Untrusted', permissions: [], status: 'BLOCKED' }
];

const INITIAL_REQUESTS: AgentRequest[] = [];
const INITIAL_LOGS: LogEntry[] = [];

export const getRequests = (): AgentRequest[] => {
  const reqs = localStorage.getItem('sg_requests');
  return reqs ? JSON.parse(reqs) : INITIAL_REQUESTS;
};

export const saveRequests = (reqs: AgentRequest[]) => {
  localStorage.setItem('sg_requests', JSON.stringify(reqs));
};

export const getLogs = (): LogEntry[] => {
  const logs = localStorage.getItem('sg_logs');
  return logs ? JSON.parse(logs) : INITIAL_LOGS;
};

export const saveLogs = (logs: LogEntry[]) => {
  localStorage.setItem('sg_logs', JSON.stringify(logs));
};

export const resetData = () => {
  localStorage.setItem('sg_requests', JSON.stringify(INITIAL_REQUESTS));
  localStorage.setItem('sg_logs', JSON.stringify(INITIAL_LOGS));
};

// Risk Engine Service
export const evaluateRequest = (agentName: string, action: string, targetApi: string, sensitive: boolean, outsideHours: boolean) => {
  const agent = MOCK_AGENTS.find(a => a.name === agentName) || MOCK_AGENTS.find(a => a.name === 'Unknown Agent')!;
  
  const result = {
    authnResult: false,
    authzResult: false,
    riskScore: 0,
    status: 'Blocked' as const,
    reason: '',
    factors: [] as string[]
  };

  // 1. Authenticate
  if (agent.trustLevel === 'Trusted') {
    result.authnResult = true;
  } else {
    result.authnResult = false;
    result.factors.push('+40 Untrusted agent');
    result.riskScore += 40;
  }

  // 2. Authorize
  if (agent.permissions.includes(action)) {
    result.authzResult = true;
  } else {
    result.authzResult = false;
    result.factors.push('+50 Unauthorized action');
    result.riskScore += 50;
  }

  // 3. Action Sensitivity Risk
  if (action.includes('Delete') || action.includes('Update salary')) {
    result.riskScore += 45;
    result.factors.push(`+45 High sensitivity (${action})`);
  } else if (action.includes('Update')) {
    result.riskScore += 25;
    result.factors.push(`+25 Medium sensitivity (${action})`);
  } else {
    result.riskScore += 10;
    result.factors.push(`+10 Low sensitivity read`);
  }

  // 4. Modifiers
  if (sensitive) {
    result.riskScore += 20;
    result.factors.push('+20 Sensitive data involved');
  }
  if (outsideHours) {
    result.riskScore += 15;
    result.factors.push('+15 Outside business hours');
  }

  // 5. Decision
  if (!result.authnResult || !result.authzResult) {
    result.status = 'Blocked';
    result.reason = 'Request blocked because it violated security policy (Failed Authentication/Authorization).';
  } else if (result.riskScore > 85) {
    result.status = 'Blocked';
    result.reason = 'Request blocked because it violated security policy (High Risk > 85).';
  } else if (result.riskScore >= 50) {
    result.status = 'Pending Approval';
    result.reason = 'High-impact operation requires human approval.';
  } else {
    result.status = 'Allowed';
    result.reason = 'Request passed all security checks.';
  }

  return { ...result, agentId: agent.id };
};

export const addRequest = (reqData: ReturnType<typeof evaluateRequest> & { agent: string, action: string, targetApi: string }) => {
  const reqs = getRequests();
  const logs = getLogs();
  
  const newReq: AgentRequest = {
    id: `REQ-${Math.floor(Math.random() * 10000)}`,
    agent: reqData.agent,
    action: reqData.action,
    targetApi: reqData.targetApi,
    riskScore: reqData.riskScore,
    status: reqData.status,
    timestamp: new Date().toISOString(),
    authnResult: reqData.authnResult,
    authzResult: reqData.authzResult,
    reason: reqData.reason
  };
  
  reqs.unshift(newReq);
  saveRequests(reqs);
  
  const newLog: LogEntry = {
    logId: `LOG-${Math.floor(Math.random() * 10000)}`,
    time: newReq.timestamp,
    agent: newReq.agent,
    action: newReq.action,
    targetSystem: newReq.targetApi,
    riskScore: newReq.riskScore,
    decision: newReq.status,
    reason: newReq.reason,
  };
  
  logs.unshift(newLog);
  saveLogs(logs);
  
  return { newReq, factors: reqData.factors };
};
