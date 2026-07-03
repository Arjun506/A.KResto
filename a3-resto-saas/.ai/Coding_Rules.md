# Coding Rules and Engineering Standards

This document establishes the technical guidelines for writing backend (NestJS/TypeScript) and frontend (Next.js/React/TypeScript) code.

## 1. Backend (NestJS) Standards

- **Strict Type Checking:** Never use `any`. Always declare specific types or interfaces.
- **DTO Validation:** All entry points must validate request parameters using `class-validator` decorators on DTOs.
- **Exception Filters:** Throw built-in NestJS HTTP exceptions (e.g. `BadRequestException`, `NotFoundException`). Do not return raw string error messages.
- **Dependency Injection:** Inject services, gateways, and configurations via constructors. Avoid manually initializing instances with `new`.
- **Database Access:** Always access database tables through Prisma Client injected as a service. Do not write raw SQL queries unless explicitly needed for performance tuning.

## 2. Frontend (Next.js) Standards

- **App Router Guidelines:** Use client components (`'use client';`) only when hooks, state, or DOM event handlers are necessary. Keep page entry points as server components for better rendering performance.
- **State Management:** Use Zustand for lightweight, global application state. Avoid prop drilling beyond three levels.
- **Component Separation:** Break down UI layout components into reusable widgets in the `components/` directory. Keep components focused, atomic, and testable.
- **Styling Rules:** Use Vanilla CSS or Tailwind CSS utility classes strictly guided by Design System spacing and color tokens.

## 3. General Principles

- **DRY (Don't Repeat Yourself):** Extract duplicated functions, hooks, or configurations into common utilities or shared packages.
- **Documentation:** Document complex methods, algorithms, and interface boundaries. Keep code comments up-to-date with refactoring changes.
