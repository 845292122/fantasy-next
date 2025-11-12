/*
  Warnings:

  - You are about to drop the column `endDate` on the `auth_account` table. All the data in the column will be lost.
  - You are about to drop the column `isPremium` on the `auth_account` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `auth_account` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `auth_account` table. All the data in the column will be lost.
  - You are about to alter the column `createdAt` on the `auth_account` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `updatedAt` on the `auth_account` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to drop the column `birthday` on the `auth_profile` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `auth_profile` table. All the data in the column will be lost.
  - You are about to drop the column `loginDate` on the `auth_profile` table. All the data in the column will be lost.
  - You are about to drop the column `loginIP` on the `auth_profile` table. All the data in the column will be lost.
  - You are about to alter the column `createdAt` on the `auth_profile` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `updatedAt` on the `auth_profile` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - A unique constraint covering the columns `[email]` on the table `auth_account` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `auth_account_phone_role_status_isPremium_idx` ON `auth_account`;

-- AlterTable
ALTER TABLE `auth_account` DROP COLUMN `endDate`,
    DROP COLUMN `isPremium`,
    DROP COLUMN `startDate`,
    DROP COLUMN `status`,
    ADD COLUMN `email` VARCHAR(100) NULL,
    ADD COLUMN `isActive` BOOLEAN NULL DEFAULT false,
    ADD COLUMN `lastLoginAt` TIMESTAMP NULL,
    MODIFY `createdAt` TIMESTAMP NOT NULL DEFAULT NOW(),
    MODIFY `updatedAt` TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE NOW();

-- AlterTable
ALTER TABLE `auth_profile` DROP COLUMN `birthday`,
    DROP COLUMN `email`,
    DROP COLUMN `loginDate`,
    DROP COLUMN `loginIP`,
    MODIFY `createdAt` TIMESTAMP NOT NULL DEFAULT NOW(),
    MODIFY `updatedAt` TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE NOW();

-- CreateIndex
CREATE UNIQUE INDEX `auth_account_email_key` ON `auth_account`(`email`);

-- CreateIndex
CREATE INDEX `auth_account_phone_role_isActive_idx` ON `auth_account`(`phone`, `role`, `isActive`);
