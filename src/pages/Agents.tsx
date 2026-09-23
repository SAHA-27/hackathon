import React from 'react';
import { Bot, Key, Shield, ShieldAlert, CheckCircle, Database, Server } from 'lucide-react';

const Agents = () => {
  const agents = [
    {
      id: 'AGT-001',
      name: 'HR Agent',
      status: 'Active',
      role: 'HR Administration',
      identityHash: 'sha256:8f43...b9a1',
      permissions: ['hr.employee.read', 'hr.salary.update', 'hr.documents.read'],
      riskProfile: 'Low',
    },
    {
      id: 'AGT-002',
      name: 'FinanceBot',
      status: 'Active',
      role: 'Financial Operations',
      identityHash: 'sha256:2d19...c3f4',
      permissions: ['finance.accounts.read', 'finance.payments.initiate'],
      riskProfile: 'High',
    },
    {
      id: 'AGT-003',
      name: 'SupportAgent',
      status: 'Active',
      role: 'Customer Support',
      identityHash: 'sha256:5e32...d8e2',
      permissions: ['crm.tickets.read', 'crm.tickets.update'],
      riskProfile: 'Low',
    },
    {
      id: 'AGT-004',
      name: 'IT Operations Bot',
      status: 'Active',
      role: 'DevOps & Infrastructure',
      identityHash: 'sha256:7a90...f1b3',
      permissions: ['cloud.servers.read', 'cloud.servers.provision', 'cloud.database.read'],
      riskProfile: 'High',
    },
    {
      id: 'AGT-005',
      name: 'Sales & Marketing Bot',
      status: 'Active',
      role: 'Outreach & Campaign Management',
      identityHash: 'sha256:4b21...e8c9',
      permissions: ['marketing.campaigns.create', 'sales.leads.read', 'sales.leads.update'],
      riskProfile: 'Medium',
    },
    {
      id: 'AGT-006',
      name: 'Unknown Agent',
      status: 'Quarantined',
      role: 'Unassigned',
      identityHash: 'Unknown',
      permissions: [],
      riskProfile: 'Critical',
    }
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-1">Agent Identity & Permissions</h1>
          <p className="text-slate-500 font-medium">Manage AI agent authentication, roles, and least-privilege API access.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {agents.map((agent) => (
          <div key={agent.id} className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-start">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  agent.status === 'Active' ? 'bg-blue-50 text-blue-600' : 'bg-rose-50 text-rose-600'
                }`}>
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{agent.name}</h3>
                  <div className="text-sm text-slate-500 font-mono">{agent.id} • {agent.role}</div>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                agent.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
              }`}>
                {agent.status === 'Active' ? <CheckCircle className="w-3 h-3" /> : <ShieldAlert className="w-3 h-3" />}
                {agent.status}
              </span>
            </div>
            
            <div className="p-6 bg-slate-50/50 space-y-4">
              <div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Key className="w-4 h-4" /> Identity & Authentication
                </div>
                <div className="text-sm font-mono bg-white border border-slate-200 p-2 rounded-lg text-slate-600">
                  {agent.identityHash}
                </div>
              </div>
              
              <div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Shield className="w-4 h-4" /> Action-Level Authorization
                </div>
                <div className="flex flex-wrap gap-2">
                  {agent.permissions.length > 0 ? agent.permissions.map(perm => (
                    <span key={perm} className="bg-white border border-slate-200 text-slate-600 text-xs px-2.5 py-1 rounded-md font-mono flex items-center gap-1">
                      {perm.includes('read') ? <Database className="w-3 h-3 text-emerald-500" /> : <Server className="w-3 h-3 text-amber-500" />}
                      {perm}
                    </span>
                  )) : (
                    <span className="text-sm text-slate-400 italic">No permissions granted</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Agents;
