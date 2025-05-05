/**
 *  article controller with custom methods
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::article.article', ({ strapi }) => ({
  // Keep the default controllers
  async find(ctx) {
    // Call the default find method
    const { data, meta } = await super.find(ctx);
    
    // Example of conditional logic:
    // If query parameter "featured" is true, filter to only show articles marked as featured
    if (ctx.query.featured === 'true') {
      const filteredData = data.filter(article => article.attributes.featured === true);
      return { data: filteredData, meta };
    }
    
    // Otherwise return all articles
    return { data, meta };
  },
  
  // Custom endpoint to get related articles
  async getRelated(ctx) {
    const { id } = ctx.params;
    
    // Ensure ID exists
    if (!id) {
      return ctx.badRequest('ID is required');
    }
    
    try {
      // Get the article
      const article = await strapi.db.query('api::article.article').findOne({
        where: { id },
        populate: ['category'],
      });
      
      if (!article) {
        return ctx.notFound('Article not found');
      }
      
      // Conditionally fetch related articles based on the same category
      let relatedArticles = [];
      
      if (article.category) {
        relatedArticles = await strapi.db.query('api::article.article').findMany({
          where: {
            id: { $ne: id }, // Not the same article
            category: { id: article.category.id }, // Same category
          },
          limit: 3,
          populate: ['cover', 'category'],
        });
      }
      
      return { data: relatedArticles };
    } catch (error) {
      ctx.internalServerError('Error finding related articles');
    }
  }
}));
