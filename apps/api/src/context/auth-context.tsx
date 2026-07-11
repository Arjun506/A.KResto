// Deprecated: backend must not contain React/TSX artifacts.
// This file is kept only to avoid broken imports during stabilization.
// Prefer importing from: ../common/auth/auth-context.types

export type AuthContextType = {
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
};



