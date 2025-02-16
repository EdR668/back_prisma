/*
  Warnings:

  - You are about to drop the `propertymedias` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "propertymedias" DROP CONSTRAINT "propertymedias_property_fkey";

-- DropTable
DROP TABLE "propertymedias";

-- CreateTable
CREATE TABLE "PropertyMedia" (
    "id" SERIAL NOT NULL,
    "property" INTEGER NOT NULL,
    "mediaType" TEXT NOT NULL,
    "mediaUrl" TEXT NOT NULL,
    "description" TEXT,
    "uploadDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PropertyMedia_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PropertyMedia" ADD CONSTRAINT "PropertyMedia_property_fkey" FOREIGN KEY ("property") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
