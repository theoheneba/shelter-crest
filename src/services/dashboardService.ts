import { supabase, handleDbError } from './db';

export const dashboardService = {
  // Application Management
  async updateApplication(id: string, data: any) {
    return handleDbError(async () => {
      const { data: updatedApplication, error } = await supabase
        .from('applications')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      if (!updatedApplication) {
        throw new Error('Application not found');
      }

      return updatedApplication;
    });
  },

  async getApplications(filters?: any) {
    return handleDbError(async () => {
      let query = supabase
        .from('applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }

      if (filters?.userId) {
        query = query.eq('user_id', filters.userId);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      return data;
    });
  },

  // Document Management
  async verifyDocument(id: string, verifiedBy: string) {
    return handleDbError(async () => {
      const { data: document, error } = await supabase
        .from('documents')
        .update({
          status: 'verified',
          verified_at: new Date().toISOString(),
          verified_by: verifiedBy
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      if (!document) {
        throw new Error('Document not found');
      }

      return document;
    });
  },

  // Product Management
  async getProducts(filters?: any) {
    return handleDbError(async () => {
      let query = supabase
        .from('products')
        .select('*')
        .order('name');

      if (filters?.category) {
        query = query.eq('category_id', filters.category);
      }

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }

      if (filters?.minPrice) {
        query = query.gte('price', filters.minPrice);
      }

      if (filters?.maxPrice) {
        query = query.lte('price', filters.maxPrice);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      return data;
    });
  },

  async getProductCategories() {
    return handleDbError(async () => {
      const { data, error } = await supabase
        .from('product_categories')
        .select('*')
        .order('name');

      if (error) {
        throw error;
      }

      return data;
    });
  }
};