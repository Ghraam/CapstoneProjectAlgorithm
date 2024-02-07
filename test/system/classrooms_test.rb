require "application_system_test_case"

class ClassroomsTest < ApplicationSystemTestCase
  setup do
    @classroom = classrooms(:one)
  end

  test "visiting the index" do
    visit classrooms_url
    assert_selector "h1", text: "Classrooms"
  end

  test "should create classroom" do
    visit classrooms_url
    click_on "New classroom"

    fill_in "Is lab", with: @classroom.is_lab
    fill_in "Room", with: @classroom.room
    fill_in "Room capacity", with: @classroom.room_capacity
    click_on "Create Classroom"

    assert_text "Classroom was successfully created"
    click_on "Back"
  end

  test "should update Classroom" do
    visit classroom_url(@classroom)
    click_on "Edit this classroom", match: :first

    fill_in "Is lab", with: @classroom.is_lab
    fill_in "Room", with: @classroom.room
    fill_in "Room capacity", with: @classroom.room_capacity
    click_on "Update Classroom"

    assert_text "Classroom was successfully updated"
    click_on "Back"
  end

  test "should destroy Classroom" do
    visit classroom_url(@classroom)
    click_on "Destroy this classroom", match: :first

    assert_text "Classroom was successfully destroyed"
  end
end
