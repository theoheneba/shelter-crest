import { usePaystackPayment } from 'react-paystack';
import Button from '../ui/Button';
import { useAuth } from '../../contexts/AuthContext';

interface PaystackButtonProps {
  amount: number;
  onSuccess: (reference: string) => void;
  onClose: () => void;
  className?: string;
}

const PaystackButton = ({ amount, onSuccess, onClose, className }: PaystackButtonProps) => {
  const { user } = useAuth();
  const publicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || 'pk_live_fadc0b6f399b4bd5046145881a0e1ee6284d79c6';

  if (!publicKey) {
    console.error('Paystack public key not found');
    return null;
  }

  const config = {
    reference: `pay_${Math.floor(Math.random() * 1000000000 + 1)}`,
    email: user?.email || '',
    amount: Math.round(amount * 100), // Convert to pesewas and ensure it's a whole number
    publicKey,
    currency: 'GHS',
  };

  const initializePayment = usePaystackPayment(config);

  const handlePayment = () => {
    initializePayment(() => onSuccess(config.reference), onClose);
  };

  return (
    <Button
      onClick={handlePayment}
      className={className}
    >
      Pay GH₵ {amount.toLocaleString()}
    </Button>
  );
};

export default PaystackButton;