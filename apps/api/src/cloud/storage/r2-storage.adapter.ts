import { Injectable, NotImplementedException } from '@nestjs/common';
import { StorageAdapter } from './storage.adapter';

@Injectable()
export class R2StorageAdapter implements StorageAdapter {
  constructor() {
    // Cloudflare R2 client initialization would go here in the future
  }

  async save(key: string, buffer: Buffer, mimeType: string): Promise<string> {
    console.log(`[R2StorageAdapter] Mock saving key: ${key}`);
    throw new NotImplementedException(
      'Cloudflare R2 Storage Engine integration is slated for future release.',
    );
  }

  async get(key: string): Promise<Buffer> {
    throw new NotImplementedException(
      'Cloudflare R2 Storage Engine integration is slated for future release.',
    );
  }

  async delete(key: string): Promise<void> {
    throw new NotImplementedException(
      'Cloudflare R2 Storage Engine integration is slated for future release.',
    );
  }
}
