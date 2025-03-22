import { list } from '@keystone-6/core';
import { allowAll } from '@keystone-6/core/access';
import { relationship, text } from '@keystone-6/core/fields';

export const Tag: any = list({
  // WARNING
  //   for this starter project, anyone can create, query, update and delete anything
  //   if you want to prevent random people on the internet from accessing your data,
  //   you can find out more at https://keystonejs.com/docs/guides/auth-and-access-control
  access: allowAll,

  // setting this to isHidden for the user interface prevents this list being visible in the Admin UI
  ui: {
    // isHidden: true,
  },

  // this is the fields for our Tag list
  fields: {
    name: text(),
    description: text({ ui: { displayMode: 'textarea' } }),
    users: relationship({
      ref: 'User.tags',
      many: true,
      ui: {
        displayMode: 'select',
        labelField: 'email',
        searchFields: ['firstName', 'lastName', 'email'],
      },
    }),
    lists: relationship({ ref: 'List.tags', many: true }),
    products: relationship({ ref: 'Product.tags', many: true }),
    inventory: relationship({ ref: 'Inventory.tags', many: true }),
    // you can add more fields here, like images, videos, etc.
  },
});
