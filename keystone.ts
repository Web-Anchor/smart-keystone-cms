// Welcome to Keystone!
//
// This file is what Keystone uses as the entry-point to your headless backend
//
// Keystone imports the default export of this file, expecting a Keystone configuration object
//   you can find out more at https://keystonejs.com/docs/apis/config

import { config } from '@keystone-6/core';

// to keep this file tidy, we define our schema in a different file
import { lists } from './schema';

// authentication is configured separately here too, but you might move this elsewhere
// when you write your list-level access control functions, as they typically rely on session data
import { withAuth, session } from './auth';
import { DatabaseProvider } from '@keystone-6/core/types';

export default withAuth(
  config({
    db: {
      // we're using sqlite for the fastest startup experience
      //   for more information on what database might be appropriate for you
      //   see https://keystonejs.com/docs/guides/choosing-a-database#title
      provider: (process.env.DATABASE_PROVIDER || 'sqlite') as DatabaseProvider, // or 'postgresql' or 'mysql'
      url: process.env.DATABASE_URL || 'file:./keystone.db',
    },
    lists,
    session,
    graphql: {
      path: '/api/graphql', // The path to the GraphQL API
      playground: process.env.ENVIRONMENT === 'development', // Enable GraphQL Playground via environment variable
      apolloConfig: {
        introspection: true, // Enable introspection via environment variable
      },
    },
  })
);
