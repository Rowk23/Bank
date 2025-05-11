import { Link } from 'react-router-dom';
import './ProfileComponents.css';

/**
 * Account Item Component
 * Displays an individual bank account with its details
 * 
 * @param {Object} props - Component props
 * @param {Object} props.account - Account data
 */
const AccountItem = ({ account }) => {
  /**
   * Format IBAN to be more readable
   * @param {string} iban - IBAN string
   * @returns {string} - Formatted IBAN with spaces every 4 characters
   */
  const formatIBAN = (iban) => {
    if (!iban) return 'N/A';
    // Format IBAN in groups of 4 characters
    return iban.replace(/(.{4})/g, '$1 ').trim();
  };

  /**
   * Format amount with currency symbol
   * @param {number} amount - Account balance
   * @param {string} currency - Currency code
   * @returns {string} - Formatted amount with currency
   */
  const formatAmount = (amount, currency = 'USD') => {
    if (amount === undefined || amount === null) return '0.00';
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD'
    }).format(amount);
  };

  /**
   * Get background color class based on account currency
   * @param {string} currency - Currency code
   * @returns {string} - CSS class name
   */
  const getAccountColorClass = (currency) => {
    switch (currency) {
      case 'USD':
        return 'account-usd';
      case 'EUR':
        return 'account-eur';
      case 'GBP':
        return 'account-gbp';
      case 'RON':
        return 'account-ron';
      default:
        return 'account-default';
    }
  };

  return (
    <div className={`account-item ${getAccountColorClass(account.currency)}`}>
      <div className="account-header">
        <div className="account-type">
          {account.currency} Account
        </div>
        <div className="account-balance">
          {formatAmount(account.balance, account.currency)}
        </div>
      </div>
      
      <div className="account-details">
        <div className="account-iban-container">
          <div className="account-label">IBAN</div>
          <div className="account-iban">{formatIBAN(account.IBAN)}</div>
        </div>
      </div>
      
      <div className="account-actions">
        <Link 
          to={`/profile/accounts/${account.id}`} 
          className="btn btn-sm"
        >
          View Details
        </Link>
        <Link 
          to={`/profile/accounts/${account.id}/transactions`} 
          className="btn btn-sm"
        >
          Transactions
        </Link>
      </div>
    </div>
  );
};

export default AccountItem;
