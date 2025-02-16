/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `Tenant` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `id` to the `Tenant` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Tenant" ADD COLUMN     "id" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Tenant_id_key" ON "Tenant"("id");
