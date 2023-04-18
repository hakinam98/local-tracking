import { Injectable } from '@nestjs/common';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class LocationsService {
  constructor(private prisma: PrismaService) {}
  async create(createLocationDto: CreateLocationDto) {
    const location = await this.prisma.locations.create({
      data: createLocationDto,
    });

    return location;
  }

  findAll() {
    return this.prisma.locations.findMany();
  }

  async findOne(id: string) {
    const location = await this.prisma.locations.findUnique({ where: { id } });
    return location;
  }

  async update(id: string, updateLocationDto: UpdateLocationDto) {
    const updatedLocation = await this.prisma.locations.update({
      where: {
        id,
      },
      data: updateLocationDto,
    });
    return updatedLocation;
  }

  remove(id: string) {
    return this.prisma.locations.delete({
      where: { id },
    });
  }
}
