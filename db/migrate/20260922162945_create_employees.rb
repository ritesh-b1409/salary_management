class CreateEmployees < ActiveRecord::Migration[8.0]
  def change
    create_table :employees do |t|
      t.string :name
      t.string :email
      t.string :department
      t.string :country
      t.string :role
      t.string :employment_status
      t.date :hire_date
      t.string :currency
      t.decimal :current_salary, precision: 12, scale: 2
      t.date :last_raise_date

      t.timestamps
    end
    add_index :employees, :email, unique: true
    add_index :employees, :department
    add_index :employees, :country
    add_index :employees, :employment_status
    add_index :employees, :name
  end
end
