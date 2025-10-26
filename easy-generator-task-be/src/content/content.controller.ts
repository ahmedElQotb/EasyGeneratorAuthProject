import { Controller, Get, UseGuards } from '@nestjs/common';
import { ContentService } from './content.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guards';

@Controller('content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Get('quote')
  @UseGuards(JwtAuthGuard)
  getQuote() {
    return { quote: this.contentService.getQuote() };
  }
}
