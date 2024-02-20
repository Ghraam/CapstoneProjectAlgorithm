class Classroom < ApplicationRecord
  has_many :sections, dependent: :destroy
end
