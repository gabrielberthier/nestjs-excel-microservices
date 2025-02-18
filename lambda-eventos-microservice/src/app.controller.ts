import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Controller()
export class AppController {
  private countEvents = 0;

  constructor(@InjectModel(Event.name) private readonly model: Model<Event>) {}

  @EventPattern('disciplinas')
  async microserviceTest(data: Record<string, unknown>): Promise<string> {
    await this.model.create(data);
    this.countEvents++;

    return JSON.stringify(data) + ' - MICROSERVICE';
  }
}
