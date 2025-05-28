import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import transactionsService from '../../services/transactionsService';
import './PaymentPage.css'; // Reuse or create new styles

const PaymentsPage = () => {
  const [payments, setPayments] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const data = await transactionsService.getTransactions();
        const paymentTransactions = data.filter(tx => tx.type === 'payment');
        setPayments(paymentTransactions);
      } catch (err) {
        setError('Failed to load payment history.');
      }
    };
    fetchPayments();
  }, []);

  return (
    <div className="payment-page">
      <div className="payments-header">
        <h1>Payment History</h1>
        <button className="btn btn-primary" onClick={() => navigate('/payments/new')}>
          Make a New Payment
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {payments.length === 0 ? (
        <p>No payments found.</p>
      ) : (
        <table className="payments-table">
          <thead>
            <tr>
              <th>Identifier</th>
              <th>Amount</th>
              <th>Currency</th>
              <th>Date</th>
              <th>From Account</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.identifier}>
                <td>{payment.identifier}</td>
                <td>{payment.amount.toFixed(2)}</td>
                <td>{payment.currency}</td>
                <td>{new Date(payment.time).toLocaleString()}</td>
                <td>{payment.FROMid}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PaymentsPage;
