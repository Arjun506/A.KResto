export type AuthLoginRequest = {
  email: string;
  password: string;
};

export type AuthRegisterRequest = {
  name: string;
  email: string;
  password: string;
  restaurantId?: string | null;
};

export type AuthAccessTokenResponse = {
  access_token: string;
};

