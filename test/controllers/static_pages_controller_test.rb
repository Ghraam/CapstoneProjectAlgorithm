require "test_helper"

class StaticPagesControllerTest < ActionDispatch::IntegrationTest
  test "should get home" do
    get static_pages_home_url
    assert_response :success
  end

  test "should get generate" do
    get static_pages_generate_url
    assert_response :success
  end
end
