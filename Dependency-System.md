# Module Dependency System

Ensures that no module is activated without its prerequisite helper modules.

## Flow
- Given target module `A`, look up dependencies array in `ModuleMetadata`.
- If a dependency `B` is missing, schedule it for automatic installation.
- Verify cyclic dependencies before generating final installation plans.
