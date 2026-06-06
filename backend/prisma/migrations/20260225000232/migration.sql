/*
  Warnings:

  - You are about to drop the column `fuel_type` on the `Car` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `Car` table. All the data in the column will be lost.
  - You are about to drop the column `price_per_day` on the `Car` table. All the data in the column will be lost.
  - You are about to drop the column `seating_capacity` on the `Car` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[phoneNumber]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `fuelType` to the `Car` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pricePerDay` to the `Car` table without a default value. This is not possible if the table is not empty.
  - Added the required column `seatingCapacity` to the `Car` table without a default value. This is not possible if the table is not empty.
  - Made the column `agencyId` on table `Car` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `phoneNumber` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Car" DROP CONSTRAINT "Car_agencyId_fkey";

-- DropForeignKey
ALTER TABLE "Rental" DROP CONSTRAINT "Rental_carId_fkey";

-- AlterTable
ALTER TABLE "Car" DROP COLUMN "fuel_type",
DROP COLUMN "image",
DROP COLUMN "price_per_day",
DROP COLUMN "seating_capacity",
ADD COLUMN     "fuelType" TEXT NOT NULL,
ADD COLUMN     "pricePerDay" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "seatingCapacity" INTEGER NOT NULL,
ALTER COLUMN "agencyId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Rental" ALTER COLUMN "extraCharges" SET DEFAULT 0,
ALTER COLUMN "extraCharges" SET DATA TYPE DECIMAL(65,30);

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "phoneNumber" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "CarImages" (
    "id" SERIAL NOT NULL,
    "carId" INTEGER NOT NULL,
    "image" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "CarImages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_phoneNumber_key" ON "User"("phoneNumber");

-- AddForeignKey
ALTER TABLE "Car" ADD CONSTRAINT "Car_agencyId_fkey" FOREIGN KEY ("agencyId") REFERENCES "Agency"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarImages" ADD CONSTRAINT "CarImages_carId_fkey" FOREIGN KEY ("carId") REFERENCES "Car"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rental" ADD CONSTRAINT "Rental_carId_fkey" FOREIGN KEY ("carId") REFERENCES "Car"("id") ON DELETE CASCADE ON UPDATE CASCADE;
