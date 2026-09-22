Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check

  namespace :api do
    namespace :v1 do
      post "auth/login", to: "auth#login"

      resources :employees, only: %i[index show create update destroy] do
        member do
          get :salary_history
          patch :salary, action: :update_salary
        end

        collection do
          post :import
          get "export.csv", action: :export, defaults: { format: "csv" }
        end
      end

      get "analytics/summary", to: "analytics#summary"
    end
  end
end
