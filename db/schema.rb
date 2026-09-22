# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.0].define(version: 2026_09_22_162951) do
  create_table "employees", force: :cascade do |t|
    t.string "name"
    t.string "email"
    t.string "department"
    t.string "country"
    t.string "role"
    t.string "employment_status"
    t.date "hire_date"
    t.string "currency"
    t.decimal "current_salary", precision: 12, scale: 2
    t.date "last_raise_date"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["country"], name: "index_employees_on_country"
    t.index ["department"], name: "index_employees_on_department"
    t.index ["email"], name: "index_employees_on_email", unique: true
    t.index ["employment_status"], name: "index_employees_on_employment_status"
    t.index ["name"], name: "index_employees_on_name"
  end

  create_table "salary_histories", force: :cascade do |t|
    t.integer "employee_id", null: false
    t.decimal "amount", precision: 12, scale: 2
    t.string "currency"
    t.date "effective_date"
    t.string "reason"
    t.string "changed_by"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["employee_id"], name: "index_salary_histories_on_employee_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "email"
    t.string "password_digest"
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_users_on_email", unique: true
  end

  add_foreign_key "salary_histories", "employees"
end
