module Api
  module V1
    class BaseController < ApplicationController
      before_action :authenticate_request!

      attr_reader :current_user

      private

      def authenticate_request!
        header = request.headers["Authorization"]
        token = header&.split(" ")&.last

        if token.blank?
          return render_errors([ { field: "", message: "Missing authentication token" } ], status: :unauthorized)
        end

        payload = JsonWebToken.decode(token)
        @current_user = User.find_by(id: payload[:user_id])

        render_errors([ { field: "", message: "Invalid or expired token" } ], status: :unauthorized) unless @current_user
      rescue JsonWebToken::DecodeError
        render_errors([ { field: "", message: "Invalid or expired token" } ], status: :unauthorized)
      end
    end
  end
end
