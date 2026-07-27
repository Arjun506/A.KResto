# Phase 31 Wave 5 — File Service

---

## Storage Abstraction & Presigned Upload Security

- **Storage Driver Abstraction**: `StorageDriver` interface supports `LocalDiskDriver` and `S3R2Driver`.
- **Presigned Upload URLs**: Endpoint `/api/v1/files/presign` validates user JWT `tenantId`, permissions, file MIME type, and max size (capped at 25MB).
- **Download Authorization**: File download links verify context ownership; raw storage credentials are never exposed.
