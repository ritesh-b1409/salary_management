class Employee < ApplicationRecord
  EMPLOYMENT_STATUSES = %w[active on_leave inactive terminated].freeze

  has_many :salary_histories, -> { order(effective_date: :asc) }, dependent: :destroy

  validates :name, presence: true
  validates :email, presence: true, uniqueness: true,
                     format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :department, presence: true
  validates :country, presence: true
  validates :role, presence: true
  validates :hire_date, presence: true
  validates :currency, presence: true, length: { is: 3 }
  validates :employment_status, inclusion: { in: EMPLOYMENT_STATUSES }
  validates :current_salary, numericality: { greater_than: 0 }, allow_nil: true

  scope :search_by_name_or_id, ->(term) {
    return all if term.blank?

    if term.match?(/\A\d+\z/)
      where("employees.name LIKE :term OR employees.id = :id", term: "%#{term}%", id: term.to_i)
    else
      where("employees.name LIKE :term", term: "%#{term}%")
    end
  }

  scope :in_department, ->(department) { department.present? ? where(department: department) : all }
  scope :in_country, ->(country) { country.present? ? where(country: country) : all }
  scope :with_status, ->(status) { status.present? ? where(employment_status: status) : all }

  SORTABLE_COLUMNS = %w[name department country current_salary].freeze

  def as_api_json
    {
      id: id,
      name: name,
      email: email,
      department: department,
      country: country,
      role: role,
      employment_status: employment_status,
      hire_date: hire_date&.iso8601,
      current_salary: current_salary.to_f,
      currency: currency,
      last_raise_date: last_raise_date&.iso8601,
    }
  end

  def as_api_detail_json
    as_api_json.merge(salary_history: salary_histories.map(&:as_api_json))
  end
end
