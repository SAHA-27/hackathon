import React, { useEffect, useState } from 'react';
import { getRequests, getSystemState, setLockdown, addRequestAsync } from '../store';
import type { AgentRequest } from '../types';
import { Shield, CheckCircle, AlertTriangle, XCircle, ArrowRight, Server, Database, Bot, Lock, ShieldAlert, Target, ShieldCheck, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [requests, setRequests] = useState<AgentRequest[]>([]);
  const [systemState, setSystemState] = useState({ lockdown: false, postureScore: 87 });
  const [isTrafficLive, setIsTrafficLive] = useState(false);

  useEffect(() => {
    getRequests().then(setRequests);
    getSystemState().then(setSystemState);
  }, []);

  useEffect(() => {
    let interval: any;
    if (isTrafficLive && !systemState.lockdown) {
      interval = setInterval(async () => {
        const agents = ['HR Agent', 'Finance Agent', 'CRM Agent', 'IT Operations Bot', 'Sales & Marketing Bot', 'Unknown Agent'];
        const actions = ['View employee details', 'Update salary', 'Delete employee', 'Search employees', 'View financial records', 'Provision new server', 'Delete production database', 'View campaign metrics', 'Export lead contact list', 'Launch mass email campaign'];
        const targets = ['HR System', 'Finance System', 'CRM System', 'Cloud Infrastructure API', 'Marketing Automation Platform', 'Sales CRM System', 'Legacy DB (Honeypot Decoy)'];
        const networks = ['Corporate VPN (Secured)', 'AWS US-East (Trusted Cloud)', 'Public Wi-Fi (Unsecured)', 'Tor Anonymity Network', 'Known Malicious Subnet (High Risk)'];
        
        const randomAgent = agents[Math.floor(Math.random() * agents.length)];
        const randomAction = actions[Math.floor(Math.random() * actions.length)];
        const randomTarget = targets[Math.floor(Math.random() * targets.length)];
        const randomNetwork = networks[Math.floor(Math.random() * networks.length)];
        const isSensitive = Math.random() > 0.7;
        const isOutsideHours = Math.random() > 0.8;

        await addRequestAsync(randomAgent, randomAction, randomTarget, randomNetwork, isSensitive, isOutsideHours);
        getRequests().then(setRequests);
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [isTrafficLive, systemState.lockdown]);

  const total = requests.length;
  const allowed = requests.filter(r => r.status.includes('Allowed')).length;
  const pending = requests.filter(r => r.status === 'Pending Approval').length;
  const blocked = requests.filter(r => r.status === 'Blocked' || r.status === 'Rejected').length;

  const handleLockdown = async () => {
    if (systemState.lockdown) {
      await setLockdown(false);
      setSystemState({ ...systemState, lockdown: false });
    } else {
      if (confirm("EMERGENCY: Suspend all AI agent communication?")) {
        await setLockdown(true);
        setSystemState({ ...systemState, lockdown: true });
        setIsTrafficLive(false);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10">
      
      {/* Executive Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">Executive Security View</h1>
          <p className="text-slate-400 font-medium">Dynamic Agent Security Gateway</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => setIsTrafficLive(!isTrafficLive)}
            className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${
              isTrafficLive 
                ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-[0_0_20px_rgba(16,185,129,0.5)] animate-pulse' 
                : 'bg-slate-900 hover:bg-slate-800 text-emerald-500 border border-emerald-500/30'
            }`}
          >
            <Activity className="w-5 h-5" />
            {isTrafficLive ? 'AUTO-PILOT ON' : 'SIMULATE LIVE TRAFFIC'}
          </button>
          <button 
            onClick={handleLockdown}
            className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${
              systemState.lockdown 
                ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-[0_0_20px_rgba(244,63,94,0.5)] animate-pulse' 
                : 'bg-slate-900 hover:bg-slate-800 text-rose-500 border border-rose-500/30'
            }`}
          >
            <Lock className="w-5 h-5" />
            {systemState.lockdown ? 'GATEWAY LOCKDOWN ACTIVE' : 'EMERGENCY LOCKDOWN'}
          </button>
          <Link to="/simulate" className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] flex items-center gap-2">
            <Target className="w-5 h-5 text-indigo-200" />
            Simulate Attack / Request
          </Link>
        </div>
      </div>

      {/* Top Level Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="col-span-1 bg-slate-900/50 p-6 rounded-2xl border border-slate-800 shadow-lg backdrop-blur-sm flex flex-col items-center justify-center relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4 opacity-5"><ShieldCheck className="w-24 h-24" /></div>
           <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Security Posture</div>
           <div className="text-5xl font-black text-emerald-400 mb-2">{systemState.postureScore}%</div>
           <div className="text-xs text-emerald-500/70 font-medium">Excellent rating</div>
        </div>

        <div className="col-span-4 grid grid-cols-4 gap-6">
          <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 shadow-lg backdrop-blur-sm">
            <div className="text-xs font-bold text-slate-500 mb-2 tracking-wider uppercase">Total Requests</div>
            <div className="text-4xl font-black text-white">{total > 0 ? total : 126}</div>
          </div>
          <div className="bg-slate-900/50 p-6 rounded-2xl border border-emerald-500/20 shadow-lg backdrop-blur-sm relative overflow-hidden">
            <div className="text-xs font-bold text-emerald-500 mb-2 tracking-wider uppercase flex items-center gap-1.5"><CheckCircle className="w-4 h-4"/> Allowed</div>
            <div className="text-4xl font-black text-white">{allowed > 0 ? allowed : 93}</div>
          </div>
          <div className="bg-slate-900/50 p-6 rounded-2xl border border-amber-500/20 shadow-lg backdrop-blur-sm relative overflow-hidden">
            <div className="text-xs font-bold text-amber-500 mb-2 tracking-wider uppercase flex items-center gap-1.5"><AlertTriangle className="w-4 h-4"/> Pending</div>
            <div className="text-4xl font-black text-white">{pending > 0 ? pending : 12}</div>
          </div>
          <div className="bg-slate-900/50 p-6 rounded-2xl border border-rose-500/20 shadow-lg backdrop-blur-sm relative overflow-hidden">
            <div className="text-xs font-bold text-rose-500 mb-2 tracking-wider uppercase flex items-center gap-1.5"><ShieldAlert className="w-4 h-4"/> Blocked Threats</div>
            <div className="text-4xl font-black text-white">{blocked > 0 ? blocked : 21}</div>
          </div>
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
