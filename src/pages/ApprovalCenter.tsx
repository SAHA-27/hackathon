import React, { useState, useEffect } from 'react';
import { getRequests, updateRequestStatus, getLogs } from '../store';
import type { AgentRequest } from '../types';
import { Check, X, CheckCircle2, ShieldAlert } from 'lucide-react';

const ApprovalCenter = () => {
  const [requests, setRequests] = useState<AgentRequest[]>([]);

  useEffect(() => {
    getRequests().then(setRequests);
  }, []);

  const pendingRequests = requests.filter(r => r.status === 'Pending Approval');

  const handleApprove = async (id: string) => {
    await updateRequestStatus(id, 'Allowed / Executed', 'Manual approval granted by administrator.');
    setRequests(await getRequests());
  };

  const handleReject = async (id: string) => {
    await updateRequestStatus(id, 'Rejected', 'Manual rejection by administrator.');
    setRequests(await getRequests());
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight mb-2">Human Approval Center</h1>
          <p className="text-slate-400 font-medium">Review and explicitly approve or reject medium-risk agent operations.</p>
        </div>
      </div>

      <div className="space-y-6">
        {pendingRequests.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/50 rounded-2xl border border-slate-800 backdrop-blur-sm">
            <CheckCircle2 className="w-16 h-16 mx-auto mb-4 text-emerald-500/50" />
            <h3 className="text-xl font-bold text-slate-300 mb-2">All Caught Up</h3>
            <p className="text-slate-500">No pending requests require human intervention at this time.</p>
          </div>
        ) : (
          pendingRequests.map(req => (
            <div key={req.id} className="bg-slate-900/80 border border-amber-500/30 rounded-2xl p-6 shadow-xl shadow-amber-500/5 backdrop-blur-md flex flex-col md:flex-row gap-6 items-center justify-between">
              <div className="flex-1 w-full">
                <div className="flex items-center gap-3 mb-4">
                  <span className="font-bold text-white text-lg">{req.agent}</span>
                  <span className="text-slate-500">requested</span>
                  <span className="font-bold text-indigo-300 px-3 py-1 bg-indigo-500/10 rounded-lg border border-indigo-500/20">{req.action}</span>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800">
                    <div className="text-xs font-bold text-slate-500 mb-1">TARGET</div>
                    <div className="text-sm font-medium text-slate-300">{req.targetApi}</div>
                  </div>
                  <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800">
                    <div className="text-xs font-bold text-slate-500 mb-1">RISK SCORE</div>
                    <div className="text-sm font-bold text-amber-400">{req.riskScore} / 100</div>
                  </div>
                  <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800 md:col-span-2">
                    <div className="text-xs font-bold text-slate-500 mb-1">TIMESTAMP</div>
                    <div className="text-sm font-mono text-slate-400">{new Date(req.timestamp).toLocaleString()}</div>
                  </div>
                </div>

                <div className="text-sm text-amber-200/80 bg-amber-500/10 p-4 rounded-xl border border-amber-500/20 flex flex-col gap-2">
                  <div className="flex items-start gap-3">
                    <ShieldAlert className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                    <p><span className="font-bold text-amber-400">Triggered Policy:</span> {req.reason}</p>
                  </div>
                  <div className="ml-8 text-slate-300 font-mono">
                    <span className="font-bold text-slate-400">Potential Impact:</span> Unauthorized state mutation on {req.targetApi}.
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col gap-3 w-full md:w-56">
                <button onClick={() => handleApprove(req.id)} className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 py-3 px-4 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                  <Check className="w-5 h-5" /> APPROVE
                </button>
                <button onClick={() => handleReject(req.id)} className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-rose-400 border border-slate-700 hover:border-rose-500/50 py-3 px-4 rounded-xl font-bold transition-all">
                  <X className="w-5 h-5" /> REJECT
                </button>
                <button onClick={() => {
                  updateRequestStatus(req.id, 'Awaiting Agent Justification', 'Requested more info from agent.');
                  getRequests().then(setRequests);
                }} className="w-full text-xs font-bold text-indigo-400 hover:text-indigo-300 py-2 transition-colors">
                  REQUEST MORE INFO
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ApprovalCenter;
