require "csv"

module Api
  module V1
    class EmployeesController < BaseController
      before_action :set_employee, only: %i[show update destroy salary_history update_salary]

      def index
        page = [ params.fetch(:page, 1).to_i, 1 ].max
        per_page = params.fetch(:per_page, 25).to_i.clamp(1, 100)

        scope = Employee
          .search_by_name_or_id(params[:search])
          .in_department(params[:department])
          .in_country(params[:country])
          .with_status(params[:employment_status])

        scope = apply_sort(scope)

        total = scope.count
        employees = scope.offset((page - 1) * per_page).limit(per_page)

        render json: {
          data: employees.map(&:as_api_json),
          meta: {
            total: total,
            page: page,
            per_page: per_page,
            total_pages: (total.to_f / per_page).ceil,
          },
        }
      end

      def show
        render json: @employee.as_api_detail_json
      end

      def create
        employee = Employee.new(employee_params.except(:current_salary))
        employee.employment_status ||= "active"

        ActiveRecord::Base.transaction do
          employee.current_salary = employee_params[:current_salary] || 0
          employee.save!

          if employee_params[:current_salary].present?
            employee.salary_histories.create!(
              amount: employee_params[:current_salary],
              currency: employee.currency,
              effective_date: employee.hire_date,
              reason: "Starting salary",
              changed_by: current_user.name,
            )
          end
        end

        render json: employee.as_api_detail_json, status: :created
      rescue ActiveRecord::RecordInvalid => e
        render_model_errors(e.record)
      end

      def update
        if @employee.update(employee_params.except(:current_salary))
          render json: @employee.as_api_detail_json
        else
          render_model_errors(@employee)
        end
      end

      def destroy
        @employee.destroy!
        head :no_content
      end

      def salary_history
        render json: @employee.salary_histories.order(effective_date: :desc).map(&:as_api_json)
      end

      def update_salary
        effective_date = parse_date(salary_params[:effective_date])

        if effective_date && effective_date < Date.current
          return render_errors([ { field: "effective_date", message: "Effective date cannot be in the past" } ])
        end

        ActiveRecord::Base.transaction do
          history = @employee.salary_histories.create!(
            amount: salary_params[:amount],
            currency: @employee.currency,
            effective_date: effective_date,
            reason: salary_params[:reason],
            changed_by: current_user.name,
          )
          @employee.update!(current_salary: history.amount, last_raise_date: history.effective_date)
        end

        render json: @employee.as_api_detail_json
      rescue ActiveRecord::RecordInvalid => e
        render_model_errors(e.record)
      end

      def import
        file = params[:file]
        return render_errors([ { field: "file", message: "No file uploaded" } ]) if file.blank?

        created = 0
        errors = []

        CSV.foreach(file.path, headers: true).with_index(2) do |row, line_number|
          employee = Employee.new(
            name: row["name"],
            email: row["email"],
            department: row["department"],
            country: row["country"],
            role: row["role"],
            employment_status: row["employment_status"].presence || "active",
            hire_date: row["hire_date"],
            currency: row["currency"],
            current_salary: row["current_salary"],
          )

          if employee.save
            created += 1
          else
            errors << { row: line_number, message: employee.errors.full_messages.join(", ") }
          end
        end

        render json: { created: created, failed: errors.size, errors: errors }
      end

      def export
        scope = Employee
          .search_by_name_or_id(params[:search])
          .in_department(params[:department])
          .in_country(params[:country])
          .with_status(params[:employment_status])
        scope = apply_sort(scope)

        csv_data = CSV.generate(headers: true) do |csv|
          csv << %w[name email department country role employment_status hire_date currency current_salary last_raise_date]
          scope.find_each do |employee|
            csv << [
              employee.name, employee.email, employee.department, employee.country, employee.role,
              employee.employment_status, employee.hire_date, employee.currency, employee.current_salary,
              employee.last_raise_date,
            ]
          end
        end

        send_data csv_data, filename: "employees.csv", type: "text/csv"
      end

      private

      def set_employee
        @employee = Employee.find(params[:id])
      end

      def employee_params
        params.permit(:name, :email, :department, :country, :role, :employment_status,
                       :hire_date, :currency, :current_salary)
      end

      def salary_params
        params.permit(:amount, :effective_date, :reason)
      end

      def apply_sort(scope)
        sort = Employee::SORTABLE_COLUMNS.include?(params[:sort]) ? params[:sort] : "name"
        order = params[:order].to_s.downcase == "desc" ? :desc : :asc
        scope.order(sort => order)
      end

      def parse_date(value)
        Date.parse(value.to_s)
      rescue ArgumentError, TypeError
        nil
      end
    end
  end
end
