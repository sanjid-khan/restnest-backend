/*
  Warnings:

  - You are about to drop the column `stripePaymentIntentId` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `stripeSessionId` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `isPremium` on the `properties` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[stripeCustomerId]` on the table `payments` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[stripeSubscriptionId]` on the table `payments` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "payments_rentalRequestId_key";

-- DropIndex
DROP INDEX "payments_stripePaymentIntentId_key";

-- DropIndex
DROP INDEX "payments_stripeSessionId_key";

-- AlterTable
ALTER TABLE "payments" DROP COLUMN "stripePaymentIntentId",
DROP COLUMN "stripeSessionId",
ADD COLUMN     "stripeCustomerId" TEXT,
ADD COLUMN     "stripeSubscriptionId" TEXT;

-- AlterTable
ALTER TABLE "properties" DROP COLUMN "isPremium";

-- CreateIndex
CREATE UNIQUE INDEX "payments_stripeCustomerId_key" ON "payments"("stripeCustomerId");

-- CreateIndex
CREATE UNIQUE INDEX "payments_stripeSubscriptionId_key" ON "payments"("stripeSubscriptionId");
