class Course < ApplicationRecord
  has_many :sections, dependent: :destroy
  has_many :course_preferences, dependent: :destroy
end
