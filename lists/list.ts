import { list } from '@keystone-6/core';
import { allowAll } from '@keystone-6/core/access';
import { text, relationship, timestamp } from '@keystone-6/core/fields';

export const List: any = list({
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
    name: text(),
    description: text({ ui: { displayMode: 'textarea' } }),
    tags: relationship({ ref: 'Tag.lists', many: true }),
    clusters: relationship({ ref: 'Cluster', many: true }),
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
    items: relationship({ ref: 'Inventory', many: true }),
    createdAt: timestamp({ defaultValue: { kind: 'now' } }),
    updatedAt: timestamp({ db: { updatedAt: true } }),
  },
});
