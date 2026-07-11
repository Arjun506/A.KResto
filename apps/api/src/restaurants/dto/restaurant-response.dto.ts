export class RestaurantResponseDto {
  id!: string;
  name!: string;
  slug!: string;
  location?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  timezone?: string | null;
  currency?: string | null;
  isActive!: boolean;
  logo?: string | null;
  createdAt!: Date;
  updatedAt!: Date;
}
