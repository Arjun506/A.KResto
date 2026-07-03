# Specification: Authentication Module

## 1. Overview
The Authentication Module handles login verification, JWT token sign-off, cookie injection, and session refreshes.

## 2. Technical Specifications
- **Security Protocols:** Passport JWT, dynamic secret keys, secure HttpOnly cookies.
- **Table Mapping:** `users` (queries for user authentication).
- **Core Interfaces:**
  - `login(credentials: LoginDto): Promise<{ token: string }>`
  - `refreshSession(refreshToken: string): Promise<{ token: string }>`
  - `validateToken(token: string): Promise<JwtPayload>`

## 3. Endpoints & API Contract
- `POST /api/v1/auth/login` - Verify user credentials and set secure session cookies.
- `POST /api/v1/auth/logout` - Clear session cookies and terminate refresh tokens.
- `POST /api/v1/auth/refresh` - Issue new short-lived JWT tokens using refresh keys.
