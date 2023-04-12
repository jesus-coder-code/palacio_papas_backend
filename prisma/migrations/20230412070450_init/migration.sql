/*
  Warnings:

  - You are about to alter the column `role` on the `user` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(0))`.
  - A unique constraint covering the columns `[id]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `user` MODIFY `role` ENUM('Admin', 'Cashier') NOT NULL DEFAULT 'Admin';

-- CreateIndex
CREATE UNIQUE INDEX `User_id_key` ON `User`(`id`);
