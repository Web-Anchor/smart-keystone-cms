import { list } from '@keystone-6/core';
import { allowAll } from '@keystone-6/core/access';
import {
  text,
  relationship,
  password,
  timestamp,
  select,
  integer,
  float,
  checkbox,
  json,
} from '@keystone-6/core/fields';
import { document } from '@keystone-6/fields-document';

export const lists = {
  // ======== USER & AUTHENTICATION MODELS ========
  User: list({
    access: allowAll,
    fields: {
      firstName: text({ validation: { isRequired: true } }),
      lastName: text(),
      email: text({ validation: { isRequired: true }, isIndexed: 'unique' }),
      password: password({ validation: { isRequired: true } }),
      avatar: text(),
      role: select({
        options: [
          { label: 'Admin', value: 'admin' },
          { label: 'Manager', value: 'manager' },
          { label: 'Employee', value: 'employee' },
          { label: 'Staff', value: 'staff' },
        ],
        defaultValue: 'admin',
      }),
      isActive: checkbox({ defaultValue: true }),
      createdAt: timestamp({
        defaultValue: { kind: 'now' },
      }),
      teams: relationship({ ref: 'Team.members', many: true }),
      managedTeams: relationship({ ref: 'Team.manager', many: true }),
      products: relationship({ ref: 'Product.createdBy', many: true }),
      materials: relationship({ ref: 'Material.createdBy', many: true }),
      orders: relationship({ ref: 'Order.createdBy', many: true }),
      retailLocations: relationship({
        ref: 'RetailLocation.staff',
        many: true,
      }),
      warehouseLocations: relationship({
        ref: 'WarehouseLocation.staff',
        many: true,
      }),
      // Stripe Subscription Fields
      stripeCustomerId: text({ isIndexed: 'unique' }),
      stripeSubscriptionId: text({ isIndexed: 'unique' }),
      stripePriceId: text(),
      subscriptionPlan: select({
        options: [
          { label: 'Free', value: 'free' },
          { label: 'Starter', value: 'starter' },
          { label: 'Professional', value: 'professional' },
          { label: 'Premium', value: 'premium' },
          { label: 'Enterprise', value: 'enterprise' },
        ],
        defaultValue: 'free',
      }),
      subscriptionStatus: select({
        options: [
          { label: 'Active', value: 'active' },
          { label: 'Trialing', value: 'trialing' },
          { label: 'Past Due', value: 'past_due' },
          { label: 'Canceled', value: 'canceled' },
          { label: 'Unpaid', value: 'unpaid' },
          { label: 'Incomplete', value: 'incomplete' },
          { label: 'Incomplete Expired', value: 'incomplete_expired' },
        ],
        defaultValue: 'active',
      }),
      subscriptionPeriodStart: timestamp(),
      subscriptionPeriodEnd: timestamp(),
      subscriptionCancelAtPeriodEnd: checkbox({ defaultValue: false }),
      billingCycle: select({
        options: [
          { label: 'Monthly', value: 'monthly' },
          { label: 'Annual', value: 'annual' },
        ],
      }),
      paymentMethodId: text(),
      paymentMethodType: text(),
      paymentMethodLast4: text(),
      paymentMethodExpMonth: integer(),
      paymentMethodExpYear: integer(),
      subscriptionMetadata: json(),
      // invoices: relationship({ ref: 'Invoice.user', many: true }),
      // paymentHistory: relationship({ ref: 'PaymentHistory.user', many: true }),
    },
  }),

  Team: list({
    access: allowAll,
    fields: {
      name: text({ validation: { isRequired: true } }),
      description: text(),
      members: relationship({ ref: 'User.teams', many: true }),
      manager: relationship({ ref: 'User.managedTeams' }),
      createdAt: timestamp({
        defaultValue: { kind: 'now' },
      }),
    },
  }),

  // ======== PRODUCT & INVENTORY MODELS ========
  Product: list({
    access: allowAll,
    fields: {
      name: text({ validation: { isRequired: true } }),
      description: document({
        formatting: true,
        links: true,
        dividers: true,
      }),
      sku: text({ validation: { isRequired: true }, isIndexed: 'unique' }),
      barcode: text({ isIndexed: 'unique' }),
      price: integer({ validation: { isRequired: true } }),
      cost: integer({ defaultValue: 0 }),
      weight: float(),
      dimensions: json(),
      status: select({
        type: 'enum',
        options: [
          { label: 'Active', value: 'active' },
          { label: 'Draft', value: 'draft' },
          { label: 'Archived', value: 'archived' },
        ],
        defaultValue: 'draft',
        validation: { isRequired: true },
      }),
      inventoryItems: relationship({
        ref: 'InventoryItem.product',
        many: true,
      }),
      images: relationship({ ref: 'ProductImage.product', many: true }),
      categories: relationship({ ref: 'Category.products', many: true }),
      tags: relationship({ ref: 'Tag.products', many: true }),
      variants: relationship({
        ref: 'ProductVariant.parentProduct',
        many: true,
      }),
      materials: relationship({ ref: 'BillOfMaterial.product', many: true }),
      createdBy: relationship({ ref: 'User.products' }),
      createdAt: timestamp({
        defaultValue: { kind: 'now' },
      }),
      updatedAt: timestamp(),
      orderItems: relationship({ ref: 'OrderItem.product', many: true }),
    },
  }),

  ProductVariant: list({
    access: allowAll,
    fields: {
      name: text({ validation: { isRequired: true } }),
      sku: text({ validation: { isRequired: true }, isIndexed: 'unique' }),
      barcode: text({ isIndexed: 'unique' }),
      price: integer({ defaultValue: 0 }),
      attributes: json(), // e.g., { color: 'red', size: 'medium' }
      parentProduct: relationship({ ref: 'Product.variants' }),
      inventoryItems: relationship({
        ref: 'InventoryItem.variant',
        many: true,
      }),
      images: relationship({ ref: 'ProductImage.variant', many: true }),
      orderItems: relationship({ ref: 'OrderItem.variant', many: true }),
    },
  }),

  ProductImage: list({
    access: allowAll,
    fields: {
      altText: text(),
      image: text(),
      product: relationship({ ref: 'Product.images' }),
      variant: relationship({ ref: 'ProductVariant.images' }),
      isPrimary: checkbox({ defaultValue: false }),
    },
  }),

  InventoryItem: list({
    access: allowAll,
    fields: {
      product: relationship({ ref: 'Product.inventoryItems' }),
      variant: relationship({ ref: 'ProductVariant.inventoryItems' }),
      location: relationship({
        ref: 'WarehouseLocation.inventory',
      }),
      section: relationship({ ref: 'WarehouseSection.inventory' }),
      quantity: integer({ validation: { isRequired: true }, defaultValue: 0 }),
      minStockLevel: integer({ defaultValue: 5 }),
      maxStockLevel: integer(),
      reorderPoint: integer(),
      reorderQuantity: integer(),
      lastStockCheck: timestamp(),
      adjustments: relationship({
        ref: 'InventoryAdjustment.inventoryItem',
        many: true,
      }),
      transfers: relationship({ ref: 'InventoryTransfer.items', many: true }),
    },
  }),

  InventoryAdjustment: list({
    access: allowAll,
    fields: {
      inventoryItem: relationship({
        ref: 'InventoryItem.adjustments',
      }),
      adjustmentType: select({
        type: 'enum',
        options: [
          { label: 'Add', value: 'add' },
          { label: 'Remove', value: 'remove' },
          { label: 'Set', value: 'set' },
          { label: 'Damage', value: 'damage' },
          { label: 'Loss', value: 'loss' },
          { label: 'Return', value: 'return' },
        ],
        validation: { isRequired: true },
      }),
      quantity: integer({ validation: { isRequired: true } }),
      previousQuantity: integer(),
      newQuantity: integer(),
      reason: text(),
      notes: text(),
      performedBy: relationship({ ref: 'User' }),
      timestamp: timestamp({
        defaultValue: { kind: 'now' },
      }),
    },
  }),

  // ======== MATERIAL & BOM MODELS ========
  Material: list({
    access: allowAll,
    fields: {
      name: text({ validation: { isRequired: true } }),
      description: text(),
      sku: text({ validation: { isRequired: true }, isIndexed: 'unique' }),
      unit: text({ validation: { isRequired: true } }), // e.g., meters, kg, pieces
      unitCost: integer({ defaultValue: 0 }),
      supplier: relationship({ ref: 'Supplier.materials' }),
      category: relationship({ ref: 'Category.materials' }),
      tags: relationship({ ref: 'Tag.materials', many: true }),
      inventory: relationship({
        ref: 'MaterialInventory.material',
        many: true,
      }),
      usedIn: relationship({ ref: 'BillOfMaterial.material', many: true }),
      createdBy: relationship({ ref: 'User.materials' }),
      createdAt: timestamp({
        defaultValue: { kind: 'now' },
      }),
      updatedAt: timestamp(),
    },
  }),

  MaterialInventory: list({
    access: allowAll,
    fields: {
      material: relationship({
        ref: 'Material.inventory',
      }),
      location: relationship({
        ref: 'WarehouseLocation.materialInventory',
      }),
      section: relationship({ ref: 'WarehouseSection.materialInventory' }),
      quantity: float({ validation: { isRequired: true }, defaultValue: 0 }),
      minStockLevel: float({ defaultValue: 5 }),
      reorderPoint: float(),
      reorderQuantity: float(),
      lastStockCheck: timestamp(),
      adjustments: relationship({
        ref: 'MaterialAdjustment.materialInventory',
        many: true,
      }),
    },
  }),

  MaterialAdjustment: list({
    access: allowAll,
    fields: {
      materialInventory: relationship({
        ref: 'MaterialInventory.adjustments',
      }),
      adjustmentType: select({
        type: 'enum',
        options: [
          { label: 'Add', value: 'add' },
          { label: 'Remove', value: 'remove' },
          { label: 'Set', value: 'set' },
          { label: 'Damage', value: 'damage' },
          { label: 'Loss', value: 'loss' },
        ],
        validation: { isRequired: true },
      }),
      quantity: float({ validation: { isRequired: true } }),
      previousQuantity: float(),
      newQuantity: float(),
      reason: text(),
      notes: text(),
      performedBy: relationship({ ref: 'User' }),
      timestamp: timestamp({
        defaultValue: { kind: 'now' },
      }),
    },
  }),

  BillOfMaterial: list({
    access: allowAll,
    fields: {
      product: relationship({
        ref: 'Product.materials',
      }),
      material: relationship({
        ref: 'Material.usedIn',
      }),
      quantity: float({ validation: { isRequired: true } }),
      wastagePercent: float({ defaultValue: 0 }),
      notes: text(),
    },
  }),

  // ======== ORDER & SHIPPING MODELS ========
  Order: list({
    access: allowAll,
    fields: {
      orderNumber: text({
        validation: { isRequired: true },
        isIndexed: 'unique',
      }),
      customer: relationship({
        ref: 'Customer.orders',
      }),
      orderDate: timestamp({
        defaultValue: { kind: 'now' },
      }),
      status: select({
        type: 'enum',
        options: [
          { label: 'Draft', value: 'draft' },
          { label: 'Processing', value: 'processing' },
          { label: 'Shipped', value: 'shipped' },
          { label: 'Delivered', value: 'delivered' },
          { label: 'Cancelled', value: 'cancelled' },
          { label: 'Returned', value: 'returned' },
        ],
        defaultValue: 'draft',
        validation: { isRequired: true },
      }),
      paymentStatus: select({
        type: 'enum',
        options: [
          { label: 'Pending', value: 'pending' },
          { label: 'Paid', value: 'paid' },
          { label: 'Refunded', value: 'refunded' },
          { label: 'Failed', value: 'failed' },
        ],
        defaultValue: 'pending',
        validation: { isRequired: true },
      }),
      source: select({
        type: 'enum',
        options: [
          { label: 'Manual', value: 'manual' },
          { label: 'Shopify', value: 'shopify' },
          { label: 'Etsy', value: 'etsy' },
          { label: 'Website', value: 'website' },
          { label: 'POS', value: 'pos' },
        ],
        defaultValue: 'manual',
        validation: { isRequired: true },
      }),
      sourceId: text(), // External ID from source platform
      items: relationship({ ref: 'OrderItem.order', many: true }),
      subtotal: integer({ defaultValue: 0 }),
      taxAmount: integer({ defaultValue: 0 }),
      shippingAmount: integer({ defaultValue: 0 }),
      discountAmount: integer({ defaultValue: 0 }),
      totalAmount: integer({ defaultValue: 0 }),
      notes: text(),
      shippingAddress: relationship({ ref: 'Address.shippingOrders' }),
      billingAddress: relationship({ ref: 'Address.billingOrders' }),
      shipment: relationship({ ref: 'Shipment.order' }),
      createdBy: relationship({ ref: 'User.orders' }),
      retailLocation: relationship({ ref: 'RetailLocation.orders' }),
      tags: relationship({ ref: 'Tag.orders', many: true }),
    },
  }),

  OrderItem: list({
    access: allowAll,
    fields: {
      order: relationship({
        ref: 'Order.items',
      }),
      product: relationship({
        ref: 'Product.orderItems',
      }),
      variant: relationship({ ref: 'ProductVariant.orderItems' }),
      quantity: integer({ validation: { isRequired: true }, defaultValue: 1 }),
      unitPrice: integer({ validation: { isRequired: true } }),
      discount: integer({ defaultValue: 0 }),
      tax: integer({ defaultValue: 0 }),
      total: integer({ defaultValue: 0 }),
      fulfilled: integer({ defaultValue: 0 }),
      notes: text(),
    },
  }),

  Customer: list({
    access: allowAll,
    fields: {
      firstName: text({ validation: { isRequired: true } }),
      lastName: text({ validation: { isRequired: true } }),
      email: text({ isIndexed: 'unique' }),
      phone: text(),
      company: text(),
      taxId: text(),
      notes: text(),
      addresses: relationship({ ref: 'Address.customer', many: true }),
      orders: relationship({ ref: 'Order.customer', many: true }),
      tags: relationship({ ref: 'Tag.customers', many: true }),
      createdAt: timestamp({
        defaultValue: { kind: 'now' },
      }),
    },
  }),

  Address: list({
    access: allowAll,
    fields: {
      addressLine1: text({ validation: { isRequired: true } }),
      addressLine2: text(),
      city: text({ validation: { isRequired: true } }),
      state: text({ validation: { isRequired: true } }),
      postalCode: text({ validation: { isRequired: true } }),
      country: text({ validation: { isRequired: true } }),
      isDefault: checkbox({ defaultValue: false }),
      addressType: select({
        type: 'enum',
        options: [
          { label: 'Shipping', value: 'shipping' },
          { label: 'Billing', value: 'billing' },
          { label: 'Both', value: 'both' },
        ],
        defaultValue: 'both',
      }),
      customer: relationship({ ref: 'Customer.addresses' }),
      shippingOrders: relationship({
        ref: 'Order.shippingAddress',
        many: true,
      }),
      billingOrders: relationship({ ref: 'Order.billingAddress', many: true }),
    },
  }),

  Shipment: list({
    access: allowAll,
    fields: {
      shipmentId: text({
        validation: { isRequired: true },
        isIndexed: 'unique',
      }),
      order: relationship({
        ref: 'Order.shipment',
      }),
      carrier: relationship({
        ref: 'Carrier.shipments',
      }),
      trackingNumber: text(),
      status: select({
        type: 'enum',
        options: [
          { label: 'Processing', value: 'processing' },
          { label: 'Ready for Pickup', value: 'ready_for_pickup' },
          { label: 'In Transit', value: 'in_transit' },
          { label: 'Delivered', value: 'delivered' },
          { label: 'Failed', value: 'failed' },
          { label: 'Returned', value: 'returned' },
        ],
        defaultValue: 'processing',
        validation: { isRequired: true },
      }),
      shippedDate: timestamp(),
      deliveredDate: timestamp(),
      packaging: relationship({ ref: 'Packaging.shipments' }),
      weight: float(),
      dimensions: json(),
      shippingCost: integer({ defaultValue: 0 }),
      notes: text(),
      createdAt: timestamp({
        defaultValue: { kind: 'now' },
      }),
      updatedAt: timestamp(),
    },
  }),

  Carrier: list({
    access: allowAll,
    fields: {
      name: text({ validation: { isRequired: true } }),
      accountNumber: text(),
      isActive: checkbox({ defaultValue: true }),
      trackingUrlTemplate: text(), // e.g., https://track.carrier.com/{trackingNumber}
      rateType: select({
        type: 'enum',
        options: [
          { label: 'Standard', value: 'standard' },
          { label: 'Negotiated', value: 'negotiated' },
          { label: 'Commercial Plus', value: 'commercial_plus' },
        ],
      }),
      shipments: relationship({ ref: 'Shipment.carrier', many: true }),
      settings: json(),
    },
  }),

  Packaging: list({
    access: allowAll,
    fields: {
      name: text({ validation: { isRequired: true } }),
      dimensions: text(), // e.g., "12" x 10" x 6"
      weight: float(),
      isActive: checkbox({ defaultValue: true }),
      shipments: relationship({ ref: 'Shipment.packaging', many: true }),
    },
  }),

  // ======== WAREHOUSE & RETAIL MODELS ========
  WarehouseLocation: list({
    access: allowAll,
    fields: {
      name: text({ validation: { isRequired: true } }),
      address: text({ validation: { isRequired: true } }),
      status: select({
        type: 'enum',
        options: [
          { label: 'Active', value: 'active' },
          { label: 'Maintenance', value: 'maintenance' },
          { label: 'Inactive', value: 'inactive' },
        ],
        defaultValue: 'active',
      }),
      sections: relationship({ ref: 'WarehouseSection.warehouse', many: true }),
      inventory: relationship({ ref: 'InventoryItem.location', many: true }),
      materialInventory: relationship({
        ref: 'MaterialInventory.location',
        many: true,
      }),
      staff: relationship({ ref: 'User.warehouseLocations', many: true }),
      outgoingTransfers: relationship({
        ref: 'InventoryTransfer.fromLocation',
        many: true,
      }),
      incomingTransfers: relationship({
        ref: 'InventoryTransfer.toLocation',
        many: true,
      }),
    },
  }),

  WarehouseSection: list({
    access: allowAll,
    fields: {
      name: text({ validation: { isRequired: true } }),
      warehouse: relationship({
        ref: 'WarehouseLocation.sections',
      }),
      type: select({
        type: 'enum',
        options: [
          { label: 'Raw Materials', value: 'raw_materials' },
          { label: 'Finished Products', value: 'finished_products' },
          { label: 'Packaging', value: 'packaging' },
          { label: 'Seasonal', value: 'seasonal' },
          { label: 'Mixed Inventory', value: 'mixed' },
        ],
      }),
      capacity: integer(),
      inventory: relationship({ ref: 'InventoryItem.section', many: true }),
      materialInventory: relationship({
        ref: 'MaterialInventory.section',
        many: true,
      }),
    },
  }),

  InventoryTransfer: list({
    access: allowAll,
    fields: {
      transferId: text({
        isIndexed: 'unique',
      }),
      fromLocation: relationship({
        ref: 'WarehouseLocation.outgoingTransfers',
      }),
      toLocation: relationship({
        ref: 'WarehouseLocation.incomingTransfers',
      }),
      items: relationship({ ref: 'InventoryItem.transfers', many: true }),
      status: select({
        type: 'enum',
        options: [
          { label: 'Pending', value: 'pending' },
          { label: 'In Transit', value: 'in_transit' },
          { label: 'Completed', value: 'completed' },
          { label: 'Cancelled', value: 'cancelled' },
        ],
        defaultValue: 'pending',
      }),
      initiatedBy: relationship({ ref: 'User' }),
      initiatedDate: timestamp({
        defaultValue: { kind: 'now' },
      }),
      completedDate: timestamp(),
      notes: text(),
    },
  }),

  RetailLocation: list({
    access: allowAll,
    fields: {
      name: text({ validation: { isRequired: true } }),
      address: text({ validation: { isRequired: true } }),
      manager: relationship({ ref: 'User' }),
      status: select({
        type: 'enum',
        options: [
          { label: 'Active', value: 'active' },
          { label: 'Maintenance', value: 'maintenance' },
          { label: 'Inactive', value: 'inactive' },
        ],
        defaultValue: 'active',
      }),
      staff: relationship({ ref: 'User.retailLocations', many: true }),
      orders: relationship({ ref: 'Order.retailLocation', many: true }),
      posTerminals: relationship({ ref: 'POSTerminal.location', many: true }),
    },
  }),

  POSTerminal: list({
    access: allowAll,
    fields: {
      terminalId: text({
        validation: { isRequired: true },
        isIndexed: 'unique',
      }),
      location: relationship({
        ref: 'RetailLocation.posTerminals',
      }),
      status: select({
        type: 'enum',
        options: [
          { label: 'Connected', value: 'connected' },
          { label: 'Disconnected', value: 'disconnected' },
          { label: 'Maintenance', value: 'maintenance' },
        ],
        defaultValue: 'connected',
      }),
      lastSync: timestamp(),
      settings: json(),
    },
  }),

  // ======== PROMOTION & MARKETING MODELS ========
  Promotion: list({
    access: allowAll,
    fields: {
      name: text({ validation: { isRequired: true } }),
      description: text(),
      discountType: select({
        type: 'enum',
        options: [
          { label: 'Percentage', value: 'percentage' },
          { label: 'Fixed Amount', value: 'fixed' },
          { label: 'Buy X Get Y', value: 'bxgy' },
          { label: 'Free Shipping', value: 'free_shipping' },
        ],
        validation: { isRequired: true },
      }),
      discountValue: integer({ defaultValue: 0 }),
      discountCode: text(),
      startDate: timestamp({ validation: { isRequired: true } }),
      endDate: timestamp({ validation: { isRequired: true } }),
      status: select({
        type: 'enum',
        options: [
          { label: 'Active', value: 'active' },
          { label: 'Upcoming', value: 'upcoming' },
          { label: 'Expired', value: 'expired' },
          { label: 'Cancelled', value: 'cancelled' },
        ],
      }),
      minimumPurchase: integer({ defaultValue: 0 }),
      usageLimit: integer(),
      usageCount: integer({ defaultValue: 0 }),
      applicableProducts: relationship({ ref: 'Product', many: true }),
      applicableCategories: relationship({ ref: 'Category', many: true }),
      createdBy: relationship({ ref: 'User' }),
      createdAt: timestamp({
        defaultValue: { kind: 'now' },
      }),
    },
  }),

  // ======== SUPPLIER MODELS ========
  Supplier: list({
    access: allowAll,
    fields: {
      name: text({ validation: { isRequired: true } }),
      contactName: text(),
      email: text(),
      phone: text(),
      website: text(),
      address: text(),
      notes: text(),
      materials: relationship({ ref: 'Material.supplier', many: true }),
      isActive: checkbox({ defaultValue: true }),
      createdAt: timestamp({
        defaultValue: { kind: 'now' },
      }),
    },
  }),

  // ======== TAG & CATEGORY MODELS ========
  Tag: list({
    access: allowAll,
    fields: {
      name: text({ validation: { isRequired: true }, isIndexed: 'unique' }),
      color: text(),
      products: relationship({ ref: 'Product.tags', many: true }),
      materials: relationship({ ref: 'Material.tags', many: true }),
      customers: relationship({ ref: 'Customer.tags', many: true }),
      orders: relationship({ ref: 'Order.tags', many: true }),
      createdBy: relationship({ ref: 'User' }),
      createdAt: timestamp({
        defaultValue: { kind: 'now' },
      }),
    },
  }),

  Category: list({
    access: allowAll,
    fields: {
      name: text({ validation: { isRequired: true } }),
      slug: text({ isIndexed: 'unique' }),
      description: text(),
      parent: relationship({ ref: 'Category.children' }),
      children: relationship({ ref: 'Category.parent', many: true }),
      products: relationship({ ref: 'Product.categories', many: true }),
      materials: relationship({ ref: 'Material.category', many: true }),
      image: text(),
      isActive: checkbox({ defaultValue: true }),
    },
  }),

  // ======== INTEGRATION MODELS ========
  Integration: list({
    access: allowAll,
    fields: {
      name: text({ validation: { isRequired: true } }),
      type: select({
        type: 'enum',
        options: [
          { label: 'Shopify', value: 'shopify' },
          { label: 'Etsy', value: 'etsy' },
          { label: 'WooCommerce', value: 'woocommerce' },
          { label: 'Square', value: 'square' },
          { label: 'Lightspeed', value: 'lightspeed' },
        ],
        validation: { isRequired: true },
      }),
      isActive: checkbox({ defaultValue: true }),
      credentials: json(),
      settings: json(),
      lastSync: timestamp(),
      syncLogs: relationship({
        ref: 'IntegrationSyncLog.integration',
        many: true,
      }),
      createdAt: timestamp({
        defaultValue: { kind: 'now' },
      }),
      updatedAt: timestamp(),
    },
  }),

  IntegrationSyncLog: list({
    access: allowAll,
    fields: {
      integration: relationship({
        ref: 'Integration.syncLogs',
      }),
      syncType: select({
        type: 'enum',
        options: [
          { label: 'Products', value: 'products' },
          { label: 'Orders', value: 'orders' },
          { label: 'Inventory', value: 'inventory' },
          { label: 'Customers', value: 'customers' },
          { label: 'Full', value: 'full' },
        ],
        validation: { isRequired: true },
      }),
      status: select({
        type: 'enum',
        options: [
          { label: 'Success', value: 'success' },
          { label: 'Partial', value: 'partial' },
          { label: 'Failed', value: 'failed' },
          { label: 'In Progress', value: 'in_progress' },
        ],
        validation: { isRequired: true },
      }),
      startTime: timestamp({
        defaultValue: { kind: 'now' },
      }),
      endTime: timestamp(),
      itemsProcessed: integer({ defaultValue: 0 }),
      itemsSucceeded: integer({ defaultValue: 0 }),
      itemsFailed: integer({ defaultValue: 0 }),
      errors: json(),
      details: json(),
    },
  }),

  // ======== REPORT MODELS ========
  Report: list({
    access: allowAll,
    fields: {
      name: text({ validation: { isRequired: true } }),
      description: text(),
      type: select({
        type: 'enum',
        options: [
          { label: 'Sales', value: 'sales' },
          { label: 'Inventory', value: 'inventory' },
          { label: 'Products', value: 'products' },
          { label: 'Customers', value: 'customers' },
          { label: 'Orders', value: 'orders' },
          { label: 'Custom', value: 'custom' },
        ],
        validation: { isRequired: true },
      }),
      parameters: json(),
      schedule: json(), // For scheduled reports
      lastRun: timestamp(),
      createdBy: relationship({ ref: 'User' }),
      createdAt: timestamp({
        defaultValue: { kind: 'now' },
      }),
      isPro: checkbox({ defaultValue: false }),
    },
  }),
};
