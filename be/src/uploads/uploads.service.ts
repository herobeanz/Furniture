import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { randomUUID } from 'crypto';

const ALLOWED_MIMES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
]);

@Injectable()
export class UploadsService {
  private readonly maxFileSize: number;
  private readonly cloudinaryFolder: string;

  constructor(private readonly config: ConfigService) {
    this.maxFileSize =
      Number(this.config.get<string>('MAX_FILE_SIZE')) || 5 * 1024 * 1024;
    this.cloudinaryFolder =
      this.config.get<string>('CLOUDINARY_FOLDER') || 'furniture';

    cloudinary.config({
      cloud_name: this.config.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.config.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.config.get<string>('CLOUDINARY_API_SECRET'),
    });
  }

  private validateFile(file: Express.Multer.File | undefined) {
    if (!file) {
      throw new BadRequestException('Không có file được tải lên');
    }
    if (file.size > this.maxFileSize) {
      const mb = Math.round(this.maxFileSize / (1024 * 1024));
      throw new BadRequestException(`File quá lớn. Tối đa ${mb}MB`);
    }
    if (!ALLOWED_MIMES.has(file.mimetype)) {
      throw new BadRequestException(
        'Định dạng không hợp lệ. Chỉ chấp nhận JPG, PNG, WEBP, GIF',
      );
    }
  }

  private uploadBuffer(file: Express.Multer.File): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'image',
          folder: this.cloudinaryFolder,
          public_id: randomUUID(),
        },
        (error, result) => {
          if (error || !result) {
            reject(error || new Error('Không thể tải ảnh lên Cloudinary'));
            return;
          }
          resolve(result);
        },
      );

      stream.end(file.buffer);
    });
  }

  async saveImage(file: Express.Multer.File) {
    this.validateFile(file);
    const result = await this.uploadBuffer(file);
    return { url: result.secure_url };
  }

  async saveImages(files: Express.Multer.File[]) {
    if (!files?.length) {
      throw new BadRequestException('Không có file được tải lên');
    }
    const urls: string[] = [];
    for (const file of files) {
      const { url } = await this.saveImage(file);
      urls.push(url);
    }
    return { urls };
  }
}
