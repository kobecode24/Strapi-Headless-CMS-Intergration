/**
 * article router with custom routes.
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::article.article', {
  config: {
    find: {
      auth: false, // Public access for find method
    },
    findOne: {
      auth: false, // Public access for findOne method
    },
  },
  routes: [
    // All default routes automatically included
    {
      method: 'GET',
      path: '/articles/:id/related',
      handler: 'api::article.article.getRelated',
      config: {
        auth: false, // Make this endpoint public
      },
    },
  ],
});
