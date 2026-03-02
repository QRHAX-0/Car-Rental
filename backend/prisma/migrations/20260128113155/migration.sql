/*
  Warnings:

  - Changed the type of `seating_capacity` on the `Car` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Car" DROP COLUMN "seating_capacity",
ADD COLUMN     "seating_capacity" INTEGER NOT NULL;
