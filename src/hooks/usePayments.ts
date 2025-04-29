import { useState, useEffect } from 'react';
import { useUserStore } from '../store/userStore';
import { formatCurrency } from '../utils/paymentCalculations';

export const usePayments = () => {
  const [recentPayments, setRecentPayments] = useState<any[]>([]);
  const [upcomingPayment, setUpcomingPayment] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { payments, fetchPayments } = useUserStore();

  useEffect(() => {
    const fetchPaymentData = async () => {
      try {
        setLoading(true);
        await fetchPayments();
        
        // Convert payments to the expected format
        const formattedPayments = payments.map(payment => ({
          id: payment.id,
          date: payment.due_date || payment.created_at,
          amount: payment.amount,
          status: payment.status === 'completed' ? 'Completed' : 
                 payment.status === 'pending' ? 'Pending' : 'Failed'
        }));
        
        // Sort by date (newest first)
        formattedPayments.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        
        setRecentPayments(formattedPayments);
        
        // Find the next upcoming payment
        const pendingPayments = formattedPayments.filter(p => p.status === 'Pending');
        if (pendingPayments.length > 0) {
          // Get the earliest pending payment
          pendingPayments.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
          
          const next = pendingPayments[0];
          const dueDate = new Date(next.date);
          const today = new Date();
          
          // Calculate days until the end of the payment window (5th of next month)
          let paymentWindowEnd = new Date(dueDate);
          if (dueDate.getDate() >= 25) {
            // If due date is 25th or later, payment window ends on 5th of next month
            paymentWindowEnd = new Date(dueDate.getFullYear(), dueDate.getMonth() + 1, 5);
          } else {
            // If due date is before 25th, it's likely already in the next month, so window ends on 5th of same month
            paymentWindowEnd = new Date(dueDate.getFullYear(), dueDate.getMonth(), 5);
          }
          
          const diffTime = paymentWindowEnd.getTime() - today.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
          setUpcomingPayment({
            ...next,
            daysUntil: diffDays
          });
        } else {
          // If no pending payments, create a mock upcoming payment
          const today = new Date();
          // Next payment window starts on the 25th of current month
          const nextPaymentDate = new Date(today.getFullYear(), today.getMonth(), 25);
          
          // If today is past the 25th, move to next month
          if (today.getDate() >= 25) {
            nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);
          }
          
          // Payment window ends on the 5th of the following month
          const paymentWindowEnd = new Date(nextPaymentDate.getFullYear(), nextPaymentDate.getMonth() + 1, 5);
          const diffTime = paymentWindowEnd.getTime() - today.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
          setUpcomingPayment({
            id: 'next',
            date: nextPaymentDate.toISOString(),
            amount: formattedPayments.length > 0 ? formattedPayments[0].amount : 1200,
            status: 'Pending',
            daysUntil: diffDays
          });
        }
        
        setLoading(false);
      } catch (err) {
        setError(err as Error);
        setLoading(false);
      }
    };

    fetchPaymentData();
  }, [fetchPayments, payments]);

  return {
    recentPayments,
    upcomingPayment,
    loading,
    error,
  };
};