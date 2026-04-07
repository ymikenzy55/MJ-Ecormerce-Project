import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Button from '../components/Button';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-light-gray flex items-center justify-center py-16">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-32 h-32 mx-auto mb-8 bg-light-gray rounded-full flex items-center justify-center">
              <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold mb-4 text-dark">Your Cart is Empty</h1>
            <p className="text-gray-600 text-lg mb-8">
              Looks like you haven't added any products to your cart yet.
            </p>
            <Link to="/products">
              <Button className="text-lg px-10 py-4">
                Start Shopping
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light-gray py-12">
      <div className="container-custom">
        <h1 className="text-4xl font-bold mb-10 text-dark">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-card shadow-card">
              {cart.map((item) => (
                <div
                  key={item._id}
                  className="flex flex-col sm:flex-row items-start sm:items-center gap-6 p-6 border-b border-light-border last:border-b-0"
                >
                  {/* Image */}
                  <Link to={`/products/${item._id}`} className="flex-shrink-0">
                    <div className="w-28 h-28 bg-light-gray rounded-card flex items-center justify-center overflow-hidden">
                      {item.images && item.images[0] ? (
                        <img
                          src={item.images[0]}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      )}
                    </div>
                  </Link>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/products/${item._id}`}
                      className="text-lg font-bold text-dark hover:text-primary transition-colors duration-300 block mb-2"
                    >
                      {item.name}
                    </Link>
                    <p className="text-gray-600 text-base">
                      ${item.price.toFixed(2)} each
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity - 1)}
                      className="w-10 h-10 flex items-center justify-center border-2 border-light-border rounded-button hover:border-primary hover:bg-light-gray transition-all duration-300 text-dark font-bold"
                    >
                      −
                    </button>
                    <span className="w-14 text-center font-bold text-lg text-dark">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      disabled={item.quantity >= item.inventory}
                      className="w-10 h-10 flex items-center justify-center border-2 border-light-border rounded-button hover:border-primary hover:bg-light-gray transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-dark font-bold"
                    >
                      +
                    </button>
                  </div>

                  {/* Subtotal */}
                  <div className="text-right min-w-[100px]">
                    <p className="font-bold text-xl text-dark">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="text-red-600 hover:text-red-700 p-2 transition-colors duration-300"
                    aria-label="Remove item"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-card shadow-card p-8 sticky top-24">
              <h2 className="text-2xl font-bold mb-6 text-dark">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-base">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold text-dark">${getCartTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold text-green-600">Free</span>
                </div>
                <div className="border-t border-light-border pt-4 flex justify-between">
                  <span className="text-xl font-bold text-dark">Total</span>
                  <span className="text-2xl font-bold text-primary">
                    ${getCartTotal().toFixed(2)}
                  </span>
                </div>
              </div>

              <Button
                onClick={() => navigate('/checkout')}
                className="w-full mb-4 text-lg py-4"
              >
                Proceed to Checkout
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Button>

              <Link
                to="/products"
                className="block text-center text-primary hover:text-primary-hover font-medium transition-colors duration-300"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
