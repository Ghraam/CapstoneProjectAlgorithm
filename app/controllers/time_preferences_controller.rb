class TimePreferencesController < ApplicationController
  before_action :set_time_preference, only: %i[ show edit update destroy ]

  # GET /time_preferences or /time_preferences.json
  def index
    @time_preferences = TimePreference.all
  end

  # GET /time_preferences/1 or /time_preferences/1.json
  def show
  end

  # GET /time_preferences/new
  def new
    @time_preference = TimePreference.new
  end

  # GET /time_preferences/1/edit
  def edit
  end

  # POST /time_preferences or /time_preferences.json
  def create
    @time_preference = TimePreference.new(time_preference_params)

    respond_to do |format|
      if @time_preference.save
        format.html { redirect_to time_preference_url(@time_preference), notice: "Time preference was successfully created." }
        format.json { render :show, status: :created, location: @time_preference }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @time_preference.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /time_preferences/1 or /time_preferences/1.json
  def update
    respond_to do |format|
      if @time_preference.update(time_preference_params)
        format.html { redirect_to time_preference_url(@time_preference), notice: "Time preference was successfully updated." }
        format.json { render :show, status: :ok, location: @time_preference }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @time_preference.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /time_preferences/1 or /time_preferences/1.json
  def destroy
    @time_preference.destroy!

    respond_to do |format|
      format.html { redirect_to time_preferences_url, notice: "Time preference was successfully destroyed." }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_time_preference
      @time_preference = TimePreference.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def time_preference_params
      params.require(:time_preference).permit(:professor_id, :time_block_id, :priority)
    end
end
