/**
 * LinkedIn API Service
 * Handles fetching posts from LinkedIn organization page
 */

/**
 * Extract title from LinkedIn post commentary
 * @param {string} commentary - The post text content
 * @returns {string} - Extracted title
 */
function extractTitle(commentary) {
  if (!commentary) return 'Post de Intertrade Solutions';
  
  // Try to get first line or first sentence as title
  const lines = commentary.split('\n');
  const firstLine = lines[0]?.trim();
  
  if (firstLine && firstLine.length > 10 && firstLine.length < 100) {
    return firstLine;
  }
  
  // Fallback: get first sentence
  const sentences = commentary.split(/[.!?]/);
  const firstSentence = sentences[0]?.trim();
  
  if (firstSentence && firstSentence.length > 10) {
    return firstSentence.length > 80 
      ? firstSentence.substring(0, 77) + '...'
      : firstSentence;
  }
  
  return 'Actualización de Intertrade Solutions';
}

/**
 * Extract excerpt from LinkedIn post commentary
 * @param {string} commentary - The post text content
 * @returns {string} - Extracted excerpt
 */
function extractExcerpt(commentary) {
  if (!commentary) return 'Síguenos en LinkedIn para las últimas actualizaciones.';
  
  // Remove the title part and get the rest as excerpt
  const lines = commentary.split('\n');
  const contentLines = lines.slice(1).join(' ').trim();
  
  if (contentLines && contentLines.length > 20) {
    return contentLines.length > 150 
      ? contentLines.substring(0, 147) + '...'
      : contentLines;
  }
  
  // Fallback: use full commentary as excerpt
  return commentary.length > 150 
    ? commentary.substring(0, 147) + '...'
    : commentary;
}

/**
 * Extract image URL from LinkedIn post content
 * @param {Object} content - The post content object
 * @returns {string|null} - Image URL or null
 */
function extractImageUrl(content) {
  try {
    // Check for media content
    if (content?.media?.length > 0) {
      const media = content.media[0];
      
      // Handle different media types
      if (media.media && media.media.digitalmediaAsset) {
        return media.media.digitalmediaAsset.downloadUrl;
      }
      
      if (media.thumbnails && media.thumbnails.length > 0) {
        return media.thumbnails[0].url;
      }
    }
    
    // Check for article content with images
    if (content?.article?.thumbnail) {
      return content.article.thumbnail;
    }
    
    return null;
  } catch (error) {
    console.warn('Error extracting image URL:', error);
    return null;
  }
}

/**
 * Obtiene el último post de una organización de LinkedIn usando Posts API 2025
 * @param {string} orgId - ID de la organización
 * @param {string} accessToken - Token de acceso OAuth
 * @returns {Object|null} - Datos del post o null si hay error
 */
export async function fetchLatestPost(orgId, accessToken) {
  try {
    // Usar el endpoint actualizado de Posts API
    const encodedOrgUrn = encodeURIComponent(`urn:li:organization:${orgId}`);
    const currentVersion = new Date().toISOString().slice(0, 7).replace('-', ''); // YYYYMM format
    
    const response = await fetch(
      `https://api.linkedin.com/rest/posts?author=${encodedOrgUrn}&q=author&count=1&sortBy=LAST_MODIFIED`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'X-Restli-Protocol-Version': '2.0.0',
          'LinkedIn-Version': currentVersion,
          'X-RestLi-Method': 'FINDER'
        }
      }
    );
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`LinkedIn API error: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    
    if (!data.elements || data.elements.length === 0) {
      throw new Error('No posts found');
    }
    
    const post = data.elements[0];
    
    // Extract post data
    const title = extractTitle(post.commentary);
    const excerpt = extractExcerpt(post.commentary);
    const imageUrl = extractImageUrl(post.content);
    
    return {
      title,
      excerpt,
      url: `https://www.linkedin.com/feed/update/${post.id}`,
      publishedAt: new Date(post.publishedAt).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      imageUrl,
      author: {
        name: 'Intertrade Solutions',
        profileUrl: 'https://www.linkedin.com/company/intertradesolutions'
      }
    };
    
  } catch (error) {
    console.error('Error fetching LinkedIn post:', error);
    throw error;
  }
}

/**
 * Fetch the latest post from LinkedIn organization using environment variables
 * @returns {Promise<Object>} - Latest post data
 */
export async function fetchLinkedInPost() {
  const orgId = import.meta.env.LINKEDIN_ORG_ID;
  const accessToken = import.meta.env.LINKEDIN_ACCESS_TOKEN;
  
  if (!orgId || !accessToken) {
    throw new Error('LinkedIn credentials not configured');
  }
  
  return await fetchLatestPost(orgId, accessToken);
}

/**
 * Fetch LinkedIn post with fallback handling
 * @returns {Promise<Object|null>} - Post data or null if failed
 */
export async function fetchLinkedInPostSafe() {
  try {
    return await fetchLinkedInPost();
  } catch (error) {
    console.warn('LinkedIn API unavailable, using fallback:', error.message);
    return null;
  }
}
