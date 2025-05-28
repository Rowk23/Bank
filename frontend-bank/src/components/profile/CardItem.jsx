import { Link } from 'react-router-dom';
import './ProfileComponents.css';

/**
 * Card Item Component
 * Displays a bank card with its details
 * 
 * @param {Object} props - Component props
 * @param {Object} props.card - Card data
 */
const CardItem = ({ card }) => {
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

  return (
    <div className="card-item">
      {/* Removed card type class */}
      <div className="card-container">
        <div className="card-header">
          {/* Removed card type display */}
          <div className="card-chip"></div>
        </div>

        <div className="card-number">
            <div className="label">Card number</div>
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

      <div className="card-actions">
        <Link to={`/profile/cards/${card.id}`} className="btn btn-primary">
          View Details
        </Link>
      </div>
    </div>
  );
};

export default CardItem;
