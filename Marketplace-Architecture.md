# App Marketplace Architecture

This document describes the design of the Business OS App Marketplace.

## Design Goals
- **Decoupled Architecture**: All marketplace extensions can be enabled/disabled on a per-workspace basis without altering core platform databases.
- **Dynamic Catalog**: The catalog items (Packs, Themes, AI helpers) are populated dynamically from the central module registries.
