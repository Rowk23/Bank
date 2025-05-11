import Header from './Header';
import './Layout.css';

/**
 * Layout Component
 * Provides consistent layout structure for the application
 * Includes header and main content area
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render in the layout
 */
const Layout = ({ children }) => {
  return (
    <div className="app-layout">
      <Header />
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default Layout;
