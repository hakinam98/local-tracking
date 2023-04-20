import { Controller, Get, Post, Body, Query, Inject } from '@nestjs/common';
import { LocationsService } from './locations.service';
import { CreateLocationDto } from './dto/create-location.dto';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { LocationsEntity } from './entities/location.entity';
import LocationsQuery from 'src/interface/locationQuery.interface';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { LocationsUtils } from 'src/utils/locations.utils';

@Controller('api/locations')
@ApiTags('Locations')
export class LocationsController {
  constructor(
    @Inject(CACHE_MANAGER) private cacheService: Cache,
    private readonly locationsService: LocationsService,
    private locationsUtils: LocationsUtils,
  ) {}

  @Post()
  @ApiCreatedResponse({ type: LocationsEntity })
  create(@Body() createLocationDto: CreateLocationDto) {
    return this.locationsService.create(createLocationDto);
  }

  @Get()
  @ApiQuery({
    name: 'object_id',
    required: false,
    type: Number,
    description: 'object_id',
  })
  @ApiQuery({
    name: 'object_type',
    required: false,
    type: String,
    description: 'object_type',
  })
  @ApiQuery({
    name: 'created_at',
    required: false,
    type: Date,
    description: 'created_at',
  })
  @ApiOkResponse({ type: LocationsEntity, isArray: true })
  async findAll(@Query() query: LocationsQuery): Promise<LocationsEntity[]> {
    let cacheKey: string;
    if (query.object_id && query.object_type) {
      cacheKey = `object_id=${query.object_id}&object_type=${query.object_type}`;
    } else if (query.created_at) {
      cacheKey = `created_at=${query.created_at}`;
    } else if (query.object_id && query.object_type && query.created_at) {
      cacheKey = `object_id=${query.object_id}&object_type=${query.object_type}&created_at=${query.created_at}`;
    } else {
      cacheKey = 'All';
    }
    const cachedResp = await this.cacheService.get(cacheKey);
    if (cachedResp) return cachedResp as LocationsEntity[];
    const locations = await this.locationsService.findAll(query, cacheKey);
    return locations;
  }
}
