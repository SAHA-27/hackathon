import React, { useState, useEffect } from 'react';
import { getLogs } from '../store';
import type { LogEntry } from '../types';
import { ShieldCheck, CheckCircle, AlertTriangle, XCircle, Filter } from 'lucide-react';

const ActivityLogs = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filter, setFilter] = useState<'All' | 'Allowed' | 'Pending' | 'Blocked'>('All');

  useEffect(() => {
    getLogs().then(setLogs);
  }, []);

  const filteredLogs = logs.filter(log => {
    if (filter === 'All') return true;
    if (filter === 'Allowed') return log.decision.includes('Allowed');
    if (filter === 'Pending') return log.decision === 'Pending Approval';
    if (filter === 'Blocked') return log.decision === 'Blocked' || log.decision === 'Rejected';
    return true;
  });

  const exportToCSV = () => {
    if (filteredLogs.length === 0) return;
    
    // Create CSV header
    const headers = ['Log ID', 'Time', 'Agent', 'Action', 'Target System', 'Risk Score', 'Decision', 'Reason'];
    
    // Create CSV rows
    const csvRows = filteredLogs.map(log => {
      return [
        log.logId,
        new Date(log.time).toISOString(),
        `"${log.agent}"`,
        `"${log.action}"`,
        `"${log.targetSystem}"`,
        log.riskScore,
        `"${log.decision}"`,
        `"${log.reason}"`
      ].join(',');
    });
    
    // Combine header and rows
    const csvString = [headers.join(','), ...csvRows].join('\n');
    
    // Create download link
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `security_audit_logs_${new Date().getTime()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-end mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-slate-900">Activity Logs</h1>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
              <ShieldCheck className="w-4 h-4" /> Verified Activity Logs
            </span>
          </div>
          <p className="text-slate-500">Immutable audit trail of all AI agent activities and gateway decisions.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
              <Filter className="w-4 h-4" /> Filter by Decision:
            </div>
            <div className="flex gap-2">
              {['All', 'Allowed', 'Pending', 'Blocked'].map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f as any)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    filter === f 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
          <button 
            onClick={exportToCSV}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-bold rounded-lg transition-colors"
          >
            Export to CSV
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-white text-slate-500 border-b border-slate-200">
                <th className="px-6 py-4 font-medium whitespace-nowrap">Log ID</th>
                <th className="px-6 py-4 font-medium whitespace-nowrap">Time</th>
                <th className="px-6 py-4 font-medium whitespace-nowrap">Agent</th>
                <th className="px-6 py-4 font-medium whitespace-nowrap">Action</th>
                <th className="px-6 py-4 font-medium whitespace-nowrap">Target</th>
                <th className="px-6 py-4 font-medium whitespace-nowrap">Risk</th>
                <th className="px-6 py-4 font-medium whitespace-nowrap">Decision</th>
                <th className="px-6 py-4 font-medium">Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.map((log) => (
                <tr key={log.logId} className="hover:bg-slate-50/50">
                  <td className="px-6 py-4 text-slate-500 font-mono text-xs">{log.logId}</td>
                  <td className="px-6 py-4 text-slate-600 whitespace-nowrap">{new Date(log.time).toLocaleTimeString()}</td>
                  <td className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap">{log.agent}</td>
                  <td className="px-6 py-4 text-slate-600 whitespace-nowrap">{log.action}</td>
                  <td className="px-6 py-4 text-slate-600 whitespace-nowrap">{log.targetSystem}</td>
                  <td className="px-6 py-4">
                    <span className={`font-medium ${log.riskScore < 30 ? 'text-emerald-600' : log.riskScore < 70 ? 'text-amber-600' : 'text-rose-600'}`}>
                      {log.riskScore}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                      log.decision.includes('Allowed') ? 'bg-emerald-100 text-emerald-700' :
                      log.decision.includes('Pending') ? 'bg-amber-100 text-amber-700' :
                      'bg-rose-100 text-rose-700'
                    }`}>
                      {log.decision}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500 truncate max-w-xs" title={log.reason}>
                    {log.reason}
                  </td>
                </tr>
              ))}
              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-slate-500">
                    No logs found matching the current filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ActivityLogs;
