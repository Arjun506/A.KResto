'use client';

import { useState, useEffect } from 'react';
import {
  Store,
  FileText,
  MapPin,
  Clock,
  Coffee,
  Percent,
  Save,
  CheckCircle,
  HelpCircle,
  Loader2,
  Plus,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  Truck,
  ArrowRightLeft,
  ChevronRight,
  X,
  AlertCircle
} from 'lucide-react';
import { getBusinessSettings, updateBusinessSettings } from '@/services/business.service';
import { BranchService, Branch, InventoryTransfer } from '../../../services/branch.service';

const steps = [
  { id: 1, label: 'General Info', icon: Store, desc: 'Name, legal name, type, cuisine, description' },
  { id: 2, label: 'Business & Tax Info', icon: FileText, desc: 'GST, PAN, FSSAI registration numbers' },
  { id: 3, label: 'Address & Location', icon: MapPin, desc: 'Postal address, map coordinates' },
  { id: 4, label: 'Hours & Settings', icon: Clock, desc: 'Working hours, holiday schedule' },
  { id: 5, label: 'Dining Channels', icon: Coffee, desc: 'Dine-in, takeaway, delivery setups' },
  { id: 6, label: 'Taxes & Gateway', icon: Percent, desc: 'Charges, payment preferences' }
];

export default function MultiBranchPage() {
  const [activeTab, setActiveTab] = useState<'outlets' | 'wizard'>('outlets');
  
  // Branch Management States
  const [branches, setBranches] = useState<Branch[]>([]);
  const [transfers, setTransfers] = useState<InventoryTransfer[]>([]);
  const [loadingBranches, setLoadingBranches] = useState(true);
  
  // Modals
  const [showAddBranchModal, setShowAddBranchModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);

  // New Branch Form
  const [bName, setBName] = useState('');
  const [bCode, setBCode] = useState('');
  const [bAddress, setBAddress] = useState('');
  const [bPhone, setBPhone] = useState('');
  const [bEmail, setBEmail] = useState('');
  const [bIndustry, setBIndustry] = useState('RESTAURANT');

  // New Transfer Form
  const [sourceBranchId, setSourceBranchId] = useState('');
  const [destBranchId, setDestBranchId] = useState('');
  const [transferNotes, setTransferNotes] = useState('');
  const [sourceItems, setSourceItems] = useState<any[]>([]);
  const [selectedItemId, setSelectedItemId] = useState('');
  const [transferQty, setTransferQty] = useState(10);

  // Settings Wizard States
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [restaurantName, setRestaurantName] = useState('');
  const [legalName, setLegalName] = useState('');
  const [businessType, setBusinessType] = useState('Fine Dining');
  const [cuisine, setCuisine] = useState('Italian');
  const [description, setDescription] = useState('');
  const [gstNumber, setGstNumber] = useState('');
  const [panNumber, setPanNumber] = useState('');
  const [fssaiLicense, setFssaiLicense] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [googleMapsUrl, setGoogleMapsUrl] = useState('');
  const [openingTime, setOpeningTime] = useState('09:00');
  const [closingTime, setClosingTime] = useState('22:00');
  const [workingDays, setWorkingDays] = useState<string[]>(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']);
  const [dineIn, setDineIn] = useState(true);
  const [takeaway, setTakeaway] = useState(true);
  const [delivery, setDelivery] = useState(false);
  const [pickup, setPickup] = useState(false);
  const [gstRate, setGstRate] = useState(18);
  const [serviceCharge, setServiceCharge] = useState(5);
  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const [paymentMethods, setPaymentMethods] = useState<string[]>(['Cash', 'Card', 'UPI']);

  const loadBranchData = async () => {
    setLoadingBranches(true);
    try {
      const bList = await BranchService.listBranches();
      setBranches(bList || []);
      const tList = await BranchService.listTransfers();
      setTransfers(tList || []);
    } catch (err) {
      console.error('Failed to load branches:', err);
    } finally {
      setLoadingBranches(false);
    }
  };

  useEffect(() => {
    loadBranchData();

    const loadSettings = async () => {
      try {
        const res = await getBusinessSettings();
        if (res && res.settings) {
          const s = res.settings;
          if (s.restaurantName) setRestaurantName(s.restaurantName);
          if (s.legalName) setLegalName(s.legalName);
          if (s.businessType) setBusinessType(s.businessType);
          if (s.cuisine) setCuisine(s.cuisine);
          if (s.description) setDescription(s.description);
          if (s.gstNumber) setGstNumber(s.gstNumber);
          if (s.panNumber) setPanNumber(s.panNumber);
          if (s.fssaiLicense) setFssaiLicense(s.fssaiLicense);
          if (s.registrationNumber) setRegistrationNumber(s.registrationNumber);
          if (s.address) setAddress(s.address);
          if (s.city) setCity(s.city);
          if (s.state) setState(s.state);
          if (s.postalCode) setPostalCode(s.postalCode);
          if (s.googleMapsUrl) setGoogleMapsUrl(s.googleMapsUrl);
          if (s.openingTime) setOpeningTime(s.openingTime);
          if (s.closingTime) setClosingTime(s.closingTime);
          if (s.workingDays) setWorkingDays(s.workingDays);
          if (s.dineIn !== undefined) setDineIn(s.dineIn);
          if (s.takeaway !== undefined) setTakeaway(s.takeaway);
          if (s.delivery !== undefined) setDelivery(s.delivery);
          if (s.pickup !== undefined) setPickup(s.pickup);
          if (s.gstRate) setGstRate(s.gstRate);
          if (s.serviceCharge) setServiceCharge(s.serviceCharge);
          if (s.deliveryCharge) setDeliveryCharge(s.deliveryCharge);
          if (s.paymentMethods) setPaymentMethods(s.paymentMethods);
        }
      } catch (err: any) {
        console.warn('Failed to load settings from server, using default overrides.');
      } finally {
        setLoading(false);
      }
    };
    loadSettings();
  }, []);

  const handleCreateBranch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bName) return;

    try {
      await BranchService.createBranch({
        name: bName,
        code: bCode || undefined,
        address: bAddress || undefined,
        phone: bPhone || undefined,
        email: bEmail || undefined,
        industryType: bIndustry,
      });
      setShowAddBranchModal(false);
      setBName('');
      setBCode('');
      setBAddress('');
      setBPhone('');
      setBEmail('');
      loadBranchData();
    } catch (err: any) {
      alert(`Error creating branch: ${err.message}`);
    }
  };

  const handleToggleStatus = async (branchId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      await BranchService.updateBranchStatus(branchId, nextStatus);
      loadBranchData();
    } catch (err: any) {
      alert(`Status update failed: ${err.message}`);
    }
  };

  const handleSourceBranchChange = async (bId: string) => {
    setSourceBranchId(bId);
    if (!bId) return;
    try {
      const items = await BranchService.getBranchInventory(bId);
      setSourceItems(items || []);
    } catch (err) {
      console.error('Failed to load branch inventory items:', err);
    }
  };

  const handleCreateTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sourceBranchId || !destBranchId || !selectedItemId || transferQty <= 0) {
      alert('Please select valid branches, inventory item, and quantity.');
      return;
    }

    try {
      await BranchService.createTransfer({
        sourceBranchId,
        destinationBranchId: destBranchId,
        notes: transferNotes,
        items: [{ inventoryItemId: selectedItemId, quantity: Number(transferQty) }],
      });
      setShowTransferModal(false);
      setTransferNotes('');
      setSelectedItemId('');
      loadBranchData();
    } catch (err: any) {
      alert(`Transfer creation failed: ${err.message}`);
    }
  };

  const handleApproveTransfer = async (tId: string) => {
    try {
      await BranchService.approveTransfer(tId);
      loadBranchData();
    } catch (err: any) {
      alert(`Approval failed: ${err.message}`);
    }
  };

  const handleShipTransfer = async (tId: string) => {
    try {
      await BranchService.shipTransfer(tId);
      loadBranchData();
    } catch (err: any) {
      alert(`Shipment failed: ${err.message}`);
    }
  };

  const handleReceiveTransfer = async (tId: string) => {
    try {
      await BranchService.receiveTransfer(tId);
      loadBranchData();
    } catch (err: any) {
      alert(`Receipt failed: ${err.message}`);
    }
  };

  const handleSaveSettings = async () => {
    setErrorMsg(null);
    setSaving(true);
    setSuccess(false);

    const data = {
      restaurantName,
      legalName,
      businessType,
      cuisine,
      description,
      gstNumber,
      panNumber,
      fssaiLicense,
      registrationNumber,
      address,
      city,
      state,
      postalCode,
      googleMapsUrl,
      openingTime,
      closingTime,
      workingDays,
      dineIn,
      takeaway,
      delivery,
      pickup,
      gstRate,
      serviceCharge,
      deliveryCharge,
      paymentMethods
    };

    try {
      await updateBusinessSettings({ settings: data });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save configuration settings.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 text-slate-900 bg-[#F8F9FF] p-4 min-h-screen">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 flex items-center gap-2">
            Multi-Outlet & Branch Operations
          </h1>
          <p className="text-sm text-slate-500 font-bold mt-1">
            Enterprise branch management, multi-outlet menu/pricing overrides, and transactional stock transfers.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-200/60 p-1 rounded-2xl border border-slate-200">
          <button
            onClick={() => setActiveTab('outlets')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
              activeTab === 'outlets'
                ? 'bg-[#4F46E5] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Outlets & Stock Transfers
          </button>
          <button
            onClick={() => setActiveTab('wizard')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
              activeTab === 'wizard'
                ? 'bg-[#4F46E5] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tenant Global Settings
          </button>
        </div>
      </div>

      {activeTab === 'outlets' ? (
        <div className="space-y-6">
          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="text-lg font-black text-slate-900">Registered Branches ({branches.length})</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setShowAddBranchModal(true)}
                className="px-4 py-2.5 bg-[#4F46E5] hover:bg-[#4338CA] text-white rounded-xl text-xs font-bold flex items-center gap-2 transition active:scale-95 shadow-sm"
              >
                <Plus size={16} /> Add Outlet Branch
              </button>
              <button
                onClick={() => setShowTransferModal(true)}
                className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition active:scale-95 shadow-sm"
              >
                <ArrowRightLeft size={16} /> Inter-Branch Transfer
              </button>
            </div>
          </div>

          {/* Branch Grid */}
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {loadingBranches ? (
              <div className="col-span-full py-12 text-center text-slate-400 font-bold text-xs">
                Loading tenant branches from PostgreSQL...
              </div>
            ) : branches.length > 0 ? (
              branches.map((b) => (
                <div key={b.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                        {b.name}
                        <span className="text-[9px] bg-indigo-50 text-indigo-600 font-bold px-1.5 py-0.5 rounded">
                          {b.code}
                        </span>
                      </h3>
                      <p className="text-[10px] text-slate-400 font-bold mt-0.5">{b.industryType} · {b.timezone}</p>
                    </div>
                    <button
                      onClick={() => handleToggleStatus(b.id, b.status)}
                      className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                        b.status === 'ACTIVE'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {b.status}
                    </button>
                  </div>

                  <p className="text-xs text-slate-600 font-medium flex items-center gap-1">
                    <MapPin size={12} className="text-slate-400" /> {b.address || 'Address not specified'}
                  </p>
                  <p className="text-xs text-slate-500 font-bold">Phone: {b.phone || 'N/A'}</p>
                </div>
              ))
            ) : (
              <div className="col-span-full py-12 text-center text-slate-400 font-bold text-xs">
                No branches registered yet. Click "Add Outlet Branch" to create your first location.
              </div>
            )}
          </div>

          {/* Inter-Branch Transfers History Table */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <Truck size={16} className="text-indigo-600" /> Inter-Branch Inventory Transfer Ledger
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="px-5 py-3 text-left text-xs font-bold text-slate-400 uppercase">Ref Code</th>
                    <th className="px-5 py-3 text-left text-xs font-bold text-slate-400 uppercase">Source Branch</th>
                    <th className="px-5 py-3 text-left text-xs font-bold text-slate-400 uppercase">Destination Branch</th>
                    <th className="px-5 py-3 text-left text-xs font-bold text-slate-400 uppercase">Items Transferred</th>
                    <th className="px-5 py-3 text-left text-xs font-bold text-slate-400 uppercase">Status</th>
                    <th className="px-5 py-3 text-right text-xs font-bold text-slate-400 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {transfers.length > 0 ? (
                    transfers.map((t) => (
                      <tr key={t.id} className="hover:bg-slate-50/50 text-xs">
                        <td className="px-5 py-3 font-extrabold text-slate-900">{t.referenceNumber}</td>
                        <td className="px-5 py-3 font-bold text-slate-700">{t.sourceBranch?.name || t.sourceBranchId}</td>
                        <td className="px-5 py-3 font-bold text-slate-700">{t.destinationBranch?.name || t.destinationBranchId}</td>
                        <td className="px-5 py-3 font-bold text-indigo-600">
                          {t.items?.map((i) => `${i.itemName} (${i.quantity} ${i.unit})`).join(', ')}
                        </td>
                        <td className="px-5 py-3">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                            t.status === 'RECEIVED' ? 'bg-emerald-100 text-emerald-800' :
                            t.status === 'IN_TRANSIT' ? 'bg-amber-100 text-amber-800' :
                            t.status === 'APPROVED' ? 'bg-blue-100 text-blue-800' :
                            'bg-slate-100 text-slate-700'
                          }`}>
                            {t.status}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-right">
                          <div className="flex justify-end gap-1.5">
                            {t.status === 'REQUESTED' && (
                              <button
                                onClick={() => handleApproveTransfer(t.id)}
                                className="px-2 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded text-[10px] font-bold"
                              >
                                Approve
                              </button>
                            )}
                            {(t.status === 'APPROVED' || t.status === 'REQUESTED') && (
                              <button
                                onClick={() => handleShipTransfer(t.id)}
                                className="px-2 py-1 bg-amber-50 text-amber-600 hover:bg-amber-100 rounded text-[10px] font-bold"
                              >
                                Ship Transfer
                              </button>
                            )}
                            {t.status === 'IN_TRANSIT' && (
                              <button
                                onClick={() => handleReceiveTransfer(t.id)}
                                className="px-2 py-1 bg-emerald-600 text-white hover:bg-emerald-700 rounded text-[10px] font-bold"
                              >
                                Receive & Credit Stock
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-5 py-8 text-center text-slate-400 font-bold text-xs">
                        No inventory transfers created yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* Settings Wizard View */
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 text-left max-w-7xl mx-auto select-none">
          <div className="bg-white border border-slate-200/50 rounded-3xl p-5 shadow-xs h-fit space-y-4">
            <div className="space-y-1 pb-3 border-b border-slate-50">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">Configuration Wizard</h3>
            </div>
            <div className="space-y-1">
              {steps.map(step => {
                const Icon = step.icon;
                const isActive = step.id === currentStep;
                return (
                  <button
                    key={step.id}
                    onClick={() => setCurrentStep(step.id)}
                    className={`w-full p-3 rounded-2xl flex items-start gap-3 transition text-left cursor-pointer ${
                      isActive ? 'bg-slate-900 text-white shadow-sm' : 'hover:bg-slate-50'
                    }`}
                  >
                    <Icon size={14} className={isActive ? 'text-white' : 'text-slate-500'} />
                    <div>
                      <span className={`text-xs font-black block ${isActive ? 'text-white' : 'text-slate-700'}`}>{step.label}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-3 bg-white border border-slate-200/50 rounded-3xl p-6 shadow-xs flex flex-col justify-between min-h-[500px]">
            {currentStep === 1 && (
              <div className="space-y-4">
                <h3 className="text-sm font-black text-slate-850 border-b pb-3">General Profile Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" value={restaurantName} onChange={(e) => setRestaurantName(e.target.value)} placeholder="Restaurant Name" className="p-2 border rounded-xl text-xs font-bold" />
                  <input type="text" value={legalName} onChange={(e) => setLegalName(e.target.value)} placeholder="Legal Name" className="p-2 border rounded-xl text-xs font-bold" />
                </div>
              </div>
            )}

            <div className="flex justify-end pt-6">
              <button onClick={handleSaveSettings} className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold">
                Save Configuration
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Branch Modal */}
      {showAddBranchModal && (
        <div className="fixed inset-0 bg-black/55 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100">
            <h3 className="text-base font-black text-slate-900 mb-4">Add Outlet Branch</h3>
            <form onSubmit={handleCreateBranch} className="space-y-3 text-xs">
              <input type="text" placeholder="Branch Name" value={bName} onChange={(e) => setBName(e.target.value)} className="w-full p-2 border rounded-xl font-bold" required />
              <input type="text" placeholder="Branch Code (e.g. BR-101)" value={bCode} onChange={(e) => setBCode(e.target.value)} className="w-full p-2 border rounded-xl font-bold" />
              <input type="text" placeholder="Physical Address" value={bAddress} onChange={(e) => setBAddress(e.target.value)} className="w-full p-2 border rounded-xl font-bold" />
              <input type="text" placeholder="Contact Phone" value={bPhone} onChange={(e) => setBPhone(e.target.value)} className="w-full p-2 border rounded-xl font-bold" />
              <input type="email" placeholder="Contact Email" value={bEmail} onChange={(e) => setBEmail(e.target.value)} className="w-full p-2 border rounded-xl font-bold" />
              <select value={bIndustry} onChange={(e) => setBIndustry(e.target.value)} className="w-full p-2 border rounded-xl font-bold">
                <option value="RESTAURANT">Restaurant</option>
                <option value="HOTEL">Hotel</option>
                <option value="RETAIL">Retail Store</option>
                <option value="SALON">Salon & Spa</option>
                <option value="HEALTHCARE">Healthcare</option>
                <option value="LOGISTICS">Logistics</option>
              </select>

              <div className="flex gap-2 pt-2">
                <button type="submit" className="flex-1 bg-[#4F46E5] text-white py-2 rounded-xl font-bold">Save Outlet</button>
                <button type="button" onClick={() => setShowAddBranchModal(false)} className="flex-1 border border-slate-200 text-slate-600 py-2 rounded-xl font-bold">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Inter-Branch Transfer Modal */}
      {showTransferModal && (
        <div className="fixed inset-0 bg-black/55 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <h3 className="text-base font-black text-slate-900 mb-4">Create Inter-Branch Transfer</h3>
            <form onSubmit={handleCreateTransfer} className="space-y-3 text-xs">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">Source Branch</label>
                <select value={sourceBranchId} onChange={(e) => handleSourceBranchChange(e.target.value)} className="w-full p-2 border rounded-xl font-bold" required>
                  <option value="">-- Select Source Branch --</option>
                  {branches.map(b => <option key={b.id} value={b.id}>{b.name} ({b.code})</option>)}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">Destination Branch</label>
                <select value={destBranchId} onChange={(e) => setDestBranchId(e.target.value)} className="w-full p-2 border rounded-xl font-bold" required>
                  <option value="">-- Select Destination Branch --</option>
                  {branches.filter(b => b.id !== sourceBranchId).map(b => <option key={b.id} value={b.id}>{b.name} ({b.code})</option>)}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">Select Inventory Item</label>
                <select value={selectedItemId} onChange={(e) => setSelectedItemId(e.target.value)} className="w-full p-2 border rounded-xl font-bold" required>
                  <option value="">-- Select Item at Source --</option>
                  {sourceItems.map(i => <option key={i.id} value={i.id}>{i.name} (Available: {i.quantity} {i.unit})</option>)}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">Quantity to Transfer</label>
                <input type="number" value={transferQty} onChange={(e) => setTransferQty(Number(e.target.value))} className="w-full p-2 border rounded-xl font-bold" required />
              </div>

              <div className="flex gap-2 pt-2">
                <button type="submit" className="flex-1 bg-amber-500 text-white py-2 rounded-xl font-bold">Create Transfer</button>
                <button type="button" onClick={() => setShowTransferModal(false)} className="flex-1 border border-slate-200 text-slate-600 py-2 rounded-xl font-bold">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
