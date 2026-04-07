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
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
            <p className="text-gray-600 mb-8">
              Add some products to your cart before checking out.
            </p>
            <Button onClick={() => navigate('/products')}>
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Forms */}
            <div className="lg:col-span-2 space-y-6">
              {/* Guest Email */}
              {!isAuthenticated() && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-bold mb-4">Contact Information</h2>
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
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4">Shipping Address</h2>
                <div className="grid grid-cols-2 gap-4">
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
                  <div className="col-span-2">
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
                  <div className="col-span-2">
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
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold">Billing Address</h2>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={sameAsShipping}
                      onChange={(e) => setSameAsShipping(e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-sm">Same as shipping</span>
                  </label>
                </div>

                {!sameAsShipping && (
                  <div className="grid grid-cols-2 gap-4">
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
                    <div className="col-span-2">
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
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4">Payment Method</h2>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="credit_card"
                      checked={formData.paymentMethod === 'credit_card'}
                      onChange={handleChange}
                    />
                    <span>Credit Card</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="debit_card"
                      checked={formData.paymentMethod === 'debit_card'}
                      onChange={handleChange}
                    />
                    <span>Debit Card</span>
                  </label>
                </div>
                <p className="text-sm text-gray-600 mt-4">
                  Payment will be processed securely through our payment gateway.
                </p>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                
                <div className="space-y-3 mb-6">
                  {cart.map((item) => (
                    <div key={item._id} className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {item.name} x {item.quantity}
                      </span>
                      <span className="font-semibold">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-3 space-y-2 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold">${getCartTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-semibold">Free</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary-600">${getCartTotal().toFixed(2)}</span>
                  </div>
                </div>

                <Button
                  type="submit"
                  loading={loading}
                  className="w-full"
                >
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
