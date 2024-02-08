class Classroom < ApplicationRecord
  has_many :assignments, dependent: :destroy
end
