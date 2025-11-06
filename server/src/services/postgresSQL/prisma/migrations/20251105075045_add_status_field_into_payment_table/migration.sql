-- AlterTable
ALTER TABLE "Payments" ADD COLUMN     "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING';
