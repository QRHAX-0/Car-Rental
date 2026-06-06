-- AlterTable
ALTER TABLE "Car" ADD COLUMN     "mileage" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Rental" ADD COLUMN     "agentId" INTEGER,
ADD COLUMN     "returnedAt" TIMESTAMP(3);

-- AddForeignKey
ALTER TABLE "Rental" ADD CONSTRAINT "Rental_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent"("id") ON DELETE SET NULL ON UPDATE CASCADE;
