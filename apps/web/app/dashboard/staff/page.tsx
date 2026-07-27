'use client';

import { useState } from 'react';
import {
  UserCheck,
  Plus,
  Key,
  Copy,
  Check,
  Calendar,
  Clock,
  Briefcase,
  Search,
  X,
  UserX,
  Mail,
  Phone,
  Sparkles,
  Award,
  Users
} from 'lucide-react';

interface StaffMember {
  id: string;
  name: string;
  role: 'Chef' | 'Waiter' | 'Cashier' | 'Manager';
  phone: string;
  username: string;
  password: string;
  email?: string;
  rating?: number;
}

interface ShiftAssignment {
  day: string; // 'Monday', 'Tuesday', etc.
  shift: 'Morning (6am - 2pm)' | 'Evening (2pm - 10pm)' | 'Night (10pm - 6am)';
  staffId: string;
}

interface AttendanceLog {
  id: string;
  staffName: string;
  role: string;
  date: string;
  clockIn: string;
  clockOut?: string;
  status: 'ON_TIME' | 'LATE' | 'ABSENT';
}

export default function StaffPage() {
  const [activeTab, setActiveTab] = useState<'directory' | 'schedule' | 'attendance'>('directory');
  
  // Staff Directory State
  const [staff, setStaff] = useState<StaffMember[]>([
    {
      id: 's1',
      name: 'Rahul Sen',
      role: 'Manager',
      phone: '9876543210',
      username: 'manager_rahul_82',
      password: 'wp9x' + Math.floor(1000 + Math.random() * 9000),
      email: 'rahul.sen@a3resto.com',
      rating: 4.8,
    },
    {
      id: 's2',
      name: 'Aman Deep',
      role: 'Waiter',
      phone: '9876501234',
      username: 'waiter_aman_45',
      password: 'wt3y' + Math.floor(1000 + Math.random() * 9000),
      email: 'aman.d@a3resto.com',
      rating: 4.6,
    },
    {
      id: 's3',
      name: 'Pooja Sharma',
      role: 'Cashier',
      phone: '9988776655',
      username: 'cashier_pooja_91',
      password: 'cs7z' + Math.floor(1000 + Math.random() * 9000),
      email: 'pooja.s@a3resto.com',
      rating: 4.9,
    },
  ]);

  const [name, setName] = useState('');
  const [role, setRole] = useState<'Chef' | 'Waiter' | 'Cashier' | 'Manager'>('Waiter');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Shift Schedule State
  const [shifts, setShifts] = useState<ShiftAssignment[]>([
    { day: 'Monday', shift: 'Morning (6am - 2pm)', staffId: 's1' },
    { day: 'Monday', shift: 'Evening (2pm - 10pm)', staffId: 's2' },
    { day: 'Tuesday', shift: 'Morning (6am - 2pm)', staffId: 's3' },
    { day: 'Wednesday', shift: 'Evening (2pm - 10pm)', staffId: 's1' },
    { day: 'Thursday', shift: 'Night (10pm - 6am)', staffId: 's2' },
    { day: 'Friday', shift: 'Morning (6am - 2pm)', staffId: 's3' },
  ]);

  // Attendance Logs State
  const [attendance, setAttendance] = useState<AttendanceLog[]>([
    { id: 'att1', staffName: 'Rahul Sen', role: 'Manager', date: '2026-06-14', clockIn: '05:55 AM', clockOut: '02:05 PM', status: 'ON_TIME' },
    { id: 'att2', staffName: 'Pooja Sharma', role: 'Cashier', date: '2026-06-14', clockIn: '06:12 AM', status: 'LATE' },
    { id: 'att3', staffName: 'Aman Deep', role: 'Waiter', date: '2026-06-13', clockIn: '01:58 PM', clockOut: '10:02 PM', status: 'ON_TIME' },
  ]);

  const [clockStaffId, setClockStaffId] = useState('');

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const addStaff = () => {
    if (!name || !role || !phone) {
      triggerToast('Please fill out Name, Role, and Phone fields.');
      return;
    }

    const cleanName = name.toLowerCase().replace(/[^a-z0-9]/g, '');
    const cleanRole = role.toLowerCase();
    const randNum = Math.floor(10 + Math.random() * 90);
    const generatedUsername = `${cleanRole}_${cleanName}_${randNum}`;
    const generatedPassword = Math.random().toString(36).slice(-8);

    const newStaff: StaffMember = {
      id: 's_' + Math.random().toString(36).substr(2, 9),
      name,
      role,
      phone,
      username: generatedUsername,
      password: generatedPassword,
      email: email || undefined,
      rating: 5.0,
    };

    setStaff([...staff, newStaff]);
    setName('');
    setPhone('');
    setEmail('');
    triggerToast(`Staff account for ${name} registered!`);
  };

  const deleteStaff = (id: string) => {
    setStaff(staff.filter((s) => s.id !== id));
    triggerToast('Staff account deactivated.');
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    triggerToast('Credentials copied to clipboard!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Shift assignment modifier
  const assignShift = (day: string, shiftName: any, staffId: string) => {
    if (!staffId) return;
    
    // Remove if already exists for this day/shift
    const filtered = shifts.filter(s => !(s.day === day && s.shift === shiftName));
    
    setShifts([...filtered, { day, shift: shiftName, staffId }]);
    triggerToast(`Assigned shift on ${day}`);
  };

  // Clock In / Out simulation
  const handleClockIn = () => {
    if (!clockStaffId) {
      triggerToast('Select employee to clock in.');
      return;
    }
    const emp = staff.find(s => s.id === clockStaffId);
    if (!emp) return;

    // Check if already clocked in today
    const exists = attendance.find(a => a.staffName === emp.name && a.date === new Date().toISOString().slice(0, 10) && !a.clockOut);
    if (exists) {
      triggerToast(`${emp.name} is already clocked in.`);
      return;
    }

    const checkTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    const isLate = new Date().getHours() > 8; // Late after 8 AM

    const newLog: AttendanceLog = {
      id: 'att_' + Math.random().toString(36).substr(2, 9),
      staffName: emp.name,
      role: emp.role,
      date: new Date().toISOString().slice(0, 10),
      clockIn: checkTime,
      status: isLate ? 'LATE' : 'ON_TIME',
    };

    setAttendance([newLog, ...attendance]);
    triggerToast(`${emp.name} clocked in successfully at ${checkTime}!`);
    setClockStaffId('');
  };

  const handleClockOut = (id: string, name: string) => {
    const checkTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    setAttendance(prev =>
      prev.map(a => (a.id === id ? { ...a, clockOut: checkTime } : a))
    );
    triggerToast(`${name} clocked out successfully at ${checkTime}!`);
  };

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const shiftTypes = [
    'Morning (6am - 2pm)' as const,
    'Evening (2pm - 10pm)' as const,
    'Night (10pm - 6am)' as const
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-white shadow-2xl animate-in fade-in slide-in-from-bottom-5">
          <Sparkles className="h-5 w-5 text-indigo-400" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Staff Accounts & Scheduling</h1>
          <p className="text-sm text-slate-500">
            Provision waiter, chef, and cashier credentials, coordinate shift calendars, and record punch logs.
          </p>
        </div>

        {/* Tab view controllers */}
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl w-fit self-start">
          <button
            onClick={() => setActiveTab('directory')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              activeTab === 'directory'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Users className="h-3.5 w-3.5" />
            Accounts Directory
          </button>
          <button
            onClick={() => setActiveTab('schedule')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              activeTab === 'schedule'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Calendar className="h-3.5 w-3.5" />
            Weekly Shift Planner
          </button>
          <button
            onClick={() => setActiveTab('attendance')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              activeTab === 'attendance'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Clock className="h-3.5 w-3.5" />
            Attendance Punch Logs
          </button>
        </div>
      </div>

      {/* 1. DIRECTORY VIEW */}
      {activeTab === 'directory' && (
        <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
          
          {/* Add Staff form */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm h-fit">
            <h2 className="text-base font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2 flex items-center gap-2">
              <Plus className="h-4.5 w-4.5 text-indigo-600" />
              Register New Employee
            </h2>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Full Name *</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Aman Deep"
                  className="w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Select Role *</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm focus:border-indigo-500 focus:outline-none bg-white text-slate-700 font-semibold"
                >
                  <option value="Chef">Chef (Kitchen orders)</option>
                  <option value="Waiter">Waiter (Tablet orders)</option>
                  <option value="Cashier">Cashier (Checkout billing)</option>
                  <option value="Manager">Manager (Reports / Admin)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Phone *</label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 9876501234"
                  className="w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Email</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="aman@restaurant.com"
                  className="w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <button
                onClick={addStaff}
                className="mt-2 w-full rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white py-2 text-sm font-semibold transition-colors shadow-sm"
              >
                Create Account & Key ID
              </button>
            </div>
          </div>

          {/* Accounts Grid */}
          <div className="grid gap-4 sm:grid-cols-2">
            {staff.map((member) => (
              <div key={member.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-extrabold text-base text-slate-900">{member.name}</h3>
                      <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">{member.role} Account</span>
                    </div>
                    
                    <span className="bg-indigo-50 text-indigo-700 text-xs font-bold px-2.5 py-1 rounded-lg">
                      Rating {member.rating || 5.0}★
                    </span>
                  </div>

                  {/* Credentials block */}
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5 space-y-2 mt-4 relative">
                    <button
                      onClick={() => handleCopy(`Username: ${member.username}\nPassword: ${member.password}`, member.id)}
                      className="absolute top-3 right-3 p-1.5 hover:bg-white border border-transparent hover:border-slate-200 rounded-lg text-slate-400 hover:text-indigo-600 transition"
                      title="Copy login credentials"
                    >
                      {copiedId === member.id ? (
                        <Check className="h-4 w-4 text-emerald-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                    <div>
                      <span className="text-[9px] text-slate-400 font-bold block uppercase">System Username</span>
                      <span className="text-xs font-mono font-bold text-slate-800 block select-all">{member.username}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 font-bold block uppercase">Initial Password</span>
                      <span className="text-xs font-mono font-bold text-slate-800 block select-all">{member.password}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 mt-4 pt-3 border-t border-slate-100">
                  <div className="flex gap-2 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5" /> {member.phone}</span>
                  </div>
                  <button
                    onClick={() => deleteStaff(member.id)}
                    className="text-xs font-bold text-rose-600 hover:text-rose-800"
                  >
                    Deactivate
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* 2. WEEKLY SHIFT PLANNER TAB */}
      {activeTab === 'schedule' && (
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm overflow-hidden">
          <h2 className="text-base font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">Operational Shift Scheduler</h2>
          
          <div className="overflow-x-auto">
            <div className="min-w-[800px] grid grid-cols-8 gap-4 border-b border-slate-100 pb-3 mb-4">
              <div className="font-bold text-xs text-slate-400 uppercase">Day</div>
              {shiftTypes.map((shiftName) => (
                <div key={shiftName} className="col-span-2 font-bold text-xs text-slate-500 uppercase tracking-wider">{shiftName}</div>
              ))}
            </div>

            <div className="space-y-4">
              {daysOfWeek.map((day) => (
                <div key={day} className="min-w-[800px] grid grid-cols-8 gap-4 items-center border-b border-slate-50 pb-3">
                  <div className="font-extrabold text-sm text-slate-800">{day}</div>
                  
                  {shiftTypes.map((shiftName) => {
                    const assigned = shifts.find((s) => s.day === day && s.shift === shiftName);
                    const staffName = staff.find((st) => st.id === assigned?.staffId)?.name;

                    return (
                      <div key={shiftName} className="col-span-2 flex items-center gap-2">
                        {assigned ? (
                          <div className="rounded-lg bg-indigo-50 border border-indigo-100 px-3 py-1.5 text-xs font-bold text-indigo-950 flex items-center justify-between w-full">
                            <span>{staffName}</span>
                            <button
                              onClick={() => setShifts(prev => prev.filter(s => !(s.day === day && s.shift === shiftName)))}
                              className="text-indigo-400 hover:text-rose-600"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ) : (
                          <select
                            onChange={(e) => assignShift(day, shiftName, e.target.value)}
                            className="rounded-lg border border-slate-200 px-2 py-1 text-xs focus:outline-none focus:border-indigo-500 bg-white text-slate-400 w-full"
                            value=""
                          >
                            <option value="">+ Assign Shift</option>
                            {staff.map((st) => (
                              <option key={st.id} value={st.id}>{st.name} ({st.role})</option>
                            ))}
                          </select>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. ATTENDANCE PUNCH LOGS */}
      {activeTab === 'attendance' && (
        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
          
          {/* Attendance logs list */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-semibold text-slate-500 uppercase bg-slate-50/30">
                  <th className="px-6 py-3">Employee</th>
                  <th className="px-6 py-3">Role</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Clock In</th>
                  <th className="px-6 py-3">Clock Out</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {attendance.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900">{log.staffName}</td>
                    <td className="px-6 py-4 text-slate-600">{log.role}</td>
                    <td className="px-6 py-4 text-slate-500">{log.date}</td>
                    <td className="px-6 py-4 font-mono font-semibold text-indigo-600">{log.clockIn}</td>
                    <td className="px-6 py-4 font-mono font-semibold text-slate-600">
                      {log.clockOut || <span className="text-emerald-600 font-bold tracking-wider animate-pulse">Active Shift</span>}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-bold ${
                        log.status === 'ON_TIME'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}>
                        {log.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {!log.clockOut && (
                        <button
                          onClick={() => handleClockOut(log.id, log.staffName)}
                          className="rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-2.5 py-1"
                        >
                          Clock Out
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Clock In Panel */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm self-start">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide mb-3">Live Clock Punch</h3>
            
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Pick Employee</label>
                <select
                  value={clockStaffId}
                  onChange={(e) => setClockStaffId(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm focus:border-indigo-500 focus:outline-none bg-white text-slate-700"
                >
                  <option value="">Select staff</option>
                  {staff.map((st) => (
                    <option key={st.id} value={st.id}>{st.name} ({st.role})</option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleClockIn}
                className="w-full rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white py-2 text-sm font-semibold transition-colors shadow-sm"
              >
                Clock In Employee
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

