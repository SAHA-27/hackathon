import type { AgentRequest, LogEntry } from './types';

const INITIAL_REQUESTS: AgentRequest[] = [
  { id: 'REQ-001', agent: 'HR Agent', action: 'View employee details', targetApi: 'HR API', riskScore: 10, status: 'Allowed', timestamp: new Date().toISOString(), authnResult: true, authzResult: true, reason: 'Low risk read operation' },
  { id: 'REQ-002', agent: 'HR Agent', action: 'Update employee salary', targetApi: 'HR API', riskScore: 65, status: 'Pending Approval', timestamp: new Date().toISOString(), authnResult: true, authzResult: true, reason: 'Medium risk: sensitive data modification' },
  { id: 'REQ-003', agent: 'Unknown Agent', action: 'Delete employee', targetApi: 'HR API', riskScore: 95, status: 'Blocked', timestamp: new Date().toISOString(), authnResult: false, authzResult: false, reason: 'High risk: unauthorized destructive operation by unregistered agent' },
  { id: 'REQ-004', agent: 'FinanceBot', action: 'Initiate payment', targetApi: 'Finance API', riskScore: 75, status: 'Pending Approval', timestamp: new Date().toISOString(), authnResult: true, authzResult: true, reason: 'High risk: financial transaction' },
  { id: 'REQ-005', agent: 'SupportAgent', action: 'View customer ticket', targetApi: 'CRM API', riskScore: 15, status: 'Allowed', timestamp: new Date().toISOString(), authnResult: true, authzResult: true, reason: 'Low risk read operation' },
];

const INITIAL_LOGS: LogEntry[] = INITIAL_REQUESTS.map(req => ({
  logId: `LOG-${Math.floor(Math.random() * 10000)}`,
  time: req.timestamp,
  agent: req.agent,
  action: req.action,
  targetSystem: req.targetApi,
  riskScore: req.riskScore,
  decision: req.status,
  reason: req.reason,
}));

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

export const addRequest = (req: Omit<AgentRequest, 'id' | 'timestamp'>) => {
  const reqs = getRequests();
  const logs = getLogs();
  
  const newReq: AgentRequest = {
    ...req,
    id: `REQ-${Math.floor(Math.random() * 10000)}`,
    timestamp: new Date().toISOString()
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
  
  return newReq;
};
