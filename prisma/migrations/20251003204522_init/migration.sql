-- CreateTable
CREATE TABLE `admin` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(255) NOT NULL,
    `name` VARCHAR(255) NULL,
    `passwordHash` VARCHAR(255) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Admin_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `application` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `jobId` INTEGER NOT NULL,
    `userEmail` VARCHAR(191) NOT NULL,
    `userName` VARCHAR(191) NULL,
    `profileImage` TEXT NULL,
    `gender` VARCHAR(191) NOT NULL,
    `dateOfBirth` VARCHAR(191) NOT NULL,
    `mobileNo` VARCHAR(191) NOT NULL,
    `currentStatus` VARCHAR(191) NOT NULL,
    `country` VARCHAR(191) NOT NULL,
    `state` VARCHAR(191) NOT NULL,
    `city` VARCHAR(191) NOT NULL,
    `linkedin` VARCHAR(191) NOT NULL,
    `portfolio` VARCHAR(191) NULL,
    `educationSchool` VARCHAR(191) NOT NULL,
    `educationSchoolPercentage` DOUBLE NOT NULL,
    `educationCollege` VARCHAR(191) NOT NULL,
    `educationCollegePercentage` DOUBLE NOT NULL,
    `workedAlready` BOOLEAN NOT NULL,
    `companyName` VARCHAR(191) NULL,
    `skills` JSON NOT NULL,
    `resumeUrl` TEXT NULL,
    `reasonToJoin` TEXT NOT NULL,
    `excitedAboutStartup` TEXT NOT NULL,
    `cameFrom` VARCHAR(191) NOT NULL,
    `acceptCondition` BOOLEAN NOT NULL,
    `totalScore` INTEGER NULL,
    `interviewProcess` ENUM('pending', 'started', 'in_progress', 'completed') NOT NULL DEFAULT 'started',
    `result` ENUM('pending', 'hired', 'hold', 'reject') NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Application_jobId_fkey`(`jobId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `interview_availability` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `date` DATETIME(3) NOT NULL,
    `startTime` DATETIME(3) NOT NULL,
    `endTime` DATETIME(3) NOT NULL,
    `slotMinutes` INTEGER NOT NULL DEFAULT 20,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `interviewslot` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `availabilityId` INTEGER NOT NULL,
    `startsAt` DATETIME(3) NOT NULL,
    `endsAt` DATETIME(3) NOT NULL,
    `bookedByEmail` VARCHAR(191) NULL,
    `applicationId` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `InterviewSlot_startsAt_key`(`startsAt`),
    INDEX `InterviewSlot_availabilityId_idx`(`availabilityId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `job` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `company` VARCHAR(191) NOT NULL,
    `location` VARCHAR(191) NOT NULL,
    `type` ENUM('fulltime', 'internship') NOT NULL,
    `workSchedule` VARCHAR(255) NULL,
    `workMode` VARCHAR(255) NOT NULL,
    `compensation` TEXT NULL,
    `description` TEXT NOT NULL,
    `overview` TEXT NULL,
    `responsibilities` JSON NULL,
    `minQualifications` JSON NULL,
    `preferredQualifications` JSON NULL,
    `perks` JSON NULL,
    `team` VARCHAR(255) NULL,
    `startingDate` VARCHAR(255) NULL,
    `minDuration` VARCHAR(64) NULL,
    `expectedStipend` VARCHAR(255) NULL,
    `lastDate` VARCHAR(64) NULL,
    `applicationDeadline` VARCHAR(64) NULL,
    `status` ENUM('open', 'expired') NULL,
    `postedDate` VARCHAR(64) NULL,
    `whoCanApply` TEXT NULL,
    `skills` JSON NULL,
    `openings` INTEGER NULL,
    `slug` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Job_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `screeningnote` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `applicationId` INTEGER NOT NULL,
    `stage` VARCHAR(64) NOT NULL,
    `verdict` VARCHAR(32) NULL,
    `score` INTEGER NULL,
    `notes` TEXT NULL,
    `createdBy` VARCHAR(255) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `ScreeningNote_applicationId_idx`(`applicationId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `application` ADD CONSTRAINT `Application_jobId_fkey` FOREIGN KEY (`jobId`) REFERENCES `job`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `interviewslot` ADD CONSTRAINT `InterviewSlot_availabilityId_fkey` FOREIGN KEY (`availabilityId`) REFERENCES `interview_availability`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `screeningnote` ADD CONSTRAINT `ScreeningNote_applicationId_fkey` FOREIGN KEY (`applicationId`) REFERENCES `application`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
