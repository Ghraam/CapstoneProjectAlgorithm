require "application_system_test_case"

class CoursePreferencesTest < ApplicationSystemTestCase
  setup do
    @course_preference = course_preferences(:one)
  end

  test "visiting the index" do
    visit course_preferences_url
    assert_selector "h1", text: "Course preferences"
  end

  test "should create course preference" do
    visit course_preferences_url
    click_on "New course preference"

    fill_in "Course", with: @course_preference.course_id
    fill_in "Priority", with: @course_preference.priority
    fill_in "Professor", with: @course_preference.professor_id
    click_on "Create Course preference"

    assert_text "Course preference was successfully created"
    click_on "Back"
  end

  test "should update Course preference" do
    visit course_preference_url(@course_preference)
    click_on "Edit this course preference", match: :first

    fill_in "Course", with: @course_preference.course_id
    fill_in "Priority", with: @course_preference.priority
    fill_in "Professor", with: @course_preference.professor_id
    click_on "Update Course preference"

    assert_text "Course preference was successfully updated"
    click_on "Back"
  end

  test "should destroy Course preference" do
    visit course_preference_url(@course_preference)
    click_on "Destroy this course preference", match: :first

    assert_text "Course preference was successfully destroyed"
  end
end
