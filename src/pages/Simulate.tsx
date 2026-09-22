import React, { useState } from 'react';
import { evaluateRequest, addRequest } from '../store';
import { Shield, Lock, Activity, CheckCircle, AlertTriangle, XCircle, Server, Key } from 'lucide-react';
import type { RequestStatus } from '../types';

const Simulate = () => {
  const [agent, setAgent] = useState('HR Agent');
  const [action, setAction] = useState('View employee details');
  const [targetApi, setTargetApi] = useState('HR System');
  const [outsideHours, setOutsideHours] = useState(false);
  const [sensitiveData, setSensitiveData] = useState(false);
  
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationStep, setEvaluationStep] = useState(0);
  const [result, setResult] = useState<any>(null);

  const handleEvaluate = () => {
    setIsEvaluating(true);
    setEvaluationStep(1);
    setResult(null);

    const evalResult = evaluateRequest(agent, action, targetApi, sensitiveData, outsideHours);

    // Simulate pipeline visually
    setTimeout(() => setEvaluationStep(2), 800);
    setTimeout(() => setEvaluationStep(3), 1600);
    setTimeout(() => setEvaluationStep(4), 2400);
    setTimeout(() => {
      setEvaluationStep(5);
      setIsEvaluating(false);
      const { newReq, factors } = addRequest({ ...evalResult, agent, action, targetApi });
      setResult({ ...newReq, factors });
    }, 3000);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-3xl font-extrabold text-slate-100 mb-2">Simulate Agent Request</h1>
      <p className="text-slate-400 mb-8">Test the dynamic security gateway pipeline.</p>

      <div className="grid grid-cols-2 gap-8">
        <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 shadow-xl backdrop-blur-sm h-fit">
          <h2 className="text-lg font-bold text-slate-200 mb-6 flex items-center gap-2">
            <Server className="w-5 h-5 text-indigo-400" /> Request Parameters
          </h2>
          
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1.5">Select AI Agent</label>
              <select className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" value={agent} onChange={e => setAgent(e.target.value)}>
                <option>HR Agent</option>
                <option>Finance Agent</option>
                <option>CRM Agent</option>
                <option>Unknown Agent</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1.5">Action</label>
              <select className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" value={action} onChange={e => setAction(e.target.value)}>
                <option>View employee details</option>
                <option>Search employees</option>
                <option>Update employee</option>
                <option>Update salary</option>
                <option>Delete employee</option>
                <option>View customer details</option>
                <option>Update customer records</option>
                <option>View financial records</option>
                <option>Delete financial record</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1.5">Target System</label>
              <select className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" value={targetApi} onChange={e => setTargetApi(e.target.value)}>
                <option>HR System</option>
                <option>Finance System</option>
                <option>CRM System</option>
                <option>Employee Database</option>
                <option>Customer Database</option>
              </select>
            </div>

            <div className="pt-2 flex flex-col gap-3 p-4 bg-slate-950 rounded-xl border border-slate-800">
              <label className="flex items-center gap-3 text-sm font-medium text-slate-300 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-indigo-500 focus:ring-indigo-500" checked={sensitiveData} onChange={e => setSensitiveData(e.target.checked)} />
                Sensitive Data Involved
              </label>
              <label className="flex items-center gap-3 text-sm font-medium text-slate-300 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-indigo-500 focus:ring-indigo-500" checked={outsideHours} onChange={e => setOutsideHours(e.target.checked)} />
                Outside Business Hours
              </label>
            </div>

            <button 
              onClick={handleEvaluate} 
              disabled={isEvaluating}
              className="w-full mt-6 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)]"
            >
              {isEvaluating ? 'EVALUATING REQUEST...' : 'EXECUTE REQUEST'}
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {(isEvaluating || result) && (
            <div className="bg-slate-900/80 rounded-2xl shadow-2xl border border-slate-700 p-6 text-white relative overflow-hidden backdrop-blur-md">
              <div className="absolute top-0 right-0 p-4 opacity-5">
                <Shield className="w-48 h-48" />
              </div>
              
              <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                <Activity className="w-5 h-5 text-indigo-400" /> Security Evaluation Pipeline
              </h2>
              
              <div className="space-y-3 relative z-10 font-mono text-sm">
                <div className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${evaluationStep >= 1 ? 'border-slate-700 bg-slate-800/80 shadow-inner' : 'border-slate-800/50 opacity-40'}`}>
                  <div className="flex items-center gap-3">
                    <Lock className="w-4 h-4 text-slate-400" />
                    <span>STEP 1: AUTHENTICATION</span>
                  </div>
                  {evaluationStep > 1 && (
                    <span className={`font-bold ${result ? (result.authnResult ? 'text-emerald-400' : 'text-rose-500') : 'text-emerald-400'}`}>
                      {result ? (result.authnResult ? '✓ VERIFIED' : '✗ FAILED') : '✓ VERIFIED'}
                    </span>
                  )}
                  {evaluationStep === 1 && <span className="text-indigo-400 animate-pulse">Checking...</span>}
                </div>

                <div className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${evaluationStep >= 2 ? 'border-slate-700 bg-slate-800/80 shadow-inner' : 'border-slate-800/50 opacity-40'}`}>
                  <div className="flex items-center gap-3">
                    <Key className="w-4 h-4 text-slate-400" />
                    <span>STEP 2: AUTHORIZATION</span>
                  </div>
                  {evaluationStep > 2 && (
                    <span className={`font-bold ${result ? (result.authzResult ? '✓ PERMITTED' : '✗ DENIED') : '✓ PERMITTED'}`}>
                      {result ? (result.authzResult ? '✓ PERMITTED' : '✗ DENIED') : '✓ PERMITTED'}
                    </span>
                  )}
                  {evaluationStep === 2 && <span className="text-indigo-400 animate-pulse">Checking...</span>}
                </div>

                <div className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${evaluationStep >= 3 ? 'border-slate-700 bg-slate-800/80 shadow-inner' : 'border-slate-800/50 opacity-40'}`}>
                  <div className="flex items-center gap-3">
                    <Activity className="w-4 h-4 text-slate-400" />
                    <span>STEP 3: RISK ANALYSIS</span>
                  </div>
                  {evaluationStep > 3 && (
                    <span className={`font-bold text-amber-400`}>SCORE: {result?.riskScore || '--'}</span>
                  )}
                  {evaluationStep === 3 && <span className="text-indigo-400 animate-pulse">Calculating...</span>}
                </div>

                <div className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${evaluationStep >= 4 ? 'border-slate-700 bg-slate-800/80 shadow-inner' : 'border-slate-800/50 opacity-40'}`}>
                  <div className="flex items-center gap-3">
                    <Shield className="w-4 h-4 text-slate-400" />
                    <span>STEP 4: DECISION</span>
                  </div>
                  {evaluationStep > 4 && result && (
                    <span className={`font-black tracking-wider ${
                      result.status === 'Allowed' ? 'text-emerald-400' :
                      result.status === 'Pending Approval' ? 'text-amber-400' : 'text-rose-500'
                    }`}>
                      {result.status.toUpperCase()}
                    </span>
                  )}
                  {evaluationStep === 4 && <span className="text-indigo-400 animate-pulse">Computing...</span>}
                </div>
              </div>
            </div>
          )}

          {result && evaluationStep >= 5 && (
            <div className={`bg-slate-900/80 p-6 rounded-2xl shadow-2xl border-2 backdrop-blur-md ${
              result.status === 'Allowed' ? 'border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.15)]' :
              result.status === 'Pending Approval' ? 'border-amber-500/50 shadow-[0_0_30px_rgba(245,158,11,0.15)]' : 
              'border-rose-500/50 shadow-[0_0_30px_rgba(244,63,94,0.15)]'
            }`}>
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">Final Decision</h3>
                  <p className="text-sm font-mono text-slate-400">{result.id}</p>
                </div>
                <div className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 ${
                  result.status === 'Allowed' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                  result.status === 'Pending Approval' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 
                  'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                }`}>
                  {result.status === 'Allowed' && <CheckCircle className="w-4 h-4" />}
                  {result.status === 'Pending Approval' && <AlertTriangle className="w-4 h-4" />}
                  {(result.status === 'Blocked' || result.status === 'Rejected') && <XCircle className="w-4 h-4" />}
                  {result.status.toUpperCase()}
                </div>
              </div>

              <div className="mb-6 bg-slate-950/50 p-4 rounded-xl border border-slate-800">
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium text-slate-400">Risk Score</span>
                  <span className="font-bold text-white">{result.riskScore} / 100</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-3 mb-4 overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-1000 ${
                    result.riskScore < 50 ? 'bg-emerald-500' :
                    result.riskScore < 85 ? 'bg-amber-500' : 'bg-rose-500'
                  }`} style={{ width: `${Math.min(result.riskScore, 100)}%` }}></div>
                </div>

                <div className="space-y-1.5 mt-4 pt-4 border-t border-slate-800">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Risk Factors Identified:</div>
                  {result.factors.map((f: string, i: number) => (
                    <div key={i} className="text-sm text-slate-300 font-mono flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
                      {f}
                    </div>
                  ))}
                  {result.factors.length === 0 && (
                    <div className="text-sm text-slate-400 italic">No significant risk factors detected.</div>
                  )}
                </div>
              </div>

              <div className="bg-indigo-500/10 p-4 rounded-xl border border-indigo-500/20 text-sm text-indigo-200">
                <span className="font-bold block mb-1">Explanation:</span>
                {result.reason}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Simulate;
