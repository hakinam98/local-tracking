import { ApiProperty } from '@nestjs/swagger';
import { Locations } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class LocationsEntity implements Locations {
  @ApiProperty()
  id: string;

  @ApiProperty()
  object_id: number;

  @ApiProperty()
  object_type: string;

  @Exclude()
  latitude: number;

  @ApiProperty()
  longitude: number;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
}
