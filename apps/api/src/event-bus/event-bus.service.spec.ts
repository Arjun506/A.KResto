import { Test, TestingModule } from '@nestjs/testing';
import { EventBusService } from './event-bus.service';
import { UserCreatedEvent } from './events/system.events';
import { firstValueFrom } from 'rxjs';

describe('EventBusService', () => {
  let service: EventBusService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EventBusService],
    }).compile();

    service = module.get<EventBusService>(EventBusService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should publish and receive domain events via stream$', async () => {
    const eventPromise = firstValueFrom(
      service.ofType<UserCreatedEvent>('identity.user.created'),
    );

    const event = new UserCreatedEvent('u-1', {
      userId: 'u-1',
      email: 'test@akos.io',
      role: 'ADMIN',
    });
    await service.publish(event);

    const received = await eventPromise;
    expect(received.aggregateId).toBe('u-1');
    expect(received.payload.email).toBe('test@akos.io');
  });
});
