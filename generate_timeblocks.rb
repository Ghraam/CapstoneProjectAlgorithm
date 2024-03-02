#!/usr/bin/env ruby

require 'yaml'

data = YAML.load_file("data.yml")

timeblock_matrix = File.read("timegrid.txt").split("\n").map { |row| row.split("") }

weekdays = %w[Monday Tuesday Wednesday Thursday Friday]

timeblocks = timeblock_matrix.map.with_index do |row, i|
  row.map.with_index do |cell, j|
    cell_above = (timeblock_matrix[i - 1][j] if i > 0) || " "
    next if cell == "%"
    type = cell == "&" ? 2 : ("A".."Z").include?(cell) ? 1 : 0
    identifier = "#{weekdays[j]} #{cell == "&" ? cell_above : cell}#{type > 0 ? type : ""}"
    {
      "identifier" => identifier,
      "block_type" => type,
      "day" => j,
      "timeslot" => i,
    }
  end
end

data["time_blocks"] = timeblocks.transpose.flatten.compact

File.open("data.yml", "w") { |file| file.write(data.to_yaml) }