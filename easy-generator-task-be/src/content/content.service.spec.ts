import { Test, TestingModule } from '@nestjs/testing';
import { ContentService } from './content.service';

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

      // Since we have 11 quotes, we should get at least 2 different ones
      expect(quotes.size).toBeGreaterThan(1);
    });

    it('should return a quote from the predefined list', () => {
      const validQuotes = [
        "The only way to do great work is to love what you do. - Steve Jobs",
        "Innovation distinguishes between a leader and a follower. - Steve Jobs",
        "Life is what happens to you while you're busy making other plans. - John Lennon",
        "The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt",
        "It is during our darkest moments that we must focus to see the light. - Aristotle",
        "The way to get started is to quit talking and begin doing. - Walt Disney",
        "Spread love everywhere you go. Let no one ever come to you without leaving happier. - Mother Teresa",
        "Do one thing every day that scares you. - Eleanor Roosevelt",
        "The only impossible journey is the one you never begin. - Tony Robbins",
        "Don't judge each day by the harvest you reap but by the seeds that you plant. - Robert Louis Stevenson",
        "The purpose of our lives is to be happy. - Dalai Lama",
      ];

      const result = service.getQuote();
      expect(validQuotes).toContain(result);
    });
  });
});
