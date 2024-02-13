json.extract! course, :id, :name, :identifier, :needs_lab, :course_size, :level, :needs_double, :created_at, :updated_at
json.url course_url(course, format: :json)
