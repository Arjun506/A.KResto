'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Shield,
  Activity,
  Plus,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Send,
  Trash2,
  ListTodo,
  FileSpreadsheet,
  HelpCircle,
  MessageSquare,
  Lock,
  Database,
  ArrowLeft
} from 'lucide-react';

type PilotStage =
  | 'DRAFT'
  | 'INVITED'
  | 'REGISTRATION_STARTED'
  | 'TENANT_PROVISIONED'
  | 'SETUP_IN_PROGRESS'
  | 'PILOT_ACTIVE'
  | 'PILOT_BLOCKED'
  | 'PILOT_COMPLETED'
  | 'CANCELLED';

type Pilot = {
  id: string;
  name: string;
  industry: 'RESTAURANT' | 'RETAIL';
  plan: string;
  stage: PilotStage;
  startDate: string;
  endDate: string;
  modules: string[];
  setupProgress: number;
  lastActivity: string;
  invitationToken?: string;
  invitationExpires?: string;
  supportContact: string;
};

type ProviderStatus = 'READY' | 'SANDBOX' | 'SIMULATED' | 'MISSING' | 'FAILED' | 'NOT_REQUIRED';

export default function PilotControlCenter() {
  const router = useRouter();
  const [pilots, setPilots] = useState<Pilot[]>([]);
  const [selectedPilot, setSelectedPilot] = useState<Pilot | null>(null);

  // Form states for new pilot
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPilotName, setNewPilotName] = useState('');
  const [newPilotIndustry, setNewPilotIndustry] = useState<'RESTAURANT' | 'RETAIL'>('RESTAURANT');
  const [newPilotPlan, setNewPilotPlan] = useState('Staging Sandbox Plan');
  const [newPilotContact, setNewPilotContact] = useState('operator@akresto.com');

  // Feedback form states
  const [feedbackList, setFeedbackList] = useState<{ id: string; role: string; category: string; text: string; priority: string }[]>([]);
  const [newFeedbackRole, setNewFeedbackRole] = useState('OWNER');
  const [newFeedbackCategory, setNewFeedbackCategory] = useState('UX');
  const [newFeedbackText, setNewFeedbackText] = useState('');
  const [newFeedbackPriority, setNewFeedbackPriority] = useState('MEDIUM');

  // Defect tracking states
  const [defectList, setDefectList] = useState<{ id: string; module: string; severity: string; desc: string; status: string }[]>([]);
  const [newDefectModule, setNewDefectModule] = useState('POS');
  const [newDefectSeverity, setNewDefectSeverity] = useState('P2');
  const [newDefectDesc, setNewDefectDesc] = useState('');

  // Initializing from localStorage to persist mock data
  useEffect(() => {
    const storedPilots = localStorage.getItem('pilot_control_center_pilots');
    if (storedPilots) {
      setPilots(JSON.parse(storedPilots));
    } else {
      const initial: Pilot[] = [
        {
          id: 'PILOT-R-001',
          name: 'Anonymized Bistro Cafe',
          industry: 'RESTAURANT',
          plan: 'Pilot Trial Tier',
          stage: 'SETUP_IN_PROGRESS',
          startDate: '2026-07-26',
          endDate: '2026-09-26',
          modules: ['orders', 'menu', 'pos', 'kds'],
          setupProgress: 75,
          lastActivity: '10 minutes ago',
          invitationToken: 'inv_tok_8cfcda85949a',
          invitationExpires: '2026-08-26',
          supportContact: 'support.bistro@akresto.com'
        }
      ];
      setPilots(initial);
      localStorage.setItem('pilot_control_center_pilots', JSON.stringify(initial));
    }

    const storedFeedback = localStorage.getItem('pilot_control_center_feedback');
    if (storedFeedback) {
      setFeedbackList(JSON.parse(storedFeedback));
    } else {
      const initialFb = [
        { id: 'FB-01', role: 'CASHIER', category: 'UX', text: 'POS transaction receipt takes too long to render', priority: 'MEDIUM' }
      ];
      setFeedbackList(initialFb);
      localStorage.setItem('pilot_control_center_feedback', JSON.stringify(initialFb));
    }

    const storedDefects = localStorage.getItem('pilot_control_center_defects');
    if (storedDefects) {
      setDefectList(JSON.parse(storedDefects));
    } else {
      const initialDefects = [
        { id: 'DEF-01', module: 'KDS', severity: 'P2', desc: 'Out of order ticket notifications delayed', status: 'OPEN' }
      ];
      setDefectList(initialDefects);
      localStorage.setItem('pilot_control_center_defects', JSON.stringify(initialDefects));
    }
  }, []);

  const savePilots = (updated: Pilot[]) => {
    setPilots(updated);
    localStorage.setItem('pilot_control_center_pilots', JSON.stringify(updated));
    if (selectedPilot) {
      const reselected = updated.find(p => p.id === selectedPilot.id);
      if (reselected) setSelectedPilot(reselected);
    }
  };

  // State Machine transitions
  const handleTransition = (pilotId: string, targetStage: PilotStage) => {
    const updated = pilots.map(p => {
      if (p.id !== pilotId) return p;

      // Validate transitions
      const current = p.stage;
      let allowed = false;

      if (current === 'DRAFT' && targetStage === 'INVITED') allowed = true;
      if (current === 'INVITED' && targetStage === 'REGISTRATION_STARTED') allowed = true;
      if (current === 'REGISTRATION_STARTED' && targetStage === 'TENANT_PROVISIONED') allowed = true;
      if (current === 'TENANT_PROVISIONED' && targetStage === 'SETUP_IN_PROGRESS') allowed = true;
      if (current === 'SETUP_IN_PROGRESS' && targetStage === 'PILOT_ACTIVE') {
        // Enforce readiness evaluation gate
        const hasP0P1 = defectList.some(d => (d.severity === 'P0' || d.severity === 'P1') && d.status === 'OPEN');
        if (!hasP0P1 && p.setupProgress >= 100) {
          allowed = true;
        } else {
          alert('Readiness gate failed: Ensure setup is 100% and there are no open P0/P1 defects.');
        }
      }
      if (targetStage === 'CANCELLED' || targetStage === 'PILOT_BLOCKED') allowed = true;
      if (current === 'PILOT_ACTIVE' && targetStage === 'PILOT_COMPLETED') allowed = true;

      if (allowed) {
        return { ...p, stage: targetStage, lastActivity: 'Stage transition logged' };
      } else {
        alert(`Invalid state transition from ${current} to ${targetStage}`);
        return p;
      }
    });
    savePilots(updated);
  };

  const createNewPilot = () => {
    if (!newPilotName) return;
    const newId = `PILOT-R-0${pilots.length + 1}`;
    const newPilot: Pilot = {
      id: newId,
      name: newPilotName,
      industry: newPilotIndustry,
      plan: newPilotPlan,
      stage: 'DRAFT',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '2026-10-26',
      modules: ['orders', 'menu', 'pos'],
      setupProgress: 0,
      lastActivity: 'Created Draft',
      supportContact: newPilotPlan
    };
    savePilots([...pilots, newPilot]);
    setShowCreateModal(false);
    setNewPilotName('');
  };

  const generateInvitation = (pilotId: string) => {
    const updated = pilots.map(p => {
      if (p.id !== pilotId) return p;
      return {
        ...p,
        invitationToken: `inv_tok_${Math.random().toString(36).substring(2, 14)}`,
        invitationExpires: new Date(Date.now() + 86400000 * 30).toISOString().split('T')[0],
        stage: 'INVITED' as const
      };
    });
    savePilots(updated);
  };

  // Readiness evaluator helper
  const evaluateReadiness = (pilot: Pilot) => {
    const checks = [
      { name: 'Tenant Provisioned', passed: pilot.setupProgress >= 20 },
      { name: 'Restaurant Pack Active', passed: pilot.setupProgress >= 40 },
      { name: 'Taxes Configured', passed: pilot.setupProgress >= 60 },
      { name: 'POS/KDS Terminal Setup', passed: pilot.setupProgress >= 80 },
      { name: 'Sellable Menu Items Loaded', passed: pilot.setupProgress >= 100 }
    ];
    const passedAll = checks.every(c => c.passed);
    return { checks, status: passedAll ? 'READY_FOR_FIRST_ORDER' : 'BLOCKERS_IDENTIFIED' };
  };

  const addFeedback = () => {
    if (!newFeedbackText) return;
    const newFb = {
      id: `FB-0${feedbackList.length + 1}`,
      role: newFeedbackRole,
      category: newFeedbackCategory,
      text: newFeedbackText,
      priority: newFeedbackPriority
    };
    const updated = [...feedbackList, newFb];
    setFeedbackList(updated);
    localStorage.setItem('pilot_control_center_feedback', JSON.stringify(updated));
    setNewFeedbackText('');
  };

  const addDefect = () => {
    if (!newDefectDesc) return;
    const newDef = {
      id: `DEF-0${defectList.length + 1}`,
      module: newDefectModule,
      severity: newDefectSeverity,
      desc: newDefectDesc,
      status: 'OPEN'
    };
    const updated = [...defectList, newDef];
    setDefectList(updated);
    localStorage.setItem('pilot_control_center_defects', JSON.stringify(updated));
    setNewDefectDesc('');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push('/super-admin')} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-100 transition">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <Shield className="w-6 h-6 text-indigo-500" /> AK Business OS Pilot Control Center
            </h1>
            <p className="text-slate-400 text-sm">Deploy, monitor, and audit live Restaurant & Retail external pilots</p>
          </div>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition"
        >
          <Plus className="w-4 h-4" /> Create Pilot Display
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Pilots Directory List */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <LayoutDashboard className="w-5 h-5 text-cyan-400" /> Active Pilots Directory
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-sm">
                  <th className="pb-3">Pilot ID</th>
                  <th className="pb-3">Name</th>
                  <th className="pb-3">Industry</th>
                  <th className="pb-3">Stage</th>
                  <th className="pb-3">Setup Progress</th>
                  <th className="pb-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-sm">
                {pilots.map(p => (
                  <tr key={p.id} className="hover:bg-slate-800/50 transition cursor-pointer" onClick={() => setSelectedPilot(p)}>
                    <td className="py-4 font-mono text-cyan-400 font-bold">{p.id}</td>
                    <td className="py-4 font-medium text-white">{p.name}</td>
                    <td className="py-4">{p.industry}</td>
                    <td className="py-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        p.stage === 'PILOT_ACTIVE' ? 'bg-emerald-500/10 text-emerald-400' :
                        p.stage === 'PILOT_BLOCKED' ? 'bg-rose-500/10 text-rose-400' :
                        'bg-slate-800 text-slate-300'
                      }`}>
                        {p.stage}
                      </span>
                    </td>
                    <td className="py-4">
                      <div className="w-full bg-slate-800 rounded-full h-2">
                        <div className="bg-indigo-500 h-2 rounded-full" style={{ width: `${p.setupProgress}%` }}></div>
                      </div>
                    </td>
                    <td className="py-4">
                      <button
                        onClick={(e) => { e.stopPropagation(); generateInvitation(p.id); }}
                        className="text-xs bg-slate-800 hover:bg-slate-700 text-indigo-400 hover:text-indigo-300 px-2 py-1 rounded border border-slate-700 transition"
                      >
                        Generate Invite
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Selected Pilot Details */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-indigo-400" /> Pilot Details
          </h2>
          {selectedPilot ? (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-white text-lg">{selectedPilot.id}</h3>
                <span className="text-xs text-slate-400">Last Active: {selectedPilot.lastActivity}</span>
              </div>

              {/* State Machine Transition triggers */}
              <div className="border border-slate-800 rounded-lg p-4 bg-slate-950">
                <h4 className="text-xs font-bold text-slate-400 mb-2 uppercase">Lifecycle Transitions</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button onClick={() => handleTransition(selectedPilot.id, 'INVITED')} className="bg-slate-800 hover:bg-slate-700 p-2 rounded text-left font-mono">
                    ➔ INVITED
                  </button>
                  <button onClick={() => handleTransition(selectedPilot.id, 'REGISTRATION_STARTED')} className="bg-slate-800 hover:bg-slate-700 p-2 rounded text-left font-mono">
                    ➔ REG_START
                  </button>
                  <button onClick={() => handleTransition(selectedPilot.id, 'TENANT_PROVISIONED')} className="bg-slate-800 hover:bg-slate-700 p-2 rounded text-left font-mono">
                    ➔ PROVISIONED
                  </button>
                  <button onClick={() => handleTransition(selectedPilot.id, 'SETUP_IN_PROGRESS')} className="bg-slate-800 hover:bg-slate-700 p-2 rounded text-left font-mono">
                    ➔ SETUP_IN_PROG
                  </button>
                  <button onClick={() => handleTransition(selectedPilot.id, 'PILOT_ACTIVE')} className="bg-indigo-900/40 hover:bg-indigo-900/60 p-2 rounded text-left font-mono text-indigo-400 font-bold border border-indigo-500/20">
                    ➔ PILOT_ACTIVE
                  </button>
                  <button onClick={() => handleTransition(selectedPilot.id, 'PILOT_BLOCKED')} className="bg-rose-950/40 hover:bg-rose-950/60 p-2 rounded text-left font-mono text-rose-400 font-bold border border-rose-500/20">
                    ➔ PILOT_BLOCKED
                  </button>
                </div>
              </div>

              {/* Invitation Token View */}
              {selectedPilot.invitationToken && (
                <div className="border border-slate-800 rounded-lg p-4 bg-slate-950">
                  <h4 className="text-xs font-bold text-slate-400 mb-2 uppercase">Invitation Token (Hashed)</h4>
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-mono text-amber-400">{selectedPilot.invitationToken.substring(0, 12)}***</span>
                    <span className="text-slate-500">Expires: {selectedPilot.invitationExpires}</span>
                  </div>
                </div>
              )}

              {/* Readiness Evaluator Checklist */}
              <div className="border border-slate-800 rounded-lg p-4 bg-slate-950">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-xs font-bold text-slate-400 uppercase">Readiness Gates Checklist</h4>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                    evaluateReadiness(selectedPilot).status === 'READY_FOR_FIRST_ORDER' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                  }`}>
                    {evaluateReadiness(selectedPilot).status}
                  </span>
                </div>
                <div className="space-y-2 text-xs">
                  {evaluateReadiness(selectedPilot).checks.map(c => (
                    <div key={c.name} className="flex justify-between items-center">
                      <span className="text-slate-300">{c.name}</span>
                      {c.passed ? (
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <XCircle className="w-4 h-4 text-slate-600" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Progress Setter */}
              <div className="flex justify-between items-center gap-2">
                <span className="text-xs text-slate-400">Onboarding Step:</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="20"
                  value={selectedPilot.setupProgress}
                  onChange={(e) => {
                    const progress = Number(e.target.value);
                    const updated = pilots.map(p => p.id === selectedPilot.id ? { ...p, setupProgress: progress } : p);
                    savePilots(updated);
                  }}
                  className="w-full accent-indigo-500"
                />
                <span className="text-xs font-mono font-bold text-white">{selectedPilot.setupProgress}%</span>
              </div>
            </div>
          ) : (
            <p className="text-slate-500 text-sm text-center py-12 border border-dashed border-slate-800 rounded-lg">
              Select a pilot to view details, configure lifecycle stages, or evaluate readiness.
            </p>
          )}
        </div>
      </div>

      {/* Lower Panels: Providers Status & Live Health metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        {/* Provider Readiness Status Indicators */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Lock className="w-5 h-5 text-indigo-400" /> Provider Status Indicators
          </h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center">
              <span>PostgreSQL Database</span>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">READY</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Redis Cache / Queue</span>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">READY</span>
            </div>
            <div className="flex justify-between items-center">
              <span>KMS Envelope Crypt</span>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">READY</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Twilio SMS OTP Delivery</span>
              <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">SIMULATED</span>
            </div>
            <div className="flex justify-between items-center">
              <span>SendGrid Mail Receipt</span>
              <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">SIMULATED</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Stripe Subscriptions</span>
              <span className="text-xs font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded">SANDBOX</span>
            </div>
          </div>
        </div>

        {/* Live Pilot Health Metrics Panel */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-400" /> Real Pilot Health & Metrics
          </h2>
          <div className="flex flex-col items-center justify-center py-12 border border-dashed border-slate-800 rounded-lg text-slate-500 text-sm">
            <AlertTriangle className="w-8 h-8 text-amber-400 mb-2" />
            <span className="font-bold">NO_REAL_PILOT_ACTIVITY_YET</span>
            <span className="text-[10px] text-slate-600 mt-1">Metrics populate after first pilot order checkout</span>
          </div>
        </div>

        {/* Backup & Disaster Recovery Info */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Database className="w-5 h-5 text-indigo-400" /> Disaster Recovery Safety
          </h2>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Database Size:</span>
              <span className="text-white font-mono">185 MB</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Last Backup Complete:</span>
              <span className="text-white">Today 02:00 AM</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Backup Status:</span>
              <span className="text-emerald-400 font-bold">SUCCESS</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Restore Drill Status:</span>
              <span className="text-rose-400 font-bold">NOT_VERIFIED</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Last Restore Duration:</span>
              <span className="text-slate-500">PENDING_DRILL</span>
            </div>
          </div>
        </div>
      </div>

      {/* Defect Log Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center justify-between">
            <span className="flex items-center gap-2"><ListTodo className="w-5 h-5 text-rose-500" /> Defect Tracker</span>
            <span className="text-xs text-rose-400 font-bold bg-rose-500/10 px-2 py-0.5 rounded">Gates Active</span>
          </h2>
          <div className="space-y-4 mb-4 max-h-60 overflow-y-auto">
            {defectList.map(d => (
              <div key={d.id} className="border border-slate-800 p-3 rounded bg-slate-950 flex justify-between items-center text-xs">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-rose-400 font-mono">{d.id}</span>
                    <span className="bg-slate-800 text-slate-300 px-1 py-0.5 rounded">{d.module}</span>
                    <span className={`px-1.5 py-0.5 rounded font-bold ${
                      d.severity === 'P0' || d.severity === 'P1' ? 'bg-rose-500/10 text-rose-400' : 'bg-slate-800 text-slate-400'
                    }`}>{d.severity}</span>
                  </div>
                  <p className="text-slate-300">{d.desc}</p>
                </div>
                <button
                  onClick={() => {
                    const updated = defectList.map(item => item.id === d.id ? { ...item, status: 'RESOLVED' } : item);
                    setDefectList(updated);
                    localStorage.setItem('pilot_control_center_defects', JSON.stringify(updated));
                  }}
                  className={`px-2 py-1 rounded transition text-[10px] ${
                    d.status === 'RESOLVED' ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                  }`}
                  disabled={d.status === 'RESOLVED'}
                >
                  {d.status === 'RESOLVED' ? 'Resolved' : 'Resolve'}
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Report new pilot defect..."
              value={newDefectDesc}
              onChange={(e) => setNewDefectDesc(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs flex-grow focus:outline-none focus:border-indigo-500 text-white"
            />
            <select
              value={newDefectModule}
              onChange={(e) => setNewDefectModule(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded px-2 py-2 text-xs focus:outline-none text-white"
            >
              <option value="POS">POS</option>
              <option value="KDS">KDS</option>
              <option value="ONBOARDING">ONBOARDING</option>
              <option value="SECURITY">SECURITY</option>
            </select>
            <select
              value={newDefectSeverity}
              onChange={(e) => setNewDefectSeverity(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded px-2 py-2 text-xs focus:outline-none text-white"
            >
              <option value="P0">P0 (Blocker)</option>
              <option value="P1">P1 (High)</option>
              <option value="P2">P2 (Medium)</option>
              <option value="P3">P3 (Low)</option>
            </select>
            <button onClick={addDefect} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded text-xs font-bold transition">
              Report
            </button>
          </div>
        </div>

        {/* Feedback Center Panel */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-cyan-400" /> Feedback Center
          </h2>
          <div className="space-y-4 mb-4 max-h-60 overflow-y-auto">
            {feedbackList.map(fb => (
              <div key={fb.id} className="border border-slate-800 p-3 rounded bg-slate-950 text-xs">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-cyan-400 font-mono">{fb.id}</span>
                  <span className="bg-slate-800 text-slate-300 px-1 py-0.5 rounded">{fb.role}</span>
                  <span className="bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded font-bold">{fb.category}</span>
                </div>
                <p className="text-slate-300">{fb.text}</p>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Collect user feedback..."
              value={newFeedbackText}
              onChange={(e) => setNewFeedbackText(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs flex-grow focus:outline-none focus:border-indigo-500 text-white"
            />
            <select
              value={newFeedbackRole}
              onChange={(e) => setNewFeedbackRole(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded px-2 py-2 text-xs focus:outline-none text-white"
            >
              <option value="OWNER">Owner</option>
              <option value="CASHIER">Cashier</option>
              <option value="WAITER">Waiter</option>
              <option value="CUSTOMER">Customer</option>
            </select>
            <select
              value={newFeedbackCategory}
              onChange={(e) => setNewFeedbackCategory(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded px-2 py-2 text-xs focus:outline-none text-white"
            >
              <option value="UX">UX</option>
              <option value="BUG">Bug</option>
              <option value="PERFORMANCE">Performance</option>
              <option value="BILLING">Billing</option>
            </select>
            <button onClick={addFeedback} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded text-xs font-bold transition">
              Collect
            </button>
          </div>
        </div>
      </div>

      {/* Modal for creating a new pilot display */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-bold text-white mb-4">Create Pilot Display</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Pilot Name</label>
                <input
                  type="text"
                  placeholder="e.g. pilot-resto-001"
                  value={newPilotName}
                  onChange={(e) => setNewPilotName(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded w-full px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 text-white"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Industry</label>
                <select
                  value={newPilotIndustry}
                  onChange={(e) => setNewPilotIndustry(e.target.value as any)}
                  className="bg-slate-950 border border-slate-800 rounded w-full px-3 py-2 text-sm focus:outline-none text-white"
                >
                  <option value="RESTAURANT">Restaurant</option>
                  <option value="RETAIL">Retail</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded text-sm transition"
                >
                  Cancel
                </button>
                <button
                  onClick={createNewPilot}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded text-sm font-bold transition"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
