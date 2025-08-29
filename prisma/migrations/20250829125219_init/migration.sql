-- CreateEnum
CREATE TYPE "public"."user_role" AS ENUM ('user', 'admin');

-- CreateTable
CREATE TABLE "public"."chemicalreactionresult" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "formula" VARCHAR(255) NOT NULL,
    "reaction_type" VARCHAR(50) NOT NULL,
    "color_gradient" VARCHAR(100) NOT NULL,
    "temperature" INTEGER NOT NULL,
    "observations" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chemicalreactionresult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."experimentstats" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "exType" VARCHAR(50) NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "experimentstats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."session" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "refresh_token" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."threedmodel" (
    "id" SERIAL NOT NULL,
    "uid" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "thumbnail" VARCHAR(500) NOT NULL,
    "category" VARCHAR(100),
    "subcategory" VARCHAR(100),
    "embedUrl" VARCHAR(500),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uploaded_by" INTEGER,

    CONSTRAINT "threedmodel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user" (
    "id" SERIAL NOT NULL,
    "full_name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "role" "public"."user_role" NOT NULL DEFAULT 'user',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "verification_token" VARCHAR(255),

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."useractivity" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "totalTime" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "useractivity_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ChemicalReactionResult_user_id_fkey" ON "public"."chemicalreactionresult"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "ExperimentStats_user_id_exType_key" ON "public"."experimentstats"("user_id", "exType");

-- CreateIndex
CREATE INDEX "Session_user_id_fkey" ON "public"."session"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "ThreeDModel_uid_key" ON "public"."threedmodel"("uid");

-- CreateIndex
CREATE INDEX "ThreeDModel_uploaded_by_fkey" ON "public"."threedmodel"("uploaded_by");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UserActivity_user_id_key" ON "public"."useractivity"("user_id");

-- AddForeignKey
ALTER TABLE "public"."chemicalreactionresult" ADD CONSTRAINT "ChemicalReactionResult_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."experimentstats" ADD CONSTRAINT "ExperimentStats_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."session" ADD CONSTRAINT "Session_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."threedmodel" ADD CONSTRAINT "ThreeDModel_uploaded_by_fk" FOREIGN KEY ("uploaded_by") REFERENCES "public"."user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."useractivity" ADD CONSTRAINT "UserActivity_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
