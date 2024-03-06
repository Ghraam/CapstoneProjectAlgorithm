Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html
  resources :sections
  resources :time_preferences
  resources :time_blocks
  resources :professors
  resources :course_preferences
  resources :courses
  resources :classrooms

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check
  post "generate" => "static_pages#generate", as: :generate

  # Defines the root path route ("/")
  root "static_pages#home"
end
