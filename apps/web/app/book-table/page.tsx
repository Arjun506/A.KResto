'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Calendar, Users, Clock, ShieldCheck, Copy, Check, MessageSquare, ChevronRight, Phone, User, Store } from 'lucide-react';
import { getPublicRestaurantTables, createPublicReservation, getPublicRestaurant } from '@/services/public.service';

function BookTableContent() {
  const searchParams = useSearchParams();
  const initialSlug = searchParams.get('restaurant') || 'spicy-hub';

  // Form states
  const [restaurantSlug, setRestaurantSlug] = useState(initialSlug);
  const [restaurantName, setRestaurantName] = useState('');
  const [tables, setTables] = useState<any[]>([]);
  const [selectedTable, setSelectedTable] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [guestCount, setGuestCount] = useState('2');
  const [bookingDate, setBookingDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [bookingTime, setBookingTime] = useState('13:00');
  const [durationHours, setDurationHours] = useState('1');
  const [notes, setNotes] = useState('');

  // UI status states
  const [loading, setLoading] = useState(false);
  const [tablesLoading, setTablesLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdBooking, setCreatedBooking] = useState<any>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedSMS, setCopiedSMS] = useState(false);

  // Load restaurant metadata and tables
  useEffect(() => {
    async function loadRestaurantData() {
      if (!restaurantSlug) return;
      setTablesLoading(true);
      setError(null);
      try {
        const rest = await getPublicRestaurant(restaurantSlug);
        setRestaurantName(rest.name);
        const activeTables = await getPublicRestaurantTables(restaurantSlug);
        setTables(activeTables);
        if (activeTables.length > 0) {
          setSelectedTable(activeTables[0].id);
        }
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Failed to load restaurant tables. Verify the restaurant slug.');
        setTables([]);
      } finally {
        setTablesLoading(false);
      }
    }
    void loadRestaurantData();
  }, [restaurantSlug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTable || !customerName || !bookingDate || !bookingTime) {
      setError('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const reservationAt = new Date(`${bookingDate}T${bookingTime}:00`);
      const durationMinutes = Number(durationHours) * 60;

      const res = await createPublicReservation({
        restaurantSlug,
        tableId: selectedTable,
        customerName,
        customerPhone: customerPhone || undefined,
        guestCount: Number(guestCount),
        reservationAt: reservationAt.toISOString(),
        durationMinutes,
        notes: notes || undefined,
      });

      setCreatedBooking(res);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to complete table booking. Table may be already reserved for this slot.');
    } finally {
      setLoading(false);
    }
  };

  const selectedTableObj = tables.find((t) => t.id === selectedTable);
  const bypassUrl = createdBooking
    ? `${window.location.origin}/qr-order?restaurant=${restaurantSlug}&table=${createdBooking.tableId}&token=${selectedTableObj?.qrCode || 'qr-token'}&bookingId=${createdBooking.id}`
    : '';

  const copyToClipboard = (text: string, setCopied: (val: boolean) => void) => {
    navigator.clipboard?.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => undefined);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white relative overflow-hidden py-12 px-4">
      {/* Glow effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] rounded-full bg-violet-600/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] rounded-full bg-rose-500/10 blur-[100px] pointer-events-none" />

      <div className="max-w-4xl mx-auto z-10 relative">
        {/* LOGO */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 to-violet-600 flex items-center justify-center shadow-lg shadow-rose-500/20">
            <Clock className="text-white" size={20} />
          </div>
          <div>
            <span className="text-xl font-black tracking-tight bg-gradient-to-r from-rose-500 to-violet-400 bg-clip-text text-transparent">
              RESTOBILL
            </span>
            <span className="text-[10px] block font-bold text-zinc-500 tracking-widest uppercase">
              PRE-TABLE BOOKING
            </span>
          </div>
        </div>

        {!createdBooking ? (
          <div className="bg-slate-900/50 border border-slate-850 rounded-[2.5rem] p-6 sm:p-10 shadow-2xl backdrop-blur-md">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-black tracking-tight leading-tight">
                Pre-Book Your <span className="bg-gradient-to-r from-rose-500 to-violet-400 bg-clip-text text-transparent">Favorite Table</span>
              </h1>
              <p className="text-zinc-400 text-xs sm:text-sm mt-2 font-medium">
                Reserve in advance, get a direct access QR link, and bypass general public locks.
              </p>
            </div>

            {error && (
              <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-4 mb-6 flex items-start gap-3">
                <span className="text-rose-500 text-lg">⚠️</span>
                <p className="text-rose-200 text-xs font-bold leading-relaxed">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Restaurant Slug */}
                <div className="space-y-2">
                  <label className="text-xs text-zinc-400 font-black uppercase flex items-center gap-1.5">
                    <Store size={14} className="text-violet-400" />
                    Restaurant Slug
                  </label>
                  <input
                    value={restaurantSlug}
                    onChange={(e) => setRestaurantSlug(e.target.value)}
                    placeholder="e.g. spicy-hub"
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-3.5 text-sm outline-none text-white focus:border-violet-500 transition"
                    required
                  />
                </div>

                {/* Table Number */}
                <div className="space-y-2">
                  <label className="text-xs text-zinc-400 font-black uppercase flex items-center gap-1.5">
                    <Users size={14} className="text-violet-400" />
                    Select Table
                  </label>
                  {tablesLoading ? (
                    <div className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-3.5 text-xs text-zinc-500">
                      Loading active tables...
                    </div>
                  ) : tables.length === 0 ? (
                    <div className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-3.5 text-xs text-rose-400 font-bold">
                      No active tables found. Verify restaurant slug.
                    </div>
                  ) : (
                    <select
                      value={selectedTable}
                      onChange={(e) => setSelectedTable(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-3.5 text-sm outline-none text-white focus:border-violet-500 transition cursor-pointer"
                      required
                    >
                      {tables.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name} (Max Capacity: {t.capacity})
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {/* Customer Name */}
                <div className="space-y-2">
                  <label className="text-xs text-zinc-400 font-black uppercase flex items-center gap-1.5">
                    <User size={14} className="text-violet-400" />
                    Your Name
                  </label>
                  <input
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Enter customer name"
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-3.5 text-sm outline-none text-white focus:border-violet-500 transition"
                    required
                  />
                </div>

                {/* Customer Phone */}
                <div className="space-y-2">
                  <label className="text-xs text-zinc-400 font-black uppercase flex items-center gap-1.5">
                    <Phone size={14} className="text-violet-400" />
                    Phone Number (for SMS confirmation)
                  </label>
                  <input
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="Enter phone number"
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-3.5 text-sm outline-none text-white focus:border-violet-500 transition"
                  />
                </div>

                {/* Booking Date */}
                <div className="space-y-2">
                  <label className="text-xs text-zinc-400 font-black uppercase flex items-center gap-1.5">
                    <Calendar size={14} className="text-violet-400" />
                    Booking Date
                  </label>
                  <input
                    type="date"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-3.5 text-sm outline-none text-white focus:border-violet-500 transition cursor-pointer"
                    required
                  />
                </div>

                {/* Booking Time */}
                <div className="space-y-2">
                  <label className="text-xs text-zinc-400 font-black uppercase flex items-center gap-1.5">
                    <Clock size={14} className="text-violet-400" />
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={bookingTime}
                    onChange={(e) => setBookingTime(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-3.5 text-sm outline-none text-white focus:border-violet-500 transition cursor-pointer"
                    required
                  />
                </div>

                {/* Duration */}
                <div className="space-y-2">
                  <label className="text-xs text-zinc-400 font-black uppercase flex items-center gap-1.5">
                    <Clock size={14} className="text-violet-400" />
                    Duration
                  </label>
                  <select
                    value={durationHours}
                    onChange={(e) => setDurationHours(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-3.5 text-sm outline-none text-white focus:border-violet-500 transition cursor-pointer"
                    required
                  >
                    <option value="1">1 Hour</option>
                    <option value="2">2 Hours</option>
                    <option value="3">3 Hours</option>
                  </select>
                </div>

                {/* Guest Count */}
                <div className="space-y-2">
                  <label className="text-xs text-zinc-400 font-black uppercase flex items-center gap-1.5">
                    <Users size={14} className="text-violet-400" />
                    Guests Count
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={guestCount}
                    onChange={(e) => setGuestCount(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-3.5 text-sm outline-none text-white focus:border-violet-500 transition"
                    required
                  />
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <label className="text-xs text-zinc-400 font-black uppercase block">Special Requests (Notes)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Near window, child chair request"
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-3.5 text-sm outline-none text-white focus:border-violet-500 transition resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading || tables.length === 0}
                className="w-full py-4 bg-gradient-to-r from-rose-500 to-violet-600 hover:from-rose-600 hover:to-violet-700 text-white font-black text-sm rounded-2xl transition shadow-lg shadow-rose-500/15 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? 'Processing Reservation...' : 'Confirm Pre-Booking'}
                <ChevronRight size={16} />
              </button>
            </form>
          </div>
        ) : (
          /* CONFIRMATION SCREEN */
          <div className="grid gap-6 md:grid-cols-5">
            {/* Ticket Card */}
            <div className="md:col-span-3 bg-slate-900/50 border border-slate-850 rounded-[2.5rem] p-6 sm:p-8 shadow-2xl backdrop-blur-md flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start border-b border-slate-800 pb-5 mb-5">
                  <div>
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 px-2.5 py-1 rounded-full font-black uppercase tracking-wider">
                      Confirmed
                    </span>
                    <h2 className="text-2xl font-black mt-3">{restaurantName}</h2>
                    <p className="text-xs text-zinc-400 mt-1">Booking ID: {createdBooking.id}</p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <ShieldCheck size={26} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm font-medium text-zinc-400 mb-6">
                  <div>
                    <span className="text-[10px] text-zinc-500 font-bold block uppercase">Customer</span>
                    <span className="text-white font-black text-base mt-1 block">{createdBooking.customerName}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 font-bold block uppercase">Table Number</span>
                    <span className="text-white font-black text-base mt-1 block">
                      {selectedTableObj?.name || 'Table'} ({createdBooking.guestCount} guests)
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 font-bold block uppercase">Time Slot</span>
                    <span className="text-white font-black text-base mt-1 block">
                      {new Date(createdBooking.reservationAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 font-bold block uppercase">Duration</span>
                    <span className="text-white font-black text-base mt-1 block">{createdBooking.durationMinutes / 60} Hour(s)</span>
                  </div>
                </div>

                {/* Bypass Link copy */}
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-500 font-black uppercase">Diner Access Link</span>
                    <button
                      onClick={() => copyToClipboard(bypassUrl, setCopiedLink)}
                      className="text-violet-400 hover:text-violet-300 font-black flex items-center gap-1.5 transition"
                    >
                      {copiedLink ? (
                        <>
                          <Check size={14} /> Copied!
                        </>
                      ) : (
                        <>
                          <Copy size={14} /> Copy Link
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-zinc-400 break-all font-mono select-all bg-slate-900/60 p-2.5 rounded-lg border border-slate-850">
                    {bypassUrl}
                  </p>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => window.open(bypassUrl, '_blank')}
                  className="flex-1 py-3.5 bg-violet-600 hover:bg-violet-700 text-white font-black text-xs rounded-2xl transition active:scale-95 flex items-center justify-center gap-1.5 shadow-md shadow-violet-500/10"
                >
                  🚀 Test Customer Bypass Scan
                </button>
                <button
                  onClick={() => setCreatedBooking(null)}
                  className="py-3.5 px-6 bg-slate-950 border border-slate-800 hover:bg-slate-900 text-zinc-400 hover:text-white font-black text-xs rounded-2xl transition active:scale-95"
                >
                  Book Another Table
                </button>
              </div>
            </div>

            {/* Notification Simulation Center */}
            <div className="md:col-span-2 space-y-6">
              {/* Simulated SMS Alert mockup */}
              <div className="bg-black/60 border border-slate-800 rounded-[2.5rem] p-6 shadow-2xl backdrop-blur-md relative overflow-hidden flex flex-col justify-between">
                <div className="flex items-center gap-2 border-b border-slate-850 pb-4 mb-4">
                  <div className="w-8 h-8 rounded-full bg-violet-500/10 flex items-center justify-center text-violet-400">
                    <MessageSquare size={16} />
                  </div>
                  <div>
                    <h3 className="text-xs font-black">SMS Notification Simulator</h3>
                    <p className="text-[9px] text-zinc-500 font-bold">Simulating SMS received by the customer</p>
                  </div>
                </div>

                {/* SMS Bubble */}
                <div className="space-y-4">
                  <div className="bg-slate-900 border border-slate-800 p-4 rounded-3xl relative text-xs leading-relaxed max-w-[85%]">
                    <p className="font-bold text-zinc-400">RestoBill Confirmations:</p>
                    <p className="mt-1 font-medium">
                      Hey {createdBooking.customerName}! Your table booking at {restaurantName} is confirmed for{' '}
                      {new Date(createdBooking.reservationAt).toLocaleDateString()} at{' '}
                      {new Date(createdBooking.reservationAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.
                    </p>
                    <p className="mt-2 text-violet-400 underline break-all font-bold">
                      Use this link to check in & place your order when you arrive: {bypassUrl}
                    </p>
                    <span className="text-[9px] text-zinc-600 block mt-2 text-right">Just now</span>
                  </div>

                  <button
                    onClick={() =>
                      copyToClipboard(
                        `RestoBill Confirmations: Hey ${createdBooking.customerName}! Your table booking at ${restaurantName} is confirmed. Use this link to check-in & order: ${bypassUrl}`,
                        setCopiedSMS
                      )
                    }
                    className="w-full py-2.5 bg-slate-950 hover:bg-slate-900 border border-slate-850 hover:border-slate-800 text-zinc-400 hover:text-white font-black text-[10px] rounded-xl flex items-center justify-center gap-1.5 transition active:scale-95"
                  >
                    {copiedSMS ? <Check size={12} /> : <Copy size={12} />}
                    Copy Simulated SMS Text
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default function BookTablePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">Loading...</div>}>
      <BookTableContent />
    </Suspense>
  );
}

