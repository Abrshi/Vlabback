-- CreateTable
CREATE TABLE `ChemicalReactionResult` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `formula` VARCHAR(255) NOT NULL,
    `reaction_type` VARCHAR(50) NOT NULL,
    `color_gradient` VARCHAR(100) NOT NULL,
    `temperature` INTEGER NOT NULL,
    `observations` TEXT NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ChemicalReactionResult` ADD CONSTRAINT `ChemicalReactionResult_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
