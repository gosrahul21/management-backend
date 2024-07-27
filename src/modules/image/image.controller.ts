// src/image/image.controller.ts
import { Controller, Get, Param, Post, Res, UseInterceptors, UploadedFile, HttpException, HttpStatus } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageService } from './image.service';
import { Response, Express, MediaType } from 'express';
import { diskStorage } from 'multer';

@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit for uploaded file
    // storage: diskStorage({}),
  }))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new HttpException('No file uploaded', HttpStatus.BAD_REQUEST);
    }

    const savedImage = await this.imageService.uploadImage(file);
    return savedImage;
  }

  @Get(':id')
  async getImage(@Param('id') id: string, @Res() res: Response) {
    const image = await this.imageService.getImageById(id);
    res.setHeader('Content-Type', image.contentType);
    res.send(image.data);
  }
}
