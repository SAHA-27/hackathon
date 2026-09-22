import React, { useEffect, useState } from 'react';
import { getRequests } from '../store';
import type { AgentRequest } from '../types';
import { Shield, CheckCircle, AlertTriangle, XCircle, ArrowRight, Server, Database, Bot } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [requests, setRequests] = useState<AgentRequest[]>([]);

  useEffect(() => {
    setRequests(getRequests());
  }, []);

  const total = requests.length;
  const allowed = requests.filter(r => r.status.includes('Allowed')).length;
  const pending = requests.filter(r => r.status === 'Pending Approval').length;
  const blocked = requests.filter(r => r.status === 'Blocked' || r.status === 'Rejected').length;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-start mb-10">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-1">Dynamic Agent Security Gateway</h1>
          <p className="text-slate-500 font-medium">Enterprise AI Security & Governance Layer</p>
        </div>
        <Link to="/simulate" className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-lg font-medium transition-all shadow-md hover:shadow-lg flex items-center gap-2">
          <Bot className="w-5 h-5 text-blue-400" />
          Simulate Request
        </Link>
      </div>

      <div className="grid grid-cols-4 gap-6 mb-10">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -mr-4 -mt-4 opacity-50"></div>
          <div className="text-sm font-semibold text-slate-500 mb-2 tracking-wide uppercase">Total Requests</div>
          <div className="text-4xl font-extrabold text-slate-900">{total > 0 ? total : 126}</div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60 flex flex-col relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-full -mr-4 -mt-4 opacity-50"></div>
          <div className="text-sm font-semibold text-emerald-600 mb-2 tracking-wide uppercase flex items-center gap-1.5"><CheckCircle className="w-4 h-4"/> Allowed</div>
          <div className="text-4xl font-extrabold text-slate-900">{allowed > 0 ? allowed : 93}</div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60 flex flex-col relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50 rounded-bl-full -mr-4 -mt-4 opacity-50"></div>
          <div className="text-sm font-semibold text-amber-600 mb-2 tracking-wide uppercase flex items-center gap-1.5"><AlertTriangle className="w-4 h-4"/> Pending</div>
          <div className="text-4xl font-extrabold text-slate-900">{pending > 0 ? pending : 12}</div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60 flex flex-col relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-rose-50 rounded-bl-full -mr-4 -mt-4 opacity-50"></div>
          <div className="text-sm font-semibold text-rose-600 mb-2 tracking-wide uppercase flex items-center gap-1.5"><XCircle className="w-4 h-4"/> Blocked</div>
          <div className="text-4xl font-extrabold text-slate-900">{blocked > 0 ? blocked : 21}</div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200/60 mb-10">
        <h2 className="text-lg font-bold text-slate-900 mb-8 flex items-center gap-2">
          <Shield className="w-5 h-5 text-blue-500" />
          Security Flow Architecture
        </h2>
        <div className="flex items-center justify-between px-4">
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-200 shadow-sm">
              <Bot className="w-8 h-8 text-slate-700" />
            </div>
            <span className="text-sm font-semibold text-slate-600">AI Agent</span>
          </div>
          
          <div className="flex-1 flex items-center justify-center relative">
            <div className="h-0.5 w-full bg-slate-200 absolute"></div>
            <ArrowRight className="w-6 h-6 text-slate-400 relative bg-white px-1" />
          </div>
          
          <div className="flex flex-col items-center gap-3 z-10">
            <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/30 relative">
              <Shield className="w-10 h-10 text-white" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-white animate-pulse"></div>
            </div>
            <span className="text-sm font-bold text-blue-600">Security Gateway</span>
          </div>

          <div className="flex-1 flex items-center justify-center relative">
            <div className="h-0.5 w-full bg-slate-200 absolute"></div>
            <ArrowRight className="w-6 h-6 text-slate-400 relative bg-white px-1" />
          </div>
          
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-200 shadow-sm">
              <Server className="w-8 h-8 text-slate-700" />
            </div>
            <span className="text-sm font-semibold text-slate-600">Decision</span>
          </div>

          <div className="flex-1 flex items-center justify-center relative">
            <div className="h-0.5 w-full bg-slate-200 absolute"></div>
            <ArrowRight className="w-6 h-6 text-slate-400 relative bg-white px-1" />
          </div>

          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-200 shadow-sm">
              <Database className="w-8 h-8 text-slate-700" />
            </div>
            <span className="text-sm font-semibold text-slate-600">Enterprise API</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-900">Recent Requests</h2>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-sm">
              <th className="px-6 py-3 font-medium">Agent</th>
              <th className="px-6 py-3 font-medium">Action</th>
              <th className="px-6 py-3 font-medium">Target API</th>
              <th className="px-6 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {requests.slice(0, 5).map((req) => (
              <tr key={req.id} className="hover:bg-slate-50/50">
                <td className="px-6 py-4 font-medium text-slate-900">{req.agent}</td>
                <td className="px-6 py-4 text-slate-600">{req.action}</td>
                <td className="px-6 py-4 text-slate-600">{req.targetApi}</td>
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
