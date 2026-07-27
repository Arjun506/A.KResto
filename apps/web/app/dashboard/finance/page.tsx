'use client';

import { useState } from 'react';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Plus,
  RefreshCw,
  Sliders,
  CheckCircle,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  BookOpen,
  Layers,
  Activity,
  FileText,
  Clock,
  Printer,
  ChevronRight,
  Lock
} from 'lucide-react';

interface FinanceTransaction {
  id: string;
  type: 'Income' | 'Expense';
  description: string;
  category: string;
  amount: number;
  paymentMethod: 'Cash' | 'Card' | 'UPI';
  date: string;
}

interface DailyClosingLog {
  date: string;
  expected: number;
  actual: number;
  discrepancy: number;
  closedBy: string;
  status: 'Reconciled' | 'Discrepancy';
}

const INITIAL_TRANSACTIONS: FinanceTransaction[] = [
  { id: 'FT-01', type: 'Expense', description: 'Fresh vegetables purchase', category: 'Raw Materials', amount: 4200, paymentMethod: 'Cash', date: 'Today, 10:30 AM' },
  { id: 'FT-02', type: 'Income', description: 'Catering service partial settlement', category: 'Services', amount: 15000, paymentMethod: 'UPI', date: 'Today, 11:15 AM' },
  { id: 'FT-03', type: 'Expense', description: 'Monthly electricity bill payout', category: 'Utilities', amount: 8500, paymentMethod: 'Card', date: 'Yesterday' },
  { id: 'FT-04', type: 'Expense', description: 'Supplier egg crates restock', category: 'Raw Materials', amount: 2400, paymentMethod: 'Cash', date: 'Yesterday' }
];

const INITIAL_CLOSINGS: DailyClosingLog[] = [
  { date: '04 Jul 2026', expected: 24500, actual: 24500, discrepancy: 0, closedBy: 'Kiran Cashier', status: 'Reconciled' },
  { date: '03 Jul 2026', expected: 18200, actual: 18150, discrepancy: -50, closedBy: 'Kiran Cashier', status: 'Discrepancy' }
];

export default function FinanceCenterPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'ledger' | 'drawer' | 'refunds' | 'timeline'>('overview');
  
  // Ledger States
  const [transactions, setTransactions] = useState<FinanceTransaction[]>(INITIAL_TRANSACTIONS);
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');
  const [txType, setTxType] = useState<'Income' | 'Expense'>('Expense');
  const [cat, setCat] = useState('Raw Materials');
  const [payMethod, setPayMethod] = useState<'Cash' | 'Card' | 'UPI'>('Cash');

  // Daily Closing Drawer States
  const [expectedCash, setExpectedCash] = useState(12800);
  const [actualCash, setActualCash] = useState('');
  const [drawerClosingLogs, setDrawerClosingLogs] = useState<DailyClosingLog[]>(INITIAL_CLOSINGS);
  const [drawerStatus, setDrawerStatus] = useState<'Open' | 'Closed'>('Open');
  const [discrepancyNote, setDiscrepancyNote] = useState('');

  const discrepancy = actualCash ? parseFloat(actualCash) - expectedCash : 0;

  const handleAddTransaction = () => {
    if (!desc.trim() || !amount.trim()) return;
    const numAmt = parseFloat(amount) || 0;
    const newTx: FinanceTransaction = {
      id: `FT-0${transactions.length + 1}`,
      type: txType,
      description: desc,
      category: cat,
      amount: numAmt,
      paymentMethod: payMethod,
      date: 'Just now'
    };

    setTransactions([newTx, ...transactions]);
    
    // Adjust expected cash if it was a cash transaction
    if (payMethod === 'Cash') {
      if (txType === 'Income') {
        setExpectedCash(prev => prev + numAmt);
      } else {
        setExpectedCash(prev => prev - numAmt);
      }
    }

    setDesc('');
    setAmount('');
  };

  const handleCloseDrawer = () => {
    if (!actualCash) return;
    const numActual = parseFloat(actualCash) || 0;
    const diff = numActual - expectedCash;

    const log: DailyClosingLog = {
      date: new Date().toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' }),
      expected: expectedCash,
      actual: numActual,
      discrepancy: diff,
      closedBy: 'Kiran Cashier',
      status: diff === 0 ? 'Reconciled' : 'Discrepancy'
    };

    setDrawerClosingLogs([log, ...drawerClosingLogs]);
    setDrawerStatus('Closed');
    setActualCash('');
  };

  return (
    <div className="space-y-6 text-left max-w-7xl mx-auto select-none">
      
      {/* Header Block */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800/45 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-650">
              <DollarSign className="w-4 h-4" />
            </span>
            <span className="text-[10px] font-black uppercase text-indigo-650 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded-full">
              Operational Finance Hub
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-850 dark:text-slate-100 tracking-tight">
            Universal Finance Center
          </h1>
          <p className="text-xs text-slate-450">
            Reconcile daily cash register drawers, record non-invoice expense logs, track tax payouts, and audit cash discrepancy indexes.
          </p>
        </div>

        {/* Closing Drawer State */}
        <div className="flex items-center gap-3">
          <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full ${
            drawerStatus === 'Open'
              ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950'
              : 'bg-slate-100 text-slate-400 dark:bg-slate-800'
          }`}>
            Drawer Status: {drawerStatus}
          </span>
          {drawerStatus === 'Closed' && (
            <button
              onClick={() => setDrawerStatus('Open')}
              className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-black rounded-lg transition active:scale-95"
            >
              Reopen Drawer
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none border-b border-slate-100 dark:border-slate-800/40">
        {[
          { id: 'overview', label: 'Cash Dashboard & P&L', icon: Sliders },
          { id: 'ledger', label: 'Income & Expenses', icon: BookOpen },
          { id: 'drawer', label: 'Drawer Closing', icon: Lock },
          { id: 'refunds', label: 'Refunds & Tax', icon: FileText },
          { id: 'timeline', label: 'Ledger Timeline', icon: Activity }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-t-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? 'border-b-2 border-slate-900 text-slate-900 dark:border-slate-100 dark:text-slate-100'
                  : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-250'
              }`}
            >
              <Icon size={13} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Panels */}
      <div className="space-y-6">
        
        {/* PANEL 1: OVERVIEW & DASHBOARD */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            
            {/* Primary KPI Metrics */}
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
              <div className="p-5 bg-white dark:bg-[#11131c] border border-slate-200/50 dark:border-slate-800/40 rounded-3xl text-left space-y-1">
                <span className="text-[10px] font-black text-slate-400 uppercase">Drawer Balance (Cash)</span>
                <h3 className="text-xl font-black text-slate-850 dark:text-slate-100">₹{expectedCash}</h3>
                <span className="text-[9px] text-slate-400 block font-bold">Updated via active POS sales</span>
              </div>
              <div className="p-5 bg-white dark:bg-[#11131c] border border-slate-200/50 dark:border-slate-800/40 rounded-3xl text-left space-y-1">
                <span className="text-[10px] font-black text-slate-400 uppercase">Monthly Income</span>
                <h3 className="text-xl font-black text-indigo-650 dark:text-indigo-400">₹1,42,850</h3>
                <span className="text-[9px] text-emerald-500 font-bold flex items-center gap-0.5">
                  <ArrowUpRight size={10} /> +15.2%
                </span>
              </div>
              <div className="p-5 bg-white dark:bg-[#11131c] border border-slate-200/50 dark:border-slate-800/40 rounded-3xl text-left space-y-1">
                <span className="text-[10px] font-black text-slate-400 uppercase">Monthly Expenses</span>
                <h3 className="text-xl font-black text-rose-500">₹32,400</h3>
                <span className="text-[9px] text-rose-450 font-bold flex items-center gap-0.5">
                  <ArrowDownRight size={10} /> -4.8%
                </span>
              </div>
            </div>

            {/* P&L Statement Summary */}
            <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
              
              <div className="bg-white dark:bg-[#11131c] border border-slate-200/50 dark:border-slate-800/40 rounded-3xl p-5 shadow-xs md:col-span-2 text-left space-y-4">
                <h3 className="text-sm font-black text-slate-800 dark:text-slate-100 pb-3 border-b border-slate-50 dark:border-slate-850/20">
                  Profit & Loss Breakdown
                </h3>
                <div className="space-y-2.5 text-xs font-semibold text-slate-600">
                  <div className="flex justify-between">
                    <span>Gross Sales Revenue</span>
                    <span className="font-extrabold text-slate-800 dark:text-slate-150">₹1,42,850</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cost of Goods (Inventory Restocks)</span>
                    <span className="font-extrabold text-rose-500">- ₹18,400</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Operating Expenses (Rent, Bills)</span>
                    <span className="font-extrabold text-rose-500">- ₹14,000</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-50 dark:border-slate-850/25 pt-2 text-sm font-black">
                    <span className="text-slate-800 dark:text-slate-100">Net Profit Before Tax</span>
                    <span className="text-emerald-500">₹1,10,450</span>
                  </div>
                </div>
              </div>

              {/* Payment Methods shares */}
              <div className="bg-white dark:bg-[#11131c] border border-slate-200/50 dark:border-slate-800/40 rounded-3xl p-5 shadow-xs text-left">
                <h3 className="text-sm font-black text-slate-800 dark:text-slate-100 pb-3 border-b border-slate-50 dark:border-slate-850/20 mb-4">
                  Payment Channels
                </h3>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-1">
                      <span>UPI Payments</span>
                      <span>58%</span>
                    </div>
                    <div className="w-full bg-slate-105 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: '58%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-1">
                      <span>Cash Settlements</span>
                      <span>24%</span>
                    </div>
                    <div className="w-full bg-slate-105 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '24%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-1">
                      <span>Credit/Debit Cards</span>
                      <span>18%</span>
                    </div>
                    <div className="w-full bg-slate-105 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: '18%' }} />
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* PANEL 2: INCOME & EXPENSE LEDGER */}
        {activeTab === 'ledger' && (
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
            
            {/* Transactions Catalog */}
            <div className="bg-white dark:bg-[#11131c] border border-slate-200/50 dark:border-slate-800/40 rounded-3xl p-5 shadow-xs lg:col-span-2 text-left">
              <h3 className="text-sm font-black text-slate-800 dark:text-slate-100 pb-3 border-b border-slate-50 dark:border-slate-850/20 mb-4">
                Operational Ledger Log
              </h3>

              <div className="space-y-3">
                {transactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="p-4 border border-slate-100 dark:border-slate-850/30 rounded-2xl flex justify-between items-center gap-4 hover:bg-slate-50/20 dark:hover:bg-slate-900/10 transition"
                  >
                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-slate-800 dark:text-slate-150">{tx.description}</span>
                        <span className="text-[8px] font-black uppercase tracking-wider text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                          {tx.category}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400">Payment: {tx.paymentMethod} | Date: {tx.date}</p>
                    </div>

                    <span className={`text-xs font-black shrink-0 ${
                      tx.type === 'Income' ? 'text-emerald-500' : 'text-rose-500'
                    }`}>
                      {tx.type === 'Income' ? '+' : '-'} ₹{tx.amount}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Transaction Submitter Form */}
            <div className="bg-white dark:bg-[#11131c] border border-slate-200/50 dark:border-slate-800/40 rounded-3xl p-5 shadow-xs h-fit text-left">
              <h3 className="text-sm font-black text-slate-800 dark:text-slate-100 pb-3 border-b border-slate-50 dark:border-slate-850/20 mb-4">
                Log Transaction
              </h3>
              
              <div className="space-y-4">
                
                {/* Type Toggler */}
                <div className="grid grid-cols-2 gap-2 bg-slate-50 dark:bg-slate-850/40 p-1 rounded-xl">
                  {['Income', 'Expense'].map(type => (
                    <button
                      key={type}
                      onClick={() => setTxType(type as any)}
                      className={`py-1 rounded-lg text-[10px] font-black transition cursor-pointer ${
                        txType === type
                          ? 'bg-white dark:bg-[#11131c] text-slate-800 dark:text-slate-100 shadow-sm'
                          : 'text-slate-400 hover:text-slate-650'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase">Description</label>
                  <input
                    type="text"
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    placeholder="e.g. Electricity bill payout"
                    className="w-full px-3 py-1.5 border border-slate-205 dark:border-slate-800 rounded-xl text-xs bg-transparent outline-none text-slate-700 dark:text-slate-350"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase">Amount (₹)</label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="e.g. 500"
                    className="w-full px-3 py-1.5 border border-slate-205 dark:border-slate-800 rounded-xl text-xs bg-transparent outline-none text-slate-700 dark:text-slate-355"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase">Category</label>
                    <select
                      value={cat}
                      onChange={(e) => setCat(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-slate-200 dark:border-slate-800 rounded-xl text-xs bg-transparent outline-none text-slate-600 font-bold"
                    >
                      <option value="Raw Materials">Raw Materials</option>
                      <option value="Utilities">Utilities</option>
                      <option value="Services">Services</option>
                      <option value="Salary">Staff Salary</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase">Payment Method</label>
                    <select
                      value={payMethod}
                      onChange={(e) => setPayMethod(e.target.value as any)}
                      className="w-full px-2.5 py-1.5 border border-slate-200 dark:border-slate-800 rounded-xl text-xs bg-transparent outline-none text-slate-600 font-bold"
                    >
                      <option value="Cash">Cash Drawer</option>
                      <option value="Card">Card Terminal</option>
                      <option value="UPI">UPI QR Scan</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={handleAddTransaction}
                  className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-900 text-xs font-black rounded-xl transition active:scale-95 cursor-pointer"
                >
                  Log Transaction
                </button>
              </div>
            </div>

          </div>
        )}

        {/* PANEL 3: DAILY DRAWER CLOSINGS */}
        {activeTab === 'drawer' && (
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
            
            {/* Drawer closer checklist */}
            <div className="bg-white dark:bg-[#11131c] border border-slate-200/50 dark:border-slate-800/40 rounded-3xl p-5 shadow-xs text-left space-y-4">
              <h3 className="text-sm font-black text-slate-800 dark:text-slate-100 pb-3 border-b border-slate-50 dark:border-slate-850/20 mb-4">
                Drawer Reconciliation
              </h3>

              <div className="space-y-1.5 text-xs text-slate-550">
                <div className="flex justify-between font-bold">
                  <span>Starting Register Cash</span>
                  <span>₹2,000</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>Expected Net Cash</span>
                  <span className="text-slate-800 dark:text-slate-200">₹{expectedCash}</span>
                </div>
              </div>

              <div className="space-y-1.5 pt-3 border-t border-slate-50 dark:border-slate-850/20">
                <label className="text-[10px] font-black text-slate-400 uppercase">Actual Cash Counted (₹)</label>
                <input
                  type="number"
                  value={actualCash}
                  onChange={(e) => setActualCash(e.target.value)}
                  placeholder="e.g. 12800"
                  disabled={drawerStatus === 'Closed'}
                  className="w-full px-3 py-1.5 border border-slate-200 dark:border-slate-800 rounded-xl text-xs bg-transparent outline-none text-slate-700 dark:text-slate-350"
                />
              </div>

              {actualCash && (
                <div className={`p-3 border rounded-xl flex gap-1.5 items-center text-[10px] font-black ${
                  discrepancy === 0
                    ? 'bg-emerald-50 border-emerald-150 text-emerald-700 dark:bg-emerald-950/20'
                    : 'bg-rose-50 border-rose-150 text-rose-705 dark:bg-rose-950/15'
                }`}>
                  {discrepancy === 0 ? <CheckCircle size={12} /> : <AlertTriangle size={12} />}
                  <span>
                    {discrepancy === 0
                      ? 'Drawer reconciled perfectly!'
                      : `Discrepancy: ${discrepancy > 0 ? '+' : ''}₹${discrepancy} mismatch detected.`}
                  </span>
                </div>
              )}

              {discrepancy !== 0 && (
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase">Reconciliation Note</label>
                  <input
                    type="text"
                    value={discrepancyNote}
                    onChange={(e) => setDiscrepancyNote(e.target.value)}
                    placeholder="Provide reason for mismatch..."
                    className="w-full px-3 py-1.5 border border-slate-200 dark:border-slate-805 rounded-xl text-xs bg-transparent outline-none text-slate-700 dark:text-slate-355"
                  />
                </div>
              )}

              <button
                onClick={handleCloseDrawer}
                disabled={!actualCash || drawerStatus === 'Closed'}
                className={`w-full py-2 text-xs font-black rounded-xl transition active:scale-95 cursor-pointer ${
                  actualCash && drawerStatus === 'Open'
                    ? 'bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-900'
                    : 'bg-slate-100 dark:bg-slate-800/40 text-slate-400 cursor-not-allowed'
                }`}
              >
                Submit Drawer Close
              </button>
            </div>

            {/* Closing logs timeline */}
            <div className="bg-white dark:bg-[#11131c] border border-slate-200/50 dark:border-slate-800/40 rounded-3xl p-5 shadow-xs lg:col-span-2 text-left">
              <h3 className="text-sm font-black text-slate-800 dark:text-slate-100 pb-3 border-b border-slate-50 dark:border-slate-850/20 mb-4">
                Closing History
              </h3>

              <div className="space-y-3">
                {drawerClosingLogs.map((log, idx) => (
                  <div
                    key={idx}
                    className="p-4 border border-slate-100 dark:border-slate-850/30 rounded-2xl flex justify-between items-center gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-slate-800 dark:text-slate-150">{log.date}</span>
                        <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded ${
                          log.status === 'Reconciled'
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950'
                            : 'bg-rose-50 text-rose-700 dark:bg-rose-950'
                        }`}>
                          {log.status}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400">Closed by: {log.closedBy}</p>
                    </div>

                    <div className="text-right text-xs">
                      <p className="font-extrabold text-slate-705 dark:text-slate-350">Actual: ₹{log.actual}</p>
                      <span className={`text-[9px] font-black block mt-0.5 ${
                        log.discrepancy === 0 ? 'text-slate-400' : 'text-rose-500'
                      }`}>
                        Diff: {log.discrepancy > 0 ? '+' : ''}₹{log.discrepancy}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* PANEL 4: REFUNDS & TAX */}
        {activeTab === 'refunds' && (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
            
            {/* Tax summaries */}
            <div className="bg-white dark:bg-[#11131c] border border-slate-200/50 dark:border-slate-800/40 rounded-3xl p-5 shadow-xs text-left space-y-4">
              <h3 className="text-sm font-black text-slate-800 dark:text-slate-100 pb-3 border-b border-slate-50 dark:border-slate-850/20 mb-4">
                Tax Liability
              </h3>

              <div className="space-y-3.5 text-xs text-slate-550 font-semibold">
                <div className="flex justify-between">
                  <span>GST Collected (18% Slab)</span>
                  <span className="font-extrabold text-slate-805 dark:text-slate-100">₹12,450</span>
                </div>
                <div className="flex justify-between">
                  <span>VAT Collected (5% Slab)</span>
                  <span className="font-extrabold text-slate-805 dark:text-slate-100">₹3,200</span>
                </div>
                <div className="flex justify-between border-t border-slate-50 dark:border-slate-850/20 pt-2 text-sm font-black">
                  <span className="text-slate-850 dark:text-slate-200">Total Tax Payout Due</span>
                  <span className="text-slate-700 dark:text-slate-300">₹15,650</span>
                </div>
              </div>
            </div>

            {/* Refund list */}
            <div className="bg-white dark:bg-[#11131c] border border-slate-200/50 dark:border-slate-800/40 rounded-3xl p-5 shadow-xs md:col-span-2 text-left">
              <h3 className="text-sm font-black text-slate-800 dark:text-slate-100 pb-3 border-b border-slate-50 dark:border-slate-850/20 mb-4">
                Refund Requests
              </h3>

              <div className="space-y-3">
                {[
                  { id: 'REF-9281', order: 'ORD-8902', customer: 'Amit Kumar', amount: 350, date: 'Today, 2:00 PM', status: 'Settled' },
                  { id: 'REF-9280', order: 'ORD-8799', customer: 'Nisha Sharma', amount: 840, date: 'Yesterday', status: 'Settled' }
                ].map((ref, idx) => (
                  <div key={idx} className="p-3.5 border border-slate-100 dark:border-slate-850/30 rounded-2xl flex justify-between items-center text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-slate-800 dark:text-slate-100">{ref.id}</span>
                        <span className="text-[9px] font-bold text-slate-400">Order: {ref.order}</span>
                      </div>
                      <p className="text-[10px] text-slate-450">{ref.customer} • {ref.date}</p>
                    </div>

                    <div className="text-right space-y-1">
                      <span className="font-extrabold text-slate-750 dark:text-slate-300">₹{ref.amount}</span>
                      <span className="text-[8px] font-black uppercase text-emerald-650 bg-emerald-50 dark:bg-emerald-950 px-1.5 py-0.5 rounded block w-fit ml-auto">
                        {ref.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* PANEL 5: LEDGER TIMELINE */}
        {activeTab === 'timeline' && (
          <div className="bg-white dark:bg-[#11131c] border border-slate-200/50 dark:border-slate-800/40 rounded-3xl p-5 shadow-xs text-left">
            <h3 className="text-sm font-black text-slate-800 dark:text-slate-100 pb-3 border-b border-slate-50 dark:border-slate-850/20 mb-4">
              Cash Audit timeline
            </h3>

            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1" style={{ scrollbarWidth: 'thin' }}>
              {transactions.map((tx, idx) => (
                <div key={idx} className="flex gap-3 text-xs items-start">
                  <div className="shrink-0 p-1.5 rounded bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700/30 text-slate-400 mt-0.5">
                    <Clock size={12} />
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-slate-800 dark:text-slate-150">{tx.description}</span>
                      <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded ${
                        tx.type === 'Income'
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950'
                          : 'bg-rose-50 text-rose-700 dark:bg-rose-950'
                      }`}>
                        ₹{tx.amount}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400">Recorded using {tx.paymentMethod} • {tx.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

    </div>
  );
}

