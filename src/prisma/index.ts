import { PrismaClient } from "@prisma/client";
// Enable logging
// https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging

let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  //@ts-ignore
  if (!global.prisma) {
    //@ts-ignore
    global.prisma = new PrismaClient();
  }
  //@ts-ignore
  prisma = global.prisma;
}

export default prisma;
