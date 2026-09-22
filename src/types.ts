export type RequestStatus = 'Allowed' | 'Pending Approval' | 'Blocked' | 'Rejected' | 'Allowed / Executed';

export interface AgentRequest {
  id: string;
  agent: string;
  action: string;
  targetApi: string;
  riskScore: number;
  status: RequestStatus;
  timestamp: string;
  authnResult: boolean;
  authzResult: boolean;
  reason: string;
}

export interface LogEntry {
  logId: string;
  time: string;
  agent: string;
  action: string;
  targetSystem: string;
  riskScore: number;
  decision: RequestStatus;
  reason: string;
}
