import { useState, useEffect } from 'react';
import ProfileSidebar from '../../components/profile/ProfileSidebar';
import CardItem from '../../components/profile/CardItem';
import cardsService from '../../services/cardsService';
import './ProfilePages.css';

/**
 * Cards Page Component
 * Displays all cards associated with the user
 */
const CardsPage = () => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch cards data when component mounts
  useEffect(() => {
    const fetchCards = async () => {
      try {
        setLoading(true);
        const cardsData = await cardsService.getUserCards();
        setCards(cardsData || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching cards:', err);
        setError('Failed to load cards. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCards();
  }, []);

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-sidebar-container">
          <ProfileSidebar />
        </div>
        
        <div className="profile-content">
          <div className="profile-header">
            <h1>My Cards</h1>
          </div>
          
          {loading ? (
            <div className="profile-loading">
              <div className="loading-spinner"></div>
              <p>Loading cards...</p>
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
          ) : cards.length === 0 ? (
            <div className="profile-empty-state">
              <div className="empty-icon">💳</div>
              <h2>No Cards Found</h2>
              <p>You don't have any cards associated with your account yet.</p>
              <button className="btn btn-primary">Request a New Card</button>
            </div>
          ) : (
            <div className="cards-container">
              {cards.map(card => (
                <CardItem key={card.id} card={card} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CardsPage;
