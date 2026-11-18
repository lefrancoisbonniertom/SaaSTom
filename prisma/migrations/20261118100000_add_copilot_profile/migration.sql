-- CreateTable
CREATE TABLE IF NOT EXISTS "CopilotProfile" (
    "userId" TEXT NOT NULL,
    "activity" TEXT NOT NULL,
    "periodicity" TEXT NOT NULL,
    "startDate" TEXT NOT NULL,
    "revenueThisYear" INTEGER NOT NULL DEFAULT 0,
    "doneIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "emailReminders" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CopilotProfile_pkey" PRIMARY KEY ("userId")
);

-- AddForeignKey
DO $$ BEGIN
    ALTER TABLE "CopilotProfile" ADD CONSTRAINT "CopilotProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
