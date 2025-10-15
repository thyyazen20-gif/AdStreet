import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsUUID, IsNumber } from 'class-validator';

export class UploadFileDto {
  @ApiProperty({ example: 'order', description: 'Type of the entity associated with the file (e.g., order, vendor, user)' })
  @IsString()
  entityType: string;

  @ApiProperty({ example: 'uuid-of-entity', description: 'ID of the associated entity' })
  @IsUUID()
  entityId: string;

  @ApiProperty({ example: 'my_document.pdf', description: 'Original name of the file' })
  @IsString()
  fileName: string;

  @ApiProperty({ example: 'application/pdf', description: 'MIME type of the file', required: false })
  @IsOptional()
  @IsString()
  fileType?: string;

  @ApiProperty({ example: 102400, description: 'Size of the file in bytes', required: false })
  @IsOptional()
  @IsNumber()
  fileSize?: number;
}

