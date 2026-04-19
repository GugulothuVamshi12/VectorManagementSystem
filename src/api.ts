import type { Vendor, VendorCreate, VendorCategory } from './types';

const API_BASE_URL = 'http://localhost:8000';

export const api = {
  async getVendors(category?: VendorCategory): Promise<Vendor[]> {
    const url = category 
      ? `${API_BASE_URL}/vendors?category=${encodeURIComponent(category)}`
      : `${API_BASE_URL}/vendors`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch vendors');
    }
    return response.json();
  },

  async createVendor(vendor: VendorCreate): Promise<Vendor> {
    const response = await fetch(`${API_BASE_URL}/vendors`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(vendor),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to create vendor');
    }
    return response.json();
  },

  async approveVendor(vendorId: string): Promise<Vendor> {
    const response = await fetch(`${API_BASE_URL}/vendors/${vendorId}/approve`, {
      method: 'PATCH',
    });
    
    if (!response.ok) {
      throw new Error('Failed to approve vendor');
    }
    return response.json();
  },

  async deleteVendor(vendorId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/vendors/${vendorId}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete vendor');
    }
  },
};

// Made with Bob
