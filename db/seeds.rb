# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end

data = YAML.load_file("data.yml")

puts "Seeding classrooms..."
data["classrooms"].each do |classroom|
  Classroom.find_or_create_by!(
    room: classroom["room"],
    is_lab: Faker::Boolean.boolean,
    room_capacity: Faker::Number.between(from: 10, to: 100),
  )
end

puts "Seeding courses..."
data["courses"].each do |course|
  Course.find_or_create_by!(
    name: course["name"],
    identifier: course["identifier"],
    needs_lab: Faker::Boolean.boolean,
    course_size: Faker::Number.between(from: 10, to: 100),
    level: course["identifier"][4].to_i,
    double_block: Faker::Boolean.boolean,
  )
end

puts "Seeding professors..."
data["professors"].each do |professor|
  Professor.find_or_create_by!(
    name: professor["name"],
  )
end

puts "Seeding course preferences..."
data["course_preferences"].each do |course_preference|
  CoursePreference.find_or_create_by!(
    professor: Professor.find_by(name: course_preference["professor"]),
    course: Course.find_by(identifier: course_preference["course"]),
    priority: course_preference["priority"],
  )
end

puts "Seeding time blocks..."
data["time_blocks"].each do |time_block|
  TimeBlock.find_or_create_by!(
    identifier: time_block["identifier"],
    block_type: time_block["block_type"],
    day: time_block["day"],
    timeslot: time_block["timeslot"],
  )
end

# Update the time blocks to include the corresponding block
puts "Updating time blocks with corresponding blocks..."
data["time_blocks"].each do |time_block|
  TimeBlock.find_by(identifier: time_block["identifier"]).update(
    corresponding_block: TimeBlock.find_by(identifier: time_block["corresponding_block"]).id,
  )
end