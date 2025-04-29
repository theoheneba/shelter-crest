import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase, subscribeToChanges } from '../services/db';
import { toast } from 'react-hot-toast';

interface SystemSettings {
  id?: string;
  systemName: string;
  defaultCurrency: string;
  defaultLanguage: string;
  smtpServer: string;
  smtpPort: number;
  senderEmail: string;
  emailNotifications: boolean;
  systemAlerts: boolean;
  applicationUpdates: boolean;
}

interface SecuritySettings {
  id?: string;
  twoFactorAuth: boolean;
  passwordComplexity: 'high' | 'medium' | 'low';
  sessionTimeout: number;
  ipWhitelisting: boolean;
  accountLockout: number;
  logRetention: number;
}

interface DatabaseSettings {
  id?: string;
  backupFrequency: 'daily' | 'weekly' | 'monthly';
  backupRetentionPeriod: number;
}

interface Property {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  total_units: number;
  occupied_units: number;
  monthly_revenue: number;
  status: 'active' | 'maintenance' | 'inactive';
}

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  created_at: string;
}

interface Application {
  id: string;
  user_id: string;
  status: string;
  monthly_rent: number;
  deposit_amount: number;
  interest_amount: number;
  total_initial_payment: number;
  created_at: string;
  applicant: {
    name: string;
    email: string;
    phone: string;
  };
  riskScore: number;
  completeness: number;
}

interface Document {
  id: string;
  user_id: string;
  document_type: string;
  file_name: string;
  status: string;
  created_at: string;
  user: {
    first_name: string;
    last_name: string;
    email: string;
  };
}

interface Payment {
  id: string;
  application_id: string;
  amount: number;
  status: string;
  created_at: string;
  user: {
    first_name: string;
    last_name: string;
  };
  application: {
    property_address: string;
  };
}

interface Ticket {
  id: string;
  user_id: string;
  subject: string;
  category: string;
  priority: string;
  status: string;
  created_at: string;
  user: {
    first_name: string;
    last_name: string;
    email: string;
  };
  replies?: any[];
}

interface AdminState {
  systemSettings: SystemSettings;
  securitySettings: SecuritySettings;
  databaseSettings: DatabaseSettings;
  properties: Property[];
  users: User[];
  applications: Application[];
  documents: Document[];
  payments: Payment[];
  tickets: Ticket[];
  selectedApplication: Application | null;
  selectedDocument: Document | null;
  selectedTicket: Ticket | null;
  loading: boolean;
  error: string | null;
  subscriptions: (() => void)[];
  
  // Functions
  setupSubscriptions: () => void;
  cleanup: () => void;
  fetchSystemSettings: () => Promise<void>;
  updateSystemSettings: (settings: Partial<SystemSettings>) => Promise<void>;
  fetchSecuritySettings: () => Promise<void>;
  updateSecuritySettings: (settings: Partial<SecuritySettings>) => Promise<void>;
  fetchDatabaseSettings: () => Promise<void>;
  updateDatabaseSettings: (settings: Partial<DatabaseSettings>) => Promise<void>;
  backupDatabase: () => Promise<void>;
  fetchProperties: () => Promise<void>;
  addProperty: (property: Omit<Property, 'id'>) => Promise<void>;
  updateProperty: (id: string, data: Partial<Property>) => Promise<void>;
  deleteProperty: (id: string) => Promise<void>;
  fetchUsers: () => Promise<void>;
  addUser: (user: Partial<User>) => Promise<void>;
  updateUser: (id: string, data: Partial<User>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  fetchApplications: () => Promise<void>;
  updateApplication: (id: string, data: Partial<Application>) => Promise<void>;
  setSelectedApplication: (application: Application | null) => void;
  fetchDocuments: () => Promise<void>;
  verifyDocument: (id: string, status: string) => Promise<void>;
  setSelectedDocument: (document: Document | null) => void;
  fetchPayments: () => Promise<void>;
  approvePayment: (id: string) => Promise<void>;
  fetchTickets: () => Promise<void>;
  updateTicket: (id: string, data: Partial<Ticket>) => Promise<void>;
  setSelectedTicket: (ticket: Ticket | null) => void;
  addTicketReply: (ticketId: string, message: string) => Promise<void>;
  generateReport: (type: string, dateRange: string) => Promise<string>;
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set, get) => ({
      systemSettings: {
        systemName: 'RentAssist Admin',
        defaultCurrency: 'GHS',
        defaultLanguage: 'en',
        smtpServer: 'smtp.hostinger.com',
        smtpPort: 465,
        senderEmail: 'info@sheltercrest.org',
        emailNotifications: true,
        systemAlerts: true,
        applicationUpdates: true,
      },
      
      securitySettings: {
        twoFactorAuth: false,
        passwordComplexity: 'high',
        sessionTimeout: 30,
        ipWhitelisting: false,
        accountLockout: 3,
        logRetention: 30,
      },
      
      databaseSettings: {
        backupFrequency: 'daily',
        backupRetentionPeriod: 30,
      },
      
      properties: [],
      users: [],
      applications: [],
      documents: [],
      payments: [],
      tickets: [],
      selectedApplication: null,
      selectedDocument: null,
      selectedTicket: null,
      loading: false,
      error: null,
      subscriptions: [],
      
      setupSubscriptions: () => {
        const subscriptions = [
          // Subscribe to system settings changes
          subscribeToChanges('system_settings', (payload) => {
            const { new: newSettings } = payload;
            if (!newSettings) return;
            
            set(state => ({
              systemSettings: {
                ...state.systemSettings,
                id: newSettings.id,
                systemName: newSettings.system_name || state.systemSettings.systemName,
                defaultCurrency: newSettings.default_currency || state.systemSettings.defaultCurrency,
                defaultLanguage: newSettings.default_language || state.systemSettings.defaultLanguage,
                smtpServer: newSettings.smtp_server || state.systemSettings.smtpServer,
                smtpPort: newSettings.smtp_port || state.systemSettings.smtpPort,
                senderEmail: newSettings.sender_email || state.systemSettings.senderEmail,
                emailNotifications: newSettings.email_notifications !== undefined ? 
                  newSettings.email_notifications : state.systemSettings.emailNotifications,
                systemAlerts: newSettings.system_alerts !== undefined ? 
                  newSettings.system_alerts : state.systemSettings.systemAlerts,
                applicationUpdates: newSettings.application_updates !== undefined ? 
                  newSettings.application_updates : state.systemSettings.applicationUpdates,
              }
            }));
          }),
          
          // Subscribe to security settings changes
          subscribeToChanges('security_settings', (payload) => {
            const { new: newSettings } = payload;
            if (!newSettings) return;
            
            set(state => ({
              securitySettings: {
                ...state.securitySettings,
                twoFactorAuth: newSettings.two_factor_auth !== undefined ? 
                  newSettings.two_factor_auth : state.securitySettings.twoFactorAuth,
                passwordComplexity: newSettings.password_complexity || state.securitySettings.passwordComplexity,
                sessionTimeout: newSettings.session_timeout || state.securitySettings.sessionTimeout,
                ipWhitelisting: newSettings.ip_whitelisting !== undefined ? 
                  newSettings.ip_whitelisting : state.securitySettings.ipWhitelisting,
                accountLockout: newSettings.account_lockout || state.securitySettings.accountLockout,
                logRetention: newSettings.log_retention || state.securitySettings.logRetention,
              }
            }));
          }),
          
          // Subscribe to database settings changes
          subscribeToChanges('database_settings', (payload) => {
            const { new: newSettings } = payload;
            if (!newSettings) return;
            
            set(state => ({
              databaseSettings: {
                ...state.databaseSettings,
                backupFrequency: newSettings.backup_frequency || state.databaseSettings.backupFrequency,
                backupRetentionPeriod: newSettings.backup_retention_period || state.databaseSettings.backupRetentionPeriod,
              }
            }));
          }),
          
          // Subscribe to properties changes
          subscribeToChanges('properties', (payload) => {
            const { eventType, new: newProperty, old: oldProperty } = payload;
            
            set(state => {
              switch (eventType) {
                case 'INSERT':
                  return {
                    properties: [...state.properties, newProperty]
                  };
                case 'UPDATE':
                  return {
                    properties: state.properties.map(prop =>
                      prop.id === newProperty.id ? { ...prop, ...newProperty } : prop
                    )
                  };
                case 'DELETE':
                  return {
                    properties: state.properties.filter(prop => prop.id !== oldProperty.id)
                  };
                default:
                  return state;
              }
            });
          }),
          
          // Subscribe to users changes
          subscribeToChanges('profiles', (payload) => {
            const { eventType, new: newUser, old: oldUser } = payload;
            
            set(state => {
              switch (eventType) {
                case 'INSERT':
                  return {
                    users: [...state.users, newUser]
                  };
                case 'UPDATE':
                  return {
                    users: state.users.map(user =>
                      user.id === newUser.id ? { ...user, ...newUser } : user
                    )
                  };
                case 'DELETE':
                  return {
                    users: state.users.filter(user => user.id !== oldUser.id)
                  };
                default:
                  return state;
              }
            });
          }),
          
          // Subscribe to applications changes
          subscribeToChanges('applications', (payload) => {
            const { eventType, new: newApp, old: oldApp } = payload;
            
            set(state => {
              switch (eventType) {
                case 'INSERT':
                  return {
                    applications: [...state.applications, newApp]
                  };
                case 'UPDATE':
                  return {
                    applications: state.applications.map(app =>
                      app.id === newApp.id ? { ...app, ...newApp } : app
                    ),
                    selectedApplication: state.selectedApplication?.id === newApp.id ? 
                      { ...state.selectedApplication, ...newApp } : state.selectedApplication
                  };
                case 'DELETE':
                  return {
                    applications: state.applications.filter(app => app.id !== oldApp.id),
                    selectedApplication: state.selectedApplication?.id === oldApp.id ? null : state.selectedApplication
                  };
                default:
                  return state;
              }
            });
          }),
          
          // Subscribe to documents changes
          subscribeToChanges('documents', (payload) => {
            const { eventType, new: newDoc, old: oldDoc } = payload;
            
            set(state => {
              switch (eventType) {
                case 'INSERT':
                  return {
                    documents: [...state.documents, newDoc]
                  };
                case 'UPDATE':
                  return {
                    documents: state.documents.map(doc =>
                      doc.id === newDoc.id ? { ...doc, ...newDoc } : doc
                    ),
                    selectedDocument: state.selectedDocument?.id === newDoc.id ? 
                      { ...state.selectedDocument, ...newDoc } : state.selectedDocument
                  };
                case 'DELETE':
                  return {
                    documents: state.documents.filter(doc => doc.id !== oldDoc.id),
                    selectedDocument: state.selectedDocument?.id === oldDoc.id ? null : state.selectedDocument
                  };
                default:
                  return state;
              }
            });
          }),
          
          // Subscribe to payments changes
          subscribeToChanges('payments', (payload) => {
            const { eventType, new: newPayment, old: oldPayment } = payload;
            
            set(state => {
              switch (eventType) {
                case 'INSERT':
                  return {
                    payments: [...state.payments, newPayment]
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
          }),
          
          // Subscribe to tickets changes
          subscribeToChanges('support_tickets', (payload) => {
            const { eventType, new: newTicket, old: oldTicket } = payload;
            
            set(state => {
              switch (eventType) {
                case 'INSERT':
                  return {
                    tickets: [...state.tickets, newTicket]
                  };
                case 'UPDATE':
                  return {
                    tickets: state.tickets.map(ticket =>
                      ticket.id === newTicket.id ? { ...ticket, ...newTicket } : ticket
                    ),
                    selectedTicket: state.selectedTicket?.id === newTicket.id ? 
                      { ...state.selectedTicket, ...newTicket } : state.selectedTicket
                  };
                case 'DELETE':
                  return {
                    tickets: state.tickets.filter(ticket => ticket.id !== oldTicket.id),
                    selectedTicket: state.selectedTicket?.id === oldTicket.id ? null : state.selectedTicket
                  };
                default:
                  return state;
              }
            });
          }),
        ];
        
        set({ subscriptions });
      },
      
      cleanup: () => {
        const { subscriptions } = get();
        subscriptions.forEach(unsubscribe => unsubscribe());
        set({ subscriptions: [] });
      },
      
      fetchSystemSettings: async () => {
        try {
          set({ loading: true, error: null });
          
          // Get existing settings
          const { data: existingSettings, error: getError } = await supabase
            .from('system_settings')
            .select('*')
            .maybeSingle();
            
          if (getError) throw getError;
          
          // If settings exist, use them
          if (existingSettings) {
            set({
              systemSettings: {
                id: existingSettings.id,
                systemName: existingSettings.system_name,
                defaultCurrency: existingSettings.default_currency,
                defaultLanguage: existingSettings.default_language,
                smtpServer: existingSettings.smtp_server || '',
                smtpPort: existingSettings.smtp_port || 587,
                senderEmail: existingSettings.sender_email || '',
                emailNotifications: existingSettings.email_notifications,
                systemAlerts: existingSettings.system_alerts,
                applicationUpdates: existingSettings.application_updates,
              },
              loading: false
            });
            return;
          }
          
          // If no settings exist, create default settings using upsert
          const defaultSettings = {
            system_name: 'RentAssist Admin',
            default_currency: 'GHS',
            default_language: 'en',
            smtp_server: 'smtp.hostinger.com',
            smtp_port: 465,
            sender_email: 'info@sheltercrest.org',
            email_notifications: true,
            system_alerts: true,
            application_updates: true
          };
          
          const { data: newSettings, error: upsertError } = await supabase
            .from('system_settings')
            .upsert([defaultSettings])
            .select()
            .single();
            
          if (upsertError) throw upsertError;
          
          set({
            systemSettings: {
              id: newSettings.id,
              systemName: newSettings.system_name,
              defaultCurrency: newSettings.default_currency,
              defaultLanguage: newSettings.default_language,
              smtpServer: newSettings.smtp_server || '',
              smtpPort: newSettings.smtp_port || 587,
              senderEmail: newSettings.sender_email || '',
              emailNotifications: newSettings.email_notifications,
              systemAlerts: newSettings.system_alerts,
              applicationUpdates: newSettings.application_updates,
            },
            loading: false
          });
        } catch (error: any) {
          console.error('Error fetching system settings:', error);
          set({ error: error.message, loading: false });
          toast.error('Failed to fetch system settings');
        }
      },
      
      updateSystemSettings: async (settings) => {
        try {
          set({ loading: true, error: null });
          
          // Check if user has admin role
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) throw new Error('Not authenticated');
          
          // Get user role from profiles table
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();
            
          if (profileError) throw profileError;
          if (!profile) throw new Error('Profile not found');
          
          // Check if user is admin or superadmin
          if (!['admin', 'superadmin'].includes(profile.role)) {
            throw new Error('Insufficient permissions');
          }
          
          // Convert camelCase to snake_case for database
          const dbSettings = {
            system_name: settings.systemName,
            default_currency: settings.defaultCurrency,
            default_language: settings.defaultLanguage,
            smtp_server: settings.smtpServer,
            smtp_port: settings.smtpPort,
            sender_email: settings.senderEmail,
            email_notifications: settings.emailNotifications,
            system_alerts: settings.systemAlerts,
            application_updates: settings.applicationUpdates,
          };
          
          // Remove undefined values
          Object.keys(dbSettings).forEach(key => {
            if (dbSettings[key as keyof typeof dbSettings] === undefined) {
              delete dbSettings[key as keyof typeof dbSettings];
            }
          });
          
          // Always use upsert to handle the single row constraint
          const { data: updatedSettings, error } = await supabase
            .from('system_settings')
            .upsert([dbSettings])
            .select()
            .single();
            
          if (error) throw error;
          
          set(state => ({
            systemSettings: {
              ...state.systemSettings,
              ...settings,
              id: updatedSettings.id
            },
            loading: false
          }));
          
          toast.success('Settings saved successfully');
        } catch (error: any) {
          console.error('Error updating system settings:', error);
          set({ error: error.message, loading: false });
          toast.error('Failed to save settings: ' + error.message);
        }
      },
      
      fetchSecuritySettings: async () => {
        try {
          set({ loading: true, error: null });
          const { data, error } = await supabase
            .from('security_settings')
            .select('*')
            .single();
            
          if (error) throw error;
          
          if (data) {
            set({
              securitySettings: {
                twoFactorAuth: data.two_factor_auth,
                passwordComplexity: data.password_complexity,
                sessionTimeout: data.session_timeout,
                ipWhitelisting: data.ip_whitelisting,
                accountLockout: data.account_lockout,
                logRetention: data.log_retention,
              },
              loading: false
            });
          }
        } catch (error: any) {
          console.error('Error fetching security settings:', error);
          set({ error: error.message, loading: false });
        }
      },
      
      updateSecuritySettings: async (settings) => {
        try {
          set({ loading: true, error: null });
          
          // Check if user has admin role
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) throw new Error('Not authenticated');
          
          // Get user role from profiles table
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();
            
          if (profileError) throw profileError;
          if (!profile) throw new Error('Profile not found');
          
          // Check if user is admin or superadmin
          if (!['admin', 'superadmin'].includes(profile.role)) {
            throw new Error('Insufficient permissions');
          }
          
          // Convert camelCase to snake_case for database
          const dbSettings = {
            two_factor_auth: settings.twoFactorAuth,
            password_complexity: settings.passwordComplexity,
            session_timeout: settings.sessionTimeout,
            ip_whitelisting: settings.ipWhitelisting,
            account_lockout: settings.accountLockout,
            log_retention: settings.logRetention,
          };
          
          // Remove undefined values
          Object.keys(dbSettings).forEach(key => {
            if (dbSettings[key as keyof typeof dbSettings] === undefined) {
              delete dbSettings[key as keyof typeof dbSettings];
            }
          });
          
          const { data, error } = await supabase
            .from('security_settings')
            .upsert([dbSettings])
            .select()
            .single();
            
          if (error) throw error;
          
          set(state => ({
            securitySettings: {
              ...state.securitySettings,
              ...settings
            },
            loading: false
          }));
        } catch (error: any) {
          console.error('Error updating security settings:', error);
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      
      fetchDatabaseSettings: async () => {
        try {
          set({ loading: true, error: null });
          const { data, error } = await supabase
            .from('database_settings')
            .select('*')
            .single();
            
          if (error) throw error;
          
          if (data) {
            set({
              databaseSettings: {
                backupFrequency: data.backup_frequency,
                backupRetentionPeriod: data.backup_retention_period,
              },
              loading: false
            });
          }
        } catch (error: any) {
          console.error('Error fetching database settings:', error);
          set({ error: error.message, loading: false });
        }
      },
      
      updateDatabaseSettings: async (settings) => {
        try {
          set({ loading: true, error: null });
          
          // Check if user has admin role
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) throw new Error('Not authenticated');
          
          // Get user role from profiles table
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();
            
          if (profileError) throw profileError;
          if (!profile) throw new Error('Profile not found');
          
          // Check if user is admin or superadmin
          if (!['admin', 'superadmin'].includes(profile.role)) {
            throw new Error('Insufficient permissions');
          }
          
          // Convert camelCase to snake_case for database
          const dbSettings = {
            backup_frequency: settings.backupFrequency,
            backup_retention_period: settings.backupRetentionPeriod,
          };
          
          // Remove undefined values
          Object.keys(dbSettings).forEach(key => {
            if (dbSettings[key as keyof typeof dbSettings] === undefined) {
              delete dbSettings[key as keyof typeof dbSettings];
            }
          });
          
          const { data, error } = await supabase
            .from('database_settings')
            .upsert([dbSettings])
            .select()
            .single();
            
          if (error) throw error;
          
          set(state => ({
            databaseSettings: {
              ...state.databaseSettings,
              ...settings
            },
            loading: false
          }));
        } catch (error: any) {
          console.error('Error updating database settings:', error);
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      
      backupDatabase: async () => {
        try {
          set({ loading: true, error: null });
          const { data, error } = await supabase.rpc('backup_database');
          
          if (error) throw error;
          
          set({ loading: false });
          return data;
        } catch (error: any) {
          console.error('Error backing up database:', error);
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      
      fetchProperties: async () => {
        try {
          set({ loading: true, error: null });
          const { data, error } = await supabase
            .from('properties')
            .select('*')
            .order('name');
            
          if (error) throw error;
          
          set({ properties: data || [], loading: false });
        } catch (error: any) {
          console.error('Error fetching properties:', error);
          set({ error: error.message, loading: false });
        }
      },
      
      addProperty: async (property) => {
        try {
          set({ loading: true, error: null });
          const { data, error } = await supabase
            .from('properties')
            .insert([property])
            .select()
            .single();
            
          if (error) throw error;
          
          set(state => ({
            properties: [...state.properties, data],
            loading: false
          }));
          
          toast.success('Property added successfully');
        } catch (error: any) {
          console.error('Error adding property:', error);
          set({ error: error.message, loading: false });
          toast.error('Failed to add property');
        }
      },
      
      updateProperty: async (id, data) => {
        try {
          set({ loading: true, error: null });
          const { data: updatedProperty, error } = await supabase
            .from('properties')
            .update(data)
            .eq('id', id)
            .select()
            .single();
            
          if (error) throw error;
          
          set(state => ({
            properties: state.properties.map(prop => 
              prop.id === id ? { ...prop, ...updatedProperty } : prop
            ),
            loading: false
          }));
          
          toast.success('Property updated successfully');
        } catch (error: any) {
          console.error('Error updating property:', error);
          set({ error: error.message, loading: false });
          toast.error('Failed to update property');
        }
      },
      
      deleteProperty: async (id) => {
        try {
          set({ loading: true, error: null });
          const { error } = await supabase
            .from('properties')
            .delete()
            .eq('id', id);
            
          if (error) throw error;
          
          set(state => ({
            properties: state.properties.filter(prop => prop.id !== id),
            loading: false
          }));
          
          toast.success('Property deleted successfully');
        } catch (error: any) {
          console.error('Error deleting property:', error);
          set({ error: error.message, loading: false });
          toast.error('Failed to delete property');
        }
      },
      
      fetchUsers: async () => {
        try {
          set({ loading: true, error: null });
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: false });
            
          if (error) throw error;
          
          set({ users: data || [], loading: false });
        } catch (error: any) {
          console.error('Error fetching users:', error);
          set({ error: error.message, loading: false });
        }
      },
      
      addUser: async (userData) => {
        try {
          set({ loading: true, error: null });
          
          // First create auth user
          const { data: authData, error: authError } = await supabase.auth.admin.createUser({
            email: userData.email as string,
            password: 'TemporaryPassword123!', // Temporary password
            email_confirm: true,
            user_metadata: {
              first_name: userData.first_name,
              last_name: userData.last_name
            }
          });
          
          if (authError) throw authError;
          
          // Profile should be created automatically via trigger
          
          // Update role if needed
          if (userData.role && userData.role !== 'user') {
            const { error: roleError } = await supabase
              .from('profiles')
              .update({ role: userData.role })
              .eq('id', authData.user.id);
              
            if (roleError) throw roleError;
          }
          
          // Fetch the created user
          const { data: newUser, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', authData.user.id)
            .single();
            
          if (error) throw error;
          
          set(state => ({
            users: [newUser, ...state.users],
            loading: false
          }));
          
          toast.success('User added successfully');
        } catch (error: any) {
          console.error('Error adding user:', error);
          set({ error: error.message, loading: false });
          toast.error('Failed to add user');
        }
      },
      
      updateUser: async (id, data) => {
        try {
          set({ loading: true, error: null });
          const { data: updatedUser, error } = await supabase
            .from('profiles')
            .update(data)
            .eq('id', id)
            .select()
            .single();
            
          if (error) throw error;
          
          set(state => ({
            users: state.users.map(user => 
              user.id === id ? { ...user, ...updatedUser } : user
            ),
            loading: false
          }));
          
          toast.success('User updated successfully');
        } catch (error: any) {
          console.error('Error updating user:', error);
          set({ error: error.message, loading: false });
          toast.error('Failed to update user');
        }
      },
      
      deleteUser: async (id) => {
        try {
          set({ loading: true, error: null });
          
          // Delete auth user (will cascade to profile)
          const { error } = await supabase.auth.admin.deleteUser(id);
            
          if (error) throw error;
          
          set(state => ({
            users: state.users.filter(user => user.id !== id),
            loading: false
          }));
          
          toast.success('User deleted successfully');
        } catch (error: any) {
          console.error('Error deleting user:', error);
          set({ error: error.message, loading: false });
          toast.error('Failed to delete user');
        }
      },
      
      fetchApplications: async () => {
        try {
          set({ loading: true, error: null });
          const { data, error } = await supabase
            .from('applications')
            .select(`
              *,
              profiles:user_id (
                first_name,
                last_name,
                email,
                phone
              )
            `)
            .order('created_at', { ascending: false });
            
          if (error) throw error;
          
          // Transform data to match expected format
          const applications = data.map(app => ({
            ...app,
            applicant: {
              name: `${app.profiles.first_name} ${app.profiles.last_name}`,
              email: app.profiles.email,
              phone: app.profiles.phone || 'N/A'
            },
            // Add mock risk score and completeness for UI
            riskScore: Math.floor(Math.random()* 100),
            completeness: Math.floor(Math.random() * 100)
          }));
          
          set({ applications, loading: false });
        } catch (error: any) {
          console.error('Error fetching applications:', error);
          set({ error: error.message, loading: false });
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
              app.id === id ? { 
                ...app, 
                ...updatedApp,
                // Preserve applicant info
                applicant: app.applicant
              } : app
            ),
            selectedApplication: state.selectedApplication?.id === id ? 
              { ...state.selectedApplication, ...updatedApp } : state.selectedApplication,
            loading: false
          }));
          
          toast.success('Application updated successfully');
        } catch (error: any) {
          console.error('Error updating application:', error);
          set({ error: error.message, loading: false });
          toast.error('Failed to update application');
        }
      },
      
      setSelectedApplication: (application) => {
        set({ selectedApplication: application });
      },
      
      fetchDocuments: async () => {
        try {
          set({ loading: true, error: null });
          const { data, error } = await supabase
            .from('documents')
            .select(`
              *,
              profiles:user_id (
                first_name,
                last_name,
                email
              )
            `)
            .order('created_at', { ascending: false });
            
          if (error) throw error;
          
          // Transform data to match expected format
          const documents = data.map(doc => ({
            ...doc,
            user: {
              first_name: doc.profiles.first_name,
              last_name: doc.profiles.last_name,
              email: doc.profiles.email
            }
          }));
          
          set({ documents, loading: false });
        } catch (error: any) {
          console.error('Error fetching documents:', error);
          set({ error: error.message, loading: false });
        }
      },
      
      verifyDocument: async (id, status) => {
        try {
          set({ loading: true, error: null });
          
          // Get current user for verified_by
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) throw new Error('Not authenticated');
          
          const { data: updatedDoc, error } = await supabase
            .from('documents')
            .update({
              status,
              verified_at: status === 'verified' ? new Date().toISOString() : null,
              verified_by: status === 'verified' ? user.id : null
            })
            .eq('id', id)
            .select(`
              *,
              profiles:user_id (
                first_name,
                last_name,
                email
              )
            `)
            .single();
            
          if (error) throw error;
          
          // Transform to match expected format
          const document = {
            ...updatedDoc,
            user: {
              first_name: updatedDoc.profiles.first_name,
              last_name: updatedDoc.profiles.last_name,
              email: updatedDoc.profiles.email
            }
          };
          
          set(state => ({
            documents: state.documents.map(doc => 
              doc.id === id ? document : doc
            ),
            selectedDocument: state.selectedDocument?.id === id ? document : state.selectedDocument,
            loading: false
          }));
          
          toast.success(`Document ${status === 'verified' ? 'verified' : 'updated'} successfully`);
        } catch (error: any) {
          console.error('Error verifying document:', error);
          set({ error: error.message, loading: false });
          toast.error('Failed to update document');
        }
      },
      
      setSelectedDocument: (document) => {
        set({ selectedDocument: document });
      },
      
      fetchPayments: async () => {
        try {
          set({ loading: true, error: null });
          const { data, error } = await supabase
            .from('payments')
            .select(`
              *,
              applications (
                user_id,
                property_address,
                profiles:user_id (
                  first_name,
                  last_name
                )
              )
            `)
            .order('created_at', { ascending: false });
            
          if (error) throw error;
          
          // Transform data to match expected format
          const payments = data.map(payment => ({
            ...payment,
            user: {
              first_name: payment.applications?.profiles?.first_name || 'Unknown',
              last_name: payment.applications?.profiles?.last_name || 'User'
            },
            application: {
              property_address: payment.applications?.property_address || 'N/A'
            }
          }));
          
          set({ payments, loading: false });
        } catch (error: any) {
          console.error('Error fetching payments:', error);
          set({ error: error.message, loading: false });
        }
      },
      
      approvePayment: async (id) => {
        try {
          set({ loading: true, error: null });
          const { data: updatedPayment, error } = await supabase
            .from('payments')
            .update({
              status: 'completed',
              paid_date: new Date().toISOString()
            })
            .eq('id', id)
            .select()
            .single();
            
          if (error) throw error;
          
          set(state => ({
            payments: state.payments.map(payment => 
              payment.id === id ? { 
                ...payment, 
                ...updatedPayment,
                // Preserve user and application info
                user: payment.user,
                application: payment.application
              } : payment
            ),
            loading: false
          }));
          
          toast.success('Payment approved successfully');
        } catch (error: any) {
          console.error('Error approving payment:', error);
          set({ error: error.message, loading: false });
          toast.error('Failed to approve payment');
        }
      },
      
      fetchTickets: async () => {
        try {
          set({ loading: true, error: null });
          const { data, error } = await supabase
            .from('support_tickets')
            .select(`
              *,
              profiles:user_id (
                first_name,
                last_name,
                email
              ),
              ticket_replies (
                id,
                message,
                created_at,
                user_id
              )
            `)
            .order('created_at', { ascending: false });
            
          if (error) throw error;
          
          // Transform data to match expected format
          const tickets = data.map(ticket => ({
            ...ticket,
            user: {
              first_name: ticket.profiles.first_name,
              last_name: ticket.profiles.last_name,
              email: ticket.profiles.email
            },
            replies: ticket.ticket_replies || []
          }));
          
          set({ tickets, loading: false });
        } catch (error: any) {
          console.error('Error fetching tickets:', error);
          set({ error: error.message, loading: false });
        }
      },
      
      updateTicket: async (id, data) => {
        try {
          set({ loading: true, error: null });
          const { data: updatedTicket, error } = await supabase
            .from('support_tickets')
            .update(data)
            .eq('id', id)
            .select(`
              *,
              profiles:user_id (
                first_name,
                last_name,
                email
              ),
              ticket_replies (
                id,
                message,
                created_at,
                user_id
              )
            `)
            .single();
            
          if (error) throw error;
          
          // Transform to match expected format
          const ticket = {
            ...updatedTicket,
            user: {
              first_name: updatedTicket.profiles.first_name,
              last_name: updatedTicket.profiles.last_name,
              email: updatedTicket.profiles.email
            },
            replies: updatedTicket.ticket_replies || []
          };
          
          set(state => ({
            tickets: state.tickets.map(t => 
              t.id === id ? ticket : t
            ),
            selectedTicket: state.selectedTicket?.id === id ? ticket : state.selectedTicket,
            loading: false
          }));
          
          toast.success('Ticket updated successfully');
        } catch (error: any) {
          console.error('Error updating ticket:', error);
          set({ error: error.message, loading: false });
          toast.error('Failed to update ticket');
        }
      },
      
      setSelectedTicket: (ticket) => {
        set({ selectedTicket: ticket });
      },
      
      addTicketReply: async (ticketId, message) => {
        try {
          set({ loading: true, error: null });
          
          // Get current user
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) throw new Error('Not authenticated');
          
          // Add reply
          const { data: reply, error } = await supabase
            .from('ticket_replies')
            .insert({
              ticket_id: ticketId,
              user_id: user.id,
              message
            })
            .select()
            .single();
            
          if (error) throw error;
          
          // Update ticket status to in_progress if it was open
          const { data: ticket } = await supabase
            .from('support_tickets')
            .select('status')
            .eq('id', ticketId)
            .single();
            
          if (ticket && ticket.status === 'open') {
            await supabase
              .from('support_tickets')
              .update({ status: 'in_progress' })
              .eq('id', ticketId);
          }
          
          // Update local state
          set(state => {
            const updatedTickets = state.tickets.map(t => {
              if (t.id === ticketId) {
                return {
                  ...t,
                  status: t.status === 'open' ? 'in_progress' : t.status,
                  replies: [...(t.replies || []), reply]
                };
              }
              return t;
            });
            
            const updatedSelectedTicket = state.selectedTicket?.id === ticketId
              ? {
                  ...state.selectedTicket,
                  status: state.selectedTicket.status === 'open' ? 'in_progress' : state.selectedTicket.status,
                  replies: [...(state.selectedTicket.replies || []), reply]
                }
              : state.selectedTicket;
              
            return {
              tickets: updatedTickets,
              selectedTicket: updatedSelectedTicket,
              loading: false
            };
          });
          
          toast.success('Reply added successfully');
        } catch (error: any) {
          console.error('Error adding reply:', error);
          set({ error: error.message, loading: false });
          toast.error('Failed to add reply');
        }
      },
      
      generateReport: async (type, dateRange) => {
        try {
          set({ loading: true, error: null });
          
          // In a real app, this would call an API endpoint to generate a report
          // For now, we'll just simulate a delay and return a fake URL
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          set({ loading: false });
          
          toast.success('Report generated successfully');
          return `https://example.com/reports/${type}_${dateRange}_${Date.now()}.pdf`;
        } catch (error: any) {
          console.error('Error generating report:', error);
          set({ error: error.message, loading: false });
          toast.error('Failed to generate report');
          throw error;
        }
      }
    }),
    {
      name: 'admin-store',
      partialize: (state) => ({
        systemSettings: state.systemSettings,
        securitySettings: state.securitySettings,
        databaseSettings: state.databaseSettings
      })
    }
  )
);