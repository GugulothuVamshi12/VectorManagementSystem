import type { Vendor, VendorCategory } from '../types';

interface VendorTableProps {
  vendors: Vendor[];
  onApprove: (vendorId: string) => Promise<void>;
  onDelete: (vendorId: string) => Promise<void>;
  selectedCategory: VendorCategory | 'All';
  onCategoryChange: (category: VendorCategory | 'All') => void;
}

const categories: Array<VendorCategory | 'All'> = [
  'All',
  'Staffing Agency',
  'Freelance Platform',
  'Consultant',
];

export function VendorTable({
  vendors,
  onApprove,
  onDelete,
  selectedCategory,
  onCategoryChange,
}: VendorTableProps) {
  const getStatusBadgeClass = (status: string) => {
    return status === 'Approved' ? 'status-badge approved' : 'status-badge pending';
  };

  return (
    <div className="vendor-table-container">
      <div className="table-header">
        <h2>Registered Vendors ({vendors.length})</h2>
        <div className="filter-group">
          <label htmlFor="category-filter">Filter by Category:</label>
          <select
            id="category-filter"
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value as VendorCategory | 'All')}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {vendors.length === 0 ? (
        <div className="empty-state">
          <p>No vendors registered yet.</p>
          <p className="empty-state-hint">Use the form above to register your first vendor.</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="vendor-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Contact Email</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {vendors.map((vendor) => (
                <tr key={vendor.id}>
                  <td>{vendor.name}</td>
                  <td>{vendor.category}</td>
                  <td>
                    <a href={`mailto:${vendor.contact_email}`}>{vendor.contact_email}</a>
                  </td>
                  <td>
                    <span className={getStatusBadgeClass(vendor.status)}>
                      {vendor.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      {vendor.status === 'Pending Approval' && (
                        <button
                          onClick={() => onApprove(vendor.id)}
                          className="approve-button"
                          title="Approve vendor"
                        >
                          ✓ Approve
                        </button>
                      )}
                      <button
                        onClick={() => {
                          if (window.confirm(`Are you sure you want to delete ${vendor.name}?`)) {
                            onDelete(vendor.id);
                          }
                        }}
                        className="delete-button"
                        title="Delete vendor"
                      >
                        ✕ Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// Made with Bob
