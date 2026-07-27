export type ReservationStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'SEATED'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'NO_SHOW';

export type Reservation = {
  id: string;
  tenantId: string;
  tableId: string;
  customerName: string;
  customerPhone?: string | null;
  guestCount: number;
  reservationAt: string;
  status: ReservationStatus;
  notes?: string | null;
};

export type TableAvailability = {
  id: string;
  name: string;
  code: string;
  capacity: number;
  isAvailable: boolean;
};

export type CreateReservationRequest = {
  tableId: string;
  customerName: string;
  customerPhone?: string;
  guestCount: number;
  reservationAt: string;
  notes?: string;
};

