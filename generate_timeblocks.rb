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
  values.each do |pair|
    index = values.index(pair)
    corresponding = if ("0".."9").include?(key)
      values[(index + 2) % values.length]
    elsif ("A".."Z").include?(key)
      [pair[0] + 1, pair[1]]
    elsif key == "&"
      [pair[0] - 1, pair[1]]
    else
      raise "Invalid key"
    end
    timeblock = timeblocks[pair[0]][pair[1]]
    i, j = *corresponding
    timeblock["corresponding_block"] = timeblocks[i][j]["identifier"]
  end
end

data["time_blocks"] = timeblocks.transpose.flatten.compact

File.open("data.yml", "w") { |file| file.write(data.to_yaml) }