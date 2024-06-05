import { Test, TestingModule } from '@nestjs/testing';
import { CloudinaryService } from './cloudinary.service';
import { v2 as cloudinary } from 'cloudinary';
import * as streamifier from 'streamifier';

// Mock Cloudinary methods
jest.mock('cloudinary', () => ({
  v2: {
    uploader: {
      upload_stream: jest.fn(),
      destroy: jest.fn(),
    },
  },
}));

describe('CloudinaryService', () => {
  let service: CloudinaryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CloudinaryService],
    }).compile();

    service = module.get<CloudinaryService>(CloudinaryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('uploadFile', () => {
    it('should upload a file successfully', async () => {
      const mockFile = {
        size: 500000,
        mimetype: 'image/jpeg',
        buffer: Buffer.from('mock data'),
      } as Express.Multer.File;

      const mockResult = { public_id: 'test-public-id', url: 'test-url' };
      (cloudinary.uploader.upload_stream as jest.Mock).mockImplementation(
        (options, callback) => {
          callback(null, mockResult);
          return new streamifier.PassThrough();
        },
      );

      const result = await service.uploadFile(mockFile, 'test-folder');
      expect(result).toEqual(mockResult);
    });
  });

  describe('deleteFile', () => {
    it('should delete a file successfully', async () => {
      const publicId = 'test-public-id';
      const mockResult = { result: 'ok' };

      (cloudinary.uploader.destroy as jest.Mock).mockImplementation(
        (publicId, callback) => {
          callback(null, mockResult);
        },
      );

      const result = await service.deleteFile(publicId);
      expect(result).toEqual(mockResult);
    });

    it('should handle errors during file deletion', async () => {
      const publicId = 'non-existent-id';

      (cloudinary.uploader.destroy as jest.Mock).mockImplementation(
        (publicId, callback) => {
          callback(new Error('Deletion error'), null);
        },
      );

      await expect(service.deleteFile(publicId)).rejects.toThrow(
        'Deletion error',
      );
    });
  });
});
