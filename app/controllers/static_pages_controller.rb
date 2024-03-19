class StaticPagesController < ApplicationController
  skip_before_action :verify_authenticity_token  # Skip CSRF protection for the generate action

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

    # Redirect to the root path (move this to the end of the method once the python script is working)
    redirect_to "/"
    return # derp

    # Run the python script
    system("python3 backtrackingAlgorithm.py data.json")

    # Read the output file
    output = File.read("output.json")

    # Parse the output file
    assignments = JSON.parse(output)

    # Create the assignments
    assignments.each do |assignment|
      Assignment.create(
        professor_id: assignment["professor_id"],
        time_block_id: assignment["time_block_id"],
        course_id: assignment["course_id"],
        classroom_id: assignment["classroom_id"],
      )
    end
  end
end
