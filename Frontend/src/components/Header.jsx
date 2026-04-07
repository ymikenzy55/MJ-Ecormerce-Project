import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useState } from 'react';

const Header = () => {
  const { user, isAuthenticated, logout, isAdmin } = useAuth();
  const { getCartCount } = useCart();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="container-custom">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-dark hover:text-primary transition-colors duration-300">
            MJ Electricals
          </Link>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden lg:flex flex-1 max-w-xl mx-12">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for electrical products..."
              className="flex-1 px-6 py-3 border border-light-border rounded-l-button focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-dark"
            />
            <button
              type="submit"
              className="px-8 py-3 bg-primary text-white rounded-r-button hover:bg-primary-hover transition-colors duration-300 font-medium"
            >
              Search
            </button>
          </form>

          {/* Navigation - Desktop */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link 
              to="/products" 
              className="text-dark hover:text-primary transition-colors duration-300 font-medium"
            >
              Products
            </Link>
            <Link 
              to="/contact" 
              className="text-dark hover:text-primary transition-colors duration-300 font-medium"
            >
              Contact
            </Link>
            
            {isAuthenticated() ? (
              <>
                {isAdmin() && (
                  <Link 
                    to="/admin" 
                    className="text-dark hover:text-primary transition-colors duration-300 font-medium"
                  >
                    Admin
                  </Link>
                )}
                <Link 
                  to="/profile" 
                  className="text-dark hover:text-primary transition-colors duration-300 font-medium"
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-dark hover:text-primary transition-colors duration-300 font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="text-dark hover:text-primary transition-colors duration-300 font-medium"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="px-6 py-3 bg-primary text-white rounded-button hover:bg-primary-hover transition-colors duration-300 font-medium"
                >
                  Sign Up
                </Link>
              </>
            )}
            
            <Link to="/cart" className="relative text-dark hover:text-primary transition-colors duration-300">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {getCartCount() > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                  {getCartCount()}
                </span>
              )}
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-dark p-2"
            aria-label="Toggle menu"
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-6 border-t border-light-border">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="flex mb-6">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="flex-1 px-4 py-3 border border-light-border rounded-l-button focus:outline-none focus:ring-2 focus:ring-primary text-dark"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-primary text-white rounded-r-button hover:bg-primary-hover font-medium"
              >
                Search
              </button>
            </form>
            
            {/* Mobile Navigation */}
            <nav className="flex flex-col gap-4">
              <Link 
                to="/products" 
                className="text-dark hover:text-primary font-medium py-2" 
                onClick={() => setMobileMenuOpen(false)}
              >
                Products
              </Link>
              <Link 
                to="/contact" 
                className="text-dark hover:text-primary font-medium py-2" 
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>
              {isAuthenticated() ? (
                <>
                  {isAdmin() && (
                    <Link 
                      to="/admin" 
                      className="text-dark hover:text-primary font-medium py-2" 
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <Link 
                    to="/profile" 
                    className="text-dark hover:text-primary font-medium py-2" 
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    My Profile
                  </Link>
                  <button 
                    onClick={() => { handleLogout(); setMobileMenuOpen(false); }} 
                    className="text-left text-dark hover:text-primary font-medium py-2"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="text-dark hover:text-primary font-medium py-2" 
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    className="text-dark hover:text-primary font-medium py-2" 
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
              <Link 
                to="/cart" 
                className="text-dark hover:text-primary font-medium py-2 flex items-center gap-2" 
                onClick={() => setMobileMenuOpen(false)}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Cart ({getCartCount()})
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
