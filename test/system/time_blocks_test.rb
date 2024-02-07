require "application_system_test_case"

class TimeBlocksTest < ApplicationSystemTestCase
  setup do
    @time_block = time_blocks(:one)
  end

  test "visiting the index" do
    visit time_blocks_url
    assert_selector "h1", text: "Time blocks"
  end

  test "should create time block" do
    visit time_blocks_url
    click_on "New time block"

    fill_in "Identifier", with: @time_block.identifier
    fill_in "Is double", with: @time_block.is_double
    click_on "Create Time block"

    assert_text "Time block was successfully created"
    click_on "Back"
  end

  test "should update Time block" do
    visit time_block_url(@time_block)
    click_on "Edit this time block", match: :first

    fill_in "Identifier", with: @time_block.identifier
    fill_in "Is double", with: @time_block.is_double
    click_on "Update Time block"

    assert_text "Time block was successfully updated"
    click_on "Back"
  end

  test "should destroy Time block" do
    visit time_block_url(@time_block)
    click_on "Destroy this time block", match: :first

    assert_text "Time block was successfully destroyed"
  end
end
