/**
 * Central API configuration.
 * Set REACT_APP_API_URL in your .env file or deployment environment.
 * Development default: http://localhost:9898
 * Production example: https://your-backend.railway.app
 */
const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:9898";

export default API_BASE;
