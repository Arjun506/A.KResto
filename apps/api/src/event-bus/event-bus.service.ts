import { Injectable, Logger } from '@nestjs/common';
import { Subject, Observable, filter } from 'rxjs';
import { DomainEvent, IEventPublisher } from './domain-event.interface';

@Injectable()
export class EventBusService implements IEventPublisher {
  private readonly logger = new Logger(EventBusService.name);
  private readonly bus$ = new Subject<DomainEvent>();

  async publish<T extends DomainEvent>(event: T): Promise<void> {
    this.logger.log(
      `[EventBus] Publishing event: ${event.eventName} for aggregate: ${event.aggregateId}`,
    );
    this.bus$.next(event);
  }

  async publishAll<T extends DomainEvent>(events: T[]): Promise<void> {
    for (const event of events) {
      await this.publish(event);
    }
  }

  ofType<T extends DomainEvent>(eventName: string): Observable<T> {
    return this.bus$
      .asObservable()
      .pipe(filter((event): event is T => event.eventName === eventName));
  }

  get stream$(): Observable<DomainEvent> {
    return this.bus$.asObservable();
  }
}
