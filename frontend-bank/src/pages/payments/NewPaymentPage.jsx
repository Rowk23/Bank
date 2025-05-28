import { useState, useEffect } from 'react';
import accountsService from '../../services/accountsService';
import transactionsService from '../../services/transactionsService';
import './PaymentPage.css';
import { useNavigate } from 'react-router-dom';
import PaymentErrorPage from './PaymentErrorPage';
import PaymentSuccessPage from './PaymentSuccessPage';

const NewPaymentPage = () => {
  const [accounts, setAccounts] = useState([]);
  const [formData, setFormData] = useState({
    fromAccountId: '',
    iban: '',
    name: '',
    amount: ''
  });
  const [loading, setLoading] = useState(false);
  const [successPopup, setSuccessPopup] = useState(false);
  const [error, setError] = useState('');
const navigate = useNavigate();

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const data = await accountsService.getUserAccounts();
        setAccounts(data);
      } catch (err) {
        setError('Failed to load accounts.');
      }
    };
    fetchAccounts();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };


  const handlePayment = async (e) => {
    e.preventDefault();
    setError('');

    const { fromAccountId, iban, name, amount } = formData;
    const senderAccount = accounts.find(acc => acc.id === parseInt(fromAccountId));
    const numericAmount = parseFloat(amount);

    if (!senderAccount || !iban || !name || isNaN(numericAmount)) {
      setError('Please complete all fields.');
      return;
    }

    if (numericAmount > senderAccount.balance) {
      setError('Insufficient funds in selected account.');
      return;
    }

    setLoading(true);
    try {
      const transactionPayload = {
        identifier: `PAY-${Date.now()}`,
        amount: numericAmount,
        currency: senderAccount.currency,
        time: new Date().toISOString(),
        type: 'payment',
        FROMid: senderAccount.id,
        TOid: accounts.length > 0 ? accounts[0].id : senderAccount.id,
        phone: null
      };

      await transactionsService.createTransaction(transactionPayload);
      navigate('/payments/success');
    } catch (err) {
      navigate('/payments/error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-page">
      <h1>New Payment</h1>

      <form className="payment-form" onSubmit={handlePayment}>
        <div className="form-group">
          <label>Pay From Account</label>
          <select
            name="fromAccountId"
            value={formData.fromAccountId}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Account</option>
            {accounts.map(acc => (
              <option key={acc.id} value={acc.id}>
                {acc.iban} - {acc.currency} {acc.balance.toFixed(2)}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Recipient IBAN</label>
          <input
            type="text"
            name="iban"
            value={formData.iban}
            onChange={handleInputChange}
            required
            placeholder="Enter IBAN"
          />
        </div>

        <div className="form-group">
          <label>Recipient Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            placeholder="Enter recipient name"
          />
        </div>

        <div className="form-group">
          <label>Amount</label>
          <input
            type="number"
            name="amount"
            step="0.01"
            min="0"
            value={formData.amount}
            onChange={handleInputChange}
            required
            placeholder="Enter amount"
          />
        </div>

        {error && <div className="error-message">{error}</div>}

        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? 'Processing...' : 'Make Payment'}
        </button>
      </form>

      {successPopup && (
        <div className="payment-popup">
          <div className="popup-content">
            <h2>Payment Successful</h2>
            <p>Your payment has been processed successfully.</p>
            <button className="btn btn-secondary" onClick={() => setSuccessPopup(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewPaymentPage;
