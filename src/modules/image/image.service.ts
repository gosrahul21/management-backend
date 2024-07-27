// src/image/image.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as sharp from 'sharp';
import { ImageDocument,Image } from './entities/image.entity';

@Injectable()
export class ImageService {
  constructor(@InjectModel(Image.name) private imageModel: Model<ImageDocument>) {}

  async uploadImage(file: Express.Multer.File): Promise<Image> {
    let imageData = file.buffer;

    // Resize image if it exceeds 200 KB
    if (file.size > 200 * 1024) {
      imageData = await sharp(file.buffer)
        .resize({ width: 800 }) // Resize width as an example
        .toBuffer();
    }

    const createdImage = new this.imageModel({
      filename: file.originalname,
      contentType: file.mimetype,
      data: imageData,
    });
    return createdImage.save();
  }

  async getImageById(id: string): Promise<Image> {
    const image = await this.imageModel.findById(id).exec();
    if (!image) {
      throw new NotFoundException('Image not found');
    }
    return image;
  }
}
