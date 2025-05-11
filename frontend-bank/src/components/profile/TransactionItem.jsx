import { Link } from 'react-router-dom';
import './ProfileComponents.css';

/**
 * Transaction Item Component
 * Displays a transaction with its details
 * 
 * @param {Object} props - Component props
 * @param {Object} props.transaction - Transaction data
 * @param {String} props.linkTo - Custom link destination (optional)
 */
const TransactionItem = ({ transaction, linkTo }) => {
  // Format date to a readable format
  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Format amount with currency symbol
  const formatAmount = (amount, currency = 'USD') => {
    if (amount === undefined || amount === null) return '0.00';
    
    // Use browser's Intl API for proper currency formatting
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD'
    }).format(amount);
  };

  // Determine if transaction is incoming or outgoing
  const isIncoming = transaction.type === 'deposit' || 
                     transaction.type === 'transfer_in' || 
                     transaction.type === 'refund';

  return (
    <div className={`transaction-item ${isIncoming ? 'incoming' : 'outgoing'}`}>
      <div className="transaction-icon">
        <span>{isIncoming ? '↓' : '↑'}</span>
      </div>
      
      <div className="transaction-details">
        <div className="transaction-title">
          {transaction.identifier || 'Transaction'}
        </div>
        <div className="transaction-date">
          {formatDate(transaction.time)}
        </div>
        {transaction.phone && (
          <div className="transaction-phone">
            Phone: {transaction.phone}
          </div>
        )}
      </div>
      
      <div className="transaction-amount">
        {isIncoming ? '+' : '-'}{formatAmount(transaction.amount, transaction.currency)}
      </div>
      
      <div className="transaction-actions">
        <Link 
          to={linkTo || `/profile/transactions/${transaction.id}`} 
          className="btn btn-sm"
        >
          Details
        </Link>
      </div>
    </div>
  );
};

export default TransactionItem;
