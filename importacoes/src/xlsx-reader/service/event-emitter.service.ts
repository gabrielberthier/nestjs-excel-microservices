import { Injectable } from '@nestjs/common';
import { EventDto } from '../domain/event.dto';

export interface EmitterServiceInterface {
  emit(event: EventDto): Promise<void>;
}

@Injectable()
export class MockedEmitterService implements EmitterServiceInterface {
  async emit(event: EventDto): Promise<void> {
    console.log(event);

    return Promise.resolve();
  }
}
