/*
  Warnings:

  - You are about to drop the `PropertyMedia` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PropertyMedia" DROP CONSTRAINT "PropertyMedia_propertyId_fkey";

-- DropTable
DROP TABLE "PropertyMedia";

-- CreateTable
CREATE TABLE "propertymedias" (
    "id" SERIAL NOT NULL,
    "property" INTEGER NOT NULL,
    "mediaType" TEXT NOT NULL,
    "mediaUrl" TEXT NOT NULL,
    "description" TEXT,
    "uploadDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "propertymedias_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "propertymedias" ADD CONSTRAINT "propertymedias_property_fkey" FOREIGN KEY ("property") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
