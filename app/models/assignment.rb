class Assignment < ApplicationRecord
  identified_by :professor_id, :time_block_id
  belongs_to :professor
  belongs_to :time_block
  belongs_to :course
  belongs_to :classroom
end
