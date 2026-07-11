'use client';

import { useState } from 'react';
import {
  TrendingUp,
  Percent,
  Users,
  Award,
  Sparkles,
  BarChart3,
  Search,
  Plus,
  Play,
  Pause,
  ArrowRight,
  UserCheck,
  MapPin,
  RefreshCw,
  Gift,
  Heart,
  MessageSquare,
  DollarSign,
  ChevronRight,
  ShieldCheck,
  CheckCircle,
  Eye,
  Settings,
  AlertTriangle
} from 'lucide-react';

interface CampaignItem {
  id: string;
  name: string;
  type: 'Email' | 'SMS' | 'Push Notification';
  status: 'Active' | 'Draft' | 'Completed';
  audience: string;
  reach: number;
  clickRate: string;
}

interface CouponItem {
  code: string;
  discount: string;
  status: 'Active' | 'Expired';
  uses: number;
  expiry: string;
}

const INITIAL_CAMPAIGNS: CampaignItem[] = [
  { id: 'C-01', name: 'Weekend Pizza Feast Discount', type: 'Email', status: 'Active', audience: 'Gold Members', reach: 840, clickRate: '18.4%' },
  { id: 'C-02', name: 'Loyalty points welcome bonus sms', type: 'SMS', status: 'Active', audience: 'New Registrations', reach: 350, clickRate: '12.2%' },
  { id: 'C-03', name: 'Re-engage slipping dinners', type: 'Push Notification', status: 'Draft', audience: 'Inactive 30+ Days', reach: 120, clickRate: '0.0%' }
];

const INITIAL_COUPONS: CouponItem[] = [
  { code: 'WELCOME10', discount: '10% OFF', status: 'Active', uses: 142, expiry: '31 Aug 2026' },
  { code: 'SUMMER20', discount: '₹200 OFF on orders > ₹1000', status: 'Active', uses: 89, expiry: '15 Sep 2026' },
  { code: 'WEEKEND50', discount: '50% OFF up to ₹150', status: 'Expired', uses: 450, expiry: '01 Jul 2026' }
];

export default function BusinessGrowthPlatform() {
  const [activeTab, setActiveTab] = useState<'kpis' | 'marketing' | 'loyalty' | 'coupons' | 'segments' | 'reviews'>('kpis');
  
  // Marketing & Campaigns states
  const [campaigns, setCampaigns] = useState<CampaignItem[]>(INITIAL_CAMPAIGNS);
  const [newCampaignName, setNewCampaignName] = useState('');
  const [newCampaignType, setNewCampaignType] = useState<'Email' | 'SMS' | 'Push Notification'>('Email');

  // Coupon states
  const [coupons, setCoupons] = useState<CouponItem[]>(INITIAL_COUPONS);
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponDiscount, setNewCouponDiscount] = useState('');

  // Loyalty Settings
  const [pointsPerRupee, setPointsPerRupee] = useState(0.1);
  const [welcomeBonus, setWelcomeBonus] = useState(100);
  const [referralBonus, setReferralBonus] = useState(150);

  // Growth Score breakdown
  const growthScore = 88;

  const handleToggleCampaignStatus = (campaignId: string) => {
    setCampaigns(prev =>
      prev.map(c => {
        if (c.id !== campaignId) return c;
        const nextStatus = c.status === 'Active' ? 'Draft' : 'Active';
        return { ...c, status: nextStatus };
      })
    );
  };

  const handleCreateCampaign = () => {
    if (!newCampaignName.trim()) return;
    const id = `C-0${campaigns.length + 1}`;
    const newCamp: CampaignItem = {
      id,
      name: newCampaignName,
      type: newCampaignType,
      status: 'Draft',
      audience: 'All Registered Customers',
      reach: 0,
      clickRate: '0.0%'
    };
    setCampaigns([...campaigns, newCamp]);
    setNewCampaignName('');
  };

  const handleToggleCouponStatus = (code: string) => {
    setCoupons(prev =>
      prev.map(c => {
        if (c.code !== code) return c;
        const nextStatus = c.status === 'Active' ? 'Expired' : 'Active';
        return { ...c, status: nextStatus };
      })
    );
  };

  const handleCreateCoupon = () => {
    if (!newCouponCode.trim() || !newCouponDiscount.trim()) return;
    const newC: CouponItem = {
      code: newCouponCode.toUpperCase().replace(/\s+/g, ''),
      discount: newCouponDiscount,
      status: 'Active',
      uses: 0,
      expiry: '31 Dec 2026'
    };
    setCoupons([...coupons, newC]);
    setNewCouponCode('');
    setNewCouponDiscount('');
  };

  return (
    <div className="space-y-6 text-left max-w-7xl mx-auto select-none">
      
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-650">
              <TrendingUp className="w-4 h-4" />
            </span>
            <span className="text-[10px] font-black uppercase text-indigo-650 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded-full">
              Growth Hub Engine
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-850 dark:text-slate-100 tracking-tight">
            Business Growth Platform
          </h1>
          <p className="text-xs text-slate-450 leading-relaxed max-w-xl">
            Increase customer retention rate, construct targeted SMS/email marketing templates, configure discount codes, and optimize customer lifetime value indicators.
          </p>
        </div>

        {/* Global Growth Metric */}
        <div className="p-4 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 dark:from-indigo-950/20 dark:to-purple-950/10 border border-indigo-150/20 rounded-2xl flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center font-black text-white text-sm">
            {growthScore}
          </div>
          <div>
            <p className="text-[9px] font-black text-indigo-600 uppercase tracking-wider">Ecosystem Growth Score</p>
            <h4 className="text-xs font-black text-slate-800 dark:text-slate-200 mt-0.5">🟢 Strong Performance</h4>
          </div>
        </div>
      </div>

      {/* Tabs list */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none border-b border-slate-100 dark:border-slate-800/40">
        {[
          { id: 'kpis', label: 'Growth Hub & KPIs', icon: BarChart3 },
          { id: 'marketing', label: 'Campaign Manager', icon: Sparkles },
          { id: 'loyalty', label: 'Loyalty Center', icon: Gift },
          { id: 'coupons', label: 'Coupon & Promo Codes', icon: Percent },
          { id: 'segments', label: 'Customer Segments', icon: Users },
          { id: 'reviews', label: 'Reviews & Feedback', icon: MessageSquare }
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

      {/* Tab Panels */}
      <div className="space-y-6">
        
        {/* PANEL 1: KPIs & GOALS */}
        {activeTab === 'kpis' && (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
            
            {/* Sales Targets vs Actuals */}
            <div className="bg-white dark:bg-[#11131c] border border-slate-200/50 dark:border-slate-800/40 rounded-3xl p-5 shadow-xs col-span-2">
              <h3 className="text-sm font-black text-slate-800 dark:text-slate-100 pb-3 border-b border-slate-50 dark:border-slate-850/20 mb-4">
                Monthly Revenue Goals
              </h3>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-500 mb-1">
                    <span>Target Sales Volume (₹)</span>
                    <span>₹1,50,000 / ₹2,00,000</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-indigo-650 h-2.5 rounded-full" style={{ width: '75%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-500 mb-1">
                    <span>New Customer Acquisition</span>
                    <span>420 / 500 signups</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-2.5 rounded-full" style={{ width: '84%' }} />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 pt-3">
                  <div className="p-3 bg-slate-50 dark:bg-slate-850/30 rounded-2xl text-center border border-slate-100 dark:border-slate-850/20">
                    <span className="text-[9px] font-black text-slate-400 uppercase">Retention Rate</span>
                    <h4 className="text-sm font-black text-slate-800 dark:text-slate-100 mt-1">78.5%</h4>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-850/30 rounded-2xl text-center border border-slate-100 dark:border-slate-850/20">
                    <span className="text-[9px] font-black text-slate-400 uppercase">Lifetime Value</span>
                    <h4 className="text-sm font-black text-slate-800 dark:text-slate-100 mt-1">₹4,250</h4>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-850/30 rounded-2xl text-center border border-slate-100 dark:border-slate-850/20">
                    <span className="text-[9px] font-black text-slate-400 uppercase">Avg Rating</span>
                    <h4 className="text-sm font-black text-slate-800 dark:text-slate-100 mt-1">4.8 ★</h4>
                  </div>
                </div>
              </div>
            </div>

            {/* Growth Score breakdown */}
            <div className="bg-white dark:bg-[#11131c] border border-slate-200/50 dark:border-slate-800/40 rounded-3xl p-5 shadow-xs">
              <h3 className="text-sm font-black text-slate-800 dark:text-slate-100 pb-3 border-b border-slate-50 dark:border-slate-850/20 mb-4">
                Growth Score Breakdown
              </h3>
              <div className="space-y-3.5 text-xs text-slate-550">
                <div className="flex justify-between items-center">
                  <span>Loyalty program setup</span>
                  <span className="text-emerald-500 font-extrabold flex items-center gap-0.5">
                    <CheckCircle size={12} /> Complete
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Active campaign count</span>
                  <span className="text-emerald-500 font-extrabold flex items-center gap-0.5">
                    <CheckCircle size={12} /> 2 campaigns
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Reviews response check</span>
                  <span className="text-rose-500 font-extrabold flex items-center gap-0.5">
                    <AlertTriangle size={12} /> Pending (2 reviews)
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Referral system rules</span>
                  <span className="text-emerald-500 font-extrabold flex items-center gap-0.5">
                    <CheckCircle size={12} /> Active
                  </span>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* PANEL 2: MARKETING CAMPAIGNS */}
        {activeTab === 'marketing' && (
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
            
            {/* Campaigns list */}
            <div className="bg-white dark:bg-[#11131c] border border-slate-200/50 dark:border-slate-800/40 rounded-3xl p-5 shadow-xs lg:col-span-2">
              <h3 className="text-sm font-black text-slate-800 dark:text-slate-100 pb-3 border-b border-slate-50 dark:border-slate-850/20 mb-4">
                Active Campaigns
              </h3>

              <div className="space-y-3">
                {campaigns.map((camp) => (
                  <div
                    key={camp.id}
                    className="p-4 border border-slate-100 dark:border-slate-850/30 rounded-2xl flex justify-between items-center gap-4 hover:bg-slate-50/20 dark:hover:bg-slate-900/10 transition text-left"
                  >
                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-slate-800 dark:text-slate-150">{camp.name}</span>
                        <span className="text-[8px] font-black uppercase text-indigo-650 bg-indigo-50 dark:bg-indigo-950 px-1.5 py-0.5 rounded">
                          {camp.type}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-405 font-bold">Audience: {camp.audience} | Reach: {camp.reach} users</p>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      <div>
                        <p className="text-[8px] text-slate-400 font-bold text-right uppercase">Click rate</p>
                        <span className="text-xs font-black text-slate-700 dark:text-slate-300 mt-0.5 block">{camp.clickRate}</span>
                      </div>
                      <button
                        onClick={() => handleToggleCampaignStatus(camp.id)}
                        className={`p-1.5 border rounded-lg text-xs transition active:scale-95 cursor-pointer ${
                          camp.status === 'Active'
                            ? 'bg-emerald-50 hover:bg-emerald-100 border-emerald-150 text-emerald-700'
                            : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-500'
                        }`}
                      >
                        {camp.status === 'Active' ? <Play size={12} className="fill-current" /> : <Pause size={12} />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Campaign Creator form */}
            <div className="bg-white dark:bg-[#11131c] border border-slate-200/50 dark:border-slate-800/40 rounded-3xl p-5 shadow-xs h-fit text-left">
              <h3 className="text-sm font-black text-slate-800 dark:text-slate-100 pb-3 border-b border-slate-50 dark:border-slate-850/20 mb-4">
                Launch New Campaign
              </h3>
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase">Campaign Title</label>
                  <input
                    type="text"
                    value={newCampaignName}
                    onChange={(e) => setNewCampaignName(e.target.value)}
                    placeholder="e.g. Welcome Discount"
                    className="w-full px-3 py-1.5 border border-slate-200 dark:border-slate-800 rounded-xl text-xs bg-transparent outline-none text-slate-700 dark:text-slate-300 focus:ring-1 focus:ring-indigo-500/25"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase">Campaign Channel</label>
                  <select
                    value={newCampaignType}
                    onChange={(e) => setNewCampaignType(e.target.value as any)}
                    className="w-full px-3 py-1.5 border border-slate-200 dark:border-slate-800 rounded-xl text-xs bg-transparent outline-none font-bold text-slate-650"
                  >
                    <option value="Email">Email Channel</option>
                    <option value="SMS">SMS Gateway</option>
                    <option value="Push Notification">Push App Banner</option>
                  </select>
                </div>

                <button
                  onClick={handleCreateCampaign}
                  className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-900 text-xs font-black rounded-xl transition active:scale-95 cursor-pointer"
                >
                  Create Campaign
                </button>
              </div>
            </div>

          </div>
        )}

        {/* PANEL 3: LOYALTY RULES */}
        {activeTab === 'loyalty' && (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
            
            {/* Loyalty points multiplier */}
            <div className="bg-white dark:bg-[#11131c] border border-slate-200/50 dark:border-slate-800/40 rounded-3xl p-5 shadow-xs space-y-4 text-left">
              <h3 className="text-sm font-black text-slate-800 dark:text-slate-100 pb-3 border-b border-slate-50 dark:border-slate-850/20 mb-4">
                Loyalty Reward Rules
              </h3>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase">Points Earned per Rupee Spent</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="number"
                    value={pointsPerRupee}
                    onChange={(e) => setPointsPerRupee(parseFloat(e.target.value) || 0)}
                    step="0.05"
                    className="flex-1 px-3 py-1.5 border border-slate-200 dark:border-slate-800 rounded-xl text-xs bg-transparent outline-none text-slate-700 dark:text-slate-300"
                  />
                  <span className="text-xs text-slate-450">pts</span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase">Welcome Signup Bonus</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="number"
                    value={welcomeBonus}
                    onChange={(e) => setWelcomeBonus(parseInt(e.target.value) || 0)}
                    className="flex-1 px-3 py-1.5 border border-slate-200 dark:border-slate-800 rounded-xl text-xs bg-transparent outline-none text-slate-700 dark:text-slate-300"
                  />
                  <span className="text-xs text-slate-450">pts</span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase">Referral Invitation Bonus</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="number"
                    value={referralBonus}
                    onChange={(e) => setReferralBonus(parseInt(e.target.value) || 0)}
                    className="flex-1 px-3 py-1.5 border border-slate-200 dark:border-slate-800 rounded-xl text-xs bg-transparent outline-none text-slate-700 dark:text-slate-300"
                  />
                  <span className="text-xs text-slate-450">pts</span>
                </div>
              </div>

              <button className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black rounded-xl transition active:scale-95 cursor-pointer">
                Save Loyalty Settings
              </button>
            </div>

            {/* Program Tiers */}
            <div className="bg-white dark:bg-[#11131c] border border-slate-200/50 dark:border-slate-800/40 rounded-3xl p-5 shadow-xs md:col-span-2 text-left">
              <h3 className="text-sm font-black text-slate-800 dark:text-slate-100 pb-3 border-b border-slate-50 dark:border-slate-850/20 mb-4">
                Membership Tiers Overview
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { name: 'Bronze Standard', threshold: '0 pts required', multiplier: '1.0x earning rate', color: 'border-amber-700/30' },
                  { name: 'Silver Premium', threshold: '1,000 pts required', multiplier: '1.2x earning rate', color: 'border-slate-300' },
                  { name: 'Gold VIP Member', threshold: '3,000 pts required', multiplier: '1.5x earning rate', color: 'border-yellow-500/50' }
                ].map((tier, idx) => (
                  <div key={idx} className={`p-4 border rounded-2xl space-y-1.5 ${tier.color} bg-slate-50/25 dark:bg-slate-905/10`}>
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider">{tier.threshold}</span>
                    <h4 className="text-xs font-black text-slate-800 dark:text-slate-150">{tier.name}</h4>
                    <p className="text-[10px] text-indigo-650 font-bold">{tier.multiplier}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* PANEL 4: COUPON ENGINE */}
        {activeTab === 'coupons' && (
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
            
            {/* Promo Codes list */}
            <div className="bg-white dark:bg-[#11131c] border border-slate-200/50 dark:border-slate-800/40 rounded-3xl p-5 shadow-xs lg:col-span-2">
              <h3 className="text-sm font-black text-slate-800 dark:text-slate-100 pb-3 border-b border-slate-50 dark:border-slate-850/20 mb-4">
                Coupon Catalog
              </h3>

              <div className="space-y-3">
                {coupons.map((c) => (
                  <div
                    key={c.code}
                    className="p-4 border border-slate-100 dark:border-slate-850/30 rounded-2xl flex justify-between items-center gap-4 hover:bg-slate-50/20 dark:hover:bg-slate-900/10 transition text-left"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 font-mono text-xs font-black bg-slate-105 border border-slate-200 dark:bg-slate-800 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded">
                          {c.code}
                        </span>
                        <span className="text-[10px] font-bold text-indigo-600">{c.discount}</span>
                      </div>
                      <p className="text-[10px] text-slate-400">Uses: {c.uses} times | Expiry: {c.expiry}</p>
                    </div>

                    <button
                      onClick={() => handleToggleCouponStatus(c.code)}
                      className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase transition active:scale-95 cursor-pointer ${
                        c.status === 'Active'
                          ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-150'
                          : 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-150'
                      }`}
                    >
                      {c.status}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Create Promo Code form */}
            <div className="bg-white dark:bg-[#11131c] border border-slate-200/50 dark:border-slate-800/40 rounded-3xl p-5 shadow-xs h-fit text-left">
              <h3 className="text-sm font-black text-slate-800 dark:text-slate-100 pb-3 border-b border-slate-50 dark:border-slate-850/20 mb-4">
                Add Coupon Code
              </h3>
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase">Promo Code</label>
                  <input
                    type="text"
                    value={newCouponCode}
                    onChange={(e) => setNewCouponCode(e.target.value)}
                    placeholder="e.g. RETENTION25"
                    className="w-full px-3 py-1.5 border border-slate-200 dark:border-slate-800 rounded-xl text-xs bg-transparent outline-none text-slate-700 dark:text-slate-300 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase">Discount Override</label>
                  <input
                    type="text"
                    value={newCouponDiscount}
                    onChange={(e) => setNewCouponDiscount(e.target.value)}
                    placeholder="e.g. 25% OFF / ₹150 OFF"
                    className="w-full px-3 py-1.5 border border-slate-200 dark:border-slate-800 rounded-xl text-xs bg-transparent outline-none text-slate-700 dark:text-slate-300"
                  />
                </div>

                <button
                  onClick={handleCreateCoupon}
                  className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-900 text-xs font-black rounded-xl transition active:scale-95 cursor-pointer"
                >
                  Create Coupon
                </button>
              </div>
            </div>

          </div>
        )}

        {/* PANEL 5: CUSTOMER SEGMENTS */}
        {activeTab === 'segments' && (
          <div className="bg-white dark:bg-[#11131c] border border-slate-200/50 dark:border-slate-800/40 rounded-3xl p-5 shadow-xs text-left">
            <h3 className="text-sm font-black text-slate-800 dark:text-slate-100 pb-3 border-b border-slate-50 dark:border-slate-850/20 mb-4">
              Active Targeted Customer Cohorts
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                { name: 'Slipping Customers', count: '142 users', description: 'Haven\'t placed order in 30+ days. Targeted with SMS.', color: 'border-l-rose-500' },
                { name: 'Gold Tier VIPs', count: '89 users', description: 'Spent > ₹5,000 this month. Invited to exclusive weekend tables.', color: 'border-l-yellow-500' },
                { name: 'Dine-in loyalist', count: '240 users', description: 'Visits more than twice a week. Sent welcome coupon codes.', color: 'border-l-indigo-500' }
              ].map((seg, idx) => (
                <div key={idx} className={`p-4 border border-slate-105 border-l-4 rounded-2xl dark:border-slate-800/40 space-y-1.5 ${seg.color}`}>
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider">{seg.count}</span>
                  <h4 className="text-xs font-black text-slate-800 dark:text-slate-150">{seg.name}</h4>
                  <p className="text-[10px] text-slate-450 leading-relaxed">{seg.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PANEL 6: REVIEWS & FEEDBACK */}
        {activeTab === 'reviews' && (
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
            
            {/* Reviews list */}
            <div className="bg-white dark:bg-[#11131c] border border-slate-200/50 dark:border-slate-800/40 rounded-3xl p-5 shadow-xs lg:col-span-2 text-left">
              <h3 className="text-sm font-black text-slate-800 dark:text-slate-100 pb-3 border-b border-slate-50 dark:border-slate-850/20 mb-4">
                Recent Reviews Feed
              </h3>

              <div className="space-y-4">
                {[
                  { guest: 'Arjun Sharma', rating: '★★★★★ 5.0', comment: 'Loved the Margherita Pizza! Crust was super crispy. Best restaurant operations and printer billing setup is incredibly fast.', date: 'Today' },
                  { guest: 'Sarah Jenkins', rating: '★★★★☆ 4.0', comment: 'Fast QR table order codes experience, but the paneer butter masala took 15 mins to reach the table. Service is clean.', date: 'Yesterday' }
                ].map((rev, idx) => (
                  <div key={idx} className="p-4 bg-slate-50/40 dark:bg-slate-850/10 border border-slate-100 dark:border-slate-800/30 rounded-2xl space-y-1.5">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-xs font-bold text-slate-750 dark:text-slate-200">{rev.guest}</span>
                        <span className="text-[10px] text-yellow-500 font-bold block mt-0.5">{rev.rating}</span>
                      </div>
                      <span className="text-[9px] text-slate-400 font-bold">{rev.date}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed font-medium">"{rev.comment}"</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Star average card */}
            <div className="bg-white dark:bg-[#11131c] border border-slate-200/50 dark:border-slate-800/40 rounded-3xl p-5 shadow-xs h-fit text-left space-y-4">
              <h3 className="text-sm font-black text-slate-800 dark:text-slate-100 pb-3 border-b border-slate-50 dark:border-slate-850/20 mb-4">
                Ratings Index
              </h3>
              
              <div className="text-center py-4 bg-yellow-500/5 rounded-2xl border border-yellow-500/10">
                <h2 className="text-3xl font-black text-yellow-500">4.8</h2>
                <p className="text-[9px] font-black text-slate-450 uppercase mt-1">out of 5 stars (180 reviews)</p>
              </div>

              <div className="space-y-2.5 text-[10px] font-bold text-slate-550">
                <div className="flex justify-between">
                  <span>5 stars</span>
                  <span>142 reviews (78%)</span>
                </div>
                <div className="flex justify-between">
                  <span>4 stars</span>
                  <span>32 reviews (17%)</span>
                </div>
                <div className="flex justify-between">
                  <span>3 stars</span>
                  <span>6 reviews (3%)</span>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>

    </div>
  );
}
