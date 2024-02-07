class CoursePreferencesController < ApplicationController
  before_action :set_course_preference, only: %i[ show edit update destroy ]

  # GET /course_preferences or /course_preferences.json
  def index
    @course_preferences = CoursePreference.all
  end

  # GET /course_preferences/1 or /course_preferences/1.json
  def show
  end

  # GET /course_preferences/new
  def new
    @course_preference = CoursePreference.new
  end

  # GET /course_preferences/1/edit
  def edit
  end

  # POST /course_preferences or /course_preferences.json
  def create
    @course_preference = CoursePreference.new(course_preference_params)

    respond_to do |format|
      if @course_preference.save
        format.html { redirect_to course_preference_url(@course_preference), notice: "Course preference was successfully created." }
        format.json { render :show, status: :created, location: @course_preference }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @course_preference.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /course_preferences/1 or /course_preferences/1.json
  def update
    respond_to do |format|
      if @course_preference.update(course_preference_params)
        format.html { redirect_to course_preference_url(@course_preference), notice: "Course preference was successfully updated." }
        format.json { render :show, status: :ok, location: @course_preference }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @course_preference.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /course_preferences/1 or /course_preferences/1.json
  def destroy
    @course_preference.destroy!

    respond_to do |format|
      format.html { redirect_to course_preferences_url, notice: "Course preference was successfully destroyed." }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_course_preference
      @course_preference = CoursePreference.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def course_preference_params
      params.require(:course_preference).permit(:professor_id, :course_id, :priority)
    end
end
