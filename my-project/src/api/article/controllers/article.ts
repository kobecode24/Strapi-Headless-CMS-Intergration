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
  
  // Override create method to handle relation fields
  async create(ctx) {
    // Get the request body
    const { data } = ctx.request.body;
    
    // Handle category relationship if present
    if (data && data.category) {
      console.log('Category data received:', data.category);
      
      // Extract category ID
      let categoryId;
      if (typeof data.category === 'number') {
        categoryId = data.category;
      } else if (typeof data.category === 'object') {
        // Try to extract ID from various formats
        categoryId = data.category.id || 
                     (data.category.data && data.category.data.id) ||
                     (data.category.connect && data.category.connect[0]);
      }
      
      // If we found a category ID, create the article and then set relation
      if (categoryId) {
        console.log('Extracted category ID:', categoryId);
        
        // Remove category from data to avoid validation error
        const { category, ...articleData } = data;
        
        // Create the article without category
        ctx.request.body = { data: articleData };
        const response = await super.create(ctx);
        
        // Get the created article ID
        const articleId = response.data.id;
        
        // Now update the category relation directly in the database
        try {
          await strapi.db.query('api::article.article').update({
            where: { id: articleId },
            data: {
              category: categoryId
            },
          });
          
          // Fetch the updated article with populated category
          const updatedArticle = await strapi.db.query('api::article.article').findOne({
            where: { id: articleId },
            populate: ['category'],
          });
          
          // Return the updated article
          return {
            data: updatedArticle
          };
        } catch (error) {
          console.error('Error setting category relation:', error);
          // Return the article without category if relation update fails
          return response;
        }
      }
    }
    
    // If no category or couldn't extract ID, proceed with normal creation
    return super.create(ctx);
  },
  
  // Override update method to handle the category relationship properly
  async update(ctx) {
    const { id } = ctx.params;
    const { data } = ctx.request.body;
    
    console.log(`[UPDATE] Updating article ${id} with data:`, JSON.stringify(data, null, 2));
    
    try {
      // First, check if the article exists
      const existingArticle = await strapi.db.query('api::article.article').findOne({
        where: { id: Number(id) },
      });
      
      if (!existingArticle) {
        console.error(`[UPDATE] Article with ID ${id} not found`);
        return ctx.notFound(`Article with ID ${id} not found`);
      }
      
      console.log(`[UPDATE] Found existing article:`, existingArticle.title);
      
      // Handle category relationship if present
      if (data && data.hasOwnProperty('category')) {
        let categoryId = null;
        
        // Extract category ID if it exists and is not null
        if (data.category !== null) {
          if (typeof data.category === 'number') {
            categoryId = data.category;
          } else if (typeof data.category === 'object') {
            // Try to extract ID from various formats
            categoryId = data.category.id || 
                        (data.category.data && data.category.data.id) ||
                        (data.category.connect && data.category.connect[0]);
          }
        }
        
        console.log(`[UPDATE] Extracted category ID:`, categoryId);
        
        // If we have a categoryId, check if it exists
        if (categoryId !== null) {
          const categoryExists = await strapi.db.query('api::category.category').findOne({
            where: { id: categoryId },
          });
          
          if (!categoryExists) {
            console.error(`[UPDATE] Category with ID ${categoryId} not found`);
            return ctx.badRequest(`Category with ID ${categoryId} not found`);
          }
          
          console.log(`[UPDATE] Found category:`, categoryExists.name);
        }
        
        // Remove category from data to avoid validation error
        const { category, ...articleData } = data;
        
        console.log(`[UPDATE] Sending data to super.update:`, JSON.stringify(articleData, null, 2));
        
        // Update article without category using direct database query
        try {
          // Skip calling super.update and use direct database query instead
          const updatedArticle = await strapi.db.query('api::article.article').update({
            where: { id: Number(id) },
            data: articleData,
          });
          
          if (!updatedArticle) {
            console.error(`[UPDATE] Failed to update article ${id}`);
            return ctx.internalServerError('Failed to update article');
          }
          
          console.log(`[UPDATE] Article updated successfully with title: ${updatedArticle.title}`);
          
          // Now update the category relation directly in the database
          if (categoryId !== null) {
            console.log(`[UPDATE] Updating category relation for article ${id} to category ${categoryId}`);
            
            await strapi.db.query('api::article.article').update({
              where: { id: Number(id) },
              data: {
                category: categoryId
              },
            });
            
            console.log(`[UPDATE] Category relation updated successfully`);
          }
          
          // Fetch the updated article with populated category
          const finalArticle = await strapi.db.query('api::article.article').findOne({
            where: { id: Number(id) },
            populate: ['category', 'cover', 'blocks', 'author'],
          });
          
          if (!finalArticle) {
            console.error(`[UPDATE] Failed to fetch updated article ${id}`);
            return ctx.internalServerError('Failed to fetch updated article');
          }
          
          console.log(`[UPDATE] Fetched updated article with title:`, finalArticle.title);
          
          // Format the response to match Strapi's expected structure
          const formattedResponse = {
            data: {
              id: finalArticle.id,
              attributes: { ...finalArticle }
            },
            meta: {}
          };
          
          // Remove the id from attributes as it's already in the top level
          delete formattedResponse.data.attributes.id;
          
          return formattedResponse;
        } catch (error) {
          console.error('[UPDATE] Error updating article:', error);
          return ctx.badRequest(`Error updating article: ${error.message}`);
        }
      }
      
      // If no category handling needed, proceed with normal update using database query
      console.log(`[UPDATE] No category handling needed, proceeding with normal update`);
      try {
        const updatedArticle = await strapi.db.query('api::article.article').update({
          where: { id: Number(id) },
          data: data,
        });
        
        if (!updatedArticle) {
          console.error(`[UPDATE] Failed to update article ${id}`);
          return ctx.internalServerError('Failed to update article');
        }
        
        // Fetch the updated article with populations
        const finalArticle = await strapi.db.query('api::article.article').findOne({
          where: { id: Number(id) },
          populate: ['category', 'cover', 'blocks', 'author'],
        });
        
        // Format the response
        const formattedResponse = {
          data: {
            id: finalArticle.id,
            attributes: { ...finalArticle }
          },
          meta: {}
        };
        
        // Remove the id from attributes as it's already in the top level
        delete formattedResponse.data.attributes.id;
        
        return formattedResponse;
      } catch (error) {
        console.error(`[UPDATE] Error in normal update:`, error);
        return ctx.badRequest(`Error updating article: ${error.message}`);
      }
    } catch (error) {
      console.error(`[ERROR] Update error for ID ${id}:`, error);
      return ctx.badRequest(`Error updating article: ${error.message}`);
    }
  },
  
  // Override findOne to add better error handling
  async findOne(ctx) {
    const { id } = ctx.params;
    console.log(`[DEBUG] findOne called with ID: ${id}`);
    
    try {
      let entity = null;
      
      // Check if ID is numeric
      const isNumericId = !isNaN(Number(id)) && String(Number(id)) === id;
      console.log(`[DEBUG] Is numeric ID: ${isNumericId}`);
      
      // Only attempt direct ID lookup if it's numeric
      if (isNumericId) {
        console.log(`[DEBUG] Attempting numeric ID lookup`);
        try {
          entity = await strapi.db.query('api::article.article').findOne({
            where: { id: Number(id) },
            populate: ['category', 'cover', 'blocks', 'author'], // Populate all relations
          });
        } catch (err) {
          console.log(`[DEBUG] Numeric ID lookup failed:`, err.message);
        }
      }
      
      // Try alternative lookup by slug if direct ID lookup failed
      if (!entity) {
        console.log(`[DEBUG] Trying to find article by slug or other fields`);
        try {
          // Try to find by slug (assuming that might be what the string ID represents)
          entity = await strapi.db.query('api::article.article').findOne({
            where: { slug: id },
            populate: ['category', 'cover', 'blocks', 'author'], // Populate all relations
          });
        } catch (err) {
          console.log(`[DEBUG] Slug lookup failed:`, err.message);
        }
      }
      
      // If we still can't find it, list available articles and return 404
      if (!entity) {
        console.log(`[DEBUG] Article not found by ID or slug, listing available articles`);
        try {
          const allArticles = await strapi.db.query('api::article.article').findMany({
            select: ['id', 'title', 'slug'],
            limit: 10,
          });
          console.log(`[DEBUG] Available articles:`, JSON.stringify(allArticles));
        } catch (err) {
          console.log(`[DEBUG] Failed to list articles:`, err.message);
        }
        
        return ctx.notFound('Article not found in database');
      }
      
      // If we found the entity, return it in the expected format without using parent implementation
      console.log(`[DEBUG] Found article with ID: ${entity.id}, returning formatted response`);
      
      // Format the response to match Strapi's expected structure
      const formattedResponse = {
        data: {
          id: entity.id,
          attributes: { ...entity }
        },
        meta: {}
      };
      
      // Remove the id from attributes as it's already in the top level
      delete formattedResponse.data.attributes.id;
      
      return formattedResponse;
    } catch (error) {
      console.error(`[ERROR] findOne error for ID ${id}:`, error);
      return ctx.internalServerError('Error retrieving article');
    }
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
  },
  
  // Debug method to check all articles
  async debug(ctx) {
    try {
      // Get all article IDs and metadata in the database
      const articles = await strapi.db.query('api::article.article').findMany({
        select: ['id', 'title', 'slug', 'createdAt', 'updatedAt'],
        populate: ['category'],
      });
      
      // Format for easier reading
      const formattedArticles = articles.map(article => ({
        id: article.id,
        title: article.title,
        slug: article.slug,
        categoryId: article.category?.id,
        categoryName: article.category?.name,
        created: article.createdAt,
        updated: article.updatedAt
      }));
      
      console.log('[DEBUG] All articles in database:', JSON.stringify(formattedArticles, null, 2));
      
      return {
        articles: formattedArticles,
        count: articles.length,
        message: 'Debug information retrieved successfully',
        note: 'Use numeric IDs with PostgreSQL for article lookups'
      };
    } catch (error) {
      console.error('[ERROR] Debug error:', error);
      return ctx.internalServerError('Error debugging articles');
    }
  },
  
  // Method to update article by documentId
  async updateByDocumentId(ctx) {
    const { documentId } = ctx.params;
    const { data } = ctx.request.body;
    
    console.log(`[UPDATE_BY_DOC_ID] Updating article with documentId ${documentId}`);
    console.log(`[UPDATE_BY_DOC_ID] Update data:`, JSON.stringify(data, null, 2));
    
    try {
      // Find the article by documentId
      const article = await strapi.db.query('api::article.article').findOne({
        where: { documentId },
      });
      
      if (!article) {
        console.error(`[UPDATE_BY_DOC_ID] Article with documentId ${documentId} not found`);
        return ctx.notFound(`Article with documentId ${documentId} not found`);
      }
      
      console.log(`[UPDATE_BY_DOC_ID] Found article with ID ${article.id} and title "${article.title}"`);
      
      // Now update with the standard ID
      const articleId = article.id;
      
      // Handle category relationship if present
      let updatedArticleData = { ...data };
      let categoryToSet = null;
      
      if (data && data.hasOwnProperty('category')) {
        console.log(`[UPDATE_BY_DOC_ID] Category data:`, data.category);
        
        // Extract and remove category to handle it separately
        let categoryId = null;
        
        if (data.category !== null) {
          if (typeof data.category === 'number') {
            categoryId = data.category;
          } else if (typeof data.category === 'object') {
            categoryId = data.category.id || 
                       (data.category.data && data.category.data.id) ||
                       (data.category.connect && data.category.connect[0]);
          }
          
          // Check if category exists
          if (categoryId !== null) {
            const categoryExists = await strapi.db.query('api::category.category').findOne({
              where: { id: categoryId },
            });
            
            if (!categoryExists) {
              console.error(`[UPDATE_BY_DOC_ID] Category with ID ${categoryId} not found`);
              return ctx.badRequest(`Category with ID ${categoryId} not found`);
            }
            
            console.log(`[UPDATE_BY_DOC_ID] Found category with name "${categoryExists.name}"`);
            categoryToSet = categoryId;
          }
        }
        
        // Remove category from the data
        const { category, ...dataWithoutCategory } = data;
        updatedArticleData = dataWithoutCategory;
      }
      
      // Update the article
      console.log(`[UPDATE_BY_DOC_ID] Updating article data:`, JSON.stringify(updatedArticleData, null, 2));
      
      const updatedArticle = await strapi.db.query('api::article.article').update({
        where: { id: articleId },
        data: updatedArticleData,
      });
      
      if (!updatedArticle) {
        console.error(`[UPDATE_BY_DOC_ID] Failed to update article ${articleId}`);
        return ctx.internalServerError('Failed to update article');
      }
      
      console.log(`[UPDATE_BY_DOC_ID] Article updated successfully`);
      
      // Handle category relationship separately if needed
      if (categoryToSet !== null) {
        console.log(`[UPDATE_BY_DOC_ID] Setting category relation to ${categoryToSet}`);
        
        try {
          await strapi.db.query('api::article.article').update({
            where: { id: articleId },
            data: {
              category: categoryToSet
            },
          });
          
          console.log(`[UPDATE_BY_DOC_ID] Category relation updated successfully`);
        } catch (error) {
          console.error(`[UPDATE_BY_DOC_ID] Error updating category relation:`, error);
          // Continue with the response even if category update fails
        }
      }
      
      // Fetch the updated article with populations
      const finalArticle = await strapi.db.query('api::article.article').findOne({
        where: { id: articleId },
        populate: ['category', 'cover', 'blocks', 'author'],
      });
      
      // Format the response
      const formattedResponse = {
        data: {
          id: finalArticle.id,
          attributes: { ...finalArticle }
        },
        meta: {}
      };
      
      // Remove the id from attributes as it's already in the top level
      delete formattedResponse.data.attributes.id;
      
      return formattedResponse;
    } catch (error) {
      console.error(`[UPDATE_BY_DOC_ID] Error:`, error);
      return ctx.badRequest(`Error updating article: ${error.message}`);
    }
  }
}));
