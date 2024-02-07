require "application_system_test_case"

class TimePreferencesTest < ApplicationSystemTestCase
  setup do
    @time_preference = time_preferences(:one)
  end

  test "visiting the index" do
    visit time_preferences_url
    assert_selector "h1", text: "Time preferences"
  end

  test "should create time preference" do
    visit time_preferences_url
    click_on "New time preference"

    fill_in "Priority", with: @time_preference.priority
    fill_in "Professor", with: @time_preference.professor_id
    fill_in "Time block", with: @time_preference.time_block_id
    click_on "Create Time preference"

    assert_text "Time preference was successfully created"
    click_on "Back"
  end

  test "should update Time preference" do
    visit time_preference_url(@time_preference)
    click_on "Edit this time preference", match: :first

    fill_in "Priority", with: @time_preference.priority
    fill_in "Professor", with: @time_preference.professor_id
    fill_in "Time block", with: @time_preference.time_block_id
    click_on "Update Time preference"

    assert_text "Time preference was successfully updated"
    click_on "Back"
  end

  test "should destroy Time preference" do
    visit time_preference_url(@time_preference)
    click_on "Destroy this time preference", match: :first

    assert_text "Time preference was successfully destroyed"
  end
end
