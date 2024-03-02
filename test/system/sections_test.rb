require "application_system_test_case"

class SectionsTest < ApplicationSystemTestCase
  setup do
    @section = sections(:one)
  end

  test "visiting the index" do
    visit sections_url
    assert_selector "h1", text: "Sections"
  end

  test "should create section" do
    visit sections_url
    click_on "New section"

    fill_in "Classroom", with: @section.classroom_id
    fill_in "Course", with: @section.course_id
    fill_in "End", with: @section.end
    fill_in "Professor", with: @section.professor_id
    fill_in "Section num", with: @section.section_num
    fill_in "Start", with: @section.start
    click_on "Create Section"

    assert_text "Section was successfully created"
    click_on "Back"
  end

  test "should update Section" do
    visit section_url(@section)
    click_on "Edit this section", match: :first

    fill_in "Classroom", with: @section.classroom_id
    fill_in "Course", with: @section.course_id
    fill_in "End", with: @section.end
    fill_in "Professor", with: @section.professor_id
    fill_in "Section num", with: @section.section_num
    fill_in "Start", with: @section.start
    click_on "Update Section"

    assert_text "Section was successfully updated"
    click_on "Back"
  end

  test "should destroy Section" do
    visit section_url(@section)
    click_on "Destroy this section", match: :first

    assert_text "Section was successfully destroyed"
  end
end
