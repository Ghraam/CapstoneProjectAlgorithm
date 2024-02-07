json.extract! course_preference, :id, :professor_id, :course_id, :priority, :created_at, :updated_at
json.url course_preference_url(course_preference, format: :json)
