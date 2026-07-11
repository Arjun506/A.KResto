import { Module } from '@nestjs/common';
import { CloudController } from './cloud.controller';
import { CloudService } from './cloud.service';
import { LocalStorageAdapter } from './storage/local-storage.adapter';

@Module({
  controllers: [CloudController],
  providers: [
    CloudService,
    {
      provide: 'StorageAdapter',
      useClass: LocalStorageAdapter, // Can be easily changed to S3StorageAdapter or R2StorageAdapter
    },
  ],
  exports: [CloudService],
})
export class CloudModule {}
