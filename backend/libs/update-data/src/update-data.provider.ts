import { Provider } from '@nestjs/common';
import * as CloudinaryLib from 'cloudinary';
import * as NodeHtmlToImage from 'node-html-to-image';

export const HtmlToImage = 'lib:node-html-to-image';
export const Cloudinary = 'lib:cloudinary';

export const HtmlToImageProvider: Provider = {
  provide: HtmlToImage,
  useValue: NodeHtmlToImage
};

export const CloudinaryProvider: Provider = {
  provide: Cloudinary,
  useValue: CloudinaryLib
};