import { Test, TestingModule } from '@nestjs/testing';
import { ContentService } from './content.service';
import { QUOTES } from './constants/content.constants';

describe('ContentService', () => {
  let service: ContentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContentService],
    }).compile();

    service = module.get<ContentService>(ContentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getQuote', () => {
    it('should return a string', () => {
      const result = service.getQuote();
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('should return different quotes on multiple calls', () => {
      const quotes = new Set();
      
      // Call 100 times to increase chance of getting different quotes
      for (let i = 0; i < 100; i++) {
        quotes.add(service.getQuote());
      }

      // Since we have 12 quotes, we should get at least 2 different ones
      expect(quotes.size).toBeGreaterThan(1);
    });

    it('should return a quote from the predefined list', () => {
      const result = service.getQuote();
      expect(QUOTES).toContain(result);
    });
  });
});
