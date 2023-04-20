import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsNotEmpty, IsString } from 'class-validator';

export class CreateLocationDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  object_id: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  object_type: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  latitude: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  longitude: number;

  // @ApiProperty({ required: false })
  // created_at?: Date;
  // @ApiProperty({ required: false })
  // updated_at?: Date;
}
