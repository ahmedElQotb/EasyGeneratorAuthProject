import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ContentService } from './content.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guards';

@ApiTags('Content')
@Controller('content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Get('quote')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a random quote' })
  @ApiResponse({ status: 200, description: 'Returns a random quote' })
  @ApiResponse({ status: 401, description: 'Unauthorized - access token required' })
  getQuote() {
    return { quote: this.contentService.getQuote() };
  }
}
