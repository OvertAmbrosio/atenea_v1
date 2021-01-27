import { Controller, Get, Res } from '@nestjs/common';
import { MailService } from './mail.service';

@Controller('/mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Get('template')
  sendTemplate() {
    // res.writeHead(200, { 'Content-Type': 'image/png' });
    // return res.end( await this.mailService.example2(), 'binary');
    return this.mailService.reportesToa();
  };
};

