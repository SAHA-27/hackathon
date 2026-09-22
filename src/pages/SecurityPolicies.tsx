import React from 'react';
import { Shield, Lock, Activity, Users, Clock, Key } from 'lucide-react';

const policies = [
  {
    id: 'POL-001',
    title: 'Least Privilege',
    description: 'Agents can access only resources required for their assigned tasks.',
    icon: Lock,
    status: 'Active'
  },
  {
    id: 'POL-002',
    title: 'Sensitive Data Protection',
    description: 'Operations involving sensitive data require additional security checks.',
    icon: Shield,
    status: 'Active'
  },
  {
    id: 'POL-003',
    title: 'High Risk Operations',
    description: 'High-risk operations must be blocked or require human approval.',
    icon: Activity,
    status: 'Active'
  },
  {
    id: 'POL-004',
    title: 'Unknown Agent Policy',
    description: 'Unregistered or quarantined agents are automatically blocked.',
    icon: Users,
    status: 'Active'
  },
  {
    id: 'POL-005',
    title: 'Audit Logging',
    description: 'Every agent action, allowed or blocked, must be permanently recorded.',
    icon: Key,
    status: 'Active'
  },
  {
    id: 'POL-006',
    title: 'Business Hours Policy',
    description: 'Operations outside business hours receive additional risk scoring.',
    icon: Clock,
    status: 'Active'
  }
];

const SecurityPolicies = () => {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight mb-2">Security Policies</h1>
          <p className="text-slate-400 font-medium">Core rules engine governing the Dynamic Agent Security Gateway.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {policies.map((policy) => {
          const Icon = policy.icon;
          return (
            <div key={policy.id} className="bg-slate-900/50 rounded-2xl p-6 border border-slate-800 backdrop-blur-sm hover:border-indigo-500/50 transition-colors group">
              <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Icon className="w-6 h-6 text-indigo-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{policy.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">{policy.description}</p>
              <div className="flex items-center justify-between mt-auto">
                <span className="text-xs font-mono text-slate-500">{policy.id}</span>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
                  {policy.status.toUpperCase()}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SecurityPolicies;
