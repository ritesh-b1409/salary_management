module Api
  module V1
    class AuthController < ApplicationController
      def login
        user = User.find_by(email: params[:email]&.downcase)

        if user&.authenticate(params[:password])
          token = JsonWebToken.encode(user_id: user.id)
          render json: { token: token, user: user.as_api_json }, status: :ok
        else
          render_errors([ { field: "", message: "Invalid email or password" } ], status: :unauthorized)
        end
      end
    end
  end
end
