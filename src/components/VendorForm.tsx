import { useState } from 'react';
import type { FormEvent } from 'react';
import type { VendorCreate, VendorCategory } from '../types';

interface VendorFormProps {
  onSubmit: (vendor: VendorCreate) => Promise<void>;
}

const categories: VendorCategory[] = [
  'Staffing Agency',
  'Freelance Platform',
  'Consultant',
];

export function VendorForm({ onSubmit }: VendorFormProps) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<VendorCategory>('Staffing Agency');
  const [contactEmail, setContactEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!name.trim()) {
      setError('Name is required');
      return;
    }

    if (!contactEmail.trim()) {
      setError('Email is required');
      return;
    }

    if (!validateEmail(contactEmail)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        name: name.trim(),
        category,
        contact_email: contactEmail.trim(),
      });
      
      // Reset form
      setName('');
      setCategory('Staffing Agency');
      setContactEmail('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create vendor');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="vendor-form-container">
      <h2>Register New Vendor</h2>
      <form onSubmit={handleSubmit} className="vendor-form">
        <div className="form-group">
          <label htmlFor="name">
            Vendor Name <span className="required">*</span>
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter vendor name"
            disabled={isSubmitting}
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">
            Category <span className="required">*</span>
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value as VendorCategory)}
            disabled={isSubmitting}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="email">
            Contact Email <span className="required">*</span>
          </label>
          <input
            type="email"
            id="email"
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
            placeholder="vendor@example.com"
            disabled={isSubmitting}
          />
        </div>

        {error && <div className="error-message">{error}</div>}

        <button type="submit" disabled={isSubmitting} className="submit-button">
          {isSubmitting ? 'Registering...' : 'Register Vendor'}
        </button>
      </form>
    </div>
  );
}

// Made with Bob
