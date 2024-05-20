import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';

export const CloudinaryProvider = {
  provide: 'CLOUDINARY',
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => {
    return cloudinary.config({
      cloud_name: configService.get('cloudinary.name'),
      api_key: configService.get<string>('cloudinary.key'),
      api_secret: configService.get('cloudinary.secret'),
    });
  },
};
