require "test_helper"

class TimeBlocksControllerTest < ActionDispatch::IntegrationTest
  setup do
    @time_block = time_blocks(:one)
  end

  test "should get index" do
    get time_blocks_url
    assert_response :success
  end

  test "should get new" do
    get new_time_block_url
    assert_response :success
  end

  test "should create time_block" do
    assert_difference("TimeBlock.count") do
      post time_blocks_url, params: { time_block: { block_type: @time_block.block_type, corresponding_block: @time_block.corresponding_block, day: @time_block.day, identifier: @time_block.identifier, timeslot: @time_block.timeslot } }
    end

    assert_redirected_to time_block_url(TimeBlock.last)
  end

  test "should show time_block" do
    get time_block_url(@time_block)
    assert_response :success
  end

  test "should get edit" do
    get edit_time_block_url(@time_block)
    assert_response :success
  end

  test "should update time_block" do
    patch time_block_url(@time_block), params: { time_block: { block_type: @time_block.block_type, corresponding_block: @time_block.corresponding_block, day: @time_block.day, identifier: @time_block.identifier, timeslot: @time_block.timeslot } }
    assert_redirected_to time_block_url(@time_block)
  end

  test "should destroy time_block" do
    assert_difference("TimeBlock.count", -1) do
      delete time_block_url(@time_block)
    end

    assert_redirected_to time_blocks_url
  end
end
