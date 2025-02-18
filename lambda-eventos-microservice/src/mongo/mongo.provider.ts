import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

export const MongoDbRegister = MongooseModule.forRootAsync({
  inject: [ConfigService],
  imports: [ConfigModule],
  useFactory: (configService: ConfigService) => {
    const uri =
      configService.get<string>('MONGODB_CONNECTION_STRING') ??
      'mongodb://test:test@mongo:27017';

    const dbName =
      configService.get<string>('MONGODB_DATABASE_NAME') ?? 'mongo';

    return {
      uri,
      dbName,
      user: 'test',
      pass: 'test',
    };
  },
});
