import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateLocationDto } from './dto/create-location.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { LocationsEntity } from './entities/location.entity';
import LocationsQuery from 'src/interface/locationQuery.interface';

@Injectable()
export class LocationsService {
  constructor(private prisma: PrismaService) {}
  async create(createLocationDto: CreateLocationDto) {
    const location = await this.prisma.locations.create({
      data: createLocationDto,
    });

    return location;
  }

  async findAll(query: LocationsQuery) {
    const locations = await this.prisma.locations.findMany();
    let locationsFilter: Array<LocationsEntity>;

    if (query.object_id && !query.object_type) {
      throw new BadRequestException(
        'Both object_id and object_type are required.',
      );
    } else if (!query.object_id && query.object_type) {
      throw new BadRequestException(
        'Both object_id and object_type are required.',
      );
    } else if (query.object_id && query.object_type) {
      locationsFilter = locations.filter(
        (location) =>
          location.object_id === Number(query.object_id) &&
          location.object_type
            .toLowerCase()
            .includes(query.object_type.toLowerCase()),
      );
    } else if (query.created_at) {
      locationsFilter = locations.filter(
        (location) =>
          location.created_at.getTime() >= new Date(query.created_at).getTime(),
      );
    } else if (query.object_id && query.object_type && query.created_at) {
      locationsFilter = locations.filter(
        (location) =>
          location.object_id === Number(query.object_id) &&
          location.object_type
            .toLowerCase()
            .includes(query.object_type.toLowerCase()) &&
          location.created_at.getTime() >= new Date(query.created_at).getTime(),
      );
    } else {
      locationsFilter = locations;
    }
    return locationsFilter;
  }
}
