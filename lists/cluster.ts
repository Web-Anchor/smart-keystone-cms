import { list } from '@keystone-6/core';
import { allowAll } from '@keystone-6/core/access';
import { relationship, text, timestamp } from '@keystone-6/core/fields';

export const Cluster: any = list({
  // WARNING
  //   for this starter project, anyone can create, query, update and delete anything
  //   if you want to prevent random people on the internet from accessing your data,
  //   you can find out more at https://keystonejs.com/docs/guides/auth-and-access-control
  access: allowAll,

  fields: {
    name: text(),
    description: text({ ui: { displayMode: 'textarea' } }),
    users: relationship({
      ref: 'User',
      many: true,
      ui: { displayMode: 'select' },
    }),
    lists: relationship({
      ref: 'List',
      many: true,
      ui: { displayMode: 'select' },
    }),
    createdAt: timestamp({ defaultValue: { kind: 'now' } }),
    updatedAt: timestamp({ db: { updatedAt: true } }),
  },
});
