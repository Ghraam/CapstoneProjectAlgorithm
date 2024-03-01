#!/usr/bin/env ruby

require 'yaml'

data = YAML.load_file("data.yml")

timeblock_matrix = File.read("timegrid.txt").split("\n").map { |row| row.split("") }

weekdays = %w[Monday Tuesday Wednesday Thursday Friday]

timeblocks = timeblock_matrix.map.with_index do |row, i|
  row.map.with_index do |cell, j|
    next if cell == "%" or cell == "&"
    {
      "identifier" => "#{weekdays[j]} #{cell}",
      "is_double" => ("A".."Z").include?(cell),
      "day" => j,
      "timeslot" => i,
    }
  end
end

data["time_blocks"] = timeblocks.transpose.flatten.compact

File.open("data.yml", "w") { |file| file.write(data.to_yaml) }