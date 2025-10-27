import { Injectable } from '@nestjs/common';
import { QUOTES } from './constants/content.constants';

@Injectable()
export class ContentService {
  private readonly quotes: readonly string[] = QUOTES;

  getQuote(): string {
    const randomIndex = Math.floor(Math.random() * this.quotes.length);
    return this.quotes[randomIndex];
  }
}
