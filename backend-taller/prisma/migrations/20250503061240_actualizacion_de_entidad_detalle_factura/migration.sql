/*
  Warnings:

  - Added the required column `descripcion` to the `DetalleFactura` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `detallefactura` ADD COLUMN `descripcion` VARCHAR(191) NOT NULL;
