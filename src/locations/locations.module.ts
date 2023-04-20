import { CacheModule } from '@nestjs/cache-manager';
import { LocationsService } from './locations.service';
import { LocationsController } from './locations.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { redisStore } from 'cache-manager-redis-yet';
import { Module } from '@nestjs/common';
import { LocationsUtils } from 'src/utils/locations.utils';

@Module({
  controllers: [LocationsController],
  providers: [LocationsService, LocationsUtils],
  imports: [
    PrismaModule,
    CacheModule.registerAsync({
      useFactory: async () => ({
        store: await redisStore({
          socket: {
            host: process.env.REDIS_HOST,
            port: +process.env.REDIS_PORT,
          },
        }),
      }),
    }),
  ],
})
export class LocationsModule {}
