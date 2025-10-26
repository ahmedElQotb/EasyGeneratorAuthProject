import { Injectable } from '@nestjs/common';

@Injectable()
export class ContentService {
  private readonly quotes: string[] = [
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
    "Life is a long lesson in humility. - James M. Barrie",
  ];

  getQuote(): string {
    const randomIndex = Math.floor(Math.random() * this.quotes.length);
    return this.quotes[randomIndex];
  }
}
