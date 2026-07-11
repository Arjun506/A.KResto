import { Injectable, NotFoundException } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';
import { StorageAdapter } from './storage.adapter';

@Injectable()
export class LocalStorageAdapter implements StorageAdapter {
  private readonly uploadRoot = path.join(process.cwd(), 'uploads');

  constructor() {
    // Ensure the upload root directory exists
    void fs.mkdir(this.uploadRoot, { recursive: true }).catch(() => {});
  }

  async save(key: string, buffer: Buffer, mimeType: string): Promise<string> {
    const fullPath = path.join(this.uploadRoot, key);
    const parentDir = path.dirname(fullPath);

    // Ensure the specific folder (e.g. tenant/category) exists
    await fs.mkdir(parentDir, { recursive: true });
    await fs.writeFile(fullPath, buffer);

    // Return the relative key format to be stored in the database
    return key;
  }

  async get(key: string): Promise<Buffer> {
    const fullPath = path.join(this.uploadRoot, key);
    try {
      return await fs.readFile(fullPath);
    } catch (err) {
      throw new NotFoundException(`File asset not found: ${key}`);
    }
  }

  async delete(key: string): Promise<void> {
    const fullPath = path.join(this.uploadRoot, key);
    try {
      await fs.unlink(fullPath);
    } catch (err) {
      // Ignore if file doesn't exist
    }
  }
}
