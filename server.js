
/**
 * Simple Backend Server for Password Vault
 * 
 * This server provides MySQL database connectivity for the Password Vault application.
 * It uses only built-in Node.js modules to avoid dependency issues.
 */

const http = require('http');
const url = require('url');
const { createPool } = require('mysql2/promise');

// Database Configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'admin',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'password_vault'
};

// Initialize MySQL connection pool
let pool;
try {
  pool = createPool(dbConfig);
  console.log('MySQL connection pool created');
} catch (error) {
  console.error('Failed to create MySQL connection pool:', error);
}

// Set up CORS headers
const setCorsHeaders = (res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Max-Age', '86400'); // 24 hours
};

// Parse request body as JSON
const parseJson = async (req) => {
  return new Promise((resolve, reject) => {
    if (req.method === 'GET' || req.method === 'OPTIONS') {
      return resolve({});
    }
    
    const chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => {
      if (chunks.length === 0) {
        return resolve({});
      }
      try {
        const body = JSON.parse(Buffer.concat(chunks).toString());
        resolve(body);
      } catch (error) {
        console.error('Error parsing JSON:', error);
        reject(error);
      }
    });
    req.on('error', reject);
  });
};

// Database operations
const dbOperations = {
  // Check server and database status
  checkStatus: async () => {
    try {
      const connection = await pool.getConnection();
      connection.release();
      return { status: 'connected', message: 'Database connection successful' };
    } catch (error) {
      console.error('Database connection error:', error);
      return { status: 'error', message: `Database connection failed: ${error.message}` };
    }
  },
  
  // Execute a raw SQL query
  executeQuery: async (sql, params = []) => {
    try {
      const [results] = await pool.execute(sql, params);
      return results;
    } catch (error) {
      console.error('SQL query error:', error);
      throw error;
    }
  },
  
  // Get users
  getUsers: async () => {
    return await dbOperations.executeQuery('SELECT * FROM users');
  },
  
  // Get passwords
  getPasswords: async () => {
    return await dbOperations.executeQuery('SELECT * FROM passwords');
  },
  
  // Get categories
  getCategories: async () => {
    return await dbOperations.executeQuery('SELECT * FROM categories');
  },
  
  // Add more database operations as needed...
};

// API routes
const routes = {
  '/api/status': async (req, res) => {
    const status = await dbOperations.checkStatus();
    return status;
  },
  
  '/api/users': async (req, res) => {
    if (req.method === 'GET') {
      return await dbOperations.getUsers();
    }
    // Implement POST, PUT, DELETE...
    return { error: 'Method not implemented' };
  },
  
  '/api/passwords': async (req, res) => {
    if (req.method === 'GET') {
      return await dbOperations.getPasswords();
    }
    // Implement POST, PUT, DELETE...
    return { error: 'Method not implemented' };
  },
  
  '/api/categories': async (req, res) => {
    if (req.method === 'GET') {
      return await dbOperations.getCategories();
    }
    // Implement POST, PUT, DELETE...
    return { error: 'Method not implemented' };
  },
  
  // Add more routes as needed...
};

// Create HTTP server
const server = http.createServer(async (req, res) => {
  // Set CORS headers for all responses
  setCorsHeaders(res);
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }
  
  try {
    // Parse URL and extract pathname
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    
    // Check if route exists
    if (routes[pathname]) {
      // Parse request body for non-GET requests
      const body = await parseJson(req).catch(() => ({}));
      
      // Call route handler
      const data = await routes[pathname](req, res);
      
      // Return JSON response
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(data));
    } else {
      // Route not found
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Not found' }));
    }
  } catch (error) {
    console.error('Server error:', error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: error.message }));
  }
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Database config: ${JSON.stringify({
    host: dbConfig.host,
    port: dbConfig.port,
    user: dbConfig.user,
    database: dbConfig.database
  })}`);
});
