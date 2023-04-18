import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { LocationsService } from './locations.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { LocationsEntity } from './entities/location.entity';
import LocationsQuery from 'src/interface/locationQuery.interface';

@Controller('api/locations')
@ApiTags('Locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

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
  findAll(@Query() query: LocationsQuery) {
    return this.locationsService.findAll(query);
  }
}
