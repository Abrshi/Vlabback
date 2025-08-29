-- DropIndex
DROP INDEX "public"."ChemicalReactionResult_user_id_fkey";

-- RenameForeignKey
ALTER TABLE "public"."chemicalreactionresult" RENAME CONSTRAINT "ChemicalReactionResult_user_id_fk" TO "chemicalreactionresult_user_id_fkey";
