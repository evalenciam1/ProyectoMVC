/*
  Warnings:

  - Added the required column `costo` to the `DetalleOrdenTrabajo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `detalleordentrabajo` ADD COLUMN `costo` INTEGER NOT NULL;
