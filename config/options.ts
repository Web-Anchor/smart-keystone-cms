// Define user roles as options
export const userRoleOptions = [
  { label: 'Admin', value: 'ADMIN' },
  { label: 'User', value: 'USER' },
  { label: 'Vendor', value: 'VENDOR' },
  { label: 'Customer', value: 'CUSTOMER' },
  { label: 'Employee', value: 'EMPLOYEE' },
  { label: 'Manager', value: 'MANAGER' },
  { label: 'Supervisor', value: 'SUPERVISOR' },
  { label: 'Developer', value: 'DEVELOPER' },
  { label: 'Support', value: 'SUPPORT' },
  { label: 'Finance', value: 'FINANCE' },
  { label: 'IT', value: 'IT' },
  { label: 'Marketing', value: 'MARKETING' },
  { label: 'Guest', value: 'GUEST' },
];

// Define inventory item statuses as options
export const inventoryItemStatusOptions = [
  { label: 'Active', value: 'ACTIVE' },
  { label: 'Inactive', value: 'INACTIVE' },
  { label: 'Damaged', value: 'DAMAGED' },
  { label: 'Under Maintenance', value: 'UNDER_MAINTENANCE' },
  { label: 'Discontinued', value: 'DISCONTINUED' },
];

export const listInvitationOptions = [
  { label: 'Pending', value: 'PENDING' },
  { label: 'Accepted', value: 'ACCEPTED' },
  { label: 'Declined', value: 'DECLINED' },
];

export const permissionAccessOptions = [
  { label: 'View', value: 'VIEW' },
  { label: 'Edit', value: 'EDIT' },
  { label: 'Delete', value: 'DELETE' },
  { label: 'All', value: 'ALL' },
];

export const orderStatusOptions = [
  { label: 'Pending', value: 'PENDING' },
  { label: 'Processing', value: 'PROCESSING' },
  { label: 'Shipped', value: 'SHIPPED' },
  { label: 'Delivered', value: 'DELIVERED' },
  { label: 'Cancelled', value: 'CANCELLED' },
  { label: 'Returned', value: 'RETURNED' },
];

export const userPermissionsOptions = [
  { label: 'View', value: 'VIEW' },
  { label: 'Edit', value: 'EDIT' },
  { label: 'Delete', value: 'DELETE' },
  { label: 'All', value: 'ALL' },
];

export const integrationStatusOptions = [
  { label: 'Pending', value: 'PENDING' },
  { label: 'Connected', value: 'CONNECTED' },
  { label: 'Error', value: 'ERROR' },
];
