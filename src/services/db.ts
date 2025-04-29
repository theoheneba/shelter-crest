import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';
import { toast } from 'react-hot-toast';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    storage: localStorage
  }
});

export const db = {
  execute: async ({ sql, args = [] }: { sql: string; args?: any[] }) => {
    const { data, error } = await supabase.rpc('execute_sql', { sql, args });
    if (error) throw error;
    return { rows: data || [] };
  }
};

export const handleDbError = async <T>(operation: () => Promise<T>): Promise<T> => {
  try {
    return await operation();
  } catch (error: any) {
    console.error('Database error:', error);
    
    if (error.code === '23505') {
      throw new Error('A record with this information already exists');
    }
    
    if (error.code === '23503') {
      throw new Error('Referenced record does not exist');
    }
    
    if (error.code === '42501') {
      throw new Error('Permission denied: You do not have the required permissions for this operation');
    }
    
    throw new Error(error.message || 'An unexpected database error occurred');
  }
};

// Function to subscribe to real-time changes
export const subscribeToChanges = (
  table: string,
  callback: (payload: any) => void
): (() => void) => {
  const subscription = supabase
    .channel(`${table}_changes`)
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table },
      callback
    )
    .subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        console.log(`Subscribed to ${table} changes`);
      }
      if (status === 'CHANNEL_ERROR') {
        console.error(`Failed to subscribe to ${table} changes`);
        toast.error(`Failed to subscribe to real-time updates for ${table}`);
      }
    });

  // Return unsubscribe function
  return () => {
    subscription.unsubscribe();
  };
};