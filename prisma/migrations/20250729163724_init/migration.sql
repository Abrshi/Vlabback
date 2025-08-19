-- AlterTable
ALTER TABLE `user` ADD COLUMN `is_verified` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `verification_token` VARCHAR(255) NULL;
