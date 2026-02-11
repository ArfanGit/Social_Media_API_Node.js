-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('DONOR', 'RECEIVER');

-- AlterTable
ALTER TABLE "User"
  ADD COLUMN "role" "UserRole" NOT NULL DEFAULT 'DONOR';

