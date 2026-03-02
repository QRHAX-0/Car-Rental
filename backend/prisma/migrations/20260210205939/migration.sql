-- CreateEnum
CREATE TYPE "FuelLevel" AS ENUM ('EMPTY', 'QUARTER', 'HALF', 'THREE_QUARTERS', 'FULL');

-- AlterTable
ALTER TABLE "Rental" ADD COLUMN     "endMileage" INTEGER,
ADD COLUMN     "pickupFuel" "FuelLevel",
ADD COLUMN     "returnFuel" "FuelLevel",
ADD COLUMN     "startMileage" INTEGER;
