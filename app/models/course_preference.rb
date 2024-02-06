class CoursePreference < ApplicationRecord
  belongs_to :professor
  belongs_to :course
end
