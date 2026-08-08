'use client';

import { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  MessageSquare, 
  Gift, 
  Award, 
  Star,
  Send,
  X,
  CheckCircle,
  Clock,
  Sparkles,
  ShoppingBag,
  Tag,
  FileText,
  Phone,
  Mail,
  MapPin,
  TrendingUp,
  RefreshCw,
  ChevronRight
} from 'lucide-react';
import { CustomerService, Customer, Customer360Data } from '../../../services/customer.service';

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSegment, setSelectedSegment] = useState<string>('all');
  
  // Modals & Drawers
  const [showAddModal, setShowAddModal] = useState(false);
  const [show360Drawer, setShow360Drawer] = useState(false);
  const [showPointsModal, setShowPointsModal] = useState(false);
  
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customer360, setCustomer360] = useState<Customer360Data | null>(null);
  const [loading360, setLoading360] = useState(false);

  // Form Fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  
  const [pointsAction, setPointsAction] = useState<'award' | 'redeem'>('award');
  const [pointsAmount, setPointsAmount] = useState(100);
  const [reasonCode, setReasonCode] = useState('PROMOTION');
  
  const [newNoteContent, setNewNoteContent] = useState('');

  const loadCustomers = async () => {
    setLoading(true);
    try {
      const res = await CustomerService.listCustomers({
        search: searchTerm || undefined,
        segment: selectedSegment !== 'all' ? selectedSegment : undefined,
      });
      setCustomers(res.items || []);
    } catch (err) {
      console.error('Failed to load customers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, [selectedSegment]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadCustomers();
  };

  const openCustomer360 = async (cust: Customer) => {
    setSelectedCustomer(cust);
    setShow360Drawer(true);
    setLoading360(true);
    try {
      const data = await CustomerService.getCustomer360(cust.id);
      setCustomer360(data);
    } catch (err) {
      console.error('Failed to fetch Customer 360:', err);
    } finally {
      setLoading360(false);
    }
  };

  const handleAddCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName) return;

    try {
      await CustomerService.createCustomer({
        firstName,
        lastName,
        email,
        phone,
      });
      setShowAddModal(false);
      setFirstName('');
      setLastName('');
      setEmail('');
      setPhone('');
      loadCustomers();
    } catch (err: any) {
      alert(`Error creating customer: ${err.message}`);
    }
  };

  const handlePointsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer) return;

    try {
      if (pointsAction === 'award') {
        await CustomerService.awardLoyaltyPoints(selectedCustomer.id, pointsAmount, reasonCode);
      } else {
        await CustomerService.redeemLoyaltyPoints(selectedCustomer.id, pointsAmount, reasonCode);
      }
      setShowPointsModal(false);
      loadCustomers();
      if (show360Drawer) {
        openCustomer360(selectedCustomer);
      }
    } catch (err: any) {
      alert(`Loyalty points operation failed: ${err.message}`);
    }
  };

  const handleRedeemReward = async (rewardId: string) => {
    if (!selectedCustomer) return;
    try {
      await CustomerService.redeemReward(selectedCustomer.id, rewardId);
      alert('Reward redeemed successfully! Coupon code generated.');
      openCustomer360(selectedCustomer);
      loadCustomers();
    } catch (err: any) {
      alert(`Reward redemption failed: ${err.message}`);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer || !newNoteContent.trim()) return;

    try {
      await CustomerService.addNote(selectedCustomer.id, newNoteContent);
      setNewNoteContent('');
      openCustomer360(selectedCustomer);
    } catch (err: any) {
      alert(`Failed to add note: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6 text-slate-900 bg-[#F8F9FF] p-4 min-h-screen">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 flex items-center gap-2">
            Customer CRM & Loyalty Engine
          </h1>
          <p className="text-sm text-slate-500 font-bold mt-1">
            Enterprise Customer 360 profile, real-time loyalty ledger, tier progression & dynamic rewards.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-[#4F46E5] hover:bg-[#4338CA] text-white px-5 py-3 rounded-xl text-sm font-bold flex items-center gap-2 active:scale-95 transition-all shadow-md shadow-indigo-600/10"
        >
          <Plus className="w-5 h-5" />
          Add Customer Profile
        </button>
      </div>

      {/* KPI ROW */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-[#4F46E5] flex items-center justify-center flex-shrink-0">
            <Users size={20} />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Total Members</p>
            <h3 className="text-xl font-black text-slate-900 mt-0.5">{customers.length} Profiles</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center flex-shrink-0">
            <Award size={20} />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Total Loyalty Points</p>
            <h3 className="text-xl font-black text-slate-900 mt-0.5">
              {customers.reduce((acc, c) => acc + (c.pointsTotal || 0), 0)} pts
            </h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center flex-shrink-0">
            <Sparkles size={20} />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider">VIP Customers</p>
            <h3 className="text-xl font-black text-slate-900 mt-0.5">
              {customers.filter(c => c.segment === 'VIP' || c.tier === 'GOLD' || c.tier === 'PLATINUM').length} VIPs
            </h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
            <TrendingUp size={20} />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Total Revenue</p>
            <h3 className="text-xl font-black text-slate-900 mt-0.5">
              ₹{customers.reduce((acc, c) => acc + (c.totalSpending || 0), 0).toLocaleString()}
            </h3>
          </div>
        </div>
      </div>

      {/* FILTER & TABLE PANEL */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4">
        {/* Filters */}
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, phone, code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#4F46E5] text-xs font-bold text-slate-800"
            />
          </div>

          <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-200 w-fit gap-1 overflow-x-auto">
            {['all', 'VIP', 'HIGH_VALUE', 'FREQUENT_BUYER', 'RETURNING', 'NEW', 'AT_RISK'].map((seg) => (
              <button
                key={seg}
                type="button"
                onClick={() => setSelectedSegment(seg)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all whitespace-nowrap ${
                  selectedSegment === seg
                    ? 'bg-[#4F46E5] text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {seg === 'all' ? 'All Segments' : seg.replace('_', ' ')}
              </button>
            ))}
          </div>
        </form>

        {/* Directory Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-5 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Customer</th>
                <th className="px-5 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Segment / Tier</th>
                <th className="px-5 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Visits</th>
                <th className="px-5 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Total Spent</th>
                <th className="px-5 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Loyalty Points</th>
                <th className="px-5 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-5 py-3 text-right text-xs font-bold text-slate-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-slate-400 font-bold text-xs">
                    Loading customer profiles from PostgreSQL...
                  </td>
                </tr>
              ) : customers.length > 0 ? (
                customers.map((cust) => (
                  <tr key={cust.id} className="hover:bg-indigo-50/20 transition cursor-pointer" onClick={() => openCustomer360(cust)}>
                    <td className="px-5 py-4">
                      <div>
                        <p className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
                          {cust.name}
                          <span className="text-[9px] text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded font-bold">{cust.customerCode}</span>
                        </p>
                        <p className="text-[10px] text-slate-400 font-bold mt-0.5">{cust.phone || 'No phone'} · {cust.email || 'No email'}</p>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-col gap-1 items-start">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                          cust.segment === 'VIP' ? 'bg-amber-100 text-amber-800' :
                          cust.segment === 'HIGH_VALUE' ? 'bg-purple-100 text-purple-800' :
                          cust.segment === 'FREQUENT_BUYER' ? 'bg-indigo-100 text-indigo-800' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {cust.segment}
                        </span>
                        <span className="text-[10px] font-extrabold text-slate-500">Tier: {cust.tier}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-xs font-bold text-slate-800">{cust.ordersCount} visits</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-xs font-black text-slate-900">₹{cust.totalSpending}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-xs font-extrabold text-[#4F46E5]">{cust.pointsTotal} pts</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700">
                        {cust.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex justify-end gap-1.5">
                        <button
                          onClick={() => openCustomer360(cust)}
                          className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-lg text-xs font-bold transition flex items-center gap-1"
                        >
                          Customer 360 <ChevronRight size={12} />
                        </button>
                        <button
                          onClick={() => { setSelectedCustomer(cust); setShowPointsModal(true); }}
                          className="p-1.5 hover:bg-amber-50 rounded-lg text-amber-600 transition"
                          title="Manage Points"
                        >
                          <Gift className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-slate-400 font-bold text-xs">
                    No customer profiles matched the search query.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer 360 Drawer */}
      {show360Drawer && selectedCustomer && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-end z-50 overflow-hidden">
          <div className="bg-white w-full max-w-2xl h-full shadow-2xl flex flex-col overflow-y-auto">
            {/* Drawer Header */}
            <div className="p-6 border-b border-slate-100 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-black">{selectedCustomer.name}</h2>
                  <span className="bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-[10px] font-bold px-2 py-0.5 rounded">
                    {selectedCustomer.customerCode}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1 flex items-center gap-3">
                  <span>{selectedCustomer.phone || 'No phone'}</span>
                  <span>•</span>
                  <span>{selectedCustomer.email || 'No email'}</span>
                </p>
              </div>
              <button onClick={() => setShow360Drawer(false)} className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            {loading360 ? (
              <div className="p-12 text-center text-slate-400 font-bold text-sm">
                Fetching Customer 360 view from PostgreSQL...
              </div>
            ) : customer360 ? (
              <div className="p-6 space-y-6 flex-1">
                {/* Metrics Bar */}
                <div className="grid grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Total Spent</p>
                    <p className="text-sm font-black text-slate-900">₹{customer360.metrics.totalSpending}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Total Visits</p>
                    <p className="text-sm font-black text-slate-900">{customer360.metrics.totalVisits}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Loyalty Tier</p>
                    <p className="text-sm font-black text-indigo-600">{customer360.loyaltySummary.tier}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Points Balance</p>
                    <p className="text-sm font-black text-amber-500">{customer360.loyaltySummary.pointsTotal} pts</p>
                  </div>
                </div>

                {/* Loyalty Ledger Section */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black uppercase text-slate-700 tracking-wider flex items-center gap-1.5">
                      <Award size={14} className="text-indigo-600" /> Loyalty Points Ledger
                    </h3>
                    <button
                      onClick={() => setShowPointsModal(true)}
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-700 underline"
                    >
                      + Award / Redeem Points
                    </button>
                  </div>
                  <div className="space-y-2 max-h-36 overflow-y-auto">
                    {customer360.loyaltySummary.ledger.length > 0 ? (
                      customer360.loyaltySummary.ledger.map((entry: any) => (
                        <div key={entry.id} className="flex items-center justify-between text-xs py-1.5 border-b border-slate-100">
                          <div>
                            <span className="font-bold text-slate-800">{entry.reasonCode}</span>
                            <p className="text-[10px] text-slate-400">{new Date(entry.createdAt).toLocaleString()}</p>
                          </div>
                          <span className={`font-black ${entry.points > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {entry.points > 0 ? `+${entry.points}` : entry.points} pts
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-400 italic">No points history yet.</p>
                    )}
                  </div>
                </div>

                {/* Rewards & Offers Section */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3">
                    <h3 className="text-xs font-black uppercase text-slate-700 tracking-wider flex items-center gap-1.5">
                      <Gift size={14} className="text-amber-500" /> Available Rewards
                    </h3>
                    <div className="space-y-2">
                      {customer360.rewards.available.length > 0 ? (
                        customer360.rewards.available.map((r: any) => (
                          <div key={r.id} className="p-2 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                            <div>
                              <p className="font-bold text-slate-900">{r.name}</p>
                              <p className="text-[10px] text-slate-500">{r.pointsCost} points required</p>
                            </div>
                            <button
                              onClick={() => handleRedeemReward(r.id)}
                              className="px-2 py-1 bg-amber-500 text-white font-bold text-[10px] rounded hover:bg-amber-600"
                            >
                              Redeem
                            </button>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-slate-400 italic">No tenant rewards configured.</p>
                      )}
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3">
                    <h3 className="text-xs font-black uppercase text-slate-700 tracking-wider flex items-center gap-1.5">
                      <Tag size={14} className="text-purple-600" /> Applicable Offers
                    </h3>
                    <div className="space-y-2">
                      {customer360.offers.length > 0 ? (
                        customer360.offers.map((o: any) => (
                          <div key={o.id} className="p-2 bg-purple-50 rounded-xl border border-purple-100 text-xs">
                            <p className="font-bold text-purple-900">{o.title} ({o.code})</p>
                            <p className="text-[10px] text-purple-600">Discount: {o.discountValue}{o.discountType === 'PERCENTAGE' ? '%' : ' ₹'}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-slate-400 italic">No offers active for customer tier.</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Customer Notes & Timeline */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3">
                  <h3 className="text-xs font-black uppercase text-slate-700 tracking-wider flex items-center gap-1.5">
                    <FileText size={14} className="text-slate-600" /> Customer Notes & Timeline
                  </h3>
                  <form onSubmit={handleAddNote} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add customer note..."
                      value={newNoteContent}
                      onChange={(e) => setNewNoteContent(e.target.value)}
                      className="flex-1 px-3 py-1.5 border border-slate-200 rounded-xl text-xs font-bold"
                    />
                    <button type="submit" className="px-3 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-bold">
                      Add Note
                    </button>
                  </form>

                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {customer360.customerDetails.notes.map((note: any) => (
                      <div key={note.id} className="p-2 bg-slate-50 rounded-xl text-xs border border-slate-100">
                        <p className="text-slate-800 font-medium">{note.content}</p>
                        <p className="text-[9px] text-slate-400 mt-0.5">{new Date(note.createdAt).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* Add Customer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/55 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100">
            <h3 className="text-base font-black text-slate-900 mb-4">Add Customer Profile</h3>
            <form onSubmit={handleAddCustomer} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">First Name</label>
                <input
                  type="text"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Last Name</label>
                <input
                  type="text"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Phone Number</label>
                <input
                  type="text"
                  placeholder="Mobile Phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Email Address</label>
                <input
                  type="email"
                  placeholder="Primary Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold"
                />
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-[#4F46E5] hover:bg-[#4338CA] text-white py-2 rounded-xl text-xs font-bold"
                >
                  Save Profile
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 border border-slate-200 text-slate-600 py-2 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Points Manage Modal */}
      {showPointsModal && selectedCustomer && (
        <div className="fixed inset-0 bg-black/55 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100">
            <h3 className="text-base font-black text-slate-900 mb-4">Manage Points: {selectedCustomer.name}</h3>
            <form onSubmit={handlePointsSubmit} className="space-y-4">
              <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => setPointsAction('award')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg ${pointsAction === 'award' ? 'bg-[#4F46E5] text-white' : 'text-slate-600'}`}
                >
                  Award Points
                </button>
                <button
                  type="button"
                  onClick={() => setPointsAction('redeem')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg ${pointsAction === 'redeem' ? 'bg-rose-600 text-white' : 'text-slate-600'}`}
                >
                  Redeem Points
                </button>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Points Quantity</label>
                <input
                  type="number"
                  placeholder="Points"
                  value={pointsAmount}
                  onChange={(e) => setPointsAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Reason Code</label>
                <input
                  type="text"
                  placeholder="e.g. FESTIVE_BONUS, REDEMPTION_COUPON"
                  value={reasonCode}
                  onChange={(e) => setReasonCode(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold"
                  required
                />
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="submit"
                  className={`flex-1 text-white py-2 rounded-xl text-xs font-bold ${pointsAction === 'award' ? 'bg-[#4F46E5]' : 'bg-rose-600'}`}
                >
                  Submit {pointsAction === 'award' ? 'Credit' : 'Deduction'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowPointsModal(false)}
                  className="flex-1 border border-slate-200 text-slate-600 py-2 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
