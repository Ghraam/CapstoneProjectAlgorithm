class Course < ApplicationRecord
  has_many :assignments, dependent: :destroy
  has_many :course_preferences, dependent: :destroy
end
