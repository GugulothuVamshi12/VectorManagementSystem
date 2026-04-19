export type VendorCategory = 'Staffing Agency' | 'Freelance Platform' | 'Consultant';

export type VendorStatus = 'Pending Approval' | 'Approved';

export interface Vendor {
  id: string;
  name: string;
  category: VendorCategory;
  contact_email: string;
  status: VendorStatus;
}

export interface VendorCreate {
  name: string;
  category: VendorCategory;
  contact_email: string;
}

// Made with Bob
