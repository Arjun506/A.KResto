'use client';

import { useState, useEffect } from 'react';
import {
  Users,
  Plus,
  Copy,
  Check,
  Calendar,
  Clock,
  Briefcase,
  X,
  Phone,
  Sparkles,
  Award,
  UserCheck,
  Building2,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { WorkforceService, Employee, WorkforceSummary } from '../../../services/workforce.service';
import { BranchService, Branch } from '../../../services/branch.service';

export default function StaffPage() {
  const [activeTab, setActiveTab] = useState<'directory' | 'schedule' | 'attendance' | 'leaves'>('directory');
  
  // Data States
  const [summary, setSummary] = useState<WorkforceSummary | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [attendanceLogs, setAttendanceLogs] = useState<any[]>([]);
  const [shifts, setShifts] = useState<any[]>([]);
  const [leaves, setLeaves] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form States
  const [empCode, setEmpCode] = useState('');
  const [empName, setEmpName] = useState('');
  const [empEmail, setEmpEmail] = useState('');
  const [empPhone, setEmpPhone] = useState('');
  const [empDept, setEmpDept] = useState('OPERATIONS');
  const [empDesig, setEmpDesig] = useState('Staff Associate');
  const [empRole, setEmpRole] = useState('STAFF');
  const [selectedBranchId, setSelectedBranchId] = useState('');

  // Clock state
  const [selectedEmpClock, setSelectedEmpClock] = useState('');

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [sum, empList, bList, attList, shiftList, leaveList] = await Promise.all([
        WorkforceService.getSummary().catch(() => null),
        WorkforceService.listEmployees().catch(() => []),
        BranchService.listBranches().catch(() => []),
        WorkforceService.listAttendance().catch(() => []),
        WorkforceService.listShifts().catch(() => []),
        WorkforceService.listLeaves().catch(() => []),
      ]);

      setSummary(sum);
      setEmployees(empList);
      setBranches(bList);
      setAttendanceLogs(attList);
      setShifts(shiftList);
      setLeaves(leaveList);
    } catch (err) {
      console.error('Failed to load workforce data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleRegisterEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!empName || !empDept) return;

    try {
      const payload = {
        employeeId: empCode || `EMP-${Date.now().toString(36).toUpperCase()}`,
        name: empName,
        email: empEmail || undefined,
        phone: empPhone || undefined,
        department: empDept,
        designation: empDesig,
        role: empRole,
        branchId: selectedBranchId || undefined,
      };

      const newEmp = await WorkforceService.createEmployee(payload);
      triggerToast(`Employee ${newEmp.name} registered successfully!`);
      setEmpCode('');
      setEmpName('');
      setEmpEmail('');
      setEmpPhone('');
      loadAllData();
    } catch (err: any) {
      triggerToast(`Registration failed: ${err.message}`);
    }
  };

  const handleClockIn = async () => {
    if (!selectedEmpClock) return;
    try {
      await WorkforceService.clockInEmployee(selectedEmpClock);
      triggerToast('Employee clocked in successfully!');
      setSelectedEmpClock('');
      loadAllData();
    } catch (err: any) {
      triggerToast(`Clock-in failed: ${err.message}`);
    }
  };

  const handleClockOut = async (empId: string) => {
    try {
      await WorkforceService.clockOutEmployee(empId);
      triggerToast('Employee clocked out successfully!');
      loadAllData();
    } catch (err: any) {
      triggerToast(`Clock-out failed: ${err.message}`);
    }
  };

  const handleApproveLeave = async (leaveId: string) => {
    try {
      await WorkforceService.updateLeaveStatus(leaveId, 'APPROVED');
      triggerToast('Leave approved!');
      loadAllData();
    } catch (err: any) {
      triggerToast(`Approval failed: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 bg-[#F8F9FF] min-h-screen py-4">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-white shadow-2xl animate-in fade-in">
          <Sparkles className="h-5 w-5 text-indigo-400" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Header & KPI Summary Cards */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900">Workforce & Staff Operations</h1>
            <p className="text-sm text-slate-500 font-bold mt-0.5">
              Multi-branch staff assignments, real-time clock-in punch logs, shift scheduling, and leave approvals.
            </p>
          </div>

          <div className="flex bg-slate-200/60 p-1 rounded-2xl border border-slate-200">
            <button
              onClick={() => setActiveTab('directory')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                activeTab === 'directory' ? 'bg-[#4F46E5] text-white shadow-sm' : 'text-slate-600'
              }`}
            >
              Employee Directory
            </button>
            <button
              onClick={() => setActiveTab('schedule')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                activeTab === 'schedule' ? 'bg-[#4F46E5] text-white shadow-sm' : 'text-slate-600'
              }`}
            >
              Shifts Roster
            </button>
            <button
              onClick={() => setActiveTab('attendance')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                activeTab === 'attendance' ? 'bg-[#4F46E5] text-white shadow-sm' : 'text-slate-600'
              }`}
            >
              Attendance Logs
            </button>
            <button
              onClick={() => setActiveTab('leaves')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                activeTab === 'leaves' ? 'bg-[#4F46E5] text-white shadow-sm' : 'text-slate-600'
              }`}
            >
              Leave Requests
            </button>
          </div>
        </div>

        {/* Real-time Workforce KPI Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Total Employees</span>
            <p className="text-xl font-black text-slate-900 mt-1">{summary?.totalEmployees || 0}</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
            <span className="text-[10px] font-bold text-emerald-500 uppercase">Active Staff</span>
            <p className="text-xl font-black text-emerald-600 mt-1">{summary?.activeStaff || 0}</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
            <span className="text-[10px] font-bold text-indigo-500 uppercase">Working Today</span>
            <p className="text-xl font-black text-indigo-600 mt-1">{summary?.workingToday || 0}</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
            <span className="text-[10px] font-bold text-rose-400 uppercase">Absent Today</span>
            <p className="text-xl font-black text-rose-600 mt-1">{summary?.absentToday || 0}</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
            <span className="text-[10px] font-bold text-amber-500 uppercase">On Leave</span>
            <p className="text-xl font-black text-amber-600 mt-1">{summary?.onLeave || 0}</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
            <span className="text-[10px] font-bold text-blue-500 uppercase">Open Shifts</span>
            <p className="text-xl font-black text-blue-600 mt-1">{summary?.openShifts || 0}</p>
          </div>
        </div>
      </div>

      {/* Tab Views */}
      {activeTab === 'directory' && (
        <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
          {/* Register Form */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm h-fit space-y-3">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
              <Plus size={16} className="text-indigo-600" /> Add Employee 360 Profile
            </h3>
            <form onSubmit={handleRegisterEmployee} className="space-y-2.5 text-xs font-bold">
              <input type="text" placeholder="Employee Code (e.g. EMP-101)" value={empCode} onChange={(e) => setEmpCode(e.target.value)} className="w-full p-2 border rounded-xl" />
              <input type="text" placeholder="Full Name *" value={empName} onChange={(e) => setEmpName(e.target.value)} className="w-full p-2 border rounded-xl" required />
              <input type="email" placeholder="Email Address" value={empEmail} onChange={(e) => setEmpEmail(e.target.value)} className="w-full p-2 border rounded-xl" />
              <input type="text" placeholder="Phone Number" value={empPhone} onChange={(e) => setEmpPhone(e.target.value)} className="w-full p-2 border rounded-xl" />
              <select value={empDept} onChange={(e) => setEmpDept(e.target.value)} className="w-full p-2 border rounded-xl">
                <option value="OPERATIONS">Operations</option>
                <option value="KITCHEN">Kitchen / Culinary</option>
                <option value="SERVICE">Service & Hospitality</option>
                <option value="FINANCE">Finance & Cashier</option>
                <option value="MANAGEMENT">Management</option>
              </select>
              <input type="text" placeholder="Designation (e.g. Senior Supervisor)" value={empDesig} onChange={(e) => setEmpDesig(e.target.value)} className="w-full p-2 border rounded-xl" />
              
              <select value={selectedBranchId} onChange={(e) => setSelectedBranchId(e.target.value)} className="w-full p-2 border rounded-xl">
                <option value="">-- Select Primary Branch --</option>
                {branches.map((b) => <option key={b.id} value={b.id}>{b.name} ({b.code})</option>)}
              </select>

              <button type="submit" className="w-full bg-[#4F46E5] text-white py-2.5 rounded-xl font-bold transition active:scale-95 shadow-sm mt-1">
                Save & Provision Employee
              </button>
            </form>
          </div>

          {/* Directory Grid */}
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            {employees.length > 0 ? (
              employees.map((emp) => (
                <div key={emp.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-2.5">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-sm">{emp.name}</h4>
                      <p className="text-[10px] text-slate-400 font-bold">{emp.designation} · {emp.department}</p>
                    </div>
                    <span className="bg-indigo-50 text-indigo-700 text-[10px] font-extrabold px-2 py-0.5 rounded uppercase">
                      {emp.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 font-medium flex items-center gap-1.5">
                    <Building2 size={12} className="text-slate-400" /> Primary Branch: <span className="font-bold">{emp.branch?.name || 'Global'}</span>
                  </p>
                  <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
                    <Phone size={12} className="text-slate-400" /> {emp.phone || 'No phone'}
                  </p>
                </div>
              ))
            ) : (
              <div className="col-span-full py-12 text-center text-slate-400 font-bold text-xs">
                No employee profiles registered yet.
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'attendance' && (
        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
          {/* Logs */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-3">
            <h3 className="font-black text-slate-900 text-sm">Attendance Punch Ledger</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b text-slate-400 font-bold text-left">
                    <th className="p-3">Employee</th>
                    <th className="p-3">Date</th>
                    <th className="p-3">Clock In</th>
                    <th className="p-3">Clock Out</th>
                    <th className="p-3">Duration</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {attendanceLogs.map((log) => (
                    <tr key={log.id}>
                      <td className="p-3 font-bold text-slate-900">{log.employee?.name || log.employeeId}</td>
                      <td className="p-3 font-medium text-slate-500">{new Date(log.date).toLocaleDateString()}</td>
                      <td className="p-3 font-mono font-bold text-indigo-600">{new Date(log.clockIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                      <td className="p-3 font-mono font-bold text-slate-700">{log.clockOut ? new Date(log.clockOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Active'}</td>
                      <td className="p-3 font-bold text-emerald-600">{log.durationMinutes ? `${log.durationMinutes} mins` : '-'}</td>
                      <td className="p-3 text-right">
                        {!log.clockOut && (
                          <button onClick={() => handleClockOut(log.employeeId)} className="bg-slate-900 text-white px-2.5 py-1 rounded-lg font-bold text-[10px]">
                            Clock Out
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Punch Panel */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm h-fit space-y-3">
            <h3 className="font-black text-slate-900 text-sm">Live Punch Action</h3>
            <select value={selectedEmpClock} onChange={(e) => setSelectedEmpClock(e.target.value)} className="w-full p-2 text-xs border rounded-xl font-bold">
              <option value="">-- Select Employee --</option>
              {employees.map((e) => <option key={e.id} value={e.id}>{e.name} ({e.employeeId})</option>)}
            </select>
            <button onClick={handleClockIn} className="w-full bg-[#4F46E5] text-white py-2 rounded-xl text-xs font-bold">
              Clock In Employee
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
