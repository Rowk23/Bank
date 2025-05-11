import { useState } from 'react';
import './ProfileComponents.css';

/**
 * Transaction Filters Component
 * Provides filtering options for transactions lists
 * 
 * @param {Object} props - Component props
 * @param {Object} props.filters - Current filter values
 * @param {Function} props.onFilterChange - Filter change handler
 * @param {Function} props.onClearFilters - Clear filters handler
 * @param {Array} props.transactionTypes - Available transaction types (optional)
 * @param {Array} props.currencies - Available currencies (optional)
 */
const TransactionFilters = ({ 
  filters, 
  onFilterChange, 
  onClearFilters,
  transactionTypes = [],
  currencies = []
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  /**
   * Handle input field changes
   * @param {Event} e - Input change event
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    onFilterChange({
      ...filters,
      [name]: value
    });
  };
  
  /**
   * Toggle filter panel expansion
   */
  const toggleFilters = () => {
    setIsExpanded(!isExpanded);
  };
  
  /**
   * Check if any filters are active
   * @returns {Boolean} - True if any filters are set
   */
  const hasActiveFilters = () => {
    return Object.values(filters).some(value => value !== '');
  };
  
  // Default transaction types if none provided
  const defaultTypes = ['transfer', 'deposit', 'withdrawal', 'payment', 'refund'];
  const availableTypes = transactionTypes.length > 0 ? transactionTypes : defaultTypes;
  
  // Default currencies if none provided
  const defaultCurrencies = ['USD', 'EUR', 'GBP', 'RON'];
  const availableCurrencies = currencies.length > 0 ? currencies : defaultCurrencies;

  return (
    <div className="transaction-filters">
      <div className="filters-header">
        <button 
          className="filter-toggle-btn"
          onClick={toggleFilters}
        >
          <span>Filters</span>
          <span className="toggle-icon">{isExpanded ? '▲' : '▼'}</span>
        </button>
        
        {hasActiveFilters() && (
          <button 
            className="clear-filters-btn"
            onClick={onClearFilters}
          >
            Clear All
          </button>
        )}
      </div>
      
      {isExpanded && (
        <div className="filters-content">
          <div className="filters-grid">
            <div className="filter-group">
              <label htmlFor="type">Transaction Type</label>
              <select 
                id="type"
                name="type"
                value={filters.type}
                onChange={handleChange}
              >
                <option value="">All Types</option>
                {availableTypes.map(type => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="filter-group">
              <label htmlFor="currency">Currency</label>
              <select 
                id="currency"
                name="currency"
                value={filters.currency}
                onChange={handleChange}
              >
                <option value="">All Currencies</option>
                {availableCurrencies.map(currency => (
                  <option key={currency} value={currency}>
                    {currency}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="filter-group">
              <label htmlFor="dateFrom">From Date</label>
              <input 
                type="date"
                id="dateFrom"
                name="dateFrom"
                value={filters.dateFrom}
                onChange={handleChange}
              />
            </div>
            
            <div className="filter-group">
              <label htmlFor="dateTo">To Date</label>
              <input 
                type="date"
                id="dateTo"
                name="dateTo"
                value={filters.dateTo}
                onChange={handleChange}
              />
            </div>
            
            <div className="filter-group">
              <label htmlFor="minAmount">Min Amount</label>
              <input 
                type="number"
                id="minAmount"
                name="minAmount"
                value={filters.minAmount}
                onChange={handleChange}
                min="0"
                step="0.01"
              />
            </div>
            
            <div className="filter-group">
              <label htmlFor="maxAmount">Max Amount</label>
              <input 
                type="number"
                id="maxAmount"
                name="maxAmount"
                value={filters.maxAmount}
                onChange={handleChange}
                min="0"
                step="0.01"
              />
            </div>
          </div>
          
          <div className="filters-actions">
            <button 
              className="btn btn-secondary"
              onClick={onClearFilters}
            >
              Clear Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionFilters;
