import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@/generated/prisma/client";
import { getDatabaseUrl } from "@/lib/server/database-url";
import { ensureDatabase } from "@/lib/server/sqlite-schema";

ensureDatabase();

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

const adapter = new PrismaBetterSqlite3(
  { url: getDatabaseUrl() },
  { timestampFormat: "iso8601" },
);

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
