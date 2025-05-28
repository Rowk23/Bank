import { useNavigate } from 'react-router-dom';
import './PaymentPage.css'; // Reuse payment page styles

const PaymentSuccessPage = () => {
  const navigate = useNavigate();

  const handleGoToPayments = () => {
    navigate('/payments/success');
  };

  return (
    <div className="payment-page">
      <div className="payments-header">
        <h1>Payment Successful</h1>
      </div>
      <div className="success-message">
        Your payment has been processed successfully.
      </div>
      <button className="btn btn-primary" onClick={handleGoToPayments}>
        Back to Payment History
      </button>
    </div>
  );
};

export default PaymentSuccessPage;
