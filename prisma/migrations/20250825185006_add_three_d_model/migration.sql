-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('user', 'admin');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" SERIAL NOT NULL,
    "full_name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "role" "public"."Role" NOT NULL DEFAULT 'user',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "verification_token" VARCHAR(255),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Session" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "refresh_token" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ChemicalReactionResult" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "formula" VARCHAR(255) NOT NULL,
    "reaction_type" VARCHAR(50) NOT NULL,
    "color_gradient" VARCHAR(100) NOT NULL,
    "temperature" INTEGER NOT NULL,
    "observations" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChemicalReactionResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ExperimentStats" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "exType" VARCHAR(50) NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ExperimentStats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UserActivity" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "totalTime" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserActivity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ThreeDModel" (
    "id" SERIAL NOT NULL,
    "uid" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "thumbnail" VARCHAR(500) NOT NULL,
    "category" VARCHAR(100),
    "subcategory" VARCHAR(100),
    "embedUrl" VARCHAR(500),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uploaded_by" INTEGER,

    CONSTRAINT "ThreeDModel_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ExperimentStats_user_id_exType_key" ON "public"."ExperimentStats"("user_id", "exType");

-- CreateIndex
CREATE UNIQUE INDEX "UserActivity_user_id_key" ON "public"."UserActivity"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "ThreeDModel_uid_key" ON "public"."ThreeDModel"("uid");

-- AddForeignKey
ALTER TABLE "public"."Session" ADD CONSTRAINT "Session_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ChemicalReactionResult" ADD CONSTRAINT "ChemicalReactionResult_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ExperimentStats" ADD CONSTRAINT "ExperimentStats_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserActivity" ADD CONSTRAINT "UserActivity_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ThreeDModel" ADD CONSTRAINT "ThreeDModel_uploaded_by_fkey" FOREIGN KEY ("uploaded_by") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
