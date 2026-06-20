'use client';

import { useState } from 'react';
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
  Sparkles
} from 'lucide-react';

interface CustomerProfile {
  id: string;
  name: string;
  phone: string;
  email: string;
  visits: number;
  totalSpent: number;
  loyaltyPoints: number;
  tier: 'VIP' | 'Regular' | 'New';
  joinDate: string;
  favoriteItem: string;
}

const initialCustomers: CustomerProfile[] = [
  { id: 'c1', name: 'Amit Kumar', phone: '9876543212', email: 'amit@gmail.com', visits: 24, totalSpent: 18400, loyaltyPoints: 840, tier: 'VIP', joinDate: '12 Jan 2024', favoriteItem: 'Paneer Butter Masala' },
  { id: 'c2', name: 'Rahul Verma', phone: '9876543210', email: 'rahul@gmail.com', visits: 12, totalSpent: 9200, loyaltyPoints: 460, tier: 'Regular', joinDate: '28 Feb 2024', favoriteItem: 'Veg Biryani' },
  { id: 'c3', name: 'Priya Singh', phone: '9876543211', email: 'priya@yahoo.com', visits: 18, totalSpent: 14600, loyaltyPoints: 730, tier: 'VIP', joinDate: '15 Jan 2024', favoriteItem: 'Masala Dosa' },
  { id: 'c4', name: 'Karan Patel', phone: '9876543213', email: 'karan@gmail.com', visits: 3, totalSpent: 2800, loyaltyPoints: 140, tier: 'New', joinDate: '01 May 2024', favoriteItem: 'Margherita Pizza' },
  { id: 'c5', name: 'Sneha Reddy', phone: '9876543215', email: 'sneha@outlook.com', visits: 8, totalSpent: 5900, loyaltyPoints: 295, tier: 'Regular', joinDate: '10 Mar 2024', favoriteItem: 'Veg Burger' },
];

export default function CustomersPage() {
  const [customers, setCustomers] = useState<CustomerProfile[]>(initialCustomers);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTier, setSelectedTier] = useState<string>('all');
  
  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showMsgModal, setShowMsgModal] = useState(false);
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [activeCustomer, setActiveCustomer] = useState<CustomerProfile | null>(null);

  // Form Fields
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [msgChannel, setMsgChannel] = useState<'whatsapp' | 'sms' | 'email'>('whatsapp');
  const [msgText, setMsgText] = useState('');
  const [couponCode, setCouponCode] = useState('FESTIVE20');
  const [pointsDelta, setPointsDelta] = useState(100);

  // Filtered List
  const filteredCustomers = customers.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.phone.includes(searchTerm);
    const matchesTier = selectedTier === 'all' || c.tier.toLowerCase() === selectedTier.toLowerCase();
    return matchesSearch && matchesTier;
  });

  const handleAddCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newPhone) return;

    const newCust: CustomerProfile = {
      id: `c${Date.now()}`,
      name: newName,
      phone: newPhone,
      email: newEmail || 'N/A',
      visits: 1,
      totalSpent: 0,
      loyaltyPoints: 50, // Welcome points
      tier: 'New',
      joinDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      favoriteItem: 'None yet'
    };

    setCustomers([newCust, ...customers]);
    setShowAddModal(false);
    setNewName('');
    setNewPhone('');
    setNewEmail('');
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCustomer) return;
    alert(`✉️ Message sent to ${activeCustomer.name} via ${msgChannel.toUpperCase()}:\n"${msgText}"`);
    setShowMsgModal(false);
    setMsgText('');
  };

  const handleAssignOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCustomer) return;

    setCustomers(current => 
      current.map(c => {
        if (c.id === activeCustomer.id) {
          return {
            ...c,
            loyaltyPoints: c.loyaltyPoints + Number(pointsDelta)
          };
        }
        return c;
      })
    );

    alert(`🎁 Offer assigned to ${activeCustomer.name}!\n- Coupon Code: ${couponCode}\n- Added ${pointsDelta} loyalty points.`);
    setShowGiftModal(false);
  };

  return (
    <div className="space-y-6 text-slate-900 bg-[#F8F9FF] p-1">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 flex items-center gap-2">
            Customers & Loyalty
          </h1>
          <p className="text-sm text-slate-500 font-bold mt-1">
            Build customer profiles, track visits log, assign discount offers, and trigger SMS/WhatsApp alerts.
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
              {customers.reduce((acc, c) => acc + c.loyaltyPoints, 0)} pts
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
              {customers.filter(c => c.tier === 'VIP').length} Gold Tiers
            </h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center flex-shrink-0">
            <Star size={20} className="fill-rose-500 text-rose-500" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Avg Customer Rating</p>
            <h3 className="text-xl font-black text-slate-900 mt-0.5">4.8 / 5.0 stars</h3>
          </div>
        </div>
      </div>

      {/* FILTER & TABLE PANEL */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4">
        {/* Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#4F46E5] text-xs font-bold text-slate-800"
            />
          </div>

          <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-200 w-fit gap-1">
            {['all', 'VIP', 'Regular', 'New'].map((t) => (
              <button
                key={t}
                onClick={() => setSelectedTier(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedTier === t
                    ? 'bg-[#4F46E5] text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-855'
                }`}
              >
                {t === 'all' ? 'All Tiers' : t}
              </button>
            ))}
          </div>
        </div>

        {/* Directory Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-5 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Customer</th>
                <th className="px-5 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Tier Tag</th>
                <th className="px-5 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Visits count</th>
                <th className="px-5 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Total spent</th>
                <th className="px-5 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Loyalty Points</th>
                <th className="px-5 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Favorite recipe</th>
                <th className="px-5 py-3 text-right text-xs font-bold text-slate-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((cust) => (
                  <tr key={cust.id} className="hover:bg-slate-50/50 transition">
                    <td className="px-5 py-4">
                      <div>
                        <p className="font-extrabold text-slate-900 text-xs">{cust.name}</p>
                        <p className="text-[10px] text-slate-400 font-bold mt-0.5">{cust.phone} · {cust.email}</p>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                        cust.tier === 'VIP' 
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : cust.tier === 'Regular'
                          ? 'bg-blue-100 text-blue-800 border border-blue-200'
                          : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}>
                        {cust.tier}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-xs font-bold text-slate-800">{cust.visits} visits</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-xs font-black text-slate-900">₹{cust.totalSpent}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-xs font-extrabold text-[#4F46E5]">{cust.loyaltyPoints} pts</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-xs font-bold text-slate-500">{cust.favoriteItem}</p>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex justify-end gap-1.5">
                        <button
                          onClick={() => { setActiveCustomer(cust); setShowMsgModal(true); }}
                          className="p-1.5 hover:bg-slate-100 rounded-lg text-indigo-600 transition"
                          title="Send Direct Notification"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => { setActiveCustomer(cust); setShowGiftModal(true); }}
                          className="p-1.5 hover:bg-slate-100 rounded-lg text-amber-505 transition"
                          title="Loyalty Points & Offers"
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
                    No customer profiles matched the search filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Customer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/55 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100">
            <h3 className="text-base font-black text-slate-900 mb-4">Add Customer Profile</h3>
            <form onSubmit={handleAddCustomer} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Customer Name</label>
                <input
                  type="text"
                  placeholder="Enter full name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4F46E5] text-xs font-bold"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Phone Number</label>
                <input
                  type="text"
                  placeholder="e.g. 9876543210"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4F46E5] text-xs font-bold"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Email Address (Optional)</label>
                <input
                  type="email"
                  placeholder="e.g. customer@gmail.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4F46E5] text-xs font-bold"
                />
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-[#4F46E5] hover:bg-[#4338CA] text-white py-2 rounded-xl text-xs font-bold transition-all active:scale-95"
                >
                  Create Profile
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 border border-slate-200 hover:bg-slate-50 text-slate-600 py-2 rounded-xl text-xs font-bold transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Send Message Modal */}
      {showMsgModal && activeCustomer && (
        <div className="fixed inset-0 bg-black/55 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-black text-slate-900">Notify Customer: {activeCustomer.name}</h3>
              <button onClick={() => setShowMsgModal(false)} className="p-1 hover:bg-slate-100 rounded-full">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            
            <form onSubmit={handleSendMessage} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Choose Channel</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['whatsapp', 'sms', 'email'] as const).map((channel) => (
                    <button
                      key={channel}
                      type="button"
                      onClick={() => setMsgChannel(channel)}
                      className={`py-2 border rounded-xl text-xs font-bold uppercase transition ${
                        msgChannel === channel
                          ? 'bg-[#4F46E5]/10 border-[#4F46E5] text-[#4F46E5]'
                          : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
                      }`}
                    >
                      {channel}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Message Content</label>
                <textarea
                  placeholder={`Write your promotional text or transactional update...`}
                  value={msgText}
                  onChange={(e) => setMsgText(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4F46E5] text-xs font-bold"
                  rows={4}
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#4F46E5] hover:bg-[#4338CA] text-white py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition active:scale-95"
              >
                <Send size={13} /> Send Notification
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Gift/Offer points Modal */}
      {showGiftModal && activeCustomer && (
        <div className="fixed inset-0 bg-black/55 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-black text-slate-900">Loyalty & Offers: {activeCustomer.name}</h3>
              <button onClick={() => setShowGiftModal(false)} className="p-1 hover:bg-slate-100 rounded-full">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            
            <form onSubmit={handleAssignOffer} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Assign Discount Coupon</label>
                <select
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4F46E5] text-xs font-bold text-slate-700"
                >
                  <option value="WELCOME10">WELCOME10 - Flat 10% Off</option>
                  <option value="FESTIVE20">FESTIVE20 - 20% Off Festival Special</option>
                  <option value="VIPPASS">VIPPASS - Flat ₹200 Off for Loyalists</option>
                  <option value="HAPPYHOUR">HAPPYHOUR - Buy 1 Get 1 Free Appetizers</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Grant Reward Points</label>
                <input
                  type="number"
                  placeholder="Points (e.g. 50, 100, 500)"
                  value={pointsDelta}
                  onChange={(e) => setPointsDelta(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4F46E5] text-xs font-bold"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#4F46E5] hover:bg-[#4338CA] text-white py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition active:scale-95"
              >
                <CheckCircle size={13} /> Update & Assign
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
