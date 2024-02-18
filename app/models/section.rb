class Section < ApplicationRecord
  belongs_to :course
  belongs_to :professor
  belongs_to :time_block
  belongs_to :classroom
end
