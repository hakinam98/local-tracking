import { PrismaClient } from '@prisma/client';
import { CreateLocationDto } from 'src/locations/dto/create-location.dto';

const prisma = new PrismaClient();

async function main() {
  const locations: CreateLocationDto[] = [];

  for (let i = 1; i <= 1000; i++) {
    const location: CreateLocationDto = {
      object_id: Math.floor(Math.random() * 200) + 1,
      object_type: ['car', 'bike', 'bus'][Math.floor(Math.random() * 3)],
      latitude: Math.random() * (90 - -90) + -90,
      longitude: Math.random() * (180 - -180) + -180,
      created_at: new Date(
        Date.now() - Math.floor(Math.random() * 10000000000),
      ),
      updated_at: new Date(),
    };

    locations.push(location);
  }

  for (const location of locations) {
    await prisma.locations.create({
      data: location,
    });
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
