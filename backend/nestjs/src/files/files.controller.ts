import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { FilesService } from './files.service';
import { UploadFileDto } from './dto/upload-file.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Files')
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('presigned-url')
  @ApiOperation({ summary: 'Generate a pre-signed URL for file upload' })
  @ApiResponse({ status: 201, description: 'Pre-signed URL generated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async generatePresignedUrl(@Body() uploadFileDto: UploadFileDto): Promise<{ url: string; fields: { [key: string]: string }; fileId: string }> {
    return this.filesService.generatePresignedPost(uploadFileDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get file details by ID' })
  @ApiResponse({ status: 200, description: 'File details retrieved successfully' })
  @ApiResponse({ status: 404, description: 'File not found' })
  async getFileById(@Param('id') id: string) {
    return this.filesService.findFileById(id);
  }
}
