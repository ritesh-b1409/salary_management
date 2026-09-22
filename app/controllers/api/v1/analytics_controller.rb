module Api
  module V1
    class AnalyticsController < BaseController
      BUCKET_SIZE = 25_000

      def summary
        scope = Employee.in_department(params[:department]).in_country(params[:country])

        salaries = scope.pluck(:current_salary).map(&:to_f)
        headcount = salaries.size

        render json: {
          avg_salary: average(salaries),
          median_salary: median(salaries),
          total_payroll: salaries.sum,
          headcount: headcount,
          by_department: breakdown(scope, :department),
          by_country: breakdown(scope, :country),
          salary_distribution: distribution(salaries),
        }
      end

      private

      def breakdown(scope, column)
        scope
          .group(column)
          .pluck(column, Arel.sql("AVG(current_salary)"), Arel.sql("COUNT(*)"))
          .map { |label, avg, count| { column => label, avg_salary: avg.to_f, headcount: count } }
      end

      def average(values)
        return 0.0 if values.empty?

        (values.sum / values.size).round(2)
      end

      def median(values)
        return 0.0 if values.empty?

        sorted = values.sort
        mid = sorted.size / 2
        sorted.size.odd? ? sorted[mid] : ((sorted[mid - 1] + sorted[mid]) / 2.0).round(2)
      end

      def distribution(values)
        return [] if values.empty?

        max_bucket = (values.max / BUCKET_SIZE).floor
        buckets = Hash.new(0)

        values.each do |value|
          bucket = (value / BUCKET_SIZE).floor
          buckets[bucket] += 1
        end

        (0..max_bucket).map do |bucket|
          {
            bucket_start: bucket * BUCKET_SIZE,
            bucket_end: (bucket + 1) * BUCKET_SIZE,
            count: buckets[bucket],
          }
        end
      end
    end
  end
end
