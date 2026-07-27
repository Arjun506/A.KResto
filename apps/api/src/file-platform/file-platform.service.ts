import { Injectable } from '@nestjs/common';
import { LocalStorageDriver } from './drivers/local-storage.driver';
import { MulterFile, UploadedFileDescriptor } from './storage-driver.interface';

@Injectable()
export class FilePlatformService {
  constructor(private readonly storageDriver: LocalStorageDriver) {}

  async uploadFile(
    file: MulterFile,
    folder?: string,
  ): Promise<UploadedFileDescriptor> {
    return this.storageDriver.upload(file, folder);
  }

  async getSignedUrl(key: string, expiresIn?: number): Promise<string> {
    return this.storageDriver.getSignedUrl(key, expiresIn);
  }

  async deleteFile(key: string): Promise<boolean> {
    return this.storageDriver.delete(key);
  }
}
