import { Test, TestingModule } from '@nestjs/testing';
import { NotificationPlatformService } from './notification-platform.service';
import { INotificationChannel } from './notification-channel.interface';

describe('NotificationPlatformService', () => {
  let service: NotificationPlatformService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NotificationPlatformService],
    }).compile();

    service = module.get<NotificationPlatformService>(
      NotificationPlatformService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should fallback log output when channel driver is not registered', async () => {
    const result = await service.send('EMAIL', {
      recipient: 'user@akos.io',
      body: 'Welcome to AK OS',
    });
    expect(result).toBe(true);
  });

  it('should dispatch via registered channel driver', async () => {
    const mockChannel: INotificationChannel = {
      type: 'EMAIL',
      send: jest.fn().mockResolvedValue(true),
    };
    service.registerChannel(mockChannel);

    const result = await service.send('EMAIL', {
      recipient: 'admin@akos.io',
      body: 'Alert',
    });
    expect(result).toBe(true);
    expect(mockChannel.send).toHaveBeenCalled();
  });
});
