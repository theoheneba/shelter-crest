import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { dashboardService } from '../services/dashboardService';

interface DashboardState {
  applications: any[];
  documents: any[];
  users: any[];
  tickets: any[];
  payments: any[];
  analytics: any;
  systemSettings: any;
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchApplications: (filters?: any) => Promise<void>;
  updateApplication: (id: string, data: any) => Promise<void>;
  verifyDocument: (id: string, verifiedBy: string) => Promise<void>;
  updateDocumentStatus: (id: string, status: string) => Promise<void>;
  updateUserRole: (userId: string, role: 'user' | 'admin') => Promise<void>;
  updateUserStatus: (userId: string, status: string) => Promise<void>;
  updateSystemSettings: (settings: any) => Promise<void>;
  updateTicket: (id: string, data: any) => Promise<void>;
  addTicketReply: (ticketId: string, userId: string, message: string) => Promise<void>;
  updatePayment: (id: string, data: any) => Promise<void>;
  fetchAnalytics: (dateRange: string) => Promise<void>;
  fetchSystemSettings: () => Promise<void>;
  fetchTickets: () => Promise<void>;
  fetchDocuments: () => Promise<void>;
  fetchUsers: () => Promise<void>;
  fetchPayments: () => Promise<void>;
  clearError: () => void;
}

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set, get) => ({
      applications: [],
      documents: [],
      users: [],
      tickets: [],
      payments: [],
      analytics: null,
      systemSettings: null,
      loading: false,
      error: null,

      clearError: () => set({ error: null }),

      fetchApplications: async (filters) => {
        try {
          set({ loading: true, error: null });
          const applications = await dashboardService.getApplications(filters);
          set({ applications, loading: false });
        } catch (error) {
          set({ error: (error as Error).message, loading: false });
        }
      },

      updateApplication: async (id, data) => {
        try {
          set({ loading: true, error: null });
          const updatedApplication = await dashboardService.updateApplication(id, data);
          set(state => ({
            applications: state.applications.map(app =>
              app.id === id ? { ...app, ...updatedApplication } : app
            ),
            loading: false
          }));
        } catch (error) {
          set({ error: (error as Error).message, loading: false });
        }
      },

      verifyDocument: async (id, verifiedBy) => {
        try {
          set({ loading: true, error: null });
          const updatedDoc = await dashboardService.verifyDocument(id, verifiedBy);
          set(state => ({
            documents: state.documents.map(doc =>
              doc.id === id ? { ...doc, ...updatedDoc } : doc
            ),
            loading: false
          }));
        } catch (error) {
          set({ error: (error as Error).message, loading: false });
        }
      },

      updateDocumentStatus: async (id, status) => {
        try {
          set({ loading: true, error: null });
          const updatedDoc = await dashboardService.updateDocumentStatus(id, status);
          set(state => ({
            documents: state.documents.map(doc =>
              doc.id === id ? { ...doc, ...updatedDoc } : doc
            ),
            loading: false
          }));
        } catch (error) {
          set({ error: (error as Error).message, loading: false });
        }
      },

      updateUserRole: async (userId, role) => {
        try {
          set({ loading: true, error: null });
          const updatedUser = await dashboardService.updateUserRole(userId, role);
          set(state => ({
            users: state.users.map(user =>
              user.id === userId ? { ...user, ...updatedUser } : user
            ),
            loading: false
          }));
        } catch (error) {
          set({ error: (error as Error).message, loading: false });
        }
      },

      updateUserStatus: async (userId, status) => {
        try {
          set({ loading: true, error: null });
          const updatedUser = await dashboardService.updateUserStatus(userId, status);
          set(state => ({
            users: state.users.map(user =>
              user.id === userId ? { ...user, ...updatedUser } : user
            ),
            loading: false
          }));
        } catch (error) {
          set({ error: (error as Error).message, loading: false });
        }
      },

      updateSystemSettings: async (settings) => {
        try {
          set({ loading: true, error: null });
          const updatedSettings = await dashboardService.updateSystemSettings(settings);
          set({ systemSettings: updatedSettings, loading: false });
        } catch (error) {
          set({ error: (error as Error).message, loading: false });
        }
      },

      updateTicket: async (id, data) => {
        try {
          set({ loading: true, error: null });
          const updatedTicket = await dashboardService.updateTicket(id, data);
          set(state => ({
            tickets: state.tickets.map(ticket =>
              ticket.id === id ? { ...ticket, ...updatedTicket } : ticket
            ),
            loading: false
          }));
        } catch (error) {
          set({ error: (error as Error).message, loading: false });
        }
      },

      addTicketReply: async (ticketId, userId, message) => {
        try {
          set({ loading: true, error: null });
          const reply = await dashboardService.addTicketReply(ticketId, userId, message);
          set(state => ({
            tickets: state.tickets.map(ticket =>
              ticket.id === ticketId ? {
                ...ticket,
                replies: [...(ticket.replies || []), reply]
              } : ticket
            ),
            loading: false
          }));
        } catch (error) {
          set({ error: (error as Error).message, loading: false });
        }
      },

      updatePayment: async (id, data) => {
        try {
          set({ loading: true, error: null });
          const updatedPayment = await dashboardService.updatePayment(id, data);
          set(state => ({
            payments: state.payments.map(payment =>
              payment.id === id ? { ...payment, ...updatedPayment } : payment
            ),
            loading: false
          }));
        } catch (error) {
          set({ error: (error as Error).message, loading: false });
        }
      },

      fetchAnalytics: async (dateRange) => {
        try {
          set({ loading: true, error: null });
          const analytics = await dashboardService.getAnalytics(dateRange);
          set({ analytics, loading: false });
        } catch (error) {
          set({ error: (error as Error).message, loading: false });
        }
      },

      fetchSystemSettings: async () => {
        try {
          set({ loading: true, error: null });
          const settings = await dashboardService.getSystemSettings();
          set({ systemSettings: settings, loading: false });
        } catch (error) {
          set({ error: (error as Error).message, loading: false });
        }
      },

      fetchTickets: async () => {
        try {
          set({ loading: true, error: null });
          const { data: tickets, error } = await supabase
            .from('support_tickets')
            .select(`
              *,
              replies:ticket_replies(*)
            `)
            .order('created_at', { ascending: false });

          if (error) throw error;
          set({ tickets, loading: false });
        } catch (error) {
          set({ error: (error as Error).message, loading: false });
        }
      },

      fetchDocuments: async () => {
        try {
          set({ loading: true, error: null });
          const { data: documents, error } = await supabase
            .from('documents')
            .select('*')
            .order('created_at', { ascending: false });

          if (error) throw error;
          set({ documents, loading: false });
        } catch (error) {
          set({ error: (error as Error).message, loading: false });
        }
      },

      fetchUsers: async () => {
        try {
          set({ loading: true, error: null });
          const { data: users, error } = await supabase
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: false });

          if (error) throw error;
          set({ users, loading: false });
        } catch (error) {
          set({ error: (error as Error).message, loading: false });
        }
      },

      fetchPayments: async () => {
        try {
          set({ loading: true, error: null });
          const { data: payments, error } = await supabase
            .from('payments')
            .select('*')
            .order('created_at', { ascending: false });

          if (error) throw error;
          set({ payments, loading: false });
        } catch (error) {
          set({ error: (error as Error).message, loading: false });
        }
      }
    }),
    {
      name: 'dashboard-store',
      partialize: (state) => ({
        systemSettings: state.systemSettings,
        analytics: state.analytics
      })
    }
  )
);