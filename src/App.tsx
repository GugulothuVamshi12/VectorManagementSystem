import { useState, useEffect } from 'react';
import { VendorForm } from './components/VendorForm';
import { VendorTable } from './components/VendorTable';
import { api } from './api';
import type { Vendor, VendorCreate, VendorCategory } from './types';
import './App.css';

function App() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<VendorCategory | 'All'>('All');

  const fetchVendors = async (category?: VendorCategory) => {
    try {
      setLoading(true);
      setError('');
      const data = await api.getVendors(category);
      setVendors(data);
    } catch (err) {
      setError('Failed to load vendors. Please try again.');
      console.error('Error fetching vendors:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const handleCreateVendor = async (vendor: VendorCreate) => {
    await api.createVendor(vendor);
    // Refresh the list after creating
    await fetchVendors(selectedCategory === 'All' ? undefined : selectedCategory);
  };

  const handleApproveVendor = async (vendorId: string) => {
    try {
      await api.approveVendor(vendorId);
      // Update the vendor in the local state
      setVendors((prev) =>
        prev.map((v) =>
          v.id === vendorId ? { ...v, status: 'Approved' } : v
        )
      );
    } catch (err) {
      alert('Failed to approve vendor');
      console.error('Error approving vendor:', err);
    }
  };

  const handleDeleteVendor = async (vendorId: string) => {
    try {
      await api.deleteVendor(vendorId);
      // Remove the vendor from the local state
      setVendors((prev) => prev.filter((v) => v.id !== vendorId));
    } catch (err) {
      alert('Failed to delete vendor');
      console.error('Error deleting vendor:', err);
    }
  };

  const handleCategoryChange = async (category: VendorCategory | 'All') => {
    setSelectedCategory(category);
    await fetchVendors(category === 'All' ? undefined : category);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>🏢 Vendor Management System</h1>
        <p className="subtitle">Manage your staffing agencies, freelance platforms, and consultants</p>
      </header>

      <main className="app-main">
        <VendorForm onSubmit={handleCreateVendor} />

        {error && (
          <div className="error-banner">
            {error}
            <button onClick={() => fetchVendors()}>Retry</button>
          </div>
        )}

        {loading ? (
          <div className="loading">Loading vendors...</div>
        ) : (
          <VendorTable
            vendors={vendors}
            onApprove={handleApproveVendor}
            onDelete={handleDeleteVendor}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
          />
        )}
      </main>

      <footer className="app-footer">
        <p>Built with React + TypeScript & FastAPI</p>
      </footer>
    </div>
  );
}

export default App;

// Made with Bob
