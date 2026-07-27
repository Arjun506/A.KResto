'use client';

import { useState, useMemo } from 'react';
import {
  CreditCard,
  QrCode,
  DollarSign,
  Receipt,
  Settings,
  Users,
  Percent,
  Check,
  Search,
  ArrowRight,
  TrendingUp,
  FileText,
  AlertCircle,
  Clock,
  Sparkles,
  ChevronRight,
  FileSpreadsheet
} from 'lucide-react';

interface Transaction {
  id: string;
  invoiceNo: string;
  table: string;
  guestName: string;
  date: string;
  amount: number;
  tax: number;
  method: 'UPI' | 'Card' | 'Cash';
  status: 'SUCCEEDED' | 'PENDING' | 'REFUNDED';
}

interface MenuItemSplit {
  id: string;
  name: string;
  price: number;
  quantity: number;
  assignedGuest: number; // 0 for shared, 1, 2, 3 for specific guest
}

export default function PaymentsPage() {
  const [activeTab, setActiveTab] = useState<'checkout' | 'transactions' | 'tax-settings'>('checkout');
  
  // Checkout States
  const [splitType, setSplitType] = useState<'single' | 'equal' | 'itemized'>('single');
  const [guestCount, setGuestCount] = useState<number>(2);
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'Card' | 'UPI'>('UPI');
  const [upiProvider, setUpiProvider] = useState<'gpay' | 'phonepe' | 'paytm'>('gpay');
  const [paid, setPaid] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Split billing mock items
  const [orderItems, setOrderItems] = useState<MenuItemSplit[]>([
    { id: '1', name: 'Butter Chicken Masala', price: 380, quantity: 1, assignedGuest: 0 },
    { id: '2', name: 'Dal Makhani Premium', price: 240, quantity: 1, assignedGuest: 0 },
    { id: '3', name: 'Garlic Naan Butter', price: 60, quantity: 4, assignedGuest: 0 },
    { id: '4', name: 'Paneer Tikka Angara', price: 260, quantity: 1, assignedGuest: 0 },
    { id: '5', name: 'Mango Lassi Special', price: 110, quantity: 2, assignedGuest: 0 },
    { id: '6', name: 'Premium Mineral Water', price: 40, quantity: 2, assignedGuest: 0 },
  ]);

  // Tax Settings State
  const [taxSettings, setTaxSettings] = useState({
    cgst: 2.5,
    sgst: 2.5,
    serviceCharge: 5,
    enableTaxInclusive: false,
    vatRate: 0,
  });

  // Transaction Ledger State
  const [searchQuery, setSearchQuery] = useState('');
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: 'tx1', invoiceNo: 'INV-2026-0098', table: 'Table 4', guestName: 'Rohan Sharma', date: '2026-06-14 10:20 AM', amount: 1248, tax: 112, method: 'UPI', status: 'SUCCEEDED' },
    { id: 'tx2', invoiceNo: 'INV-2026-0097', table: 'Table 12', guestName: 'Aishwarya Sen', date: '2026-06-14 09:45 AM', amount: 890, tax: 80, method: 'Card', status: 'SUCCEEDED' },
    { id: 'tx3', invoiceNo: 'INV-2026-0096', table: 'Takeaway #4', guestName: 'Deepak Gupta', date: '2026-06-14 09:12 AM', amount: 450, tax: 40, method: 'Cash', status: 'SUCCEEDED' },
    { id: 'tx4', invoiceNo: 'INV-2026-0095', table: 'Table 2', guestName: 'Shrikant Rao', date: '2026-06-14 08:30 AM', amount: 2150, tax: 195, method: 'UPI', status: 'SUCCEEDED' },
    { id: 'tx5', invoiceNo: 'INV-2026-0094', table: 'Table 8', guestName: 'Nikhil Kumar', date: '2026-06-13 11:15 PM', amount: 1650, tax: 150, method: 'Card', status: 'REFUNDED' },
  ]);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Calculations
  const subtotal = useMemo(() => {
    return orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }, [orderItems]);

  const taxAmount = useMemo(() => {
    const totalTaxRate = taxSettings.cgst + taxSettings.sgst;
    return Math.round((subtotal * totalTaxRate) / 100);
  }, [subtotal, taxSettings]);

  const serviceChargeAmount = useMemo(() => {
    return Math.round((subtotal * taxSettings.serviceCharge) / 100);
  }, [subtotal, taxSettings]);

  const totalAmount = useMemo(() => {
    return subtotal + taxAmount + serviceChargeAmount;
  }, [subtotal, taxAmount, serviceChargeAmount]);

  // Handle Itemized guest item change
  const handleAssignItem = (itemId: string, guestNum: number) => {
    setOrderItems(prev =>
      prev.map(item => (item.id === itemId ? { ...item, assignedGuest: guestNum } : item))
    );
  };

  // Calculate totals per guest (for itemized splitting)
  const guestItemizedTotals = useMemo(() => {
    const totals: Record<number, number> = {};
    for (let i = 1; i <= guestCount; i++) {
      totals[i] = 0;
    }
    
    let sharedTotal = 0;
    orderItems.forEach(item => {
      const itemCost = item.price * item.quantity;
      if (item.assignedGuest === 0) {
        sharedTotal += itemCost;
      } else if (totals[item.assignedGuest] !== undefined) {
        totals[item.assignedGuest] += itemCost;
      }
    });

    // Add shared items split equally
    const sharedSplit = sharedTotal / guestCount;
    const totalTaxPercent = taxSettings.cgst + taxSettings.sgst + taxSettings.serviceCharge;

    const finalized: Record<number, { subtotal: number; tax: number; total: number }> = {};
    for (let i = 1; i <= guestCount; i++) {
      const gSub = totals[i] + sharedSplit;
      const gTax = (gSub * totalTaxPercent) / 100;
      finalized[i] = {
        subtotal: Math.round(gSub),
        tax: Math.round(gTax),
        total: Math.round(gSub + gTax),
      };
    }
    return finalized;
  }, [orderItems, guestCount, taxSettings]);

  const processPayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setPaid(true);
      triggerToast('Payment successfully processed & receipt printed!');
      
      // Add transaction to history
      const newTx: Transaction = {
        id: 'tx_' + Math.random().toString(36).substr(2, 9),
        invoiceNo: `INV-2026-0${100 + transactions.length}`,
        table: 'Table 4',
        guestName: 'Walk-in Guest',
        date: new Date().toLocaleString(),
        amount: totalAmount,
        tax: taxAmount,
        method: paymentMethod,
        status: 'SUCCEEDED',
      };
      setTransactions([newTx, ...transactions]);
    }, 2000);
  };

  const handleRefund = (id: string) => {
    setTransactions(prev =>
      prev.map(tx => (tx.id === id ? { ...tx, status: 'REFUNDED' } : tx))
    );
    triggerToast('Refund processed successfully.');
  };

  const filteredTransactions = useMemo(() => {
    return transactions.filter(
      tx =>
        tx.invoiceNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.table.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [transactions, searchQuery]);

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
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Payments & Checkout</h1>
          <p className="text-sm text-slate-500">
            Split bills by items, generate dynamic UPI payment codes, and review invoice ledgers.
          </p>
        </div>
        
        {/* View Switches */}
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl w-fit self-start">
          <button
            onClick={() => setActiveTab('checkout')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              activeTab === 'checkout'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Receipt className="h-3.5 w-3.5" />
            Checkout Terminal
          </button>
          <button
            onClick={() => setActiveTab('transactions')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              activeTab === 'transactions'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <FileText className="h-3.5 w-3.5" />
            Invoices & Ledger
          </button>
          <button
            onClick={() => setActiveTab('tax-settings')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              activeTab === 'tax-settings'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Settings className="h-3.5 w-3.5" />
            Tax & Service Charge
          </button>
        </div>
      </div>

      {/* 1. CHECKOUT TAB */}
      {activeTab === 'checkout' && (
        <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
          
          {/* Main billing split detail */}
          <div className="space-y-6">
            
            {/* Order Items Summary */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5 text-indigo-600" />
                Active Table Bill (Table 4)
              </h2>

              <div className="space-y-3 divide-y divide-slate-100">
                {orderItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between pt-3 first:pt-0">
                    <div className="flex-1">
                      <p className="font-semibold text-slate-800 text-sm">{item.name}</p>
                      <p className="text-xs text-slate-500">₹{item.price} × {item.quantity}</p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-slate-900">₹{item.price * item.quantity}</span>
                      
                      {/* Split controller for itemized */}
                      {splitType === 'itemized' && (
                        <select
                          value={item.assignedGuest}
                          onChange={(e) => handleAssignItem(item.id, Number(e.target.value))}
                          className="rounded-lg border border-slate-200 px-2.5 py-1 text-xs focus:outline-none focus:border-indigo-500 bg-white font-semibold text-slate-700"
                        >
                          <option value="0">Shared (Split)</option>
                          {Array.from({ length: guestCount }).map((_, i) => (
                            <option key={i + 1} value={i + 1}>Guest {i + 1}</option>
                          ))}
                        </select>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Split billing type toggle */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-sm font-bold text-slate-800 mb-3 uppercase tracking-wide">Split Payment Options</h3>
              
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => setSplitType('single')}
                  className={`rounded-xl border p-4 text-left transition-all duration-200 ${
                    splitType === 'single'
                      ? 'border-indigo-600 ring-2 ring-indigo-600/10 bg-indigo-50/25'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <DollarSign className="h-5 w-5 text-indigo-600 mb-2" />
                  <span className="block font-bold text-sm text-slate-800">Single Bill</span>
                  <span className="text-xs text-slate-400">Pay entire total together</span>
                </button>

                <button
                  onClick={() => setSplitType('equal')}
                  className={`rounded-xl border p-4 text-left transition-all duration-200 ${
                    splitType === 'equal'
                      ? 'border-indigo-600 ring-2 ring-indigo-600/10 bg-indigo-50/25'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <Users className="h-5 w-5 text-amber-600 mb-2" />
                  <span className="block font-bold text-sm text-slate-800">Equal Split</span>
                  <span className="text-xs text-slate-400">Divide evenly by guests</span>
                </button>

                <button
                  onClick={() => setSplitType('itemized')}
                  className={`rounded-xl border p-4 text-left transition-all duration-200 ${
                    splitType === 'itemized'
                      ? 'border-indigo-600 ring-2 ring-indigo-600/10 bg-indigo-50/25'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <FileSpreadsheet className="h-5 w-5 text-emerald-600 mb-2" />
                  <span className="block font-bold text-sm text-slate-800">Itemized Split</span>
                  <span className="text-xs text-slate-400">Guests pay for custom items</span>
                </button>
              </div>

              {/* Guests Count picker if split */}
              {splitType !== 'single' && (
                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-600 uppercase">Number of Guests</label>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setGuestCount(prev => Math.max(2, prev - 1))}
                      className="h-8 w-8 rounded-lg bg-slate-100 hover:bg-slate-200 font-bold text-slate-700 transition-colors"
                    >
                      -
                    </button>
                    <span className="font-bold text-sm px-2 text-slate-900">{guestCount} Guests</span>
                    <button
                      onClick={() => setGuestCount(prev => Math.min(8, prev + 1))}
                      className="h-8 w-8 rounded-lg bg-slate-100 hover:bg-slate-200 font-bold text-slate-700 transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Split breakdown results */}
            {splitType === 'equal' && (
              <div className="rounded-xl border border-indigo-100 bg-indigo-50/10 p-5 shadow-xs">
                <h4 className="text-sm font-bold text-indigo-950 mb-3">Equal Share Breakdown</h4>
                <div className="grid gap-3 sm:grid-cols-2">
                  {Array.from({ length: guestCount }).map((_, i) => (
                    <div key={i} className="bg-white border border-slate-200/60 rounded-xl p-3.5 flex items-center justify-between shadow-xs">
                      <div>
                        <p className="font-bold text-xs text-slate-400 uppercase tracking-wide">Guest {i + 1}</p>
                        <p className="text-sm font-semibold text-slate-500">Share total</p>
                      </div>
                      <span className="text-lg font-extrabold text-indigo-700">₹{Math.round(totalAmount / guestCount)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {splitType === 'itemized' && (
              <div className="rounded-xl border border-indigo-100 bg-indigo-50/10 p-5 shadow-xs">
                <h4 className="text-sm font-bold text-indigo-950 mb-3">Itemized Share Breakdown</h4>
                <div className="grid gap-3 sm:grid-cols-2">
                  {Array.from({ length: guestCount }).map((_, i) => {
                    const guestData = guestItemizedTotals[i + 1] || { subtotal: 0, tax: 0, total: 0 };
                    return (
                      <div key={i} className="bg-white border border-slate-200/60 rounded-xl p-4 shadow-xs">
                        <div className="flex justify-between items-center mb-2">
                          <p className="font-bold text-xs text-slate-400 uppercase tracking-wide">Guest {i + 1}</p>
                          <span className="text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold">Verified</span>
                        </div>
                        <div className="space-y-1 text-xs text-slate-500">
                          <div className="flex justify-between">
                            <span>Subtotal:</span>
                            <span className="font-semibold text-slate-700">₹{guestData.subtotal}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Taxes & Service:</span>
                            <span className="font-semibold text-slate-700">₹{guestData.tax}</span>
                          </div>
                          <div className="flex justify-between border-t border-slate-100 pt-2 mt-1">
                            <span className="font-bold text-slate-700">Total Share:</span>
                            <span className="font-extrabold text-indigo-600 text-sm">₹{guestData.total}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          </div>

          {/* Payment execution summary side panel */}
          <div className="space-y-6">
            
            {/* Bill Summary Box */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide mb-3">Invoice Details</h3>

              <div className="space-y-2 text-sm text-slate-600 border-b border-slate-100 pb-4">
                <div className="flex justify-between">
                  <span>Cart Subtotal</span>
                  <span className="font-semibold text-slate-800">₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>CGST ({taxSettings.cgst}%)</span>
                  <span className="font-semibold text-slate-800">₹{Math.round(subtotal * taxSettings.cgst / 100)}</span>
                </div>
                <div className="flex justify-between">
                  <span>SGST ({taxSettings.sgst}%)</span>
                  <span className="font-semibold text-slate-800">₹{Math.round(subtotal * taxSettings.sgst / 100)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Service Charge ({taxSettings.serviceCharge}%)</span>
                  <span className="font-semibold text-slate-800">₹{serviceChargeAmount}</span>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between mb-4">
                <span className="text-base font-bold text-slate-900">Total Payable</span>
                <span className="text-2xl font-extrabold text-indigo-600">₹{totalAmount}</span>
              </div>

              {/* Payment Methods */}
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">Select Payment Mode</h4>
              <div className="grid grid-cols-3 gap-2 mb-4">
                <button
                  onClick={() => setPaymentMethod('Cash')}
                  className={`py-2 px-3 rounded-lg border text-xs font-bold transition-all text-center ${
                    paymentMethod === 'Cash'
                      ? 'bg-indigo-600 border-indigo-600 text-white'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  💵 Cash
                </button>
                <button
                  onClick={() => setPaymentMethod('Card')}
                  className={`py-2 px-3 rounded-lg border text-xs font-bold transition-all text-center ${
                    paymentMethod === 'Card'
                      ? 'bg-indigo-600 border-indigo-600 text-white'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  💳 Card
                </button>
                <button
                  onClick={() => setPaymentMethod('UPI')}
                  className={`py-2 px-3 rounded-lg border text-xs font-bold transition-all text-center ${
                    paymentMethod === 'UPI'
                      ? 'bg-indigo-600 border-indigo-600 text-white'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  📱 UPI
                </button>
              </div>

              {/* Method Dynamic Visualizer */}
              {paymentMethod === 'UPI' && (
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 mb-4 text-center">
                  <p className="text-xs text-slate-500 font-bold mb-3 uppercase tracking-wide">Dynamic QR Code</p>
                  
                  {/* Mock QR generator graphics */}
                  <div className="mx-auto h-36 w-36 bg-white border border-slate-200 p-2 rounded-lg flex items-center justify-center relative">
                    <QrCode className="h-32 w-32 text-slate-800" />
                    {isProcessing && (
                      <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                        <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent"></div>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-3 flex items-center justify-center gap-3">
                    <button
                      onClick={() => setUpiProvider('gpay')}
                      className={`text-xs font-bold px-2.5 py-1 rounded transition-colors ${
                        upiProvider === 'gpay' ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      GooglePay
                    </button>
                    <button
                      onClick={() => setUpiProvider('phonepe')}
                      className={`text-xs font-bold px-2.5 py-1 rounded transition-colors ${
                        upiProvider === 'phonepe' ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      PhonePe
                    </button>
                    <button
                      onClick={() => setUpiProvider('paytm')}
                      className={`text-xs font-bold px-2.5 py-1 rounded transition-colors ${
                        upiProvider === 'paytm' ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      Paytm
                    </button>
                  </div>
                  <p className="text-[10px] text-indigo-600 mt-2 font-semibold animate-pulse">
                    Scan via {upiProvider.toUpperCase()} app to pay ₹{totalAmount}
                  </p>
                </div>
              )}

              {paymentMethod === 'Card' && (
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 mb-4 text-center">
                  <CreditCard className="h-8 w-8 text-slate-400 mx-auto mb-2 animate-bounce" />
                  <p className="text-xs text-slate-600 font-bold">Swipe / Tap Card on POS Terminal</p>
                  <p className="text-[10px] text-slate-400 mt-1">Connecting to Toast POS terminal #3...</p>
                </div>
              )}

              {paymentMethod === 'Cash' && (
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 mb-4 text-center">
                  <span className="text-2xl">💵</span>
                  <p className="text-xs text-slate-600 font-bold mt-1">Cash Register Collection</p>
                  <p className="text-[10px] text-slate-400 mt-1">Keep cash drawer unlocked</p>
                </div>
              )}

              {/* Submit Buttons */}
              {!paid ? (
                <button
                  onClick={processPayment}
                  disabled={isProcessing}
                  className="w-full rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white py-3 text-sm font-semibold shadow-sm transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      Verifying Payment...
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4" />
                      Complete Payment ₹{totalAmount}
                    </>
                  )}
                </button>
              ) : (
                <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-4 text-center">
                  <div className="h-8 w-8 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Check className="h-5 w-5" />
                  </div>
                  <h3 className="font-bold text-emerald-900 text-sm">Payment Successful</h3>
                  <p className="text-xs text-emerald-700 mt-0.5">Transaction INV-2026-0099 complete</p>
                  <button
                    onClick={() => setPaid(false)}
                    className="mt-3 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                  >
                    Start New Invoice
                  </button>
                </div>
              )}

            </div>
          </div>

        </div>
      )}

      {/* 2. TRANSACTION HISTORY TAB */}
      {activeTab === 'transactions' && (
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          
          {/* Table Header Filter Search */}
          <div className="border-b border-slate-100 p-4 bg-slate-50/70 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                placeholder="Search transactions, bills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 text-sm rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500 bg-white"
              />
            </div>
            <button className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 bg-white">
              <FileSpreadsheet className="h-3.5 w-3.5 text-slate-500" />
              Export CSV Ledger
            </button>
          </div>

          {/* Ledger Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-semibold text-slate-500 uppercase bg-slate-50/30">
                  <th className="px-6 py-3">Invoice No</th>
                  <th className="px-6 py-3">Source Table</th>
                  <th className="px-6 py-3">Customer</th>
                  <th className="px-6 py-3">Payment Method</th>
                  <th className="px-6 py-3">Tax Paid</th>
                  <th className="px-6 py-3">Amount</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900">{tx.invoiceNo}</td>
                    <td className="px-6 py-4 text-slate-700">{tx.table}</td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-800">{tx.guestName}</div>
                      <div className="text-[10px] text-slate-400">{tx.date}</div>
                    </td>
                    <td className="px-6 py-4 text-xs font-bold text-slate-600">{tx.method}</td>
                    <td className="px-6 py-4 text-slate-500">₹{tx.tax}</td>
                    <td className="px-6 py-4 font-extrabold text-slate-900">₹{tx.amount}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-bold ${
                        tx.status === 'SUCCEEDED'
                          ? 'bg-emerald-50 text-emerald-700'
                          : tx.status === 'PENDING'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-rose-50 text-rose-700'
                      }`}>
                        {tx.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {tx.status === 'SUCCEEDED' && (
                        <button
                          onClick={() => handleRefund(tx.id)}
                          className="text-xs font-bold text-rose-600 hover:text-rose-800"
                        >
                          Trigger Refund
                        </button>
                      )}
                      {tx.status === 'REFUNDED' && (
                        <span className="text-xs text-slate-400 italic">Refunded</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. TAX & GST CONFIG TAB */}
      {activeTab === 'tax-settings' && (
        <div className="max-w-3xl rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
            <Percent className="h-5 w-5 text-indigo-600" />
            Tax Rules & Service Charge Customizer
          </h2>
          <p className="text-sm text-slate-500 mb-6">
            Configure default Central GST (CGST), State GST (SGST), and standard service charge calculations applied on invoice generation.
          </p>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-600 uppercase block mb-1">Central GST (CGST %)</label>
                <input
                  type="number"
                  step="0.1"
                  value={taxSettings.cgst}
                  onChange={(e) => setTaxSettings(c => ({ ...c, cgst: Number(e.target.value) }))}
                  className="w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm focus:border-indigo-500 focus:outline-none bg-white font-semibold text-slate-800"
                />
              </div>
              
              <div>
                <label className="text-xs font-bold text-slate-600 uppercase block mb-1">State GST (SGST %)</label>
                <input
                  type="number"
                  step="0.1"
                  value={taxSettings.sgst}
                  onChange={(e) => setTaxSettings(c => ({ ...c, sgst: Number(e.target.value) }))}
                  className="w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm focus:border-indigo-500 focus:outline-none bg-white font-semibold text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-600 uppercase block mb-1">Service Charge (%)</label>
              <input
                type="number"
                step="0.5"
                value={taxSettings.serviceCharge}
                onChange={(e) => setTaxSettings(c => ({ ...c, serviceCharge: Number(e.target.value) }))}
                className="w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm focus:border-indigo-500 focus:outline-none bg-white font-semibold text-slate-800"
              />
            </div>

            <div className="flex items-center gap-2 py-2">
              <input
                type="checkbox"
                id="inclusive"
                checked={taxSettings.enableTaxInclusive}
                onChange={(e) => setTaxSettings(c => ({ ...c, enableTaxInclusive: e.target.checked }))}
                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor="inclusive" className="text-xs font-bold text-slate-700">
                Menu Item Pricing is inclusive of all taxes
              </label>
            </div>

            <button
              onClick={() => triggerToast('Tax configurations saved and synced with cloud servers!')}
              className="rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 text-sm font-semibold transition-colors duration-200"
            >
              Save Configuration
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

