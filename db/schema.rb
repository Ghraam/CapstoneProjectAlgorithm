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

ActiveRecord::Schema[7.1].define(version: 0) do
  create_table "assignment", primary_key: ["professor_id", "time_block_id"], charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.integer "professor_id", null: false
    t.integer "time_block_id", null: false
    t.integer "course_id", null: false
    t.integer "classroom_id", null: false
    t.index ["classroom_id"], name: "fk_professor_has_time_block1_classroom1_idx"
    t.index ["course_id"], name: "fk_professor_has_time_block1_class1_idx"
    t.index ["professor_id"], name: "fk_professor_has_time_block1_professor1_idx"
    t.index ["time_block_id"], name: "fk_professor_has_time_block1_time_block1_idx"
  end

  create_table "availabilty", primary_key: ["professor_id", "time_block_id"], charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.integer "professor_id", null: false
    t.integer "time_block_id", null: false
    t.index ["professor_id"], name: "fk_professor_has_time_block_professor_idx"
    t.index ["time_block_id"], name: "fk_professor_has_time_block_time_block1_idx"
  end

  create_table "classroom", id: :integer, default: nil, charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "room", limit: 45, null: false
    t.integer "is_lab", limit: 1, null: false
  end

  create_table "course", id: :integer, default: nil, charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "name", limit: 45, null: false
    t.string "identifier", limit: 45, null: false
    t.integer "needs_lab", limit: 1, null: false
  end

  create_table "preference", primary_key: ["professor_id", "course_id"], charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.integer "professor_id", null: false
    t.integer "course_id", null: false
    t.integer "priority", null: false
    t.index ["course_id"], name: "fk_professor_has_class_class1_idx"
    t.index ["professor_id"], name: "fk_professor_has_class_professor1_idx"
  end

  create_table "professor", id: :integer, default: nil, charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "name", limit: 45, null: false
  end

  create_table "time_block", id: :integer, default: nil, charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "identifier", limit: 45, null: false
    t.integer "is_double", limit: 1, null: false
  end

  add_foreign_key "assignment", "classroom", name: "fk_professor_has_time_block1_classroom1"
  add_foreign_key "assignment", "course", name: "fk_professor_has_time_block1_class1"
  add_foreign_key "assignment", "professor", name: "fk_professor_has_time_block1_professor1"
  add_foreign_key "assignment", "time_block", name: "fk_professor_has_time_block1_time_block1"
  add_foreign_key "availabilty", "professor", name: "fk_professor_has_time_block_professor"
  add_foreign_key "availabilty", "time_block", name: "fk_professor_has_time_block_time_block1"
  add_foreign_key "preference", "course", name: "fk_professor_has_class_class1"
  add_foreign_key "preference", "professor", name: "fk_professor_has_class_professor1"
end
