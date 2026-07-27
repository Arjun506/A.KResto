import { Global, Module } from '@nestjs/common';
import { FilePlatformService } from './file-platform.service';
import { LocalStorageDriver } from './drivers/local-storage.driver';

@Global()
@Module({
  providers: [LocalStorageDriver, FilePlatformService],
  exports: [FilePlatformService],
})
export class FilePlatformModule {}
