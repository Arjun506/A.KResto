'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  createReservation,
  getReservations,
  getTableAvailability,
  updateReservationStatus,
} from '@/services/reservation.service';
import type {
  Reservation,
  ReservationStatus,
  TableAvailability,
} from '@/src/types/reservation.types';

const statusFlow: ReservationStatus[] = [
  'PENDING',
  'CONFIRMED',
  'SEATED',
  'COMPLETED',
  'CANCELLED',
  'NO_SHOW',
];

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [tables, setTables] = useState<TableAvailability[]>([]);
  const [form, setForm] = useState({
    tableId: '',
    customerName: '',
    customerPhone: '',
    guestCount: '2',
    reservationAt: new Date().toISOString().slice(0, 16),
  });
  const [loading, setLoading] = useState(true);

  const calendar = useMemo(() => {
    return reservations.reduce<Record<string, Reservation[]>>((groups, item) => {
      const day = new Date(item.reservationAt).toLocaleDateString();
      groups[day] = [...(groups[day] ?? []), item];
      return groups;
    }, {});
  }, [reservations]);

  const loadReservations = async () => {
    try {
      const nextReservations = await getReservations();
      setReservations(nextReservations);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const loadAvailability = useCallback(async () => {
    try {
      const nextTables = await getTableAvailability(
        new Date(form.reservationAt).toISOString(),
      );
      setTables(nextTables);
      if (!form.tableId) {
        const firstAvailable = nextTables.find((table) => table.isAvailable);
        if (firstAvailable) {
          setForm((current) => ({ ...current, tableId: firstAvailable.id }));
        }
      }
    } catch (error) {
      console.error(error);
      setTables([]);
    }
  }, [form.reservationAt, form.tableId]);

  useEffect(() => {
    void (async () => {
      await loadReservations();
    })();
  }, []);

  useEffect(() => {
    void (async () => {
      await loadAvailability();
    })();
  }, [loadAvailability]);

  const submitReservation = async () => {
    if (!form.tableId || !form.customerName || !form.reservationAt) return;

    await createReservation({
      tableId: form.tableId,
      customerName: form.customerName,
      customerPhone: form.customerPhone || undefined,
      guestCount: Number(form.guestCount),
      reservationAt: new Date(form.reservationAt).toISOString(),
    });

    setForm((current) => ({
      ...current,
      customerName: '',
      customerPhone: '',
    }));
    await loadReservations();
    await loadAvailability();
  };

  if (loading) return <div>Loading reservations...</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold">Reservations</h1>
        <p className="mt-2 text-gray-500">
          Booking dashboard, table availability, and reservation calendar.
        </p>
      </div>

      <section className="grid gap-6 xl:grid-cols-[420px_1fr]">
        <div className="rounded-2xl bg-white p-6 shadow">
          <h2 className="text-2xl font-bold">Book Table</h2>
          <div className="mt-5 space-y-4">
            <input
              value={form.customerName}
              onChange={(event) =>
                setForm((current) => ({ ...current, customerName: event.target.value }))
              }
              placeholder="Customer name"
              className="w-full rounded-xl border px-4 py-3"
            />
            <input
              value={form.customerPhone}
              onChange={(event) =>
                setForm((current) => ({ ...current, customerPhone: event.target.value }))
              }
              placeholder="Phone"
              className="w-full rounded-xl border px-4 py-3"
            />
            <input
              value={form.guestCount}
              onChange={(event) =>
                setForm((current) => ({ ...current, guestCount: event.target.value }))
              }
              type="number"
              min={1}
              className="w-full rounded-xl border px-4 py-3"
            />
            <input
              value={form.reservationAt}
              onChange={(event) =>
                setForm((current) => ({ ...current, reservationAt: event.target.value }))
              }
              type="datetime-local"
              className="w-full rounded-xl border px-4 py-3"
            />
            <select
              value={form.tableId}
              onChange={(event) =>
                setForm((current) => ({ ...current, tableId: event.target.value }))
              }
              className="w-full rounded-xl border px-4 py-3"
            >
              <option value="">Select table</option>
              {tables.map((table) => (
                <option
                  key={table.id}
                  value={table.id}
                  disabled={!table.isAvailable}
                >
                  {table.name} ({table.capacity}){' '}
                  {table.isAvailable ? 'available' : 'busy'}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={submitReservation}
            className="mt-5 w-full rounded-xl bg-black px-6 py-3 font-semibold text-white"
          >
            Create Reservation
          </button>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow">
          <h2 className="text-2xl font-bold">Table Availability</h2>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {tables.map((table) => (
              <button
                key={table.id}
                onClick={() =>
                  table.isAvailable &&
                  setForm((current) => ({ ...current, tableId: table.id }))
                }
                className={`rounded-2xl border p-5 text-left ${
                  table.id === form.tableId
                    ? 'border-black'
                    : 'border-transparent'
                } ${
                  table.isAvailable
                    ? 'bg-green-50 text-green-800'
                    : 'bg-red-50 text-red-800'
                }`}
              >
                <span className="block text-xl font-bold">{table.name}</span>
                <span className="text-sm">Capacity {table.capacity}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="rounded-2xl bg-white p-6 shadow">
          <h2 className="text-2xl font-bold">Booking Dashboard</h2>
          <div className="mt-5 overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b">
                  <th className="py-3">Customer</th>
                  <th>Time</th>
                  <th>Guests</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map((reservation) => (
                  <tr key={reservation.id} className="border-b">
                    <td className="py-4 font-medium">{reservation.customerName}</td>
                    <td>{new Date(reservation.reservationAt).toLocaleString()}</td>
                    <td>{reservation.guestCount}</td>
                    <td>
                      <select
                        value={reservation.status}
                        onChange={(event) =>
                          void updateReservationStatus(
                            reservation.id,
                            event.target.value as ReservationStatus,
                          ).then(loadReservations)
                        }
                        className="rounded-lg border px-3 py-2"
                      >
                        {statusFlow.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow">
          <h2 className="text-2xl font-bold">Calendar</h2>
          <div className="mt-5 space-y-4">
            {Object.entries(calendar).map(([day, dayReservations]) => (
              <div key={day} className="rounded-xl bg-gray-100 p-4">
                <p className="font-semibold">{day}</p>
                <p className="text-sm text-gray-500">
                  {dayReservations.length} bookings
                </p>
              </div>
            ))}
            {!Object.keys(calendar).length && (
              <p className="text-gray-500">No bookings yet.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
