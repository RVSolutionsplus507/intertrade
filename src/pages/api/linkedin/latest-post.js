import { fetchLinkedInPostSafe } from '../../../services/linkedin.js';

/**
 * API endpoint to fetch the latest LinkedIn post
 * GET /api/linkedin/latest-post
 */
export async function GET({ request }) {
  try {
    // Set CORS headers for client-side requests
    const headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Cache-Control': 'public, max-age=300' // Cache for 5 minutes
    };

    // Fetch the latest post
    const post = await fetchLinkedInPostSafe();
    
    if (post) {
      return new Response(JSON.stringify({
        success: true,
        data: post,
        timestamp: new Date().toISOString()
      }), {
        status: 200,
        headers
      });
    } else {
      // Return null when LinkedIn API is not available
      return new Response(JSON.stringify({
        success: false,
        data: null,
        message: 'LinkedIn API not available',
        timestamp: new Date().toISOString()
      }), {
        status: 200, // Still return 200 to avoid breaking the frontend
        headers
      });
    }
    
  } catch (error) {
    console.error('LinkedIn API endpoint error:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: 'Internal server error',
      message: error.message,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}

// Handle OPTIONS request for CORS preflight
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  });
}
