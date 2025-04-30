import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase, subscribeToChanges } from '../services/db';
import { toast } from 'react-hot-toast';

interface UserState {
  applications: any[];
  documents: any[];
  payments: any[];
  loading: boolean;
  error: string | null;
  
  // Add subscription cleanup functions
  subscriptions: (() => void)[];
  
  // Add subscription setup function
  setupSubscriptions: () => void;
  cleanup: () => void;
  
  fetchApplications: () => Promise<void>;
  createApplication: (data: any) => Promise<any>;
  updateApplication: (id: string, data: any) => Promise<void>;
  fetchDocuments: () => Promise<void>;
  uploadDocument: (data: any) => Promise<void>;
  fetchPayments: () => Promise<void>;
  makePayment: (data: any) => Promise<void>;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      applications: [],
      documents: [],
      payments: [],
      loading: false,
      error: null,
      subscriptions: [],

      setupSubscriptions: async () => {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) return;

        const subscriptions = [
          // Subscribe to applications changes
          subscribeToChanges('applications', (payload) => {
            const { eventType, new: newApp, old: oldApp } = payload;
            
            // Only process changes for the current user
            if (newApp?.user_id !== user.id && oldApp?.user_id !== user.id) return;
            
            set(state => {
              switch (eventType) {
                case 'INSERT':
                  return {
                    applications: [newApp, ...state.applications]
                  };
                case 'UPDATE':
                  return {
                    applications: state.applications.map(app =>
                      app.id === newApp.id ? { ...app, ...newApp } : app
                    )
                  };
                case 'DELETE':
                  return {
                    applications: state.applications.filter(app => app.id !== oldApp.id)
                  };
                default:
                  return state;
              }
            });
          }),

          // Subscribe to documents changes
          subscribeToChanges('documents', (payload) => {
            const { eventType, new: newDoc, old: oldDoc } = payload;
            
            // Only process changes for the current user
            if (newDoc?.user_id !== user.id && oldDoc?.user_id !== user.id) return;
            
            set(state => {
              switch (eventType) {
                case 'INSERT':
                  return {
                    documents: [newDoc, ...state.documents]
                  };
                case 'UPDATE':
                  return {
                    documents: state.documents.map(doc =>
                      doc.id === newDoc.id ? { ...doc, ...newDoc } : doc
                    )
                  };
                case 'DELETE':
                  return {
                    documents: state.documents.filter(doc => doc.id !== oldDoc.id)
                  };
                default:
                  return state;
              }
            });
          }),

          // Subscribe to payments changes
          subscribeToChanges('payments', (payload) => {
            const { eventType, new: newPayment, old: oldPayment } = payload;
            
            // Only process changes for payments related to the user's applications
            const isUserPayment = (payment: any) => {
              return payment?.application?.user_id === user.id;
            };
            
            if (!isUserPayment(newPayment) && !isUserPayment(oldPayment)) return;
            
            set(state => {
              switch (eventType) {
                case 'INSERT':
                  return {
                    payments: [newPayment, ...state.payments]
                  };
                case 'UPDATE':
                  return {
                    payments: state.payments.map(payment =>
                      payment.id === newPayment.id ? { ...payment, ...newPayment } : payment
                    )
                  };
                case 'DELETE':
                  return {
                    payments: state.payments.filter(payment => payment.id !== oldPayment.id)
                  };
                default:
                  return state;
              }
            });
          })
        ];

        set({ subscriptions });
      },

      cleanup: () => {
        const { subscriptions } = get();
        subscriptions.forEach(unsubscribe => unsubscribe());
        set({ subscriptions: [] });
      },

      fetchApplications: async () => {
        try {
          set({ loading: true, error: null });
          const { data: { user } } = await supabase.auth.getUser();
          
          if (!user) throw new Error('Not authenticated');

          const { data, error } = await supabase
            .from('applications')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

          if (error) throw error;
          set({ applications: data || [], loading: false });
        } catch (error: any) {
          set({ error: error.message, loading: false });
          toast.error('Failed to fetch applications');
        }
      },

      createApplication: async (data) => {
        try {
          set({ loading: true, error: null });
          const { data: { user } } = await supabase.auth.getUser();
          
          if (!user) throw new Error('Not authenticated');

          const { data: newApp, error } = await supabase
            .from('applications')
            .insert([{ ...data, user_id: user.id }])
            .select()
            .single();

          if (error) throw error;
          
          set(state => ({
            applications: [newApp, ...state.applications],
            loading: false
          }));
          
          toast.success('Application submitted successfully');
          return newApp;
        } catch (error: any) {
          set({ error: error.message, loading: false });
          toast.error('Failed to submit application');
          throw error;
        }
      },

      updateApplication: async (id, data) => {
        try {
          set({ loading: true, error: null });
          const { data: updatedApp, error } = await supabase
            .from('applications')
            .update(data)
            .eq('id', id)
            .select()
            .single();

          if (error) throw error;
          
          set(state => ({
            applications: state.applications.map(app => 
              app.id === id ? { ...app, ...updatedApp } : app
            ),
            loading: false
          }));
          
          toast.success('Application updated successfully');
        } catch (error: any) {
          set({ error: error.message, loading: false });
          toast.error('Failed to update application');
          throw error;
        }
      },

      fetchDocuments: async () => {
        try {
          set({ loading: true, error: null });
          const { data: { user } } = await supabase.auth.getUser();
          
          if (!user) throw new Error('Not authenticated');

          const { data, error } = await supabase
            .from('documents')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

          if (error) throw error;
          set({ documents: data || [], loading: false });
        } catch (error: any) {
          set({ error: error.message, loading: false });
          toast.error('Failed to fetch documents');
        }
      },

      uploadDocument: async (data) => {
        try {
          set({ loading: true, error: null });
          const { data: { user } } = await supabase.auth.getUser();
          
          if (!user) throw new Error('Not authenticated');

          const { data: newDoc, error } = await supabase
            .from('documents')
            .insert([{ ...data, user_id: user.id }])
            .select()
            .single();

          if (error) throw error;
          
          set(state => ({
            documents: [newDoc, ...state.documents],
            loading: false
          }));
          
          toast.success('Document uploaded successfully');
        } catch (error: any) {
          set({ error: error.message, loading: false });
          toast.error('Failed to upload document');
          throw error;
        }
      },

      fetchPayments: async () => {
        try {
          set({ loading: true, error: null });
          const { data: { user } } = await supabase.auth.getUser();
          
          if (!user) throw new Error('Not authenticated');

          const { data, error } = await supabase
            .from('payments')
            .select(`
              *,
              application:applications(
                id,
                user_id
              )
            `)
            .eq('application.user_id', user.id)
            .order('created_at', { ascending: false });

          if (error) throw error;
          set({ payments: data || [], loading: false });
        } catch (error: any) {
          set({ error: error.message, loading: false });
          toast.error('Failed to fetch payments');
        }
      },

      makePayment: async (data) => {
        try {
          set({ loading: true, error: null });
          const { data: { user } } = await supabase.auth.getUser();
          
          if (!user) throw new Error('Not authenticated');

          const { data: newPayment, error } = await supabase
            .from('payments')
            .insert([{ ...data }])
            .select(`
              *,
              application:applications(
                id,
                user_id
              )
            `)
            .single();

          if (error) throw error;
          
          set(state => ({
            payments: [newPayment, ...state.payments],
            loading: false
          }));
          
          toast.success('Payment successful');
        } catch (error: any) {
          set({ error: error.message, loading: false });
          toast.error('Failed to process payment');
          throw error;
        }
      }
    }),
    {
      name: 'user-store',
      partialize: (state) => ({
        applications: state.applications,
        documents: state.documents,
        payments: state.payments
      })
    }
  )
);