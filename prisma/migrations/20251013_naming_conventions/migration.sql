-- Drop existing foreign keys to allow table/column renames
ALTER TABLE `application` DROP FOREIGN KEY `Application_jobId_fkey`;
ALTER TABLE `interviewslot` DROP FOREIGN KEY `InterviewSlot_availabilityId_fkey`;
ALTER TABLE `screeningnote` DROP FOREIGN KEY `ScreeningNote_applicationId_fkey`;

-- Rename tables to plural snake_case
RENAME TABLE `admin` TO `admins`;
RENAME TABLE `application` TO `applications`;
RENAME TABLE `interview_availability` TO `interview_availabilities`;
RENAME TABLE `interviewslot` TO `interview_slots`;
RENAME TABLE `job` TO `jobs`;
RENAME TABLE `screeningnote` TO `screening_notes`;

-- Admins: rename columns and indexes
ALTER TABLE `admins`
  RENAME COLUMN `passwordHash` TO `password_hash`,
  RENAME COLUMN `isActive` TO `is_active`,
  RENAME COLUMN `createdAt` TO `created_at`,
  RENAME COLUMN `updatedAt` TO `updated_at`;

-- Rename unique index on admins.email (optional name change)
DROP INDEX `Admin_email_key` ON `admins`;
CREATE UNIQUE INDEX `ux_admins_email` ON `admins`(`email`);

-- Applications: rename columns
ALTER TABLE `applications`
  RENAME COLUMN `jobId` TO `job_id`,
  RENAME COLUMN `userEmail` TO `user_email`,
  RENAME COLUMN `userName` TO `user_name`,
  RENAME COLUMN `profileImage` TO `profile_image`,
  RENAME COLUMN `dateOfBirth` TO `date_of_birth`,
  RENAME COLUMN `mobileNo` TO `mobile_no`,
  RENAME COLUMN `currentStatus` TO `current_status`,
  RENAME COLUMN `educationSchool` TO `education_school`,
  RENAME COLUMN `educationSchoolPercentage` TO `education_school_percentage`,
  RENAME COLUMN `educationCollege` TO `education_college`,
  RENAME COLUMN `educationCollegePercentage` TO `education_college_percentage`,
  RENAME COLUMN `workedAlready` TO `worked_already`,
  RENAME COLUMN `companyName` TO `company_name`,
  RENAME COLUMN `resumeUrl` TO `resume_url`,
  RENAME COLUMN `reasonToJoin` TO `reason_to_join`,
  RENAME COLUMN `excitedAboutStartup` TO `excited_about_startup`,
  RENAME COLUMN `cameFrom` TO `came_from`,
  RENAME COLUMN `acceptCondition` TO `accept_condition`,
  RENAME COLUMN `totalScore` TO `total_score`,
  RENAME COLUMN `interviewProcess` TO `interview_process`,
  RENAME COLUMN `createdAt` TO `created_at`,
  RENAME COLUMN `updatedAt` TO `updated_at`;

-- Drop and recreate index on applications.job_id with new name
DROP INDEX `Application_jobId_fkey` ON `applications`;
CREATE INDEX `ix_applications_job_id` ON `applications`(`job_id`);

-- Interview availabilities: rename columns
ALTER TABLE `interview_availabilities`
  RENAME COLUMN `startTime` TO `start_time`,
  RENAME COLUMN `endTime` TO `end_time`,
  RENAME COLUMN `slotMinutes` TO `slot_minutes`,
  RENAME COLUMN `createdAt` TO `created_at`,
  RENAME COLUMN `updatedAt` TO `updated_at`;

-- Interview slots: rename columns and indexes
ALTER TABLE `interview_slots`
  RENAME COLUMN `availabilityId` TO `availability_id`,
  RENAME COLUMN `startsAt` TO `starts_at`,
  RENAME COLUMN `endsAt` TO `ends_at`,
  RENAME COLUMN `bookedByEmail` TO `booked_by_email`,
  RENAME COLUMN `applicationId` TO `application_id`,
  RENAME COLUMN `createdAt` TO `created_at`,
  RENAME COLUMN `updatedAt` TO `updated_at`;

-- Rename unique and regular indexes on interview_slots
DROP INDEX `InterviewSlot_startsAt_key` ON `interview_slots`;
CREATE UNIQUE INDEX `ux_interview_slots_starts_at` ON `interview_slots`(`starts_at`);
DROP INDEX `InterviewSlot_availabilityId_idx` ON `interview_slots`;
CREATE INDEX `ix_interview_slots_availability_id` ON `interview_slots`(`availability_id`);

-- Jobs: rename columns and unique index
ALTER TABLE `jobs`
  RENAME COLUMN `workSchedule` TO `work_schedule`,
  RENAME COLUMN `workMode` TO `work_mode`,
  RENAME COLUMN `minQualifications` TO `min_qualifications`,
  RENAME COLUMN `preferredQualifications` TO `preferred_qualifications`,
  RENAME COLUMN `startingDate` TO `starting_date`,
  RENAME COLUMN `minDuration` TO `min_duration`,
  RENAME COLUMN `expectedStipend` TO `expected_stipend`,
  RENAME COLUMN `lastDate` TO `last_date`,
  RENAME COLUMN `applicationDeadline` TO `application_deadline`,
  RENAME COLUMN `postedDate` TO `posted_date`,
  RENAME COLUMN `whoCanApply` TO `who_can_apply`,
  RENAME COLUMN `createdAt` TO `created_at`,
  RENAME COLUMN `updatedAt` TO `updated_at`;

DROP INDEX `Job_slug_key` ON `jobs`;
CREATE UNIQUE INDEX `ux_jobs_slug` ON `jobs`(`slug`);

-- Screening notes: rename columns and index
ALTER TABLE `screening_notes`
  RENAME COLUMN `applicationId` TO `application_id`,
  RENAME COLUMN `createdBy` TO `created_by`,
  RENAME COLUMN `createdAt` TO `created_at`,
  RENAME COLUMN `updatedAt` TO `updated_at`;

DROP INDEX `ScreeningNote_applicationId_idx` ON `screening_notes`;
CREATE INDEX `ix_screening_notes_application_id` ON `screening_notes`(`application_id`);

-- Recreate foreign keys with new names and columns
ALTER TABLE `applications`
  ADD CONSTRAINT `fk_applications_job_id` FOREIGN KEY (`job_id`) REFERENCES `jobs`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE `interview_slots`
  ADD CONSTRAINT `fk_interview_slots_availability_id` FOREIGN KEY (`availability_id`) REFERENCES `interview_availabilities`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE `screening_notes`
  ADD CONSTRAINT `fk_screening_notes_application_id` FOREIGN KEY (`application_id`) REFERENCES `applications`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;


