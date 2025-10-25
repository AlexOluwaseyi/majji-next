/*
  Warnings:

  - The `verified` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `type` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Type" AS ENUM ('buyer', 'seller');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "company" TEXT,
DROP COLUMN "type",
ADD COLUMN     "type" "Type" NOT NULL,
DROP COLUMN "verified",
ADD COLUMN     "verified" BOOLEAN NOT NULL DEFAULT false;
