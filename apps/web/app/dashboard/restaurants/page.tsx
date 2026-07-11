'use client';

import { useState, useEffect } from 'react';
import {
  Store,
  FileText,
  MapPin,
  Clock,
  Coffee,
  Printer,
  Percent,
  CreditCard,
  Users,
  Bell,
  Sparkles,
  Globe,
  ArrowRight,
  ArrowLeft,
  Save,
  CheckCircle,
  HelpCircle,
  Loader2,
  Lock
} from 'lucide-react';
import { getBusinessSettings, updateBusinessSettings } from '@/services/business.service';

const steps = [
  { id: 1, label: 'General Info', icon: Store, desc: 'Name, legal name, type, cuisine, description' },
  { id: 2, label: 'Business & Tax Info', icon: FileText, desc: 'GST, PAN, FSSAI registration numbers' },
  { id: 3, label: 'Address & Location', icon: MapPin, desc: 'Postal address, map coordinates' },
  { id: 4, label: 'Hours & Settings', icon: Clock, desc: 'Working hours, holiday schedule' },
  { id: 5, label: 'Dining Channels', icon: Coffee, desc: 'Dine-in, takeaway, delivery setups' },
  { id: 6, label: 'Taxes & Gateway', icon: Percent, desc: 'Charges, payment preferences' }
];

export default function RestaurantConfigurationCenter() {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form states matching Toast & Lightspeed specs
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

  useEffect(() => {
    // Load configurations from backend json settings
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

  const toggleDay = (day: string) => {
    if (workingDays.includes(day)) {
      setWorkingDays(workingDays.filter(d => d !== day));
    } else {
      setWorkingDays([...workingDays, day]);
    }
  };

  const togglePaymentMethod = (method: string) => {
    if (paymentMethods.includes(method)) {
      setPaymentMethods(paymentMethods.filter(m => m !== method));
    } else {
      setPaymentMethods([...paymentMethods, method]);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-slate-500" />
        <p className="text-xs text-slate-400 font-bold">Loading configuration settings...</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 text-left max-w-7xl mx-auto select-none">
      
      {/* Sidebar Stepper */}
      <div className="bg-white dark:bg-[#11131c] border border-slate-200/50 dark:border-slate-800/40 rounded-3xl p-5 shadow-xs h-fit space-y-4">
        <div className="space-y-1 pb-3 border-b border-slate-50 dark:border-slate-850/20">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">Configuration Wizard</h3>
          <p className="text-[10px] text-slate-400">Complete setup checkpoints to activate customer POS order channels.</p>
        </div>

        <div className="space-y-1">
          {steps.map(step => {
            const Icon = step.icon;
            const isCompleted = step.id < currentStep;
            const isActive = step.id === currentStep;

            return (
              <button
                key={step.id}
                onClick={() => setCurrentStep(step.id)}
                className={`w-full p-3 rounded-2xl flex items-start gap-3 transition text-left cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-sm'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-900/10'
                }`}
              >
                <div className={`p-1.5 rounded-lg border ${
                  isActive
                    ? 'bg-slate-800 border-slate-700 dark:bg-white dark:border-slate-200'
                    : 'bg-slate-50 border-slate-100 dark:bg-slate-800/40 dark:border-slate-700/30'
                }`}>
                  <Icon size={14} className={isActive ? 'text-white dark:text-slate-900' : 'text-slate-500'} />
                </div>
                <div className="min-w-0">
                  <span className={`text-xs font-black block leading-none ${
                    isActive ? 'text-white dark:text-slate-900' : 'text-slate-700 dark:text-slate-300'
                  }`}>
                    {step.label}
                  </span>
                  <span className={`text-[9px] mt-1 block truncate leading-none ${
                    isActive ? 'text-slate-300 dark:text-slate-500' : 'text-slate-400'
                  }`}>
                    {step.desc}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Form Area */}
      <div className="lg:col-span-3 bg-white dark:bg-[#11131c] border border-slate-200/50 dark:border-slate-800/40 rounded-3xl p-6 shadow-xs flex flex-col justify-between min-h-[500px]">
        
        <div className="space-y-6">
          
          {/* STEP 1: General Info */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <h3 className="text-sm font-black text-slate-850 dark:text-slate-100 border-b border-slate-50 dark:border-slate-850/20 pb-3">
                General Profile Details
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase">Restaurant Name</label>
                  <input
                    type="text"
                    value={restaurantName}
                    onChange={(e) => setRestaurantName(e.target.value)}
                    placeholder="e.g. Olive Garden"
                    className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-xs bg-transparent outline-none text-slate-750 dark:text-slate-300 focus:ring-1 focus:ring-slate-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase">Legal Business Name</label>
                  <input
                    type="text"
                    value={legalName}
                    onChange={(e) => setLegalName(e.target.value)}
                    placeholder="e.g. Olive Hospitality Pvt Ltd"
                    className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-xs bg-transparent outline-none text-slate-750 dark:text-slate-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase">Business Format</label>
                  <select
                    value={businessType}
                    onChange={(e) => setBusinessType(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-xs bg-transparent outline-none text-slate-650 font-bold"
                  >
                    <option value="Fine Dining">Fine Dining</option>
                    <option value="Quick Service (QSR)">Quick Service (QSR)</option>
                    <option value="Cafe / Bakery">Cafe / Bakery</option>
                    <option value="Cloud Kitchen">Cloud Kitchen</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase">Cuisine Specialty</label>
                  <input
                    type="text"
                    value={cuisine}
                    onChange={(e) => setCuisine(e.target.value)}
                    placeholder="e.g. Italian, Continental"
                    className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-xs bg-transparent outline-none text-slate-750 dark:text-slate-300"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase">Restaurant Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tell customers about your kitchen heritage..."
                  rows={4}
                  className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-xs bg-transparent outline-none text-slate-750 dark:text-slate-300 resize-none"
                />
              </div>
            </div>
          )}

          {/* STEP 2: Compliance & Registry */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <h3 className="text-sm font-black text-slate-850 dark:text-slate-100 border-b border-slate-50 dark:border-slate-850/20 pb-3">
                Government Compliance Records
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase">GSTIN / Tax ID Number</label>
                  <input
                    type="text"
                    value={gstNumber}
                    onChange={(e) => setGstNumber(e.target.value)}
                    placeholder="e.g. 07AAAAA1111A1Z1"
                    className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-xs bg-transparent outline-none text-slate-750 dark:text-slate-300"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase">Income Tax PAN</label>
                  <input
                    type="text"
                    value={panNumber}
                    onChange={(e) => setPanNumber(e.target.value)}
                    placeholder="e.g. ABCDE1234F"
                    className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-xs bg-transparent outline-none text-slate-750 dark:text-slate-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase">FSSAI License License Number</label>
                  <input
                    type="text"
                    value={fssaiLicense}
                    onChange={(e) => setFssaiLicense(e.target.value)}
                    placeholder="e.g. 12345678901234"
                    className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-xs bg-transparent outline-none text-slate-750 dark:text-slate-300"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase">Corporate Registration Number</label>
                  <input
                    type="text"
                    value={registrationNumber}
                    onChange={(e) => setRegistrationNumber(e.target.value)}
                    placeholder="e.g. U74999DL2026PTC..."
                    className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-xs bg-transparent outline-none text-slate-750 dark:text-slate-300"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Location */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <h3 className="text-sm font-black text-slate-855 dark:text-slate-100 border-b border-slate-50 dark:border-slate-850/20 pb-3">
                Storefront Physical Address
              </h3>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase">Street Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. 12, Park Street"
                  className="w-full px-3.5 py-2 border border-slate-205 dark:border-slate-800 rounded-xl text-xs bg-transparent outline-none text-slate-750 dark:text-slate-300"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Kolkata"
                    className="w-full px-3 py-2 border border-slate-205 dark:border-slate-800 rounded-xl text-xs bg-transparent outline-none text-slate-700 dark:text-slate-300"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase">State</label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="e.g. West Bengal"
                    className="w-full px-3 py-2 border border-slate-205 dark:border-slate-800 rounded-xl text-xs bg-transparent outline-none text-slate-700 dark:text-slate-300"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase">Postal Code</label>
                  <input
                    type="text"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="e.g. 700016"
                    className="w-full px-3 py-2 border border-slate-205 dark:border-slate-800 rounded-xl text-xs bg-transparent outline-none text-slate-700 dark:text-slate-300"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase">Google Maps coordinates url</label>
                <input
                  type="text"
                  value={googleMapsUrl}
                  onChange={(e) => setGoogleMapsUrl(e.target.value)}
                  placeholder="https://maps.google.com/?q=..."
                  className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-xs bg-transparent outline-none text-slate-750 dark:text-slate-300"
                />
              </div>
            </div>
          )}

          {/* STEP 4: Hours & Schedule */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <h3 className="text-sm font-black text-slate-850 dark:text-slate-100 border-b border-slate-50 dark:border-slate-850/20 pb-3">
                Operating Hours schedule
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase">Opening Time</label>
                  <input
                    type="time"
                    value={openingTime}
                    onChange={(e) => setOpeningTime(e.target.value)}
                    className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-xs bg-transparent outline-none text-slate-750 dark:text-slate-300 font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase">Closing Time</label>
                  <input
                    type="time"
                    value={closingTime}
                    onChange={(e) => setClosingTime(e.target.value)}
                    className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-xs bg-transparent outline-none text-slate-750 dark:text-slate-300 font-bold"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase">Active Working Days</label>
                <div className="flex gap-1.5 flex-wrap">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => {
                    const active = workingDays.includes(day);
                    return (
                      <button
                        key={day}
                        onClick={() => toggleDay(day)}
                        className={`px-3 py-1.5 border rounded-xl text-xs font-bold transition active:scale-95 cursor-pointer ${
                          active
                            ? 'bg-slate-905 text-white dark:bg-slate-100 dark:text-slate-900 border-transparent'
                            : 'bg-transparent border-slate-200 hover:bg-slate-50 text-slate-500'
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Dining channels */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <h3 className="text-sm font-black text-slate-850 dark:text-slate-100 border-b border-slate-50 dark:border-slate-850/20 pb-3">
                Active Dining Channels
              </h3>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { state: dineIn, setter: setDineIn, label: 'Dine-In Seating', desc: 'Allows waiter orders and table QR codes checkouts.' },
                  { state: takeaway, setter: setTakeaway, label: 'Self Takeaway', desc: 'Enables quick counter billing and ticket dispatch.' },
                  { state: delivery, setter: setDelivery, label: 'Home Delivery', desc: 'Wires distance charge matrix and delivery partners.' },
                  { state: pickup, setter: setPickup, label: 'Drive-Through Pickup', desc: 'Allows pre-ordered car slot delivery checks.' }
                ].map((ch, idx) => (
                  <button
                    key={idx}
                    onClick={() => ch.setter(!ch.state)}
                    className={`p-4 border rounded-2xl text-left transition space-y-1 cursor-pointer ${
                      ch.state
                        ? 'border-indigo-650 bg-indigo-50/10 dark:bg-indigo-950/10'
                        : 'border-slate-200 hover:bg-slate-50/40 dark:hover:bg-slate-900/10'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-black text-slate-800 dark:text-slate-150">{ch.label}</span>
                      <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center ${
                        ch.state ? 'bg-indigo-600 border-transparent text-white' : 'border-slate-300'
                      }`}>
                        {ch.state && <CheckCircle size={10} className="stroke-[3]" />}
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-450 leading-relaxed">{ch.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 6: Taxes & Payments */}
          {currentStep === 6 && (
            <div className="space-y-4">
              <h3 className="text-sm font-black text-slate-850 dark:text-slate-100 border-b border-slate-50 dark:border-slate-850/20 pb-3">
                Taxes & Payout Parameters
              </h3>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase">GST Rate (%)</label>
                  <input
                    type="number"
                    value={gstRate}
                    onChange={(e) => setGstRate(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-xs bg-transparent outline-none text-slate-750 dark:text-slate-300"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase">Service Charge (%)</label>
                  <input
                    type="number"
                    value={serviceCharge}
                    onChange={(e) => setServiceCharge(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-xs bg-transparent outline-none text-slate-750 dark:text-slate-300"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase">Delivery Charge (₹)</label>
                  <input
                    type="number"
                    value={deliveryCharge}
                    onChange={(e) => setDeliveryCharge(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-xs bg-transparent outline-none text-slate-750 dark:text-slate-300"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase">Accepted Payments</label>
                <div className="flex gap-2">
                  {['Cash', 'Card', 'UPI', 'Net Banking'].map(method => {
                    const active = paymentMethods.includes(method);
                    return (
                      <button
                        key={method}
                        onClick={() => togglePaymentMethod(method)}
                        className={`px-3 py-1.5 border rounded-xl text-xs font-bold transition active:scale-95 cursor-pointer ${
                          active
                            ? 'bg-slate-905 text-white dark:bg-slate-100 dark:text-slate-900 border-transparent'
                            : 'bg-transparent border-slate-200 hover:bg-slate-50 text-slate-500'
                        }`}
                      >
                        {method}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Form Action Controls */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-50 dark:border-slate-850/20 mt-6">
          <button
            onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
            disabled={currentStep === 1}
            className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 cursor-pointer ${
              currentStep === 1
                ? 'text-slate-300 dark:text-slate-700 cursor-not-allowed'
                : 'text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-900/10'
            }`}
          >
            <ArrowLeft size={13} />
            <span>Previous Step</span>
          </button>

          <div className="flex gap-3">
            <button
              onClick={handleSaveSettings}
              disabled={saving}
              className="px-4.5 py-2 bg-indigo-650 hover:bg-indigo-700 text-white text-xs font-black rounded-xl transition active:scale-95 flex items-center gap-1.5 cursor-pointer"
            >
              {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
              <span>{saving ? 'Saving...' : 'Save Configuration'}</span>
            </button>

            {currentStep < steps.length ? (
              <button
                onClick={() => setCurrentStep(prev => Math.min(steps.length, prev + 1))}
                className="px-4.5 py-2 bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-900 text-xs font-black rounded-xl transition active:scale-95 flex items-center gap-1.5 cursor-pointer"
              >
                <span>Next Step</span>
                <ArrowRight size={13} />
              </button>
            ) : null}
          </div>
        </div>

      </div>

      {/* Success alert message overlay */}
      {success && (
        <div className="fixed bottom-5 right-5 p-4 bg-emerald-500 text-white text-xs font-black rounded-2xl shadow-lg flex items-center gap-2 z-50">
          <CheckCircle size={14} className="stroke-[3]" />
          <span>Configurations saved and updated successfully!</span>
        </div>
      )}

      {/* Error alert message overlay */}
      {errorMsg && (
        <div className="fixed bottom-5 right-5 p-4 bg-rose-500 text-white text-xs font-black rounded-2xl shadow-lg flex items-center gap-2 z-50">
          <AlertCircle size={14} />
          <span>{errorMsg}</span>
        </div>
      )}

    </div>
  );
}

// Inline fallback for AlertCircle
function AlertCircle(props: any) {
  return <HelpCircle {...props} className="stroke-current text-white" />;
}
