import { integrationStatusOptions } from '../config/options';
import { list } from '@keystone-6/core';
import { allowAll } from '@keystone-6/core/access';
import {
  text,
  relationship,
  timestamp,
  select,
  integer,
} from '@keystone-6/core/fields';

export const Integration: any = list({
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
    user: relationship({ ref: 'User' }),
    integrationType: text(),
    storeUrl: text(),
    apiKey: text(),
    shopId: text(),
    status: select({
      options: integrationStatusOptions,
      defaultValue: 'PENDING',
      ui: { displayMode: 'select' },
    }),
    createdAt: timestamp({ defaultValue: { kind: 'now' } }),
    updatedAt: timestamp({ db: { updatedAt: true } }),
  },
});
