class Professor < ApplicationRecord
  has_many :sections, dependent: :destroy
  has_many :course_preferences, dependent: :destroy
  has_many :time_preferences, dependent: :destroy
end
