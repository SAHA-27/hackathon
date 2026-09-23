import React, { useState, useEffect } from 'react';
import { getRequests, updateRequestStatus, getLogs } from '../store';
import type { AgentRequest } from '../types';
import { CheckCircle, AlertTriangle, XCircle, Eye, Check, X } from 'lucide-react';

const LiveRequests = () => {
  const [activeTab, setActiveTab] = useState<'live' | 'approval'>('live');
  const [requests, setRequests] = useState<AgentRequest[]>([]);
  const [selectedReq, setSelectedReq] = useState<AgentRequest | null>(null);

  useEffect(() => {
    getRequests().then(setRequests);
  }, []);

  const pendingRequests = requests.filter(r => r.status === 'Pending Approval');

  const handleApprove = async (id: string) => {
    await updateRequestStatus(id, 'Allowed / Executed', 'Manual approval granted by administrator.');
    setRequests(await getRequests());
    alert('Request Approved successfully');
  };

  const handleReject = async (id: string) => {
    await updateRequestStatus(id, 'Rejected', 'Manual rejection by administrator.');
    setRequests(await getRequests());
    alert('Request Rejected');
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Live & Approvals</h1>
          <p className="text-slate-500">Monitor active requests and manage human-in-the-loop approvals.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-8">
        <div className="flex border-b border-slate-200">
          <button 
            className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'live' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            onClick={() => setActiveTab('live')}
          >
            Live Requests
          </button>
          <button 
            className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'approval' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            onClick={() => setActiveTab('approval')}
          >
            Approval Queue
            {pendingRequests.length > 0 && (
              <span className="bg-amber-100 text-amber-700 py-0.5 px-2 rounded-full text-xs">{pendingRequests.length}</span>
            )}
          </button>
        </div>

        {activeTab === 'live' && (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-sm">
                <th className="px-6 py-3 font-medium">Request ID</th>
                <th className="px-6 py-3 font-medium">Agent</th>
                <th className="px-6 py-3 font-medium">Action</th>
                <th className="px-6 py-3 font-medium">Risk Score</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {requests.map((req) => (
                <tr key={req.id} className="hover:bg-slate-50/50">
                  <td className="px-6 py-4 text-slate-500 text-sm font-mono">{req.id}</td>
                  <td className="px-6 py-4 font-medium text-slate-900">{req.agent}</td>
                  <td className="px-6 py-4 text-slate-600">{req.action}</td>
                  <td className="px-6 py-4">
                    <span className={`font-medium ${req.riskScore < 30 ? 'text-emerald-600' : req.riskScore < 70 ? 'text-amber-600' : 'text-rose-600'}`}>
                      {req.riskScore}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                      req.status.includes('Allowed') ? 'bg-emerald-100 text-emerald-700' :
                      req.status === 'Pending Approval' ? 'bg-amber-100 text-amber-700' :
                      'bg-rose-100 text-rose-700'
                    }`}>
                      {req.status.includes('Allowed') && <CheckCircle className="w-3.5 h-3.5" />}
                      {req.status === 'Pending Approval' && <AlertTriangle className="w-3.5 h-3.5" />}
                      {(req.status === 'Blocked' || req.status === 'Rejected') && <XCircle className="w-3.5 h-3.5" />}
                      {req.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button onClick={() => setSelectedReq(req)} className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50 transition-colors">
                      <Eye className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeTab === 'approval' && (
          <div className="p-6 space-y-4">
            {pendingRequests.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <CheckCircle className="w-12 h-12 mx-auto mb-3 text-emerald-400" />
                <p>No pending requests require approval.</p>
              </div>
            ) : (
              pendingRequests.map(req => (
                <div key={req.id} className="bg-white border border-amber-200 rounded-lg p-5 shadow-sm flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-bold text-slate-900">{req.agent}</span>
                      <span className="text-slate-400 text-sm">requested</span>
                      <span className="font-semibold text-slate-800">{req.action}</span>
                    </div>
                    <div className="flex items-center gap-6 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500">Risk Score:</span>
                        <span className="font-bold text-amber-600">{req.riskScore}/100</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500">Target:</span>
                        <span className="font-medium">{req.targetApi}</span>
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 mt-3 bg-slate-50 p-2 rounded border border-slate-100">
                      <span className="font-semibold">Reason: </span>{req.reason}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 ml-8 w-32">
                    <button onClick={() => handleApprove(req.id)} className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-lg font-medium transition-colors">
                      <Check className="w-4 h-4" /> Approve
                    </button>
                    <button onClick={() => handleReject(req.id)} className="w-full flex items-center justify-center gap-2 bg-rose-100 hover:bg-rose-200 text-rose-700 py-2 px-4 rounded-lg font-medium transition-colors">
                      <X className="w-4 h-4" /> Reject
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {selectedReq && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">Request Details</h3>
              <button onClick={() => setSelectedReq(null)} className="text-slate-400 hover:text-slate-600"><X className="w-6 h-6" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-slate-500 mb-1">Request ID</div>
                  <div className="font-mono font-medium">{selectedReq.id}</div>
                </div>
                <div>
                  <div className="text-slate-500 mb-1">Timestamp</div>
                  <div className="font-medium">{new Date(selectedReq.timestamp).toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-slate-500 mb-1">Agent</div>
                  <div className="font-medium">{selectedReq.agent}</div>
                </div>
                <div>
                  <div className="text-slate-500 mb-1">Target API</div>
                  <div className="font-medium">{selectedReq.targetApi}</div>
                </div>
                {/* Notice I don't know if selectedReq has network saved, but I'll add it anyway just in case, or show 'Unknown' */}
                <div>
                  <div className="text-slate-500 mb-1">Network Origin</div>
                  <div className="font-medium">Evaluated in Backend</div>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4 mt-2">
                <h4 className="font-medium mb-3">Security Checks</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center p-2 bg-slate-50 rounded">
                    <span>Authentication</span>
                    <span className={`font-medium ${selectedReq.authnResult ? 'text-emerald-600' : 'text-rose-600'}`}>{selectedReq.authnResult ? 'PASS' : 'FAIL'}</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-slate-50 rounded">
                    <span>Authorization</span>
                    <span className={`font-medium ${selectedReq.authzResult ? 'text-emerald-600' : 'text-rose-600'}`}>{selectedReq.authzResult ? 'PASS' : 'FAIL'}</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-slate-50 rounded">
                    <span>Risk Score</span>
                    <span className="font-medium">{selectedReq.riskScore}</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4 mt-2">
                <div className="text-slate-500 text-sm mb-1">Decision Reason</div>
                <p className="text-sm font-medium text-slate-800 bg-blue-50 p-3 rounded">{selectedReq.reason}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveRequests;
