
import prisma from "@/lib/prisma";

export const PhilosophyService = {
  async createQuote(data: any) {
    // Data likely: { philosopher: {...}, quotes: [...] }
    return await prisma.philosopherQuote.create({
        data: {
          philosopher: data.philosopher,
          quotes: data.quotes
        }
    });
  },

  async getQuotes() {
    return await prisma.philosopherQuote.findMany();
  },

  async getRandomQuoteAndLog() {
    // Prisma random access is tricky.
    // 1. Count
    const count = await prisma.philosopherQuote.count();
    if (count === 0) return null;

    // 2. Skip random
    const skip = Math.floor(Math.random() * count);
    const results = await prisma.philosopherQuote.findMany({
        take: 1,
        skip: skip
    });

    if (results.length === 0) return null;
    const quoteDoc = results[0];

    const philosopher = (quoteDoc.philosopher as any).name;
    const traits = (quoteDoc.philosopher as any).qualities;
    const quotes = quoteDoc.quotes as string[];
    const quote = quotes[Math.floor(Math.random() * quotes.length)];
    
    // Log it
    await prisma.loggedQuote.create({
        data: {
            quoteId: quoteDoc.id,
            philosopher: philosopher,
            quote: quote
        }
    });

    return {
        id: quoteDoc.id,
        philosopher,
        quote,
        traits
    };
  },

  async flushQuotes() {
      return await prisma.philosopherQuote.deleteMany();
  }
};
