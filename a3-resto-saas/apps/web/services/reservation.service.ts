import api from './api';
import { unwrap } from './helpers';

import type {
  CreateReservationRequest,
  Reservation,
  ReservationStatus,
  TableAvailability,
} from '@/src/types/reservation.types';

export const getReservations = async (): Promise<Reservation[]> => {
  return unwrap<Reservation[]>(api.get('/reservations'));
};

export const createReservation = async (
  data: CreateReservationRequest,
): Promise<Reservation> => {
  return unwrap<Reservation>(api.post('/reservations', data));
};

export const updateReservationStatus = async (
  id: string,
  status: ReservationStatus,
): Promise<Reservation> => {
  return unwrap<Reservation>(api.patch(`/reservations/${id}/status`, { status }));
};

export const getTableAvailability = async (
  reservationAt: string,
): Promise<TableAvailability[]> => {
  return unwrap<TableAvailability[]>(
    api.get('/reservations/availability', { params: { reservationAt } }),
  );
};
