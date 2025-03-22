import { orderStatusOptions } from '../config/options';
import { list } from '@keystone-6/core';
import { allowAll } from '@keystone-6/core/access';
import {
  text,
  relationship,
  timestamp,
  select,
  integer,
} from '@keystone-6/core/fields';

export const Order: any = list({
  // WARNING
  //   for this starter project, anyone can create, query, update and delete anything
  //   if you want to prevent random people on the internet from accessing your data,
  //   you can find out more at https://keystonejs.com/docs/guides/auth-and-access-control
  access: allowAll,

  // setting this to isHidden for the user interface prevents this list being visible in the Admin UI
  ui: {
    // isHidden: true,
  },

  fields: {
    orderNumber: text(),
    status: select({
      options: orderStatusOptions,
      defaultValue: 'PENDING',
      ui: { displayMode: 'select' },
    }),
    users: relationship({
      ref: 'User',
      many: true,
      ui: {
        displayMode: 'select',
        labelField: 'email',
        searchFields: ['firstName', 'lastName', 'email'],
      },
    }),
    products: relationship({ ref: 'Product', many: true }),
    inventory: relationship({ ref: 'Inventory', many: true }),
    source: text(),
    quantity: integer({ defaultValue: 0, validation: { min: 0 } }), // Total number of items
    price: integer({ defaultValue: 0, validation: { min: 0 } }), // Total price
    taxRate: integer({ defaultValue: 0, validation: { min: 0 } }), // Tax rate
    unit: text({ defaultValue: 'pcs' }), // Measurement unit (e.g., kg, liters)
    currency: text(),
    createdAt: timestamp({ defaultValue: { kind: 'now' } }),
    updatedAt: timestamp({ db: { updatedAt: true } }),
  },
});
