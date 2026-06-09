import fs from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";
import { getDatabasePath } from "@/lib/server/database-url";

let didInitialize = false;

export function ensureDatabase() {
  if (didInitialize) {
    return;
  }

  const databasePath = getDatabasePath();

  if (databasePath !== ":memory:") {
    fs.mkdirSync(path.dirname(databasePath), { recursive: true });
  }

  const db = new Database(databasePath);

  db.pragma("foreign_keys = ON");
  db.exec(`
    CREATE TABLE IF NOT EXISTS "Client" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "name" TEXT NOT NULL,
      "work" TEXT NOT NULL,
      "amount" INTEGER NOT NULL DEFAULT 0,
      "status" TEXT NOT NULL DEFAULT 'Prospect',
      "contact" TEXT NOT NULL,
      "nextAction" TEXT NOT NULL,
      "createdAt" TEXT NOT NULL,
      "updatedAt" TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "Document" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "title" TEXT NOT NULL,
      "type" TEXT NOT NULL,
      "content" TEXT NOT NULL,
      "clientName" TEXT,
      "clientId" TEXT,
      "createdAt" TEXT NOT NULL,
      "updatedAt" TEXT NOT NULL,
      CONSTRAINT "Document_clientId_fkey"
        FOREIGN KEY ("clientId")
        REFERENCES "Client" ("id")
        ON DELETE SET NULL
        ON UPDATE CASCADE
    );

    CREATE TABLE IF NOT EXISTS "Task" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "title" TEXT NOT NULL,
      "done" BOOLEAN NOT NULL DEFAULT false,
      "createdAt" TEXT NOT NULL,
      "updatedAt" TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "Usage" (
      "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'default',
      "aiCreditsUsed" INTEGER NOT NULL DEFAULT 0,
      "updatedAt" TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS "Document_clientId_idx"
      ON "Document" ("clientId");
  `);
  db.close();

  didInitialize = true;
}
