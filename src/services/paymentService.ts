import { supabase } from './db';
import { toast } from 'react-hot-toast';

export interface Payment {
  id: string;
  application_id: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  payment_method: string;
  transaction_id: string;
  created_at: string;
}

export interface PaymentVerification {
  reference: string;
  amount: number;
  applicationId: string;
}

export const paymentService = {
  async createPayment(data: Omit<Payment, 'id' | 'created_at'>) {
    try {
      const { data: payment, error } = await supabase
        .from('payments')
        .insert([data])
        .select()
        .single();

      if (error) throw error;
      return payment;
    } catch (error: any) {
      toast.error(error.message || 'Failed to create payment');
      throw error;
    }
  },

  async getUserPayments(userId: string) {
    try {
      const { data, error } = await supabase
        .from('payments')
        .select(`
          *,
          application:applications(
            id,
            user_id
          )
        `)
        .eq('application.user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch payments');
      throw error;
    }
  },

  async verifyPayment(data: PaymentVerification) {
    try {
      // First, verify the payment with Paystack
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/verify-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({ reference: data.reference }),
      });

      if (!response.ok) {
        throw new Error('Payment verification failed');
      }

      const verificationResult = await response.json();
      
      if (!verificationResult.success) {
        throw new Error(verificationResult.message || 'Payment verification failed');
      }

      // If verification is successful, update the payment record
      const { data: payment, error } = await supabase
        .from('payments')
        .insert([{
          application_id: data.applicationId,
          amount: data.amount,
          due_date: new Date().toISOString().split('T')[0], // Today's date
          paid_date: new Date().toISOString(),
          status: 'completed',
          payment_method: 'paystack',
          transaction_id: data.reference
        }])
        .select(`
          *,
          application:applications(
            id,
            user_id
          )
        `)
        .single();

      if (error) throw error;
      
      toast.success('Payment successful!');
      return payment;
    } catch (error: any) {
      toast.error(error.message || 'Payment verification failed');
      throw error;
    }
  }
};