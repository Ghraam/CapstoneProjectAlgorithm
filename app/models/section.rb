class Section < ApplicationRecord
  belongs_to :course
  belongs_to :professor
  has_one :time_block, through: :start
  has_one :time_block, through: :end
  belongs_to :classroom
end
