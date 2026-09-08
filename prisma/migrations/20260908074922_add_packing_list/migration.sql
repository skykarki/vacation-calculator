-- AlterTable
ALTER TABLE "Trip" ADD COLUMN     "packingList" JSONB NOT NULL DEFAULT '[]';
