# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).

User.find_or_create_by!(email: "hr@example.com") do |user|
  user.name = "Pat Rivera"
  user.password = "password123"
  user.password_confirmation = "password123"
end

EMPLOYEE_COUNT = (ENV["SEED_EMPLOYEE_COUNT"] || 10_000).to_i

DEPARTMENTS = %w[Engineering Sales Marketing Finance Operations Customer\ Support Human\ Resources Legal Product Design].freeze

COUNTRIES_WITH_CURRENCY = {
  "United States" => "USD",
  "United Kingdom" => "GBP",
  "Germany" => "EUR",
  "India" => "INR",
  "Canada" => "CAD",
  "Australia" => "AUD",
  "Japan" => "JPY",
  "Brazil" => "BRL",
}.freeze

ROLES_BY_DEPARTMENT = {
  "Engineering" => [ "Software Engineer", "Senior Software Engineer", "Staff Engineer", "Engineering Manager" ],
  "Sales" => [ "Account Executive", "Sales Development Rep", "Sales Manager", "VP of Sales" ],
  "Marketing" => [ "Marketing Specialist", "Content Strategist", "Marketing Manager" ],
  "Finance" => [ "Financial Analyst", "Accountant", "Finance Manager" ],
  "Operations" => [ "Operations Coordinator", "Operations Manager" ],
  "Customer Support" => [ "Support Specialist", "Support Team Lead" ],
  "Human Resources" => [ "HR Generalist", "Recruiter", "HR Manager" ],
  "Legal" => [ "Legal Counsel", "Paralegal" ],
  "Product" => [ "Product Manager", "Senior Product Manager" ],
  "Design" => [ "Product Designer", "Senior Product Designer" ],
}.freeze

EMPLOYMENT_STATUS_WEIGHTS = (
  Array.new(90) { "active" } + Array.new(5) { "on_leave" } + Array.new(3) { "inactive" } + Array.new(2) { "terminated" }
).freeze

SALARY_RANGE_BY_DEPARTMENT = {
  "Engineering" => 70_000..190_000,
  "Sales" => 55_000..170_000,
  "Marketing" => 55_000..140_000,
  "Finance" => 60_000..150_000,
  "Operations" => 50_000..120_000,
  "Customer Support" => 42_000..90_000,
  "Human Resources" => 50_000..130_000,
  "Legal" => 75_000..180_000,
  "Product" => 70_000..175_000,
  "Design" => 65_000..150_000,
}.freeze

FIRST_NAMES = %w[Ada Grace Alan Margaret Katherine Linus James Elena Priya Wei Fatima Carlos Noah Olivia Liam Sofia Mateo Yuki Ibrahim Chidi].freeze
LAST_NAMES = %w[Lovelace Hopper Turing Hamilton Johnson Torvalds Chen Diaz Singh Wang Ahmed Silva Kim Rossi Kowalski Nakamura Mensah Abara Costa Nowak].freeze

if Employee.count < EMPLOYEE_COUNT
  puts "Seeding #{EMPLOYEE_COUNT} employees…"

  now = Time.current
  employees_batch = []
  batch_size = 1000

  (Employee.count + 1..EMPLOYEE_COUNT).each do |i|
    department = DEPARTMENTS.sample
    country = COUNTRIES_WITH_CURRENCY.keys.sample
    currency = COUNTRIES_WITH_CURRENCY.fetch(country)
    role = ROLES_BY_DEPARTMENT.fetch(department).sample
    status = EMPLOYMENT_STATUS_WEIGHTS.sample
    hire_date = rand(30..3650).days.ago.to_date
    salary_range = SALARY_RANGE_BY_DEPARTMENT.fetch(department)
    current_salary = rand(salary_range).round(-2)
    had_raise = rand < 0.6
    last_raise_date = had_raise ? rand(30..900).days.ago.to_date : nil

    employees_batch << {
      name: "#{FIRST_NAMES.sample} #{LAST_NAMES.sample} #{i}",
      email: "employee#{i}@example.com",
      department: department,
      country: country,
      role: role,
      employment_status: status,
      hire_date: hire_date,
      currency: currency,
      current_salary: current_salary,
      last_raise_date: last_raise_date,
      created_at: now,
      updated_at: now,
    }

    if employees_batch.size >= batch_size
      Employee.insert_all(employees_batch)
      employees_batch = []
      print "."
    end
  end

  Employee.insert_all(employees_batch) if employees_batch.any?
  puts "\nSeeding salary history…"

  history_batch = []
  Employee.find_each do |employee|
    starting_salary = (employee.current_salary * rand(0.75..0.95)).round(-2)

    history_batch << {
      employee_id: employee.id,
      amount: starting_salary,
      currency: employee.currency,
      effective_date: employee.hire_date,
      reason: "Starting salary",
      changed_by: "HR Manager",
      created_at: now,
      updated_at: now,
    }

    if employee.last_raise_date
      history_batch << {
        employee_id: employee.id,
        amount: employee.current_salary,
        currency: employee.currency,
        effective_date: employee.last_raise_date,
        reason: [ "Annual review", "Promotion", "Market adjustment" ].sample,
        changed_by: "HR Manager",
        created_at: now,
        updated_at: now,
      }
    end

    if history_batch.size >= batch_size
      SalaryHistory.insert_all(history_batch)
      history_batch = []
      print "."
    end
  end
  SalaryHistory.insert_all(history_batch) if history_batch.any?

  puts "\nDone. #{Employee.count} employees, #{SalaryHistory.count} salary history entries."
else
  puts "Employees already seeded (#{Employee.count})."
end
