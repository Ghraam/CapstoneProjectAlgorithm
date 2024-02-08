require "test_helper"

class CoursePreferencesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @course_preference = course_preferences(:one)
  end

  test "should get index" do
    get course_preferences_url
    assert_response :success
  end

  test "should get new" do
    get new_course_preference_url
    assert_response :success
  end

  test "should create course_preference" do
    assert_difference("CoursePreference.count") do
      post course_preferences_url, params: { course_preference: { course: @course_preference.course, priority: @course_preference.priority, professor: @course_preference.professor } }
    end

    assert_redirected_to course_preference_url(CoursePreference.last)
  end

  test "should show course_preference" do
    get course_preference_url(@course_preference)
    assert_response :success
  end

  test "should get edit" do
    get edit_course_preference_url(@course_preference)
    assert_response :success
  end

  test "should update course_preference" do
    patch course_preference_url(@course_preference), params: { course_preference: { course: @course_preference.course, priority: @course_preference.priority, professor: @course_preference.professor } }
    assert_redirected_to course_preference_url(@course_preference)
  end

  test "should destroy course_preference" do
    assert_difference("CoursePreference.count", -1) do
      delete course_preference_url(@course_preference)
    end

    assert_redirected_to course_preferences_url
  end
end
