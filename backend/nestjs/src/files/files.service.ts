import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { File } from './file.entity';
import { UploadFileDto } from './dto/upload-file.dto';
import { S3Client } from '@aws-sdk/client-s3';
import { createPresignedPost } from '@aws-sdk/s3-request-presigner';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FilesService {
  private s3Client: S3Client;
  private readonly bucketName: string;

  constructor(
    @InjectRepository(File)
    private readonly filesRepository: Repository<File>,
    private readonly configService: ConfigService,
  ) {
    this.bucketName = this.configService.get<string>('S3_BUCKET_NAME');
    this.s3Client = new S3Client({
      region: this.configService.get<string>('S3_REGION'),
      credentials: {
        accessKeyId: this.configService.get<string>('S3_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get<string>('S3_SECRET_ACCESS_KEY'),
      },
    });
  }

  async generatePresignedPost(uploadFileDto: UploadFileDto): Promise<{ url: string; fields: { [key: string]: string }; fileId: string }> {
    const { entityType, entityId, fileName, fileType, fileSize } = uploadFileDto;

    const file = this.filesRepository.create({
      entityType,
      entityId,
      fileName,
      fileType,
      fileSize,
      fileUrl: '', // Will be updated after successful upload
    });
    await this.filesRepository.save(file);

    const key = `${entityType}/${entityId}/${file.id}-${fileName}`;

    const presignedPost = await createPresignedPost(this.s3Client, {
      Bucket: this.bucketName,
      Key: key,
      Fields: {
        'Content-Type': fileType,
      },
      Expires: 3600, // 1 hour
      Conditions: [
        ['content-length-range', 0, 50 * 1024 * 1024], // 0 to 50 MB
        { 'Content-Type': fileType },
      ],
    });

    // Update fileUrl with the expected S3 URL
    file.fileUrl = `${presignedPost.url}/${key}`;
    await this.filesRepository.save(file);

    return { ...presignedPost, fileId: file.id };
  }

  async findFileById(id: string): Promise<File> {
    return this.filesRepository.findOne({ where: { id } });
  }
}
