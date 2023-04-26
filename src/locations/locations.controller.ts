import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Inject,
  Res,
} from '@nestjs/common';
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
import { createObjectCsvWriter } from 'csv-writer';
import * as fs from 'fs';

@Controller('api/locations')
@ApiTags('Locations')
export class LocationsController {
  constructor(
    @Inject(CACHE_MANAGER) private cacheService: Cache,
    private readonly locationsService: LocationsService,
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

  @Get('download')
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
  async download(@Query() query: LocationsQuery, @Res() res): Promise<any> {
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
    const header = [
      { id: 'id', title: 'ID' },
      { id: 'object_id', title: 'OBJECT_ID' },
      { id: 'object_type', title: 'OBJECT_TYPE' },
      { id: 'latitude', title: 'LATITUDE' },
      { id: 'longitude', title: 'LONGITUDE' },
      { id: 'created_at', title: 'CREATED_AT' },
      { id: 'updated_at', title: 'UPDATED_AT' },
    ];
    if (!fs.existsSync('csv')) {
      fs.mkdirSync('csv');
    }
    const csvWriter = createObjectCsvWriter({
      path: `csv/${cacheKey}.csv`,
      header,
    });

    const cachedResp: object[] = await this.cacheService.get(cacheKey);
    if (cachedResp) {
      await csvWriter.writeRecords(cachedResp);

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=data.csv');
      fs.createReadStream(`csv/${cacheKey}.csv`).pipe(res);
    } else {
      const locations = await this.locationsService.findAll(query, cacheKey);
      await csvWriter.writeRecords(locations);

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=data.csv');
      fs.createReadStream(`csv/${cacheKey}.csv`).pipe(res);
    }
  }
}
