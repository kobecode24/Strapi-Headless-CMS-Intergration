/**
 * article router with custom routes
 */

export default {
  routes: [
    // Default routes
    {
      method: 'GET',
      path: '/articles',
      handler: 'api::article.article.find',
      config: {
        auth: false,
      },
    },
    {
      method: 'GET',
      path: '/articles/:id',
      handler: 'api::article.article.findOne',
      config: {
        auth: false,
      },
    },
    {
      method: 'POST',
      path: '/articles',
      handler: 'api::article.article.create',
      config: {
        auth: false,
      },
    },
    {
      method: 'PUT',
      path: '/articles/:id',
      handler: 'api::article.article.update',
      config: {
        auth: false,
      },
    },
    {
      method: 'DELETE',
      path: '/articles/:id',
      handler: 'api::article.article.delete',
      config: {
        auth: false,
      },
    },
    // Custom routes
    {
      method: 'GET',
      path: '/articles/:id/related',
      handler: 'api::article.article.getRelated',
      config: {
        auth: false,
      },
    },
    {
      method: 'GET',
      path: '/articles-debug',
      handler: 'api::article.article.debug',
      config: {
        auth: false,
      },
    },
    // Route for handling updates by documentId
    {
      method: 'PUT',
      path: '/articles/document/:documentId',
      handler: 'api::article.article.updateByDocumentId',
      config: {
        auth: false,
      },
    },
  ],
};
