// Utility functions for API

/**
 * Decode JWT token without verification (client-side only)
 * Returns the payload of the JWT token
 */
export const decodeJWT = (token: string): any => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
};

/**
 * Extract user info from JWT token
 */
export const getUserFromToken = (token: string): { id?: string; email?: string } => {
  const decoded = decodeJWT(token);
  if (!decoded) return {};
  
  return {
    id: decoded.id || decoded._id || decoded.userId,
    email: decoded.email,
  };
};

