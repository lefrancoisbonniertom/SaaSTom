import path from "node:path";
import { fileURLToPath } from "node:url";

const DEFAULT_DATABASE_URL = "file:./prisma/dev.db";

export function getDatabaseUrl() {
  return process.env.DATABASE_URL ?? DEFAULT_DATABASE_URL;
}

export function getDatabasePath() {
  const url = getDatabaseUrl();

  if (url === ":memory:") {
    return url;
  }

  if (!url.startsWith("file:")) {
    throw new Error("SaaSTom only supports SQLite file: URLs locally.");
  }

  const filePath = url.slice("file:".length);

  if (filePath.startsWith("//")) {
    return fileURLToPath(url);
  }

  if (path.isAbsolute(filePath)) {
    return filePath;
  }

  return path.resolve(/* turbopackIgnore: true */ process.cwd(), filePath);
}
