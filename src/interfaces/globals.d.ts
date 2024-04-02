declare global {
  // Namespace NodeJS to extend its global type
  namespace NodeJS {
    interface Global {
      prisma: PrismaClient;
    }
  }
}
