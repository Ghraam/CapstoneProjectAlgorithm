class TimeBlock < ApplicationRecord
  has_many :sections, dependent: :destroy, foreign_key: :start
  has_many :sections, dependent: :destroy, foreign_key: :end
  has_many :time_preferences, dependent: :destroy
end
