import { Module } from '@nestjs/common';
import { MongoDbRegister } from './mongo.provider';

@Module({
  imports: [MongoDbRegister],
  exports: [MongoDbRegister],
})
export class MongoModule {}
