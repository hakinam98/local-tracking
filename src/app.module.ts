import { Module } from '@nestjs/common';
import { LocationsModule } from './locations/locations.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [LocationsModule, PrismaModule],
})
export class AppModule {}
