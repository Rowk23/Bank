import { useState } from 'react';
import accountsService from '../../services/accountsService';
import { useNavigate } from 'react-router-dom';
//import '/OpenAccountPage.css';

const OpenAccountPage = () => {
  const [currency, setCurrency] = useState('USD');
  const [initialBalance, setInitialBalance] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const balance = parseFloat(initialBalance);
    if (isNaN(balance) || balance < 0) {
      setError('Please enter a valid starting balance.');
      return;
    }

    try {
      await accountsService.createAccount({ currency, initialBalance: balance });
      navigate('/accounts'); // redirect back to accounts list
    } catch (err) {
      setError(err.message || 'Failed to create account.');
    }
  };

  return (
    <div className="open-account-page">
      <h1>Open a New Account</h1>
      <form className="open-account-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Currency</label>
          <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
          </select>
        </div>

        <div className="form-group">
          <label>Initial Deposit</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={initialBalance}
            onChange={(e) => setInitialBalance(e.target.value)}
            placeholder="Enter initial balance"
            required
          />
        </div>

        {error && <div className="error-message">{error}</div>}

        <button className="btn btn-primary" type="submit">
          Create Account
        </button>
      </form>
    </div>
  );
};

export default OpenAccountPage;
