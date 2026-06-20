-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN', 'INTERIOR', 'SALES_ASSOCIATE');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('TODO', 'INPROGRESS', 'COMPLETED');

-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('PENDING', 'ACTIVE', 'GOODS_PENDING', 'GOODS_COMPLETE', 'TAILOR_PENDING', 'TAILOR_COMPLETE', 'COMPLETED', 'DEFAULTER');

-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('HIGH', 'MODERATE', 'LOW');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "phonenumber" TEXT,
    "address" TEXT,
    "alternate_phonenumber" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "refresh_tokens" (
    "id" UUID NOT NULL,
    "family_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'INTERIOR',
    "is_used" BOOLEAN NOT NULL,

    CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "authorizations" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "access" TEXT NOT NULL,

    CONSTRAINT "authorizations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customers" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phonenumber" TEXT,
    "alternate_phonenumber" TEXT,
    "address" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "brands" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "brands_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projects" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "customer_id" UUID,
    "creator_id" UUID NOT NULL,
    "status" "ProjectStatus" NOT NULL,
    "total_amount" DECIMAL(65,30),
    "paid" DECIMAL(65,30),
    "discount" DECIMAL(65,30),
    "discount_type" TEXT,
    "project_date" TIMESTAMPTZ(6) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tasks" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "task_date" TIMESTAMPTZ(6) NOT NULL,
    "project_id" UUID NOT NULL,
    "priority" "Priority" NOT NULL,
    "status" "Status" NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inquiries" (
    "id" UUID NOT NULL,
    "project_name" TEXT NOT NULL,
    "customer_name" TEXT NOT NULL,
    "phonenumber" TEXT NOT NULL,
    "comments" TEXT,
    "inquiry_date" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "follow_up_date" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "inquiries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stores" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "phonenumber" INTEGER NOT NULL,
    "email" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "stores_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_id_created_at_idx" ON "users"("id", "created_at");

-- CreateIndex
CREATE INDEX "refresh_tokens_family_id_idx" ON "refresh_tokens"("family_id");

-- CreateIndex
CREATE UNIQUE INDEX "authorizations_user_id_access_key" ON "authorizations"("user_id", "access");

-- CreateIndex
CREATE UNIQUE INDEX "customers_name_key" ON "customers"("name");

-- CreateIndex
CREATE INDEX "customers_id_created_at_idx" ON "customers"("id", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "brands_name_key" ON "brands"("name");

-- CreateIndex
CREATE INDEX "brands_id_created_at_idx" ON "brands"("id", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "projects_name_key" ON "projects"("name");

-- CreateIndex
CREATE INDEX "projects_id_created_at_idx" ON "projects"("id", "created_at");

-- CreateIndex
CREATE INDEX "tasks_id_created_at_idx" ON "tasks"("id", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "tasks_title_project_id_key" ON "tasks"("title", "project_id");

-- CreateIndex
CREATE UNIQUE INDEX "inquiries_customer_name_project_name_key" ON "inquiries"("customer_name", "project_name");

-- CreateIndex
CREATE INDEX "stores_id_created_at_idx" ON "stores"("id", "created_at");

-- AddForeignKey
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "authorizations" ADD CONSTRAINT "authorizations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
