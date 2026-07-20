/*
  Warnings:

  - Added the required column `propertyType` to the `properties` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PropertyType" AS ENUM ('APARTMENT', 'HOUSE', 'VILLA', 'OFFICE', 'STUDIO');

-- AlterTable
ALTER TABLE "properties" ADD COLUMN     "propertyType" "PropertyType" NOT NULL;
