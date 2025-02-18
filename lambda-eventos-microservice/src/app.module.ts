import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongoModule } from './mongo/mongo.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { EventSchema } from './domain/event.dto';

@Module({
  imports: [
    MongoModule,
    ConfigModule.forRoot(),
    MongooseModule.forFeature([{ name: Event.name, schema: EventSchema }]),
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [MongoModule],
})
export class AppModule {}
