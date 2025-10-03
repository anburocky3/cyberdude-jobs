-- AlterTable: add interviewProcess and result enums
ALTER TABLE `Application`
ADD COLUMN `interviewProcess` ENUM('pending', 'started','in_progress','completed') NOT NULL DEFAULT 'pending',
ADD COLUMN `result` ENUM('pending', 'hired','hold','reject') NULL;


