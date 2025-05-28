import { useNavigate } from 'react-router-dom';
import './PaymentPage.css';

const PaymentErrorPage = () => {
  const navigate = useNavigate();

  const handleTryAgain = () => {
    navigate('/payments/new');
  };

  return (
    <div className="payment-page">
      <div className="payments-header">
        <h1>Payment Failed</h1>
      </div>
      <div className="error-message">
        Something went wrong while processing your payment. Please try again later.
      </div>
      <button className="btn btn-primary" onClick={handleTryAgain}>
        Try Again
      </button>
    </div>
  );
};

export default PaymentErrorPage;
