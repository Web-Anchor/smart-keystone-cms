import { list } from '@keystone-6/core';
import { allowAll } from '@keystone-6/core/access';
import {
  text,
  relationship,
  timestamp,
  integer,
  float,
  json,
  select,
  checkbox,
} from '@keystone-6/core/fields';
import { inventoryItemStatusOptions } from '../config/options';
import { safeSubtract, toSafeNumber } from '../config/utils';

export const Product: any = list({
  access: allowAll,

  ui: {
    listView: {
      initialColumns: ['name', 'category', 'price', 'quantity', 'status'],
    },
  },

  hooks: {
    afterOperation: {
      create: async ({ item, context }) => {
        // Compute the change (delta) in composite product quantity.
        const delta = item.quantity as number;
        console.log('🪝 🚨 delta:', delta);
        // Only update BOM-related inventory if the product is composite and quantity has changed.
        if (item.isComposite && delta !== 0) {
          console.log('��� updating records...');
          // Fetch all BOM records for this composite product.
          // Note: We query for the related component's id via the relationship.
          const boms = await context.query.BOM.findMany({
            where: { composite: { id: { equals: item?.id } } },
            query: 'id composite { id } component { id } quantity', // 'quantity' is the quantity required per composite unit.
          });
          console.log('🪝 fetched BOMs:', boms);
          // Process each BOM record to adjust the inventory of its component.
          for (const bom of boms) {
            // Calculate the total change needed for this component.
            // For example, if delta = +10 (i.e. composite increased by 10 units)
            // and bom.quantity = 2 (2 units of the component are required per composite unit),
            // then the component inventory should be reduced by 10 * 2 = 20.
            const componentUsageChange = toSafeNumber(bom.quantity) * delta;
            // Fetch the current inventory record for the component.
            const inventoryRecord = await context.query.Inventory.findOne({
              where: { id: bom.component?.id },
              query: 'id quantity',
            });
            if (!inventoryRecord) {
              console.error(
                `No inventory record found for component id: ${bom.component?.id}`
              );
              continue;
            }
            const currentInventory = toSafeNumber(inventoryRecord.quantity);
            // Adjust the inventory.
            // If composite quantity increases (delta positive), subtract the usage from the inventory.
            // If composite quantity decreases (delta negative), add back the released components.
            const newInventory = currentInventory - componentUsageChange;
            console.log(
              `🪝 BOM ${bom?.id}: current inventory = ${currentInventory}, ` +
                `new inventory = ${newInventory}, component id: ${bom.component?.id}`
            );
            // Update the Inventory record with the new quantity.
            const updateResult = await context.query.Inventory.updateOne({
              where: { id: bom.component?.id },
              data: { quantity: newInventory },
            });
            console.log('🪝 updated inventory for component:', updateResult);
            // If the new inventory is less than 0, log a warning.
            if (newInventory < 0) {
              console.warn(
                `��� Warning: Inventory for component id: ${bom.component?.id} is below 0`
              );
            }
          }
        }
        /* ... */
      },
      update: async ({ item, originalItem, context }) => {
        // Compute the change (delta) in composite product quantity.
        const delta = safeSubtract(
          item.quantity as number,
          originalItem.quantity as number
        );

        // Only update BOM-related inventory if the product is composite and quantity has changed.
        if (item.isComposite && delta !== 0) {
          console.log('🪝 updating BOM records...Delta', delta);

          // Fetch all BOM records for this composite product.
          // Note: We query for the related component's id via the relationship.
          const boms = await context.query.BOM.findMany({
            where: { composite: { id: { equals: item?.id } } },
            query: 'id composite { id } component { id } quantity', // 'quantity' is the quantity required per composite unit.
          });
          console.log('🪝 fetched BOMs:', boms);

          // Process each BOM record to adjust the inventory of its component.
          for (const bom of boms) {
            try {
              // Calculate the total change needed for this component.
              const componentUsageChange = toSafeNumber(bom.quantity) * delta;
              // Fetch the current inventory record for the component.
              const inventoryRecord = await context.query.Inventory.findOne({
                where: { id: bom.component?.id },
                query: 'id quantity',
              });
              if (!inventoryRecord) {
                console.error(
                  `No inventory record found for component id: ${bom.component?.id}`
                );
                continue;
              }
              const currentInventory = toSafeNumber(inventoryRecord.quantity);
              // Adjust the inventory.
              // If composite quantity increases (delta positive), subtract the usage from the inventory.
              // If composite quantity decreases (delta negative), add back the released components.
              const newInventory = currentInventory - componentUsageChange;
              console.log(
                `��� BOM ${bom?.id}: current inventory = ${currentInventory}, ` +
                  `new inventory = ${newInventory}, component id: ${bom.component?.id}`
              );
              // Update the Inventory record with the new quantity.
              const updateResult = await context.query.Inventory.updateOne({
                where: { id: bom.component?.id },
                data: { quantity: newInventory },
              });
              console.log('��� updated inventory for component:', updateResult);
              // If the new inventory is less than 0, log a warning.
              if (newInventory < 0) {
                console.warn(
                  `��� Warning: Inventory for component id: ${bom.component?.id} is below 0`
                );
              }
            } catch (error) {
              console.error(
                `Error updating inventory for BOM ${bom?.id}:`,
                error
              );
              // Handle error appropriately, e.g., rollback changes, log error, etc.
              // Rollback changes if necessary, or notify the user about the error.
              // For example, you could retry the operation, or notify the user about the error.
              // Rollback changes and notify the user about the error, or re-prompt the user to make changes.
            }
          }
        }
        /* ... further processing if needed ... */
      },
      delete: async ({ originalItem }) => {
        console.log('🪝 deleting product:', originalItem?.id);
        /* ... */
      },
    },
  },

  fields: {
    name: text({ validation: { isRequired: true } }),
    description: text({ ui: { displayMode: 'textarea' } }),
    category: text(), // e.g. "construction", "retail"
    sku: text(), // Stock Keeping Unit
    barcode: text(),
    attributes: json({ defaultValue: {} }), // Additional specs stored as JSON (e.g., dimensions)
    isComposite: checkbox({ defaultValue: false }),

    // Pricing & Taxation
    cost: float({ validation: { min: 0 } }), // Cost price
    price: float({ validation: { min: 0 } }), // Selling price
    taxRate: float({ defaultValue: 0, validation: { min: 0, max: 100 } }), // Percentage-based tax

    // Inventory & Tracking
    reorderLevel: integer({ defaultValue: 0, validation: { min: 0 } }), // When to restock
    unit: text({ defaultValue: 'pcs' }), // Measurement unit (e.g., kg, liters)
    quantity: integer({ defaultValue: 0, validation: { min: 0 } }), // Current stock
    supplier: text(),
    leadTime: integer({ validation: { min: 0 } }), // Days for restocking

    // Status & Relationships
    status: select({
      options: inventoryItemStatusOptions,
      defaultValue: 'ACTIVE',
      ui: { displayMode: 'select' },
    }),
    isHidden: checkbox({ defaultValue: false }),

    users: relationship({
      ref: 'User',
      many: true,
      ui: {
        displayMode: 'select',
        labelField: 'email',
        searchFields: ['firstName', 'lastName', 'email'],
      },
    }),
    tags: relationship({ ref: 'Tag.products', many: true }),
    boms: relationship({
      ref: 'BOM.composite',
      many: true,
      // ui: {
      //   displayMode: 'cards',
      //   cardFields: ['name'],
      //   inlineCreate: { fields: ['name'] },
      //   inlineEdit: { fields: ['name'] },
      // },
    }),
    createdAt: timestamp({ defaultValue: { kind: 'now' } }),
    updatedAt: timestamp({ db: { updatedAt: true } }),
  },
});
