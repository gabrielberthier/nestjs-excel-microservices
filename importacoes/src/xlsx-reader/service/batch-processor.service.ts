import { Injectable } from '@nestjs/common';
import {
  EmitterServiceInterface,
  MockedEmitterService,
} from './event-emitter.service';
import { EventDto } from '../domain/event.dto';

@Injectable()
export class BatcProcessorService {
  private promisesBucket: Promise<void>[] = [];
  private readonly chunkSizes = 5;
  private readonly emitterService: EmitterServiceInterface;

  constructor() {
    this.emitterService = new MockedEmitterService();
  }

  public async process(event: EventDto): Promise<void> {
    if (this.promisesBucket.length <= this.chunkSizes) {
      this.promisesBucket.push(this.emitterService.emit(event));
    } else {
      await Promise.all(this.promisesBucket);
      this.promisesBucket = [];
    }
  }

  public async cleanUp() {
    if (this.promisesBucket.length) {
      await Promise.all(this.promisesBucket);
    }
  }
}
