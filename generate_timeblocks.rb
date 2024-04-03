#!/usr/bin/env ruby

require 'yaml'

data = YAML.load_file("data.yml")

timeblock_matrix = File.read("timegrid.txt").split("\n").map { |row| row.split("") }

weekdays = %w[Monday Tuesday Wednesday Thursday Friday]

timeblock_groups = {}
timeblocks = timeblock_matrix.map.with_index do |row, i|
  row.map.with_index do |cell, j|
    next if cell == "%"
    cell_above = (timeblock_matrix[i - 1][j] if i > 0) || " "
    type = cell == "&" ? 2 : ("A".."Z").include?(cell) ? 1 : 0
    identifier = "#{weekdays[j]} #{cell == "&" ? cell_above : cell}#{type > 0 ? type : ""}"
    timeblock_groups[cell] ||= []
    timeblock_groups[cell] << [i, j]
    {
      "identifier" => identifier,
      "block_type" => type,
      "day" => j,
      "timeslot" => i,
    }
  end
end

timeblock_groups.each do |key, values|
  if ("0".."9").include?(key)
    values.each do |pair|
      index = values.index(pair)
      corresponding = values[(index + 2) % values.length]
      timeblock = timeblocks[pair[0]][pair[1]]
      timeblock["corresponding_block"] = timeblocks[corresponding[0]][corresponding[1]]["identifier"]
    end
  elsif ("A".."Z").include?(key)
    values.each do |pair|
      index = values.index(pair)
      corresponding = [pair[0] + 1, pair[1]]
      timeblock = timeblocks[pair[0]][pair[1]]
      timeblock["corresponding_block"] = timeblocks[corresponding[0]][corresponding[1]]["identifier"]
    end
  elsif key == "&"
    values.each do |pair|
      index = values.index(pair)
      corresponding = [pair[0] - 1, pair[1]]
      timeblock = timeblocks[pair[0]][pair[1]]
      timeblock["corresponding_block"] = timeblocks[corresponding[0]][corresponding[1]]["identifier"]
    end
  end
end

data["time_blocks"] = timeblocks.transpose.flatten.compact

File.open("data.yml", "w") { |file| file.write(data.to_yaml) }