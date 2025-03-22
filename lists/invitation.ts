import { list } from '@keystone-6/core';
import { allowAll } from '@keystone-6/core/access';
import { text, relationship, timestamp, select } from '@keystone-6/core/fields';
import { listInvitationOptions } from '../config/options';

export const Invitation: any = list({
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
    email: text({ validation: { isRequired: true } }),
    status: select({
      options: listInvitationOptions,
      defaultValue: 'PENDING',
      ui: { displayMode: 'select' },
    }),
    token: text({ isIndexed: 'unique' }),
    lists: relationship({
      ref: 'List',
      many: true,
    }),
    clusters: relationship({ ref: 'Cluster', many: true }),
    user: relationship({
      ref: 'User',
      many: false,
      ui: {
        displayMode: 'select',
        labelField: 'email',
        searchFields: ['firstName', 'lastName', 'email'],
      },
    }),
    createdAt: timestamp({ defaultValue: { kind: 'now' } }),
    updatedAt: timestamp({ db: { updatedAt: true } }),
  },
});
