/*
  Warnings:

  - Changed the type of `category` on the `Car` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "CarCategory" AS ENUM ('ALL','LUXURY', 'ELECTRIC', 'SPORT');

-- AlterTable
ALTER TABLE "Car" DROP COLUMN "category",
ADD COLUMN     "category" "CarCategory" NOT NULL;
