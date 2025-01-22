-- CreateEnum
CREATE TYPE "Role" AS ENUM ('User', 'Admin');

-- CreateTable
CREATE TABLE "QF_User" (
    "user_id" TEXT NOT NULL,
    "user_full_name" TEXT NOT NULL,
    "user_email" TEXT NOT NULL,
    "user_password" TEXT NOT NULL,
    "user_phone" TEXT,
    "user_photo" TEXT,
    "user_gender" TEXT,
    "role" "Role" DEFAULT 'User',
    "isBlockedByAdmin" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QF_User_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "QF_Admin_User" (
    "admin_user_id" TEXT NOT NULL,
    "admin_user_name" TEXT NOT NULL,
    "admin_user_email" TEXT NOT NULL,
    "admin_user_password" TEXT NOT NULL,
    "admin_user_photo" TEXT,
    "admin_user_phone" TEXT,
    "admin_user_gender" TEXT,
    "role" "Role" DEFAULT 'Admin',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QF_Admin_User_pkey" PRIMARY KEY ("admin_user_id")
);

-- CreateTable
CREATE TABLE "QF_User_Participation" (
    "user_participation_id" TEXT NOT NULL,
    "quiz_total_question" INTEGER NOT NULL,
    "quiz_total_marks" INTEGER NOT NULL,
    "quiz_estimated_time" TEXT NOT NULL,
    "quiz_display_time" TEXT NOT NULL,
    "quiz_time_taken" TEXT NOT NULL,
    "quiz_id" TEXT NOT NULL,
    "quiz_title" TEXT NOT NULL,
    "quiz_cover_photo" TEXT,
    "quiz_total_score" INTEGER NOT NULL,
    "quiz_correct_answers_count" INTEGER NOT NULL,
    "user_id" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QF_User_Participation_pkey" PRIMARY KEY ("user_participation_id")
);

-- CreateTable
CREATE TABLE "QF_Quiz" (
    "quiz_id" TEXT NOT NULL,
    "quiz_title" TEXT NOT NULL,
    "quiz_summary" TEXT NOT NULL,
    "quiz_display_time" TEXT NOT NULL,
    "quiz_estimated_time" TEXT NOT NULL,
    "quiz_total_question" INTEGER NOT NULL,
    "quiz_total_marks" INTEGER NOT NULL,
    "quiz_status" TEXT NOT NULL,
    "quiz_about_text" TEXT,
    "quiz_terms" TEXT[],
    "quiz_cover_photo" TEXT,
    "quiz_categories" TEXT[],
    "negative_marking_score" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QF_Quiz_pkey" PRIMARY KEY ("quiz_id")
);

-- CreateTable
CREATE TABLE "QF_Question" (
    "question_id" TEXT NOT NULL,
    "question_title" TEXT NOT NULL,
    "question_marks" INTEGER NOT NULL,
    "quizid" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QF_Question_pkey" PRIMARY KEY ("question_id")
);

-- CreateTable
CREATE TABLE "QF_Option" (
    "option_id" TEXT NOT NULL,
    "options" TEXT[],
    "correct_option" TEXT NOT NULL,
    "questionid" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QF_Option_pkey" PRIMARY KEY ("option_id")
);

-- CreateTable
CREATE TABLE "QF_Quiz_Category" (
    "category_id" TEXT NOT NULL,
    "category_title" TEXT NOT NULL,
    "category_slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QF_Quiz_Category_pkey" PRIMARY KEY ("category_id")
);

-- CreateTable
CREATE TABLE "QF_Winning_Prizes" (
    "prize_id" TEXT NOT NULL,
    "prize_type" INTEGER NOT NULL,
    "prize_description" TEXT NOT NULL,
    "prize_cover_photo" TEXT,
    "winning_score_limit" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QF_Winning_Prizes_pkey" PRIMARY KEY ("prize_id")
);

-- CreateTable
CREATE TABLE "QF_Winners" (
    "winner_id" TEXT NOT NULL,
    "winner_type" INTEGER NOT NULL,
    "user_id" TEXT,
    "winner_date" TEXT NOT NULL,
    "winner_description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QF_Winners_pkey" PRIMARY KEY ("winner_id")
);

-- CreateTable
CREATE TABLE "QF_Homepage_Categories" (
    "home_cat_id" TEXT NOT NULL,
    "home_cats" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QF_Homepage_Categories_pkey" PRIMARY KEY ("home_cat_id")
);

-- CreateTable
CREATE TABLE "QF_Aggrigate_Scores" (
    "ags_id" TEXT NOT NULL,
    "aggregate_score" INTEGER NOT NULL,
    "record_date" TEXT NOT NULL,
    "record_time" TEXT NOT NULL,
    "user_id" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QF_Aggrigate_Scores_pkey" PRIMARY KEY ("ags_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "QF_User_user_email_key" ON "QF_User"("user_email");

-- CreateIndex
CREATE UNIQUE INDEX "QF_Admin_User_admin_user_email_key" ON "QF_Admin_User"("admin_user_email");

-- CreateIndex
CREATE UNIQUE INDEX "QF_Quiz_Category_category_title_key" ON "QF_Quiz_Category"("category_title");

-- CreateIndex
CREATE UNIQUE INDEX "QF_Winning_Prizes_prize_type_key" ON "QF_Winning_Prizes"("prize_type");

-- CreateIndex
CREATE UNIQUE INDEX "QF_Winners_winner_type_key" ON "QF_Winners"("winner_type");

-- CreateIndex
CREATE UNIQUE INDEX "QF_Winners_user_id_key" ON "QF_Winners"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "QF_Aggrigate_Scores_user_id_key" ON "QF_Aggrigate_Scores"("user_id");

-- AddForeignKey
ALTER TABLE "QF_User_Participation" ADD CONSTRAINT "QF_User_Participation_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "QF_User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QF_Question" ADD CONSTRAINT "QF_Question_quizid_fkey" FOREIGN KEY ("quizid") REFERENCES "QF_Quiz"("quiz_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QF_Option" ADD CONSTRAINT "QF_Option_questionid_fkey" FOREIGN KEY ("questionid") REFERENCES "QF_Question"("question_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QF_Winners" ADD CONSTRAINT "QF_Winners_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "QF_User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QF_Aggrigate_Scores" ADD CONSTRAINT "QF_Aggrigate_Scores_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "QF_User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
