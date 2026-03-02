/*
  Warnings:

  - You are about to drop the column `agentId` on the `Car` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Car` table. All the data in the column will be lost.
  - You are about to drop the column `agentId` on the `Rental` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Rental` table. All the data in the column will be lost.
  - You are about to drop the column `agentId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Agent` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `customerId` to the `Rental` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'AGENT';

-- DropForeignKey
ALTER TABLE "Car" DROP CONSTRAINT "Car_agentId_fkey";

-- DropForeignKey
ALTER TABLE "Car" DROP CONSTRAINT "Car_userId_fkey";

-- DropForeignKey
ALTER TABLE "Rental" DROP CONSTRAINT "Rental_agentId_fkey";

-- DropForeignKey
ALTER TABLE "Rental" DROP CONSTRAINT "Rental_userId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_agentId_fkey";

-- AlterTable
ALTER TABLE "Car" DROP COLUMN "agentId",
DROP COLUMN "userId",
ADD COLUMN     "agencyId" INTEGER;

-- AlterTable
ALTER TABLE "Rental" DROP COLUMN "agentId",
DROP COLUMN "userId",
ADD COLUMN     "customerId" INTEGER NOT NULL,
ADD COLUMN     "pickupStaffId" INTEGER,
ADD COLUMN     "returnStaffId" INTEGER;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "agentId",
ADD COLUMN     "agencyId" INTEGER;

-- DropTable
DROP TABLE "Agent";

-- CreateTable
CREATE TABLE "Agency" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Agency_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_agencyId_fkey" FOREIGN KEY ("agencyId") REFERENCES "Agency"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Car" ADD CONSTRAINT "Car_agencyId_fkey" FOREIGN KEY ("agencyId") REFERENCES "Agency"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rental" ADD CONSTRAINT "Rental_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rental" ADD CONSTRAINT "Rental_pickupStaffId_fkey" FOREIGN KEY ("pickupStaffId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rental" ADD CONSTRAINT "Rental_returnStaffId_fkey" FOREIGN KEY ("returnStaffId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
