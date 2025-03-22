import { list } from '@keystone-6/core';
import { allowAll } from '@keystone-6/core/access';
import {
  integer,
  text,
  relationship,
  timestamp,
} from '@keystone-6/core/fields';

export const BOM: any = list({
  // Bill of Materials (BOM) is a list of components required to build a composite product
  // This list is created and maintained manually, and it's not automatically generated from the Product model
  access: allowAll,

  ui: {
    listView: {
      initialColumns: ['name', 'composite', 'components', 'quantity', 'unit'],
    },
  },

  fields: {
    name: text(),
    description: text({ ui: { displayMode: 'textarea' } }),
    composite: relationship({
      ref: 'Product.boms',
      ui: {
        description: 'Composite product (e.g. bike)',
        displayMode: 'select',
        labelField: 'name',
        searchFields: ['name'],
      },
    }), // represents the finished product or assembly product (e.g. bike)
    component: relationship({
      ref: 'Inventory.bom',
      ui: {
        description: 'Raw material or sub-assembly (e.g. frame)',
        displayMode: 'select',
        labelField: 'name',
        searchFields: ['name', 'sku'],
      },
    }), // represents the raw material or sub-assembly (e.g. frame)
    users: relationship({ ref: 'User', many: true }),
    quantity: integer({
      validation: { isRequired: true, min: 0 },
      defaultValue: 1,
      ui: { description: 'Number of units required per composite product' },
    }),
    unit: text({
      validation: { isRequired: true },
      defaultValue: 'pcs',
      ui: { description: 'Unit of measure (e.g. grams, pcs)' },
    }),
    updatedAt: timestamp({ db: { updatedAt: true } }),
    createdAt: timestamp({
      defaultValue: { kind: 'now' },
    }),
  },
});
