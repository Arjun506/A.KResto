import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export const KITCHEN_TICKET_PRIORITIES = ['NORMAL', 'HIGH', 'URGENT'] as const;

export type KitchenTicketPriority = (typeof KITCHEN_TICKET_PRIORITIES)[number];

export class UpdateKitchenTicketPriorityDto {
  @IsString()
  @IsNotEmpty()
  @IsIn(KITCHEN_TICKET_PRIORITIES)
  priority!: KitchenTicketPriority;
}
