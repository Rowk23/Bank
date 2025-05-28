import React from 'react';
import ProfileSidebar from '../../components/profile/ProfileSidebar';
import './ExchangeRates.css';

const exchangeRates = [
  { currency: 'USD', bnr: 4.4478, buy: 4.3500, sell: 4.5700 },
  { currency: 'EUR', bnr: 5.0612, buy: 4.9850, sell: 5.1350 },
  { currency: 'GBP', bnr: 6.0313, buy: 5.8600, sell: 6.1850 },
  { currency: 'CHF', bnr: 5.4142, buy: 5.2950, sell: 5.4700 },
  { currency: 'CAD', bnr: 3.2419, buy: 3.0800, sell: 3.3850 },
  { currency: 'MDL', bnr: 0.2578, buy: 0.2500, sell: 0.2700 },
  { currency: 'HUF', bnr: 0.0125, buy: 0.0120, sell: 0.0131 },
  { currency: 'CZK', bnr: 0.2035, buy: 0.1850, sell: 0.2150 },
  { currency: 'PLN', bnr: 1.1915, buy: 1.1350, sell: 1.2400 },
];

const ExchangeRatesPage = () => {
  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-sidebar-container">
          <ProfileSidebar />
        </div>

        <div className="profile-content">
          <div className="profile-header">
            <h1>Currency Exchange Rates</h1>
          </div>

          <div className="exchange-rates-wrapper">
            <table className="exchange-rates-table">
              <thead>
                <tr>
                  <th>Currency</th>
                  <th>BNR Rate</th>
                  <th>Buy</th>
                  <th>Sell</th>
                </tr>
              </thead>
              <tbody>
                {exchangeRates.map(rate => (
                  <tr key={rate.currency}>
                    <td>{rate.currency}</td>
                    <td>{rate.bnr.toFixed(4)}</td>
                    <td>{rate.buy.toFixed(4)}</td>
                    <td>{rate.sell.toFixed(4)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="exchange-rates-footer">
              Rates are updated daily | Source: National Bank
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExchangeRatesPage;
