class Availabilty < ApplicationRecord
  belongs_to :professor
  belongs_to :time_block
end
