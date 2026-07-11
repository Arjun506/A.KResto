# Engineering Standard: Git Workflow

## 1. Branch Strategy

We use a feature-branch workflow. Developers must branch from `main` to perform edits.
- **`feat/`:** Implementation of a new feature (e.g. `feat/pos-checkout`).
- **`fix/`:** Bug resolutions (e.g. `fix/auth-expiry`).
- **`docs/`:** Documentation adjustments (e.g. `docs/naming-rules`).
- **`refactor/`:** Restructuring code files without altering feature scopes (e.g. `refactor/clean-inventory`).

## 2. Commit Message Guidelines

Commit messages must be clear and structured following semantic formats:
- `feat(inventory): add low stock notification checks`
- `fix(auth): redirect chef to kitchen dashboard on login`
- `docs(specs): add identity module technical layout`

## 3. Pull Request Requirements

- Enforce branch protection on `main`. No direct pushes are allowed.
- All Pull Requests must pass automated CI checks (linter, compiler checks, unit tests) and receive at least one approval from a peer reviewer.
- Clean up workspace branches immediately after merging.
