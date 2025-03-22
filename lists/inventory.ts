import { list } from '@keystone-6/core';
import { allowAll } from '@keystone-6/core/access';
import {
  text,
  relationship,
  timestamp,
  integer,
  float,
  select,
  json,
  checkbox,
} from '@keystone-6/core/fields';

const inventoryStatusOptions = [
  { label: 'In Stock', value: 'IN_STOCK' },
  { label: 'Reserved', value: 'RESERVED' },
  { label: 'Sold', value: 'SOLD' },
  { label: 'Damaged', value: 'DAMAGED' },
  { label: 'Expired', value: 'EXPIRED' },
];

export const Inventory: any = list({
  access: allowAll,

  ui: {
    labelField: 'name',
    searchFields: ['name'],
  },

  fields: {
    name: text({ validation: { isRequired: true } }),
    description: text({ ui: { displayMode: 'textarea' } }),
    batchNumber: text({ validation: { isRequired: false } }), // Unique batch identifier
    sku: text({ isIndexed: 'unique', validation: { isRequired: false } }), // Optional SKU tracking at the inventory level

    // Stock Tracking
    quantity: integer({
      defaultValue: 0,
      // validation: { min: 0 } // Optional SKU tracking at the inventory level
    }),
    unit: text({ defaultValue: 'pcs' }), // Measurement unit (e.g., kg, liters)
    location: text(), // Warehouse or store location
    expiryDate: timestamp(), // Expiry date for perishable goods
    receivedDate: timestamp({ defaultValue: { kind: 'now' } }),
    category: text(), // Product category
    attributes: json({ defaultValue: {} }), // Additional specs stored as JSON (e.g., dimensions)

    // Pricing & Valuation
    purchasePrice: float({ validation: { min: 0 } }), // Cost per unit at time of purchase
    salePrice: float({ validation: { min: 0 } }), // Selling price per unit (can differ from product default)
    price: float({ validation: { min: 0 } }), // Current price per unit
    cost: float({ validation: { min: 0 } }), // Current cost per unit

    // Status & Availability
    status: select({
      options: inventoryStatusOptions,
      defaultValue: 'IN_STOCK',
      ui: { displayMode: 'select' },
    }),
    supplier: text(),
    isReserved: checkbox({ defaultValue: false }), // If reserved for an order
    isDamaged: checkbox({ defaultValue: false }), // If item is damaged
    users: relationship({
      ref: 'User',
      many: true,
      ui: {
        displayMode: 'select',
        labelField: 'email',
        searchFields: ['firstName', 'lastName', 'email'],
      },
    }),
    tags: relationship({ ref: 'Tag.inventory', many: true }),
    bom: relationship({ ref: 'BOM.component', many: true }),
    createdAt: timestamp({ defaultValue: { kind: 'now' } }),
    updatedAt: timestamp({ db: { updatedAt: true } }),
  },
});
