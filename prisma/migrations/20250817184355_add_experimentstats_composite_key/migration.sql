/*
  Warnings:

  - A unique constraint covering the columns `[user_id,exType]` on the table `ExperimentStats` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `ExperimentStats_user_id_exType_key` ON `ExperimentStats`(`user_id`, `exType`);
