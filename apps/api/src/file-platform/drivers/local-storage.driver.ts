import { Injectable } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';
import {
  IStorageDriver,
  MulterFile,
  UploadedFileDescriptor,
} from '../storage-driver.interface';

@Injectable()
export class LocalStorageDriver implements IStorageDriver {
  private readonly uploadDir = path.join(process.cwd(), 'uploads');

  constructor() {
    fs.mkdir(this.uploadDir, { recursive: true }).catch(() => null);
  }

  async upload(
    file: MulterFile,
    folder: string = 'general',
  ): Promise<UploadedFileDescriptor> {
    const targetDir = path.join(this.uploadDir, folder);
    await fs.mkdir(targetDir, { recursive: true });

    const ext = path.extname(file.originalname);
    const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}${ext}`;
    const filePath = path.join(targetDir, filename);

    if (file.buffer) {
      await fs.writeFile(filePath, file.buffer);
    }

    const key = `${folder}/${filename}`;
    const url = `/uploads/${key}`;

    return {
      key,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      url,
      path: filePath,
    };
  }

  async getSignedUrl(
    key: string,
    expiresInSeconds: number = 3600,
  ): Promise<string> {
    return `/uploads/${key}?expires=${Date.now() + expiresInSeconds * 1000}`;
  }

  async delete(key: string): Promise<boolean> {
    try {
      const filePath = path.join(this.uploadDir, key);
      await fs.unlink(filePath);
      return true;
    } catch {
      return false;
    }
  }
}
