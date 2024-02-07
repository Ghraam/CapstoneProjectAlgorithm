require "test_helper"

class TimePreferencesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @time_preference = time_preferences(:one)
  end

  test "should get index" do
    get time_preferences_url
    assert_response :success
  end

  test "should get new" do
    get new_time_preference_url
    assert_response :success
  end

  test "should create time_preference" do
    assert_difference("TimePreference.count") do
      post time_preferences_url, params: { time_preference: { priority: @time_preference.priority, professor_id: @time_preference.professor_id, time_block_id: @time_preference.time_block_id } }
    end

    assert_redirected_to time_preference_url(TimePreference.last)
  end

  test "should show time_preference" do
    get time_preference_url(@time_preference)
    assert_response :success
  end

  test "should get edit" do
    get edit_time_preference_url(@time_preference)
    assert_response :success
  end

  test "should update time_preference" do
    patch time_preference_url(@time_preference), params: { time_preference: { priority: @time_preference.priority, professor_id: @time_preference.professor_id, time_block_id: @time_preference.time_block_id } }
    assert_redirected_to time_preference_url(@time_preference)
  end

  test "should destroy time_preference" do
    assert_difference("TimePreference.count", -1) do
      delete time_preference_url(@time_preference)
    end

    assert_redirected_to time_preferences_url
  end
end
