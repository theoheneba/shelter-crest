import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CreditCard, Calendar, Lock } from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useCartStore } from '../../store/cartStore';
import PaymentModal from '../../components/payment/PaymentModal';
import { useAuth } from '../../contexts/AuthContext';

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, total, clearCart } = useCartStore();
  const [paymentPlan, setPaymentPlan] = useState<'full' | '3months' | '6months'>('full');
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const calculateMonthlyPayment = () => {
    const interestRate = 0.28; // 28% interest rate
    const months = paymentPlan === '3months' ? 3 : 6;
    const principal = total;
    const monthlyInterest = interestRate / 12;
    const monthlyPayment = (principal * monthlyInterest * Math.pow(1 + monthlyInterest, months)) / 
                          (Math.pow(1 + monthlyInterest, months) - 1);
    return monthlyPayment;
  };

  const handlePaymentSuccess = async (reference: string) => {
    try {
      // Create order in database
      // Clear cart
      clearCart();
      navigate('/dashboard');
    } catch (error) {
      console.error('Payment failed:', error);
    }
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Your cart is empty</h2>
        <p className="mt-2 text-gray-600">Add some items to your cart to proceed with checkout.</p>
        <Button
          className="mt-6"
          onClick={() => navigate('/shop')}
        >
          Continue Shopping
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="divide-y divide-gray-200">
                {items.map((item) => (
                  <li key={item.id} className="py-4 flex">
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="h-16 w-16 rounded object-cover"
                    />
                    <div className="ml-4 flex flex-1 flex-col">
                      <div className="flex justify-between text-base font-medium text-gray-900">
                        <h3>{item.name}</h3>
                        <p className="ml-4">GH₵ {(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">Qty {item.quantity}</p>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-6 border-t border-gray-200 pt-4">
                <div className="flex justify-between text-base font-medium text-gray-900">
                  <p>Subtotal</p>
                  <p>GH₵ {total.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Plan */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Plan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <label className="relative flex cursor-pointer rounded-lg border p-4 focus:outline-none">
                  <input
                    type="radio"
                    name="payment-plan"
                    value="full"
                    className="sr-only"
                    checked={paymentPlan === 'full'}
                    onChange={(e) => setPaymentPlan('full')}
                  />
                  <div className="flex flex-1">
                    <div className="flex flex-col">
                      <span className="block text-sm font-medium text-gray-900">
                        Pay in Full
                      </span>
                      <span className="mt-1 flex items-center text-sm text-gray-500">
                        One-time payment of GH₵ {total.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className={`h-5 w-5 rounded-full border flex items-center justify-center ${
                    paymentPlan === 'full' ? 'border-primary-600 bg-primary-600' : 'border-gray-300'
                  }`}>
                    <div className={`rounded-full ${
                      paymentPlan === 'full' ? 'h-2.5 w-2.5 bg-white' : ''
                    }`} />
                  </div>
                </label>

                <label className="relative flex cursor-pointer rounded-lg border p-4 focus:outline-none">
                  <input
                    type="radio"
                    name="payment-plan"
                    value="3months"
                    className="sr-only"
                    checked={paymentPlan === '3months'}
                    onChange={(e) => setPaymentPlan('3months')}
                  />
                  <div className="flex flex-1">
                    <div className="flex flex-col">
                      <span className="block text-sm font-medium text-gray-900">
                        3 Monthly Payments
                      </span>
                      <span className="mt-1 flex items-center text-sm text-gray-500">
                        GH₵ {Math.round(calculateMonthlyPayment()).toLocaleString()} per month
                      </span>
                    </div>
                  </div>
                  <div className={`h-5 w-5 rounded-full border flex items-center justify-center ${
                    paymentPlan === '3months' ? 'border-primary-600 bg-primary-600' : 'border-gray-300'
                  }`}>
                    <div className={`rounded-full ${
                      paymentPlan === '3months' ? 'h-2.5 w-2.5 bg-white' : ''
                    }`} />
                  </div>
                </label>

                <label className="relative flex cursor-pointer rounded-lg border p-4 focus:outline-none">
                  <input
                    type="radio"
                    name="payment-plan"
                    value="6months"
                    className="sr-only"
                    checked={paymentPlan === '6months'}
                    onChange={(e) => setPaymentPlan('6months')}
                  />
                  <div className="flex flex-1">
                    <div className="flex flex-col">
                      <span className="block text-sm font-medium text-gray-900">
                        6 Monthly Payments
                      </span>
                      <span className="mt-1 flex items-center text-sm text-gray-500">
                        GH₵ {Math.round(calculateMonthlyPayment()).toLocaleString()} per month
                      </span>
                    </div>
                  </div>
                  <div className={`h-5 w-5 rounded-full border flex items-center justify-center ${
                    paymentPlan === '6months' ? 'border-primary-600 bg-primary-600' : 'border-gray-300'
                  }`}>
                    <div className={`rounded-full ${
                      paymentPlan === '6months' ? 'h-2.5 w-2.5 bg-white' : ''
                    }`} />
                  </div>
                </label>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment Summary */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Payment Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">GH₵ {total.toLocaleString()}</span>
                </div>

                {paymentPlan !== 'full' && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Interest (28% APR)</span>
                    <span className="font-medium">
                      GH₵ {(calculateMonthlyPayment() * (paymentPlan === '3months' ? 3 : 6) - total).toLocaleString()}
                    </span>
                  </div>
                )}

                <div className="pt-4 border-t border-gray-200">
                  <div className="flex justify-between">
                    <span className="text-base font-medium text-gray-900">Total</span>
                    <span className="text-base font-medium text-gray-900">
                      GH₵ {(paymentPlan === 'full' ? total : calculateMonthlyPayment() * (paymentPlan === '3months' ? 3 : 6)).toLocaleString()}
                    </span>
                  </div>
                  {paymentPlan !== 'full' && (
                    <div className="mt-1 text-sm text-gray-500">
                      {paymentPlan === '3months' ? '3' : '6'} monthly payments of GH₵ {Math.round(calculateMonthlyPayment()).toLocaleString()}
                    </div>
                  )}
                </div>

                <Button
                  fullWidth
                  size="lg"
                  className="mt-6"
                  onClick={() => setShowPaymentModal(true)}
                >
                  Proceed to Payment
                </Button>

                <p className="mt-4 flex justify-center text-sm text-gray-500">
                  <Lock className="w-4 h-4 mr-1.5" />
                  Secure payment processing
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        amount={paymentPlan === 'full' ? total : calculateMonthlyPayment()}
        dueDate={new Date().toISOString()}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </div>
  );
};

export default Checkout;