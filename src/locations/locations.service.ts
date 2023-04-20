import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateLocationDto } from './dto/create-location.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { LocationsEntity } from './entities/location.entity';
import LocationsQuery from 'src/interface/locationQuery.interface';
import { LocationsUtils } from 'src/utils/locations.utils';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class LocationsService {
  constructor(
    private prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheService: Cache,
    private locationsUtils: LocationsUtils,
  ) {}
  async create(createLocationDto: CreateLocationDto) {
    const location = await this.prisma.locations.create({
      data: createLocationDto,
    });
    return location;
  }

  async findAll(
    query: LocationsQuery,
    cacheKey: string,
  ): Promise<LocationsEntity[]> {
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
        (location: LocationsEntity) =>
          location.object_id === Number(query.object_id) &&
          location.object_type
            .toLowerCase()
            .includes(query.object_type.toLowerCase()),
      );
    } else if (query.created_at) {
      locationsFilter = locations.filter(
        (location: LocationsEntity) =>
          location.created_at.getTime() >= new Date(query.created_at).getTime(),
      );
    } else if (query.object_id && query.object_type && query.created_at) {
      locationsFilter = locations.filter(
        (location: LocationsEntity) =>
          location.object_id === Number(query.object_id) &&
          location.object_type
            .toLowerCase()
            .includes(query.object_type.toLowerCase()) &&
          location.created_at.getTime() >= new Date(query.created_at).getTime(),
      );
    } else {
      locationsFilter = locations;
    }
    await this.cacheService.set(cacheKey, locationsFilter, 5 * 60 * 1000);
    return locationsFilter;
  }
}
