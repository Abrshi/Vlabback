-- CreateTable
CREATE TABLE "public"."ThreeModel" (
    "id" SERIAL NOT NULL,
    "uid" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "thumbnail" VARCHAR(500) NOT NULL,
    "category" VARCHAR(100),
    "subcategory" VARCHAR(100),
    "embedUrl" VARCHAR(500),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uploaded_by" INTEGER,

    CONSTRAINT "ThreeModel_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ThreeModel_uid_key" ON "public"."ThreeModel"("uid");

-- AddForeignKey
ALTER TABLE "public"."ThreeModel" ADD CONSTRAINT "ThreeModel_uploaded_by_fkey" FOREIGN KEY ("uploaded_by") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
