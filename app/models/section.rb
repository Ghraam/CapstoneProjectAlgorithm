class Section < ApplicationRecord
  belongs_to :course
  belongs_to :professor
  belongs_to :time_block, through: :start
  belongs_to :time_block, through: :end
  belongs_to :classroom
end
