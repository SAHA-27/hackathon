import type { AgentRequest, LogEntry } from './types';

const API_URL = 'https://hackathon-5-9num.onrender.com/api';

export const MOCK_AGENTS = [
  { id: 'AGT-HR-001', name: 'HR Agent', trustLevel: 'Trusted', permissions: ['View employee details', 'Search employees', 'Read HR records'], status: 'ACTIVE' },
  { id: 'AGT-FIN-001', name: 'Finance Agent', trustLevel: 'Trusted', permissions: ['View financial records', 'Generate reports', 'Read transaction data'], status: 'ACTIVE' },
  { id: 'AGT-CRM-001', name: 'CRM Agent', trustLevel: 'Trusted', permissions: ['View customer details', 'Update customer records'], status: 'ACTIVE' },
  { id: 'AGT-IT-001', name: 'IT Operations Bot', trustLevel: 'Trusted', permissions: ['View server status', 'Provision new server'], status: 'ACTIVE' },
  { id: 'AGT-SM-001', name: 'Sales & Marketing Bot', trustLevel: 'Trusted', permissions: ['View campaign metrics', 'Export lead contact list', 'Launch mass email campaign'], status: 'ACTIVE' },
  { id: 'AGT-UNKNOWN', name: 'Unknown Agent', trustLevel: 'Untrusted', permissions: [], status: 'BLOCKED' }
];

export const getRequests = async (): Promise<AgentRequest[]> => {
  const res = await fetch(`${API_URL}/requests`);
  return res.json();
};

export const getLogs = async (): Promise<LogEntry[]> => {
  const res = await fetch(`${API_URL}/logs`);
  return res.json();
};

export const resetData = async () => {
  await fetch(`${API_URL}/reset`, { method: 'POST' });
};

export const getSystemState = async () => {
  const res = await fetch(`${API_URL}/system-state`);
  return res.json();
};

export const setLockdown = async (active: boolean) => {
  await fetch(`${API_URL}/system-state/lockdown`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ active })
  });
};

export const addRequestAsync = async (agent: string, action: string, targetApi: string, network: string, sensitive: boolean, outsideHours: boolean) => {
  const res = await fetch(`${API_URL}/evaluate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ agent, action, targetApi, network, sensitive, outsideHours })
  });
  return res.json();
};

export const updateRequestStatus = async (id: string, status: string, logReason: string) => {
  await fetch(`${API_URL}/requests/${id}/status`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status, logReason })
  });
};