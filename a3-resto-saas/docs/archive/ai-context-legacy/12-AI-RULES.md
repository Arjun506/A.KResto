# AI Rules (Non-Negotiable)

Every AI agent must follow these rules.

## 1) Safety / Compatibility

- Never delete working code.
- Never modify existing functionality unless the task explicitly requests it.
- Preserve backward compatibility.

## 2) Modularity & Design

- Never hardcode restaurant/business logic.
- Everything must be modular.
- Everything must be reusable.
- Everything must be scalable.
- Never duplicate code.

## 3) Engineering Standards

- Use TypeScript best practices.
- Follow SOLID.
- Follow Clean Architecture.

## 4) Change Management / Communication

- Explain architectural changes **before** coding.
- Wait for approval if the change is architectural.
- Before generating code, always:
  1. Read `ai-context/18-QUICK-CONTEXT.md`
  2. Read `ai-context/12-AI-RULES.md`
  3. Read the affected module documentation
  4. Understand existing architecture
  5. Explain proposed changes
  6. Wait for approval if architectural

## 5) Documentation Hygiene

- Whenever ANY code changes, update the appropriate memory files:
  - New API → `05-API.md`
  - New module → `03-MODULES.md`
  - New page → `07-PAGES.md`
  - Database migration → `04-DATABASE.md`
  - Bug fixed / behavior changes → `11-CHANGELOG.md`
  - Architecture change → `02-ARCHITECTURE.md`
  - Business rule change → `16-BUSINESS-RULES.md`

## 6) Information Integrity

- If information cannot be discovered automatically, write `TODO:` placeholders.
- Never invent details.
