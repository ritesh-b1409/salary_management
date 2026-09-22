class SalaryHistory < ApplicationRecord
  belongs_to :employee

  validates :amount, numericality: { greater_than: 0 }
  validates :effective_date, presence: true
  validates :currency, presence: true, length: { is: 3 }
  validates :reason, presence: true
  validates :changed_by, presence: true

  def as_api_json
    {
      id: id,
      effective_date: effective_date.iso8601,
      amount: amount.to_f,
      currency: currency,
      reason: reason,
      changed_by: changed_by,
    }
  end
end
