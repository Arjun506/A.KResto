# Phase 30 Wave 6 — AK Connect Experience Specifications

---

## AK Connect Experience & Connectivity Blueprint

- **Mesh Network States**:
  - `ONLINE`: Connected to cloud backend.
  - `LOCAL_NETWORK`: Connected to local restaurant/store server over Wi-Fi.
  - `NEARBY`: Local peer-to-peer discovery mode active.
  - `OFFLINE`: Network disconnected; actions stored in local sync queue.
- **Mesh Status Banner**: Displays active connection tier and pending offline sync queue count.
