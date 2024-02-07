json.extract! course, :id, :name, :identifier, :needs_lab, :course_size, :created_at, :updated_at
json.url course_url(course, format: :json)
