import express from 'express';
import path from 'path';
import fs from 'fs';
import mime from 'mime-types'; // Make sure to install: npm install mime-types

/**
 * Advanced handler for Vite-built frontend apps with Express
 * Resolves MIME type issues with module scripts and other assets
 */
export const setupViteFrontends = (app, options) => {
  const {
    userDistPath = 'user_dist',
    adminDistPath = 'admin_dist',
    adminPathPrefix = '/admin',
    rootDir = process.cwd()
  } = options || {};
  
  // Full paths
  const userDistFullPath = path.join(rootDir, userDistPath);
  const adminDistFullPath = path.join(rootDir, adminDistPath);
  
  // Verify paths exist
  const verifyPaths = () => {
    if (!fs.existsSync(userDistFullPath)) {
      console.warn(`⚠️ WARNING: User frontend path not found: ${userDistFullPath}`);
    }
    if (!fs.existsSync(adminDistFullPath)) {
      console.warn(`⚠️ WARNING: Admin frontend path not found: ${adminDistFullPath}`);
    }
  };
  
  // Function to determine MIME type with better handling
  const getMimeType = (filePath) => {
    // Force specific MIME types for critical file types
    if (filePath.endsWith('.js') || filePath.endsWith('.mjs')) {
      return 'application/javascript';
    }
    if (filePath.endsWith('.css')) {
      return 'text/css';
    }
    if (filePath.endsWith('.html')) {
      return 'text/html';
    }
    if (filePath.endsWith('.svg')) {
      return 'image/svg+xml';
    }
    if (filePath.endsWith('.json')) {
      return 'application/json';
    }
    
    // For other types, use mime-types library
    return mime.lookup(filePath) || 'application/octet-stream';
  };
  
  // Direct file serving with correct MIME types
  const serveFile = (req, res, filePath, fallbackToIndex = false) => {
    if (fs.existsSync(filePath)) {
      const mimeType = getMimeType(filePath);
      res.set('Content-Type', mimeType);
      res.sendFile(filePath);
    } else if (fallbackToIndex) {
      // For SPA - send the index.html for non-existing files
      const indexPath = path.join(path.dirname(filePath), 'index.html');
      if (fs.existsSync(indexPath)) {
        res.set('Content-Type', 'text/html');
        res.sendFile(indexPath);
      } else {
        res.status(404).send('Not found');
      }
    } else {
      res.status(404).send('Not found');
    }
  };
  
  // Handle specific paths for static assets
  const handleAssets = (distPath, urlPrefix) => {
    // Assets route handler with explicit MIME typing
    app.get(`${urlPrefix}/assets/*`, (req, res) => {
      // Extract the asset path from the URL
      const assetPath = req.path.substring(`${urlPrefix}/assets/`.length);
      const fullAssetPath = path.join(distPath, 'assets', assetPath);
      
      serveFile(req, res, fullAssetPath);
    });
    
    // Handle other static files in the dist directory
    app.get(`${urlPrefix}/*`, (req, res, next) => {
      // Skip for API routes
      if (req.path.startsWith('/api/')) {
        return next();
      }
      
      // Extract the file path from the URL
      const filePath = req.path.substring(urlPrefix.length) || '/';
      const fullPath = path.join(distPath, filePath);
      
      // If path ends with / or has no extension, try to serve index.html
      if (filePath.endsWith('/') || !path.extname(filePath)) {
        const indexPath = path.join(distPath, filePath, 'index.html');
        if (fs.existsSync(indexPath)) {
          return serveFile(req, res, indexPath);
        }
      }
      
      // Serve the specific file, falling back to index.html for SPA routing
      serveFile(req, res, fullPath, true);
    });
  };
  
  // Initialize and verify
  verifyPaths();
  
  // Setup admin frontend (at /admin)
  handleAssets(adminDistFullPath, adminPathPrefix);
  
  // Setup user frontend (at root)
  handleAssets(userDistFullPath, '');
  
  // Fallback route for SPA - MUST be the last route
  app.get('*', (req, res) => {
    // Skip for API routes
    if (req.path.startsWith('/api/')) {
      return res.status(404).json({ error: 'API endpoint not found' });
    }
    
    // Check if this is an admin route
    if (req.path.startsWith(adminPathPrefix)) {
      const indexPath = path.join(adminDistFullPath, 'index.html');
      if (fs.existsSync(indexPath)) {
        return serveFile(req, res, indexPath);
      }
    }
    
    // Default to the user frontend
    const indexPath = path.join(userDistFullPath, 'index.html');
    if (fs.existsSync(indexPath)) {
      return serveFile(req, res, indexPath);
    }
    
    // If no frontends are available
    res.status(404).send('Not found');
  });
  
  console.log(`✅ Frontend handler configured:`);
  console.log(`   📁 User frontend: ${userDistFullPath}`);
  console.log(`   📁 Admin frontend: ${adminDistFullPath} (available at ${adminPathPrefix})`);
};