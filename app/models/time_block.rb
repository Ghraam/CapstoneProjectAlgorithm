class TimeBlock < ApplicationRecord
  has_many :sections, dependent: :destroy, foreign_key: :start
  has_many :sections, dependent: :destroy, foreign_key: :end
  has_many :time_preferences, dependent: :destroy
  has_one :time_block, through: :corresponding_block
end
