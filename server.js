/**
 * LastMile Deployment Platform - API Server
 * Handles deployment requests and status tracking
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

// In-memory storage (replace with database in production)
const deployments = new Map();
const apiKeys = new Map();

// Initialize demo API key
apiKeys.set('demo_api_key_12345', {
  name: 'Demo Account',
  tier: 'free',
  rateLimit: 100
});

// Middleware: API Key Authentication
function authenticateAPIKey(req, res, next) {
  const apiKey = req.headers['x-api-key'];
  
  if (!apiKey) {
    return res.status(401).json({
      error: 'API key is required',
      message: 'Please provide an API key in the X-API-Key header'
    });
  }

  const keyData = apiKeys.get(apiKey);
  if (!keyData) {
    return res.status(401).json({
      error: 'Invalid API key',
      message: 'The provided API key is not valid'
    });
  }

  req.apiKeyData = keyData;
  next();
}

// Helper: Generate deployment ID
function generateDeploymentId() {
  return 'dep_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
}

// Helper: Simulate deployment process
async function simulateDeployment(deploymentId) {
  const deployment = deployments.get(deploymentId);
  if (!deployment) return;

  // Simulate deployment stages
  const stages = ['building', 'testing', 'deploying', 'completed'];
  
  for (const stage of stages) {
    await new Promise(resolve => setTimeout(resolve, 2000));
    deployment.status = stage;
    deployment.updatedAt = new Date().toISOString();
    
    if (stage === 'completed') {
      deployment.url = `https://${deployment.projectName}.lastmile.app`;
    }
  }
}

// Routes

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Validate API key
app.post('/v1/validate', authenticateAPIKey, (req, res) => {
  res.json({
    valid: true,
    account: req.apiKeyData.name,
    tier: req.apiKeyData.tier
  });
});

// Create deployment
app.post('/v1/deploy', authenticateAPIKey, async (req, res) => {
  try {
    const { code, projectName, framework, environment, config } = req.body;

    // Validation
    if (!code || !projectName) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Both code and projectName are required'
      });
    }

    // Create deployment
    const deploymentId = generateDeploymentId();
    const deployment = {
      deploymentId,
      projectName,
      framework: framework || 'auto-detect',
      environment: environment || {},
      config: config || {},
      status: 'queued',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      url: null,
      logs: []
    };

    deployments.set(deploymentId, deployment);

    // Start async deployment process
    simulateDeployment(deploymentId).catch(err => {
      console.error('Deployment error:', err);
      const dep = deployments.get(deploymentId);
      if (dep) {
        dep.status = 'failed';
        dep.error = err.message;
      }
    });

    // Return immediate response
    res.status(201).json({
      deploymentId,
      projectName,
      status: 'queued',
      message: 'Deployment initiated successfully',
      createdAt: deployment.createdAt,
      url: null
    });
  } catch (error) {
    console.error('Deploy error:', error);
    res.status(500).json({
      error: 'Deployment failed',
      message: error.message
    });
  }
});

// Get deployment status
app.get('/v1/deployments/:deploymentId', authenticateAPIKey, (req, res) => {
  try {
    const { deploymentId } = req.params;
    const deployment = deployments.get(deploymentId);

    if (!deployment) {
      return res.status(404).json({
        error: 'Deployment not found',
        message: `No deployment found with ID: ${deploymentId}`
      });
    }

    res.json({
      deploymentId: deployment.deploymentId,
      projectName: deployment.projectName,
      framework: deployment.framework,
      status: deployment.status,
      url: deployment.url,
      createdAt: deployment.createdAt,
      updatedAt: deployment.updatedAt,
      logs: deployment.logs,
      error: deployment.error
    });
  } catch (error) {
    console.error('Get status error:', error);
    res.status(500).json({
      error: 'Failed to retrieve deployment status',
      message: error.message
    });
  }
});

// List deployments
app.get('/v1/deployments', authenticateAPIKey, (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const offset = parseInt(req.query.offset) || 0;

    const allDeployments = Array.from(deployments.values())
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(offset, offset + limit)
      .map(d => ({
        deploymentId: d.deploymentId,
        projectName: d.projectName,
        framework: d.framework,
        status: d.status,
        url: d.url,
        createdAt: d.createdAt,
        updatedAt: d.updatedAt
      }));

    res.json({
      deployments: allDeployments,
      total: deployments.size,
      limit,
      offset
    });
  } catch (error) {
    console.error('List deployments error:', error);
    res.status(500).json({
      error: 'Failed to list deployments',
      message: error.message
    });
  }
});

// Delete deployment
app.delete('/v1/deployments/:deploymentId', authenticateAPIKey, (req, res) => {
  try {
    const { deploymentId } = req.params;
    const deployment = deployments.get(deploymentId);

    if (!deployment) {
      return res.status(404).json({
        error: 'Deployment not found',
        message: `No deployment found with ID: ${deploymentId}`
      });
    }

    deployments.delete(deploymentId);

    res.json({
      message: 'Deployment deleted successfully',
      deploymentId
    });
  } catch (error) {
    console.error('Delete deployment error:', error);
    res.status(500).json({
      error: 'Failed to delete deployment',
      message: error.message
    });
  }
});

// Get deployment logs
app.get('/v1/deployments/:deploymentId/logs', authenticateAPIKey, (req, res) => {
  try {
    const { deploymentId } = req.params;
    const deployment = deployments.get(deploymentId);

    if (!deployment) {
      return res.status(404).json({
        error: 'Deployment not found',
        message: `No deployment found with ID: ${deploymentId}`
      });
    }

    res.json({
      deploymentId,
      logs: deployment.logs || []
    });
  } catch (error) {
    console.error('Get logs error:', error);
    res.status(500).json({
      error: 'Failed to retrieve logs',
      message: error.message
    });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not found',
    message: `Route ${req.method} ${req.path} not found`
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║   🚀 LastMile Deployment Platform API Server         ║
║                                                       ║
║   Status: Running                                     ║
║   Port: ${PORT}                                        ║
║   Environment: ${process.env.NODE_ENV || 'development'}                              ║
║                                                       ║
║   API Endpoints:                                      ║
║   - POST   /v1/deploy                                 ║
║   - GET    /v1/deployments/:id                        ║
║   - GET    /v1/deployments                            ║
║   - DELETE /v1/deployments/:id                        ║
║   - POST   /v1/validate                               ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

module.exports = app;
