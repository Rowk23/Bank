# Banking Frontend Application

A modern, responsive banking frontend application built with React and Vite. This application provides a user-friendly interface for banking operations including authentication, account management, transactions, and more.

## Features

- **Authentication System**: Secure login and registration
- **Dashboard**: Overview of accounts and recent transactions
- **Responsive Design**: Works on desktop and mobile devices
- **Accessibility**: Follows WCAG guidelines for better accessibility

## Technology Stack

- **React**: UI library
- **React Router**: For navigation and routing
- **Axios**: For API communication
- **CSS**: Raw CSS for styling (no frameworks)

## Project Structure

```
src/
├── assets/         # Static assets like images
├── components/     # Reusable UI components
│   └── auth/       # Authentication-related components
├── context/        # React context providers
├── pages/          # Page components
│   ├── auth/       # Authentication pages
│   └── dashboard/  # Dashboard and other protected pages
├── services/       # API services
├── utils/          # Utility functions and configurations
└── App.jsx         # Main application component
```

## Environment Variables

The application uses environment variables for configuration. Create a `.env` file in the project root with the following variables:

```
VITE_API_URL=http://localhost:5000/api
```

You can customize the API URL based on your backend configuration.

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with the required environment variables
4. Start the development server:
   ```bash
   npm run dev
   ```

## Building for Production

To build the application for production:

```bash
npm run build
```

The built files will be in the `dist` directory.

## API Integration

This frontend is designed to work with a RESTful banking API. The API endpoints used include:

- `/api/login` - User authentication
- `/api/register` - User registration
- `/api/users` - User management
- `/api/accounts` - Account management
- `/api/transactions` - Transaction operations

## Security Considerations

- JWT tokens are stored in localStorage for authentication
- API requests include authentication headers
- Form validation is implemented for all user inputs
- Error handling is implemented for API communication
