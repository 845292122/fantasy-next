-- CreateTable
CREATE TABLE `auth_account` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `phone` VARCHAR(20) NULL,
    `passwordHash` VARCHAR(1000) NULL,
    `role` TINYINT NOT NULL DEFAULT 2,
    `avatar` VARCHAR(255) NULL,
    `status` TINYINT NULL DEFAULT 0,
    `isPremium` TINYINT NULL DEFAULT 0,
    `startDate` DATETIME NULL,
    `endDate` DATETIME NULL,
    `createdAt` TIMESTAMP NOT NULL DEFAULT NOW(),
    `updatedAt` TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE NOW(),

    UNIQUE INDEX `auth_account_phone_key`(`phone`),
    INDEX `auth_account_phone_role_status_isPremium_idx`(`phone`, `role`, `status`, `isPremium`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `auth_profile` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `contact` VARCHAR(100) NULL,
    `shopName` VARCHAR(50) NULL,
    `creditCode` VARCHAR(50) NULL,
    `address` VARCHAR(255) NULL,
    `domain` VARCHAR(255) NULL,
    `birthday` DATETIME NULL,
    `email` VARCHAR(50) NULL,
    `wechatID` VARCHAR(255) NULL,
    `loginIP` VARCHAR(255) NULL,
    `loginDate` TIMESTAMP NULL,
    `remark` VARCHAR(500) NULL,
    `createdAt` TIMESTAMP NOT NULL DEFAULT NOW(),
    `updatedAt` TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE NOW(),
    `accountId` INTEGER NOT NULL,

    UNIQUE INDEX `auth_profile_accountId_key`(`accountId`),
    INDEX `auth_profile_contact_shopName_idx`(`contact`, `shopName`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `auth_profile` ADD CONSTRAINT `auth_profile_accountId_fkey` FOREIGN KEY (`accountId`) REFERENCES `auth_account`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
