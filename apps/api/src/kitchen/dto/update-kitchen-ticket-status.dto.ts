import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export const KITCHEN_TICKET_STATUSES = [
  'PENDING',
  'PREPARING',
  'READY',
  'SERVED',
  'CANCELLED',
] as const;

export type KitchenTicketStatus = (typeof KITCHEN_TICKET_STATUSES)[number];

export class UpdateKitchenTicketStatusDto {
  @IsString()
  @IsNotEmpty()
  @IsIn(KITCHEN_TICKET_STATUSES)
  status!: KitchenTicketStatus;
}
