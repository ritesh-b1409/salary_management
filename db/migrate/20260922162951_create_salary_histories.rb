class CreateSalaryHistories < ActiveRecord::Migration[8.0]
  def change
    create_table :salary_histories do |t|
      t.references :employee, null: false, foreign_key: true
      t.decimal :amount, precision: 12, scale: 2
      t.string :currency
      t.date :effective_date
      t.string :reason
      t.string :changed_by

      t.timestamps
    end
  end
end
