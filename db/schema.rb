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
  create_table "classrooms", id: :integer, charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "room", null: false
    t.integer "is_lab", limit: 1, null: false
    t.integer "room_capacity", null: false
    t.timestamp "created_at", default: -> { "CURRENT_TIMESTAMP" }, null: false
    t.datetime "updated_at", precision: nil, default: -> { "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP" }
  end

  create_table "course_preferences", primary_key: ["professor_id", "course_id"], charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.integer "professor_id", null: false
    t.integer "course_id", null: false
    t.integer "priority", null: false
    t.timestamp "created_at", default: -> { "CURRENT_TIMESTAMP" }, null: false
    t.datetime "updated_at", precision: nil, default: -> { "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP" }
    t.index ["course_id"], name: "fk_professor_has_class_class1_idx"
    t.index ["professor_id"], name: "fk_professor_has_class_professor1_idx"
  end

  create_table "courses", id: :integer, charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "name", null: false
    t.string "identifier", null: false
    t.integer "needs_lab", limit: 1, null: false
    t.integer "course_size", null: false
    t.integer "level", null: false
    t.integer "double_block", limit: 1, null: false
    t.timestamp "created_at", default: -> { "CURRENT_TIMESTAMP" }, null: false
    t.datetime "updated_at", precision: nil, default: -> { "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP" }
  end

  create_table "professors", id: :integer, charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "name", null: false
    t.timestamp "created_at", default: -> { "CURRENT_TIMESTAMP" }, null: false
    t.datetime "updated_at", precision: nil, default: -> { "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP" }
  end

  create_table "sections", primary_key: ["course_id", "section_num"], charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.integer "course_id", null: false
    t.integer "section_num", null: false
    t.integer "professor_id", null: false
    t.integer "start", null: false
    t.integer "end", null: false
    t.integer "classroom_id", null: false
    t.timestamp "created_at", default: -> { "CURRENT_TIMESTAMP" }, null: false
    t.datetime "updated_at", precision: nil, default: -> { "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP" }
    t.index ["classroom_id"], name: "fk_professor_has_time_block1_classroom1_idx"
    t.index ["course_id"], name: "fk_professor_has_time_block1_class1_idx"
    t.index ["end"], name: "fk_sections_time_blocks1_idx"
    t.index ["professor_id", "start"], name: "professor_id", unique: true
    t.index ["professor_id"], name: "fk_professor_has_time_block1_professor1_idx"
    t.index ["start", "classroom_id"], name: "start", unique: true
    t.index ["start"], name: "fk_professor_has_time_block1_time_block1_idx"
  end

  create_table "time_blocks", id: :integer, charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "identifier", null: false
    t.integer "block_type", null: false
    t.integer "day", null: false
    t.integer "timeslot", null: false
    t.integer "corresponding_block"
    t.timestamp "created_at", default: -> { "CURRENT_TIMESTAMP" }, null: false
    t.datetime "updated_at", precision: nil, default: -> { "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP" }
    t.index ["corresponding_block"], name: "fk_time_blocks_time_blocks1_idx"
    t.index ["day", "timeslot"], name: "day", unique: true
  end

  create_table "time_preferences", primary_key: ["professor_id", "time_block_id"], charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.integer "professor_id", null: false
    t.integer "time_block_id", null: false
    t.integer "priority", null: false
    t.timestamp "created_at", default: -> { "CURRENT_TIMESTAMP" }, null: false
    t.datetime "updated_at", precision: nil, default: -> { "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP" }
    t.index ["professor_id"], name: "fk_professor_has_time_block_professor_idx"
    t.index ["time_block_id"], name: "fk_professor_has_time_block_time_block1_idx"
  end

  add_foreign_key "course_preferences", "courses", name: "fk_professor_has_class_class1"
  add_foreign_key "course_preferences", "professors", name: "fk_professor_has_class_professor1"
  add_foreign_key "sections", "classrooms", name: "fk_professor_has_time_block1_classroom1"
  add_foreign_key "sections", "courses", name: "fk_professor_has_time_block1_class1"
  add_foreign_key "sections", "professors", name: "fk_professor_has_time_block1_professor1"
  add_foreign_key "sections", "time_blocks", column: "end", name: "fk_sections_time_blocks1"
  add_foreign_key "sections", "time_blocks", column: "start", name: "fk_professor_has_time_block1_time_block1"
  add_foreign_key "time_blocks", "time_blocks", column: "corresponding_block", name: "fk_time_blocks_time_blocks1"
  add_foreign_key "time_preferences", "professors", name: "fk_professor_has_time_block_professor"
  add_foreign_key "time_preferences", "time_blocks", name: "fk_professor_has_time_block_time_block1"
end
