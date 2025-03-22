import { list } from '@keystone-6/core';
import { allowAll } from '@keystone-6/core/access';
import {
  password,
  relationship,
  select,
  text,
  timestamp,
  json,
} from '@keystone-6/core/fields';
import { userPermissionsOptions, userRoleOptions } from '../config/options';

export const User: any = list({
  // WARNING
  //   for this starter project, anyone can create, query, update and delete anything
  //   if you want to prevent random people on the internet from accessing your data,
  //   you can find out more at https://keystonejs.com/docs/guides/auth-and-access-control
  access: allowAll,

  ui: {
    labelField: 'email',
    searchFields: ['email', 'firstName', 'lastName'],
  },

  // this is the fields for our User list
  fields: {
    // by adding isRequired, we enforce that every User should have a name
    //   if no name is provided, an error will be displayed
    firstName: text(),
    lastName: text(),
    phoneNumbers: text(),
    clerkId: text({
      // by adding isIndexed: 'unique', we're saying that no user can have the same
      // clerkId as another user - this may or may not be a good idea for your project
      isIndexed: 'unique',
    }),
    email: text({
      validation: { isRequired: true },
      // by adding isIndexed: 'unique', we're saying that no user can have the same
      // email as another user - this may or may not be a good idea for your project
      isIndexed: 'unique',
    }),
    role: select({
      options: userRoleOptions,
      defaultValue: 'USER',
      ui: { displayMode: 'select' },
    }),
    password: password({ validation: { isRequired: true } }),
    permissions: select({
      options: userPermissionsOptions,
      defaultValue: 'ALL',
      ui: { displayMode: 'select' },
    }),
    configuration: json({ defaultValue: {} }), // for storing user-specific setting configurations
    tags: relationship({ ref: 'Tag.users', many: true }),

    // metadata fields
    updatedAt: timestamp({ db: { updatedAt: true } }),
    createdAt: timestamp({
      defaultValue: { kind: 'now' },
    }),
  },
});
