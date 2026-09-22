import React, { useState } from 'react';
import { addRequest } from '../store';
import { Shield, Lock, Activity, CheckCircle, AlertTriangle, XCircle, ChevronRight, Server } from 'lucide-react';
import type { RequestStatus } from '../types';

const Simulate = () => {
  const [agent, setAgent] = useState('HR Agent');
  const [action, setAction] = useState('View employee details');
  const [targetApi, setTargetApi] = useState('HR API');
  const [outsideHours, setOutsideHours] = useState(false);
  const [sensitiveData, setSensitiveData] = useState(false);
  
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationStep, setEvaluationStep] = useState(0);
  const [result, setResult] = useState<any>(null);

  const handleEvaluate = () => {
    setIsEvaluating(true);
    setEvaluationStep(1);
    setResult(null);

    // Mock Evaluation Logic
    let authn = true;
    let authz = true;
    let risk = 10;
    let status: RequestStatus = 'Allowed';
    let reason = 'Low risk operation requested during normal hours.';

    if (agent === 'Unknown Agent') {
      authn = false;
      authz = false;
      risk = 95;
      status = 'Blocked';
      reason = 'Risk score is high because this is a destructive operation requested by an unregistered agent.';
    } else if (action === 'Update employee salary') {
      risk = 65;
      status = 'Pending Approval';
      reason = 'Medium risk: sensitive data modification requires human approval.';
    } else if (action === 'Initiate payment') {
      risk = 75;
      status = 'Pending Approval';
      reason = 'High risk: financial transaction requires human approval.';
    } else if (action === 'Delete employee') {
      authz = false;
      risk = 90;
      status = 'Blocked';
      reason = 'High risk: Agent does not have authorization to delete records.';
    }

    if (outsideHours) risk += 10;
    if (sensitiveData && risk < 60) risk += 30;
    
    if (risk > 85) { status = 'Blocked'; reason = 'Automatically blocked due to excessive risk score.'; }
    else if (risk > 50 && status !== 'Blocked') { status = 'Pending Approval'; }

    // Simulate steps delay
    setTimeout(() => setEvaluationStep(2), 800);
    setTimeout(() => setEvaluationStep(3), 1600);
    setTimeout(() => setEvaluationStep(4), 2400);
    setTimeout(() => {
      setEvaluationStep(5);
      setIsEvaluating(false);
      
      const newReq = addRequest({
        agent,
        action,
        targetApi,
        authnResult: authn,
        authzResult: authz,
        riskScore: Math.min(risk, 100),
        status,
        reason
      });
      setResult(newReq);
    }, 3000);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-slate-900 mb-2">Simulate Agent Request</h1>
      <p className="text-slate-500 mb-8">Test the security gateway's response to various AI agent actions.</p>

      <div className="grid grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-fit">
          <h2 className="text-lg font-bold text-slate-900 mb-6">Request Parameters</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Select AI Agent</label>
              <select className="w-full border border-slate-300 rounded-lg p-2.5 outline-none focus:border-blue-500" value={agent} onChange={e => setAgent(e.target.value)}>
                <option>HR Agent</option>
                <option>FinanceBot</option>
                <option>SupportAgent</option>
                <option>Unknown Agent</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Action</label>
              <select className="w-full border border-slate-300 rounded-lg p-2.5 outline-none focus:border-blue-500" value={action} onChange={e => setAction(e.target.value)}>
                <option>View employee details</option>
                <option>Update employee salary</option>
                <option>Initiate payment</option>
                <option>Delete employee</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Target System</label>
              <select className="w-full border border-slate-300 rounded-lg p-2.5 outline-none focus:border-blue-500" value={targetApi} onChange={e => setTargetApi(e.target.value)}>
                <option>HR API</option>
                <option>Finance API</option>
                <option>CRM API</option>
              </select>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 text-blue-600 rounded border-slate-300" checked={outsideHours} onChange={e => setOutsideHours(e.target.checked)} />
                Outside business hours
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 text-blue-600 rounded border-slate-300" checked={sensitiveData} onChange={e => setSensitiveData(e.target.checked)} />
                Sensitive data involved
              </label>
            </div>

            <button 
              onClick={handleEvaluate} 
              disabled={isEvaluating}
              className="w-full mt-6 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-medium py-3 rounded-lg transition-colors"
            >
              {isEvaluating ? 'Evaluating...' : 'Evaluate Request'}
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {(isEvaluating || result) && (
            <div className="bg-slate-900 rounded-xl shadow-lg border border-slate-800 p-6 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Shield className="w-32 h-32" />
              </div>
              
              <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-400" /> Security Evaluation
              </h2>
              
              <div className="space-y-4 relative z-10">
                <div className={`flex items-center justify-between p-3 rounded-lg border ${evaluationStep >= 1 ? 'border-slate-700 bg-slate-800/50' : 'border-slate-800 opacity-30'}`}>
                  <div className="flex items-center gap-3">
                    <Lock className="w-5 h-5 text-slate-400" />
                    <span>1. Authentication Check</span>
                  </div>
                  {evaluationStep > 1 && (
                    <span className={`text-sm font-medium ${result ? (result.authnResult ? 'text-emerald-400' : 'text-rose-400') : 'text-emerald-400'}`}>
                      {result ? (result.authnResult ? 'PASS' : 'FAIL') : 'PASS'}
                    </span>
                  )}
                  {evaluationStep === 1 && <span className="text-blue-400 text-sm animate-pulse">Checking...</span>}
                </div>

                <div className={`flex items-center justify-between p-3 rounded-lg border ${evaluationStep >= 2 ? 'border-slate-700 bg-slate-800/50' : 'border-slate-800 opacity-30'}`}>
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-slate-400" />
                    <span>2. Authorization Check</span>
                  </div>
                  {evaluationStep > 2 && (
                    <span className={`text-sm font-medium ${result ? (result.authzResult ? 'text-emerald-400' : 'text-rose-400') : 'text-emerald-400'}`}>
                      {result ? (result.authzResult ? 'PASS' : 'FAIL') : 'PASS'}
                    </span>
                  )}
                  {evaluationStep === 2 && <span className="text-blue-400 text-sm animate-pulse">Checking...</span>}
                </div>

                <div className={`flex items-center justify-between p-3 rounded-lg border ${evaluationStep >= 3 ? 'border-slate-700 bg-slate-800/50' : 'border-slate-800 opacity-30'}`}>
                  <div className="flex items-center gap-3">
                    <Activity className="w-5 h-5 text-slate-400" />
                    <span>3. Risk Analysis Engine</span>
                  </div>
                  {evaluationStep > 3 && (
                    <span className={`text-sm font-medium text-amber-400`}>Score: {result?.riskScore || '--'}</span>
                  )}
                  {evaluationStep === 3 && <span className="text-blue-400 text-sm animate-pulse">Analyzing...</span>}
                </div>

                <div className={`flex items-center justify-between p-3 rounded-lg border ${evaluationStep >= 4 ? 'border-slate-700 bg-slate-800/50' : 'border-slate-800 opacity-30'}`}>
                  <div className="flex items-center gap-3">
                    <Server className="w-5 h-5 text-slate-400" />
                    <span>4. Final Decision</span>
                  </div>
                  {evaluationStep > 4 && result && (
                    <span className={`text-sm font-bold ${
                      result.status.includes('Allowed') ? 'text-emerald-400' :
                      result.status.includes('Pending') ? 'text-amber-400' : 'text-rose-400'
                    }`}>
                      {result.status.toUpperCase()}
                    </span>
                  )}
                  {evaluationStep === 4 && <span className="text-blue-400 text-sm animate-pulse">Computing...</span>}
                </div>
              </div>
            </div>
          )}

          {result && evaluationStep >= 5 && (
            <div className={`bg-white p-6 rounded-xl shadow-lg border-2 ${
              result.status.includes('Allowed') ? 'border-emerald-500' :
              result.status.includes('Pending') ? 'border-amber-500' : 'border-rose-500'
            }`}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-1">Evaluation Result</h3>
                  <p className="text-sm text-slate-500">{result.id}</p>
                </div>
                <div className={`px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-2 ${
                  result.status.includes('Allowed') ? 'bg-emerald-100 text-emerald-700' :
                  result.status.includes('Pending') ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
                }`}>
                  {result.status.includes('Allowed') && <CheckCircle className="w-4 h-4" />}
                  {result.status.includes('Pending') && <AlertTriangle className="w-4 h-4" />}
                  {result.status.includes('Blocked') && <XCircle className="w-4 h-4" />}
                  {result.status}
                </div>
              </div>

              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-slate-700">Risk Score</span>
                  <span className="font-bold">{result.riskScore} / 100</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5">
                  <div className={`h-2.5 rounded-full ${
                    result.riskScore < 30 ? 'bg-emerald-500' :
                    result.riskScore < 70 ? 'bg-amber-500' : 'bg-rose-500'
                  }`} style={{ width: `${result.riskScore}%` }}></div>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 text-sm text-slate-700">
                <span className="font-semibold block mb-1">Explanation:</span>
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
