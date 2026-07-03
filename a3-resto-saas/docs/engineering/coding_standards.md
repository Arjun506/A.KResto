# Engineering Standard: Coding Standards

## 1. Core Principles

- **Readability & DRY:** Keep logic clean, self-documenting, and free from duplication.
- **Strict Typing:** Never use the type `any` in TypeScript files. Leverage proper interfaces and union types.
- **Strict Null Checks:** Safely inspect optional attributes using optional chaining (`?.`) or nullish coalescing (`??`).

## 2. NestJS (Backend) Standards

- **Class Validation:** Apply `class-validator` attributes on DTO properties in API controllers.
- **Dependency Injection:** Enforce constructor injection for service files. Do not instantiate dependencies with `new`.
- **Exception Filters:** Leverage NestJS HTTP Exceptions (`BadRequestException`, `NotFoundException`). Avoid returning raw strings as error payloads.

## 3. Next.js (Frontend) Standards

- **Server vs Client Components:** Declare Client components strictly when hooks (`useState`, `useEffect`) or browser actions are required.
- **State Boundaries:** Store local variables in state frameworks like Zustand. Avoid prop drilling beyond three levels.
