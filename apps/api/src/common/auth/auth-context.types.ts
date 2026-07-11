export type AuthContextType = {
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
};
