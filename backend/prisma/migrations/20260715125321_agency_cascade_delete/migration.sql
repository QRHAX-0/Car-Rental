-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_agencyId_fkey";

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_agencyId_fkey" FOREIGN KEY ("agencyId") REFERENCES "Agency"("id") ON DELETE CASCADE ON UPDATE CASCADE;
