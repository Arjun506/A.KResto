import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';
import type { StorageAdapter } from './storage/storage.adapter';

export interface CloudFileMetadata {
  id: string;
  tenantId: string;
  userId: string;
  fileName: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  category: string;
  isPublic: boolean;
  createdAt: string;
}

@Injectable()
export class CloudService {
  private readonly registryPath = path.join(
    process.cwd(),
    'uploads',
    'metadata-registry.json',
  );

  constructor(
    @Inject('StorageAdapter') private readonly storage: StorageAdapter,
  ) {
    // Ensure the registry directory exists
    const dir = path.dirname(this.registryPath);
    void fs.mkdir(dir, { recursive: true }).catch(() => {});
  }

  private async loadRegistry(): Promise<CloudFileMetadata[]> {
    try {
      const data = await fs.readFile(this.registryPath, 'utf8');
      return JSON.parse(data) as CloudFileMetadata[];
    } catch {
      return [];
    }
  }

  private async saveRegistry(records: CloudFileMetadata[]): Promise<void> {
    await fs.writeFile(
      this.registryPath,
      JSON.stringify(records, null, 2),
      'utf8',
    );
  }

  async uploadFile(
    tenantId: string,
    userId: string,
    file: {
      buffer: Buffer;
      originalname: string;
      mimetype: string;
      size: number;
    },
    category: string,
    isPublic: boolean,
  ): Promise<CloudFileMetadata> {
    const fileId =
      Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
    const sanitizedOriginalName = file.originalname.replace(
      /[^a-zA-Z0-9.\-_]/g,
      '_',
    );
    const storageKey = `tenants/${tenantId}/${category}/${fileId}_${sanitizedOriginalName}`;

    // Write file to actual storage adapter
    const savedPath = await this.storage.save(
      storageKey,
      file.buffer,
      file.mimetype,
    );

    // Build absolute/relative URL
    const url = isPublic
      ? `/api/v1/cloud/public/${savedPath}`
      : `/api/v1/cloud/secure/${fileId}`;

    const metadata: CloudFileMetadata = {
      id: fileId,
      tenantId,
      userId,
      fileName: storageKey,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      url,
      category,
      isPublic,
      createdAt: new Date().toISOString(),
    };

    const registry = await this.loadRegistry();
    registry.push(metadata);
    await this.saveRegistry(registry);

    return metadata;
  }

  async getFileMetadata(
    tenantId: string,
    fileId: string,
  ): Promise<CloudFileMetadata> {
    const registry = await this.loadRegistry();
    const file = registry.find(
      (item) => item.id === fileId && item.tenantId === tenantId,
    );
    if (!file) {
      throw new NotFoundException(`File not found: ${fileId}`);
    }
    return file;
  }

  async listFiles(
    tenantId: string,
    category?: string,
  ): Promise<CloudFileMetadata[]> {
    const registry = await this.loadRegistry();
    return registry.filter((item) => {
      const tenantMatch = item.tenantId === tenantId;
      const categoryMatch =
        !category || item.category.toLowerCase() === category.toLowerCase();
      return tenantMatch && categoryMatch;
    });
  }

  async getFileBuffer(
    tenantId: string,
    fileId: string,
  ): Promise<{ buffer: Buffer; metadata: CloudFileMetadata }> {
    const metadata = await this.getFileMetadata(tenantId, fileId);
    const buffer = await this.storage.get(metadata.fileName);
    return { buffer, metadata };
  }

  async getFileBufferByPath(filePath: string): Promise<Buffer> {
    return await this.storage.get(filePath);
  }

  async deleteFile(tenantId: string, fileId: string): Promise<void> {
    const registry = await this.loadRegistry();
    const fileIndex = registry.findIndex(
      (item) => item.id === fileId && item.tenantId === tenantId,
    );
    if (fileIndex === -1) {
      throw new NotFoundException(`File not found: ${fileId}`);
    }

    const file = registry[fileIndex];
    // Remove from disk storage
    await this.storage.delete(file.fileName);

    // Remove from registry
    registry.splice(fileIndex, 1);
    await this.saveRegistry(registry);
  }
}
