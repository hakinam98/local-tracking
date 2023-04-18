import { INestApplication, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  // constructor() {
  //   super({
  //     datasources: {
  //       default: {
  //         provider: 'mongodb',
  //         url: process.env.DATABASE_URL,
  //       },
  //     },
  //   });
  // }
  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }
}
