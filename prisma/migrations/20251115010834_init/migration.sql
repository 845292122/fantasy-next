/*
  Warnings:

  - You are about to alter the column `createdAt` on the `auth_account` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `updatedAt` on the `auth_account` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `lastLoginAt` on the `auth_account` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `createdAt` on the `auth_profile` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `updatedAt` on the `auth_profile` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.

*/
-- AlterTable
ALTER TABLE `auth_account` MODIFY `createdAt` TIMESTAMP NOT NULL DEFAULT NOW(),
    MODIFY `updatedAt` TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE NOW(),
    MODIFY `isActive` BOOLEAN NULL DEFAULT true,
    MODIFY `lastLoginAt` TIMESTAMP NULL;

-- AlterTable
ALTER TABLE `auth_profile` ADD COLUMN `isActive` BOOLEAN NOT NULL DEFAULT true,
    MODIFY `createdAt` TIMESTAMP NOT NULL DEFAULT NOW(),
    MODIFY `updatedAt` TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE NOW();
