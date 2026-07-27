import { Injectable, NotImplementedException } from '@nestjs/common';
import { StorageAdapter } from './storage.adapter';

@Injectable()
export class S3StorageAdapter implements StorageAdapter {
  constructor() {
    // S3 Client initialization would go here in the future
  }

  async save(key: string, buffer: Buffer, mimeType: string): Promise<string> {
    console.log(`[S3StorageAdapter] Mock saving key: ${key}`);
    throw new NotImplementedException(
      'S3 Storage Engine integration is slated for future release.',
    );
  }

  async get(key: string): Promise<Buffer> {
    throw new NotImplementedException(
      'S3 Storage Engine integration is slated for future release.',
    );
  }

  async delete(key: string): Promise<void> {
    throw new NotImplementedException(
      'S3 Storage Engine integration is slated for future release.',
    );
  }
}
