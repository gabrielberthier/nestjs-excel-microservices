import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';

@Controller()
export class AppController {
  private countEvents = 0;

  @EventPattern('relatorio_de_missoes')
  microserviceTest(data: Record<string, unknown>): string {
    console.log(data);
    console.log(`Events received: ${this.countEvents++}`);
    return JSON.stringify(data) + ' - MICROSERVICE';
  }
}
