/**
 * LastMile Deployment Platform SDK
 * Embeddable JavaScript SDK for deploying AI-generated code to production
 * @version 1.0.0
 */

(function(window) {
  'use strict';

  /**
   * LastMile SDK Constructor
   * @param {Object} config - Configuration options
   * @param {string} config.apiKey - Your LastMile API key
   * @param {string} config.apiUrl - API endpoint URL (optional)
   * @param {boolean} config.debug - Enable debug logging (optional)
   */
  function LastMile(config) {
    if (!config || !config.apiKey) {
      throw new Error('LastMile SDK requires an API key');
    }

    this.config = {
      apiKey: config.apiKey,
      apiUrl: config.apiUrl || 'https://api.lastmile.dev',
      debug: config.debug || false,
      timeout: config.timeout || 30000
    };

    this.deploymentStatus = null;
    this.eventListeners = {};
    
    this._log('LastMile SDK initialized');
  }

  /**
   * Internal logging method
   * @private
   */
  LastMile.prototype._log = function(message, data) {
    if (this.config.debug) {
      console.log('[LastMile]', message, data || '');
    }
  };

  /**
   * Internal error logging method
   * @private
   */
  LastMile.prototype._error = function(message, error) {
    console.error('[LastMile Error]', message, error || '');
  };

  /**
   * Make API request
   * @private
   */
  LastMile.prototype._request = function(endpoint, options) {
    const url = this.config.apiUrl + endpoint;
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': this.config.apiKey
      }
    };

    const fetchOptions = Object.assign({}, defaultOptions, options);
    
    this._log('Making request to:', url);

    return fetch(url, fetchOptions)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        return response.json();
      })
      .catch(error => {
        this._error('Request failed:', error);
        throw error;
      });
  };

  /**
   * Deploy code to production
   * @param {Object} deployment - Deployment configuration
   * @param {string} deployment.code - The code to deploy
   * @param {string} deployment.projectName - Name of the project
   * @param {string} deployment.framework - Framework type (react, vue, node, etc.)
   * @param {Object} deployment.environment - Environment variables (optional)
   * @param {Object} deployment.config - Additional configuration (optional)
   * @returns {Promise<Object>} Deployment result
   */
  LastMile.prototype.deploy = function(deployment) {
    if (!deployment || !deployment.code) {
      return Promise.reject(new Error('Deployment requires code'));
    }

    if (!deployment.projectName) {
      return Promise.reject(new Error('Deployment requires a project name'));
    }

    this._log('Starting deployment:', deployment.projectName);
    this._emit('deployStart', { projectName: deployment.projectName });

    const payload = {
      code: deployment.code,
      projectName: deployment.projectName,
      framework: deployment.framework || 'auto-detect',
      environment: deployment.environment || {},
      config: deployment.config || {},
      timestamp: new Date().toISOString()
    };

    return this._request('/v1/deploy', {
      method: 'POST',
      body: JSON.stringify(payload)
    })
      .then(result => {
        this._log('Deployment successful:', result);
        this.deploymentStatus = result;
        this._emit('deploySuccess', result);
        return result;
      })
      .catch(error => {
        this._error('Deployment failed:', error);
        this._emit('deployError', { error: error.message });
        throw error;
      });
  };

  /**
   * Get deployment status
   * @param {string} deploymentId - The deployment ID
   * @returns {Promise<Object>} Deployment status
   */
  LastMile.prototype.getStatus = function(deploymentId) {
    if (!deploymentId) {
      return Promise.reject(new Error('Deployment ID is required'));
    }

    this._log('Checking status for:', deploymentId);

    return this._request(`/v1/deployments/${deploymentId}`, {
      method: 'GET'
    })
      .then(result => {
        this._log('Status retrieved:', result);
        this._emit('statusUpdate', result);
        return result;
      })
      .catch(error => {
        this._error('Status check failed:', error);
        throw error;
      });
  };

  /**
   * Poll deployment status until complete
   * @param {string} deploymentId - The deployment ID
   * @param {number} interval - Polling interval in ms (default: 2000)
   * @returns {Promise<Object>} Final deployment status
   */
  LastMile.prototype.pollStatus = function(deploymentId, interval) {
    interval = interval || 2000;
    const maxAttempts = 150; // 5 minutes max
    let attempts = 0;

    const poll = (resolve, reject) => {
      this.getStatus(deploymentId)
        .then(result => {
          attempts++;
          
          if (result.status === 'completed' || result.status === 'failed') {
            resolve(result);
          } else if (attempts >= maxAttempts) {
            reject(new Error('Polling timeout'));
          } else {
            setTimeout(() => poll(resolve, reject), interval);
          }
        })
        .catch(reject);
    };

    return new Promise(poll);
  };

  /**
   * List all deployments
   * @param {Object} options - Query options
   * @param {number} options.limit - Max number of results
   * @param {number} options.offset - Pagination offset
   * @returns {Promise<Array>} List of deployments
   */
  LastMile.prototype.listDeployments = function(options) {
    options = options || {};
    const params = new URLSearchParams({
      limit: options.limit || 20,
      offset: options.offset || 0
    });

    this._log('Listing deployments');

    return this._request(`/v1/deployments?${params}`, {
      method: 'GET'
    })
      .then(result => {
        this._log('Deployments retrieved:', result);
        return result;
      })
      .catch(error => {
        this._error('List deployments failed:', error);
        throw error;
      });
  };

  /**
   * Delete a deployment
   * @param {string} deploymentId - The deployment ID
   * @returns {Promise<Object>} Deletion result
   */
  LastMile.prototype.deleteDeployment = function(deploymentId) {
    if (!deploymentId) {
      return Promise.reject(new Error('Deployment ID is required'));
    }

    this._log('Deleting deployment:', deploymentId);

    return this._request(`/v1/deployments/${deploymentId}`, {
      method: 'DELETE'
    })
      .then(result => {
        this._log('Deployment deleted:', result);
        this._emit('deploymentDeleted', { deploymentId });
        return result;
      })
      .catch(error => {
        this._error('Delete deployment failed:', error);
        throw error;
      });
  };

  /**
   * Add event listener
   * @param {string} event - Event name
   * @param {Function} callback - Callback function
   */
  LastMile.prototype.on = function(event, callback) {
    if (!this.eventListeners[event]) {
      this.eventListeners[event] = [];
    }
    this.eventListeners[event].push(callback);
    this._log('Event listener added:', event);
  };

  /**
   * Remove event listener
   * @param {string} event - Event name
   * @param {Function} callback - Callback function
   */
  LastMile.prototype.off = function(event, callback) {
    if (!this.eventListeners[event]) return;
    
    if (callback) {
      this.eventListeners[event] = this.eventListeners[event].filter(
        cb => cb !== callback
      );
    } else {
      this.eventListeners[event] = [];
    }
    this._log('Event listener removed:', event);
  };

  /**
   * Emit event
   * @private
   */
  LastMile.prototype._emit = function(event, data) {
    if (!this.eventListeners[event]) return;
    
    this.eventListeners[event].forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        this._error('Event callback error:', error);
      }
    });
  };

  /**
   * Validate configuration
   * @returns {Promise<Object>} Validation result
   */
  LastMile.prototype.validateConfig = function() {
    this._log('Validating configuration');

    return this._request('/v1/validate', {
      method: 'POST',
      body: JSON.stringify({
        apiKey: this.config.apiKey
      })
    })
      .then(result => {
        this._log('Configuration valid:', result);
        return result;
      })
      .catch(error => {
        this._error('Configuration validation failed:', error);
        throw error;
      });
  };

  /**
   * Get SDK version
   * @returns {string} SDK version
   */
  LastMile.prototype.getVersion = function() {
    return '1.0.0';
  };

  // Expose LastMile to global scope
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = LastMile;
  } else {
    window.LastMile = LastMile;
  }

})(typeof window !== 'undefined' ? window : this);
