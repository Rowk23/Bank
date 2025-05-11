import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ProfileSidebar from '../../components/profile/ProfileSidebar';
import TransactionItem from '../../components/profile/TransactionItem';
import cardsService from '../../services/cardsService';
import './ProfilePages.css';

/**
 * Card Details Page Component
 * Displays detailed information about a specific card
 * and recent transactions associated with it
 */
const CardDetailsPage = () => {
  const { cardId } = useParams();
  const [card, setCard] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch card details and transactions when component mounts
  useEffect(() => {
    const fetchCardData = async () => {
      try {
        setLoading(true);
        
        // Fetch card details
        const cardData = await cardsService.getCardDetails(cardId);
        setCard(cardData);
        
        // Fetch card transactions
        const transactionsData = await cardsService.getCardTransactions(cardId);
        setTransactions(transactionsData || []);
        
        setError(null);
      } catch (err) {
        console.error('Error fetching card details:', err);
        setError('Failed to load card details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (cardId) {
      fetchCardData();
    }
  }, [cardId]);

  // Format card number to show only last 4 digits
  const formatCardNumber = (number) => {
    if (!number) return 'XXXX-XXXX-XXXX-XXXX';
    const lastFour = number.slice(-4);
    return `XXXX-XXXX-XXXX-${lastFour}`;
  };

  // Format expiry date
  const formatExpiryDate = (date) => {
    if (!date) return 'MM/YY';
    const expiryDate = new Date(date);
    const month = String(expiryDate.getMonth() + 1).padStart(2, '0');
    const year = String(expiryDate.getFullYear()).slice(-2);
    return `${month}/${year}`;
  };

  // Determine card type based on first digit
  const getCardType = (number) => {
    if (!number) return 'Unknown';
    const firstDigit = number.charAt(0);
    
    switch (firstDigit) {
      case '4':
        return 'Visa';
      case '5':
        return 'MasterCard';
      case '3':
        return 'American Express';
      case '6':
        return 'Discover';
      default:
        return 'Card';
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-sidebar-container">
          <ProfileSidebar />
        </div>
        
        <div className="profile-content">
          <div className="profile-header">
            <Link to="/profile/cards" className="back-link">
              &larr; Back to Cards
            </Link>
            <h1>Card Details</h1>
          </div>
          
          {loading ? (
            <div className="profile-loading">
              <div className="loading-spinner"></div>
              <p>Loading card details...</p>
            </div>
          ) : error ? (
            <div className="profile-error">
              <p>{error}</p>
              <button 
                className="btn btn-primary"
                onClick={() => window.location.reload()}
              >
                Try Again
              </button>
            </div>
          ) : card ? (
            <>
              <div className="card-details-container">
                <div className={`card-details-visual ${getCardType(card.number).toLowerCase()}`}>
                  <div className="card-header">
                    <div className="card-type">{getCardType(card.number)}</div>
                    <div className="card-chip"></div>
                  </div>
                  
                  <div className="card-number">
                    {formatCardNumber(card.number)}
                  </div>
                  
                  <div className="card-footer">
                    <div className="card-holder">
                      <div className="label">Card Holder</div>
                      <div className="value">{card.holderName || 'CARD HOLDER'}</div>
                    </div>
                    
                    <div className="card-expiry">
                      <div className="label">Expires</div>
                      <div className="value">{formatExpiryDate(card.expirationDate)}</div>
                    </div>
                  </div>
                </div>
                
                <div className="card-info">
                  <div className="card-info-section">
                    <h2>Card Information</h2>
                    
                    <div className="info-grid">
                      <div className="info-item">
                        <span className="info-label">Card Type</span>
                        <span className="info-value">{getCardType(card.number)}</span>
                      </div>
                      
                      <div className="info-item">
                        <span className="info-label">Card Number</span>
                        <span className="info-value">{formatCardNumber(card.number)}</span>
                      </div>
                      
                      <div className="info-item">
                        <span className="info-label">Expiry Date</span>
                        <span className="info-value">{formatExpiryDate(card.expirationDate)}</span>
                      </div>
                      
                      <div className="info-item">
                        <span className="info-label">Card Holder</span>
                        <span className="info-value">{card.holderName}</span>
                      </div>
                      
                      <div className="info-item">
                        <span className="info-label">Status</span>
                        <span className={`info-value status-badge ${card.status?.toLowerCase() || 'active'}`}>
                          {card.status || 'Active'}
                        </span>
                      </div>
                      
                      <div className="info-item">
                        <span className="info-label">Linked Account</span>
                        <span className="info-value">{card.AccountsId || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="card-actions">
                    <button className="btn btn-secondary">Lock Card</button>
                    <button className="btn btn-primary">Manage Limits</button>
                  </div>
                </div>
              </div>
              
              <div className="card-transactions-section">
                <div className="section-header">
                  <h2>Recent Transactions</h2>
                  <Link to={`/profile/cards/${cardId}/transactions`} className="view-all-link">
                    View All
                  </Link>
                </div>
                
                {transactions.length === 0 ? (
                  <div className="empty-transactions">
                    <p>No transactions found for this card.</p>
                  </div>
                ) : (
                  <div className="transactions-list">
                    {transactions.slice(0, 5).map(transaction => (
                      <TransactionItem 
                        key={transaction.id} 
                        transaction={transaction} 
                      />
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="profile-error">
              <p>Card not found.</p>
              <Link to="/profile/cards" className="btn btn-primary">
                Back to Cards
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CardDetailsPage;
