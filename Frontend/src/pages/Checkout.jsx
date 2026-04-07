import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api/client';
import toast from 'react-hot-toast';
import Button from '../components/Button';
import Input from '../components/Input';

const Checkout = () => {
  const { cart, getCartTotal, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    // Shipping Info
    shippingFirstName: user?.firstName || '',
    shippingLastName: user?.lastName || '',
    shippingAddress: '',
    shippingCity: '',
    shippingState: '',
    shippingZipCode: '',
    shippingCountry: 'USA',
    shippingPhone: '',
    
    // Billing Info
    billingFirstName: user?.firstName || '',
    billingLastName: user?.lastName || '',
    billingAddress: '',
    billingCity: '',
    billingState: '',
    billingZipCode: '',
    billingCountry: 'USA',
    
    // Guest Email
    guestEmail: user?.email || '',
    
    // Payment Info
    paymentMethod: 'credit_card',
  });

  const [sameAsShipping, setSameAsShipping] = useState(true);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (cart.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        items: cart.map((item) => ({
          productId: item._id,
          productName: item.name,
          productPrice: item.price,
          quantity: item.quantity,
          subtotal: item.price * item.quantity,
        })),
        shippingAddress: {
          firstName: formData.shippingFirstName,
          lastName: formData.shippingLastName,
          address: formData.shippingAddress,
          city: formData.shippingCity,
          state: formData.shippingState,
          zipCode: formData.shippingZipCode,
          country: formData.shippingCountry,
          phone: formData.shippingPhone,
        },
        billingAddress: sameAsShipping ? {
          firstName: formData.shippingFirstName,
          lastName: formData.shippingLastName,
          address: formData.shippingAddress,
          city: formData.shippingCity,
          state: formData.shippingState,
          zipCode: formData.shippingZipCode,
          country: formData.shippingCountry,
        } : {
          firstName: formData.billingFirstName,
          lastName: formData.billingLastName,
          address: formData.billingAddress,
          city: formData.billingCity,
          state: formData.billingState,
          zipCode: formData.billingZipCode,
          country: formData.billingCountry,
        },
        paymentInfo: {
          method: formData.paymentMethod,
        },
        orderTotal: getCartTotal(),
      };

      // Add guest email if not authenticated
      if (!isAuthenticated()) {
        orderData.guestEmail = formData.guestEmail;
      }

      const response = await apiClient.post('/api/orders', orderData);
      
      toast.success('Order placed successfully!');
      clearCart();
      navigate(`/order-confirmation/${response.data.orderNumber}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-light-gray flex items-center justify-center py-16">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-32 h-32 mx-auto mb-8 bg-white rounded-full flex items-center justify-center shadow-card">
              <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold mb-4 text-dark">Your Cart is Empty</h1>
            <p className="text-gray-600 text-lg mb-8">
              Add some products to your cart before checking out.
            </p>
            <Button onClick={() => navigate('/products')} className="text-lg px-10 py-4">
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light-gray py-12">
      <div className="container-custom">
        <h1 className="text-4xl font-bold mb-10 text-dark">Checkout</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Forms */}
            <div className="lg:col-span-2 space-y-6">
              {/* Guest Email */}
              {!isAuthenticated() && (
                <div className="bg-white rounded-card shadow-card p-8">
                  <h2 className="text-2xl font-bold mb-6 text-dark">Contact Information</h2>
                  <Input
                    label="Email"
                    type="email"
                    name="guestEmail"
                    value={formData.guestEmail}
                    onChange={handleChange}
                    required
                  />
                </div>
              )}

              {/* Shipping Address */}
              <div className="bg-white rounded-card shadow-card p-8">
                <h2 className="text-2xl font-bold mb-6 text-dark">Shipping Address</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Input
                    label="First Name"
                    name="shippingFirstName"
                    value={formData.shippingFirstName}
                    onChange={handleChange}
                    required
                  />
                  <Input
                    label="Last Name"
                    name="shippingLastName"
                    value={formData.shippingLastName}
                    onChange={handleChange}
                    required
                  />
                  <div className="sm:col-span-2">
                    <Input
                      label="Address"
                      name="shippingAddress"
                      value={formData.shippingAddress}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <Input
                    label="City"
                    name="shippingCity"
                    value={formData.shippingCity}
                    onChange={handleChange}
                    required
                  />
                  <Input
                    label="State"
                    name="shippingState"
                    value={formData.shippingState}
                    onChange={handleChange}
                    required
                  />
                  <Input
                    label="ZIP Code"
                    name="shippingZipCode"
                    value={formData.shippingZipCode}
                    onChange={handleChange}
                    required
                  />
                  <Input
                    label="Country"
                    name="shippingCountry"
                    value={formData.shippingCountry}
                    onChange={handleChange}
                    required
                  />
                  <div className="sm:col-span-2">
                    <Input
                      label="Phone"
                      type="tel"
                      name="shippingPhone"
                      value={formData.shippingPhone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Billing Address */}
              <div className="bg-white rounded-card shadow-card p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-dark">Billing Address</h2>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sameAsShipping}
                      onChange={(e) => setSameAsShipping(e.target.checked)}
                      className="w-5 h-5 rounded border-light-border text-primary focus:ring-primary"
                    />
                    <span className="text-base font-medium text-dark">Same as shipping</span>
                  </label>
                </div>

                {!sameAsShipping && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <Input
                      label="First Name"
                      name="billingFirstName"
                      value={formData.billingFirstName}
                      onChange={handleChange}
                      required
                    />
                    <Input
                      label="Last Name"
                      name="billingLastName"
                      value={formData.billingLastName}
                      onChange={handleChange}
                      required
                    />
                    <div className="sm:col-span-2">
                      <Input
                        label="Address"
                        name="billingAddress"
                        value={formData.billingAddress}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <Input
                      label="City"
                      name="billingCity"
                      value={formData.billingCity}
                      onChange={handleChange}
                      required
                    />
                    <Input
                      label="State"
                      name="billingState"
                      value={formData.billingState}
                      onChange={handleChange}
                      required
                    />
                    <Input
                      label="ZIP Code"
                      name="billingZipCode"
                      value={formData.billingZipCode}
                      onChange={handleChange}
                      required
                    />
                    <Input
                      label="Country"
                      name="billingCountry"
                      value={formData.billingCountry}
                      onChange={handleChange}
                      required
                    />
                  </div>
                )}
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-card shadow-card p-8">
                <h2 className="text-2xl font-bold mb-6 text-dark">Payment Method</h2>
                <div className="space-y-4">
                  <label className="flex items-center gap-3 p-4 border-2 border-light-border rounded-button cursor-pointer hover:border-primary transition-all duration-300">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="credit_card"
                      checked={formData.paymentMethod === 'credit_card'}
                      onChange={handleChange}
                      className="w-5 h-5 text-primary focus:ring-primary"
                    />
                    <span className="font-medium text-dark">Credit Card</span>
                  </label>
                  <label className="flex items-center gap-3 p-4 border-2 border-light-border rounded-button cursor-pointer hover:border-primary transition-all duration-300">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="debit_card"
                      checked={formData.paymentMethod === 'debit_card'}
                      onChange={handleChange}
                      className="w-5 h-5 text-primary focus:ring-primary"
                    />
                    <span className="font-medium text-dark">Debit Card</span>
                  </label>
                </div>
                <p className="text-sm text-gray-600 mt-6 p-4 bg-light-gray rounded-button">
                  <svg className="w-5 h-5 inline mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Payment will be processed securely through our payment gateway.
                </p>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-card shadow-card p-8 sticky top-24">
                <h2 className="text-2xl font-bold mb-6 text-dark">Order Summary</h2>
                
                <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                  {cart.map((item) => (
                    <div key={item._id} className="flex justify-between text-sm pb-3 border-b border-light-border last:border-0">
                      <span className="text-gray-600">
                        {item.name} × {item.quantity}
                      </span>
                      <span className="font-semibold text-dark">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-light-border pt-4 space-y-3 mb-6">
                  <div className="flex justify-between text-base">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold text-dark">${getCartTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-base">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-semibold text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold pt-3 border-t border-light-border">
                    <span className="text-dark">Total</span>
                    <span className="text-primary">${getCartTotal().toFixed(2)}</span>
                  </div>
                </div>

                <Button
                  type="submit"
                  loading={loading}
                  className="w-full text-lg py-4"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Place Order
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
