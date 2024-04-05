class StaticPagesController < ApplicationController
  # skip_before_action :verify_authenticity_token

  # Generate the schedule (assignments) using a python backtracking algorithm
  def generate
    # Get all tables
    professors = Professor.all.as_json
    time_blocks = TimeBlock.all.as_json
    courses = Course.all.as_json
    classrooms = Classroom.all.as_json

    # Export the data to a json file
    data = {
      professors: professors,
      time_blocks: time_blocks,
      courses: courses,
      classrooms: classrooms,
    }
    
    data.each_value do |table|
      table.each do |record|
        %w[created_at updated_at].each(&record.method(:delete))
      end
    end

    File.open("data.json", "w") { |file| file.write(data.to_json) }

    # Run the python script
    system("python3 backtrackingAlgorithm.py data.json output.json")

    # Read the output file
    output = File.read("output.json")

    # Parse the output file
    sections = JSON.parse(output)

    # Create the sections
    sections.each do |section|
      Section.create(
        section_num: section["section_num"],
        professor_id: section["professor_id"],
        start: section["start"],
        end: section["end"],
        course_id: section["course_id"],
        classroom_id: section["classroom_id"],
      )
    end

    # Redirect to the root path
    redirect_to "/"
  end
end
