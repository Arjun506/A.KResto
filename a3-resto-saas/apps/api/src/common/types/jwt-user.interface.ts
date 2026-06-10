export interface JwtUser {
  id: string;
  email: string;
  role: string;
  restaurantId?: string;
}
