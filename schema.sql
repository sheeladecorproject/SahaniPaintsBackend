CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "phonenumber" TEXT,
    "address" TEXT,
    "alternate_phonenumber" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
CREATE INDEX "users_id_created_at_idx" ON "users"("id", "created_at");

CREATE TABLE "refresh_tokens" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "family_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'INTERIOR',
    "is_used" BOOLEAN NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "refresh_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "refresh_tokens_family_id_idx" ON "refresh_tokens"("family_id");
CREATE INDEX "refresh_tokens_user_id_idx" ON "refresh_tokens"("user_id");

CREATE TABLE "authorizations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "access" TEXT NOT NULL,
    CONSTRAINT "authorizations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "authorizations_user_id_access_key" ON "authorizations"("user_id", "access");
CREATE INDEX "authorizations_user_id_idx" ON "authorizations"("user_id");

CREATE TABLE "customers" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phonenumber" TEXT,
    "alternate_phonenumber" TEXT,
    "address" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX "customers_name_key" ON "customers"("name");
CREATE INDEX "customers_id_created_at_idx" ON "customers"("id", "created_at");

CREATE TABLE "brands" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX "brands_name_key" ON "brands"("name");
CREATE INDEX "brands_id_created_at_idx" ON "brands"("id", "created_at");

CREATE TABLE "products" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "brand_id" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "price" DECIMAL NOT NULL,
    "coverage_sqft" DECIMAL,
    "coverage_rnft" DECIMAL,
    "has_token" BOOLEAN NOT NULL DEFAULT false,
    "size" TEXT NOT NULL DEFAULT '1ltr',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "products_brand_id_fkey" FOREIGN KEY ("brand_id") REFERENCES "brands" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "products_name_key" ON "products"("name");
CREATE INDEX "products_id_created_at_idx" ON "products"("id", "created_at");

CREATE TABLE "interiors" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phonenumber" TEXT,
    "alternate_phonenumber" TEXT,
    "address" TEXT,
    "commission_fee_percentage" DECIMAL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX "interiors_name_key" ON "interiors"("name");
CREATE INDEX "interiors_id_created_at_idx" ON "interiors"("id", "created_at");

CREATE TABLE "projects" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "customer_id" TEXT,
    "creator_id" TEXT NOT NULL,
    "interior_id" TEXT,
    "status" TEXT NOT NULL,
    "total_amount" DECIMAL,
    "paid" DECIMAL,
    "discount" DECIMAL,
    "discount_type" TEXT,
    "tax" DECIMAL,
    "agreed_price" DECIMAL,
    "project_date" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "supervisor_id" TEXT,
    CONSTRAINT "projects_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "projects_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "projects_interior_id_fkey" FOREIGN KEY ("interior_id") REFERENCES "interiors" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "projects_supervisor_id_fkey" FOREIGN KEY ("supervisor_id") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "projects_name_key" ON "projects"("name");
CREATE INDEX "projects_id_created_at_idx" ON "projects"("id", "created_at");

CREATE TABLE "colors" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "shade" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX "colors_name_shade_key" ON "colors"("name", "shade");
CREATE INDEX "colors_id_created_at_idx" ON "colors"("id", "created_at");

CREATE TABLE "areas" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX "areas_name_key" ON "areas"("name");
CREATE INDEX "areas_id_created_at_idx" ON "areas"("id", "created_at");

CREATE TABLE "project_area_colors" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "project_id" TEXT NOT NULL,
    "area_id" TEXT NOT NULL,
    "color_id" TEXT NOT NULL,
    "description" TEXT,
    "stage" TEXT NOT NULL DEFAULT 'Putty',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "project_area_colors_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "project_area_colors_area_id_fkey" FOREIGN KEY ("area_id") REFERENCES "areas" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "project_area_colors_color_id_fkey" FOREIGN KEY ("color_id") REFERENCES "colors" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "project_area_colors_project_id_area_id_color_id_key" ON "project_area_colors"("project_id", "area_id", "color_id");

CREATE TABLE "tasks" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "task_date" DATETIME NOT NULL,
    "project_id" TEXT NOT NULL,
    "priority" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "tasks_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "tasks_title_project_id_key" ON "tasks"("title", "project_id");
CREATE INDEX "tasks_id_created_at_idx" ON "tasks"("id", "created_at");

CREATE TABLE "inquiries" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "project_name" TEXT NOT NULL,
    "customer_name" TEXT NOT NULL,
    "phonenumber" TEXT NOT NULL,
    "comments" TEXT,
    "inquiry_date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "follow_up_date" DATETIME NOT NULL
);
CREATE UNIQUE INDEX "inquiries_customer_name_project_name_key" ON "inquiries"("customer_name", "project_name");

CREATE TABLE "stores" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "phonenumber" INTEGER NOT NULL,
    "email" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX "stores_id_created_at_idx" ON "stores"("id", "created_at");

CREATE TABLE "labours" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "payment_per_day" DECIMAL NOT NULL,
    "tuesday_payment_amount" DECIMAL DEFAULT 0,
    "phone_number" TEXT,
    "type" TEXT NOT NULL DEFAULT 'WEEKLY',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX "labours_name_key" ON "labours"("name");
CREATE INDEX "labours_id_created_at_idx" ON "labours"("id", "created_at");

CREATE TABLE "labour_attendance" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" DATETIME NOT NULL,
    "project_id" TEXT NOT NULL,
    "labour_id" TEXT NOT NULL,
    "workDayType" TEXT NOT NULL DEFAULT 'DAY',
    "workDayValue" DECIMAL NOT NULL DEFAULT 1.0,
    "marked_by_id" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "labour_attendance_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "labour_attendance_labour_id_fkey" FOREIGN KEY ("labour_id") REFERENCES "labours" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "labour_attendance_marked_by_id_fkey" FOREIGN KEY ("marked_by_id") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "labour_attendance_date_project_id_labour_id_key" ON "labour_attendance"("date", "project_id", "labour_id");
CREATE INDEX "labour_attendance_date_project_id_idx" ON "labour_attendance"("date", "project_id");

CREATE TABLE "labour_payments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "labour_id" TEXT NOT NULL,
    "project_id" TEXT,
    "amount" DECIMAL NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'OUTGOING',
    "payment_mode" TEXT DEFAULT 'CASH',
    "payment_date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "remarks" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "labour_payments_labour_id_fkey" FOREIGN KEY ("labour_id") REFERENCES "labours" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "labour_payments_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "labour_payments_id_created_at_idx" ON "labour_payments"("id", "created_at");

CREATE TABLE "project_products" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "project_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "area" DECIMAL NOT NULL,
    "unit" TEXT NOT NULL,
    "rate" DECIMAL NOT NULL,
    "litres_used" DECIMAL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "project_products_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "project_products_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "project_products_id_created_at_idx" ON "project_products"("id", "created_at");

CREATE TABLE "project_material_logs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" DATETIME NOT NULL,
    "project_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "quantity" DECIMAL NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "project_material_logs_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "project_material_logs_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "project_material_logs_date_project_id_product_id_idx" ON "project_material_logs"("date", "project_id", "product_id");
CREATE INDEX "project_material_logs_date_project_id_idx" ON "project_material_logs"("date", "project_id");

CREATE TABLE "project_payments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "project_id" TEXT NOT NULL,
    "amount" DECIMAL NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'INCOMING',
    "payment_mode" TEXT DEFAULT 'CASH',
    "payment_date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "remarks" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "project_payments_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "project_payments_id_created_at_idx" ON "project_payments"("id", "created_at");

CREATE TABLE "contractors" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "phone_number" TEXT,
    "email" TEXT,
    "address" TEXT,
    "type" TEXT NOT NULL DEFAULT 'WEEKLY',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX "contractors_name_key" ON "contractors"("name");
CREATE INDEX "contractors_id_created_at_idx" ON "contractors"("id", "created_at");

CREATE TABLE "contractor_payments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "contractor_id" TEXT NOT NULL,
    "project_id" TEXT,
    "amount" DECIMAL NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'OUTGOING',
    "payment_mode" TEXT DEFAULT 'CASH',
    "payment_date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "remarks" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "contractor_payments_contractor_id_fkey" FOREIGN KEY ("contractor_id") REFERENCES "contractors" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "contractor_payments_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "contractor_payments_id_created_at_idx" ON "contractor_payments"("id", "created_at");

CREATE TABLE "contractor_work_logs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" DATETIME NOT NULL,
    "project_id" TEXT NOT NULL,
    "contractor_id" TEXT NOT NULL,
    "sq_ft" DECIMAL NOT NULL,
    "price_per_sqft" DECIMAL,
    "material" TEXT,
    "remarks" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "contractor_work_logs_contractor_id_fkey" FOREIGN KEY ("contractor_id") REFERENCES "contractors" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "contractor_work_logs_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "contractor_work_logs_id_created_at_idx" ON "contractor_work_logs"("id", "created_at");
CREATE INDEX "contractor_work_logs_project_id_idx" ON "contractor_work_logs"("project_id");

CREATE TABLE "low_materials" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "project_id" TEXT NOT NULL,
    "material" TEXT NOT NULL,
    "quantity" TEXT NOT NULL,
    "approved" BOOLEAN NOT NULL DEFAULT false,
    "delivered" BOOLEAN NOT NULL DEFAULT false,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "low_materials_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "low_materials_id_created_at_idx" ON "low_materials"("id", "created_at");

CREATE TABLE "activity_logs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT,
    "user_name" TEXT,
    "user_role" TEXT,
    "action" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "details" TEXT NOT NULL,
    "ip_address" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "activity_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
CREATE INDEX "activity_logs_created_at_idx" ON "activity_logs"("created_at");
CREATE INDEX "activity_logs_user_id_idx" ON "activity_logs"("user_id");
CREATE INDEX "activity_logs_entity_idx" ON "activity_logs"("entity");
