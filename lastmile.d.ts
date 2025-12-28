/**
 * LastMile Deployment Platform SDK
 * TypeScript Type Definitions
 * @version 1.0.0
 */

declare module '@lastmile/deployment-sdk' {
  /**
   * Configuration options for LastMile SDK
   */
  export interface LastMileConfig {
    /**
     * Your LastMile API key (required)
     */
    apiKey: string;

    /**
     * API endpoint URL (optional)
     * @default 'https://api.lastmile.dev'
     */
    apiUrl?: string;

    /**
     * Enable debug logging (optional)
     * @default false
     */
    debug?: boolean;

    /**
     * Request timeout in milliseconds (optional)
     * @default 30000
     */
    timeout?: number;
  }

  /**
   * Deployment configuration
   */
  export interface DeploymentConfig {
    /**
     * The code to deploy (required)
     */
    code: string;

    /**
     * Name of the project (required)
     */
    projectName: string;

    /**
     * Framework type (optional)
     * @default 'auto-detect'
     */
    framework?: 'react' | 'vue' | 'angular' | 'node' | 'express' | 'next' | 'static' | 'auto-detect' | string;

    /**
     * Environment variables (optional)
     */
    environment?: Record<string, string>;

    /**
     * Additional configuration (optional)
     */
    config?: Record<string, any>;
  }

  /**
   * Deployment result
   */
  export interface DeploymentResult {
    /**
     * Unique deployment ID
     */
    deploymentId: string;

    /**
     * Project name
     */
    projectName: string;

    /**
     * Current deployment status
     */
    status: DeploymentStatus;

    /**
     * Deployment URL (null if not completed)
     */
    url: string | null;

    /**
     * Deployment creation timestamp
     */
    createdAt: string;

    /**
     * Last update timestamp
     */
    updatedAt?: string;

    /**
     * Success message
     */
    message?: string;

    /**
     * Error message (if failed)
     */
    error?: string;
  }

  /**
   * Deployment status values
   */
  export type DeploymentStatus = 
    | 'queued' 
    | 'building' 
    | 'testing' 
    | 'deploying' 
    | 'completed' 
    | 'failed';

  /**
   * Deployment status details
   */
  export interface DeploymentStatusDetail {
    /**
     * Deployment ID
     */
    deploymentId: string;

    /**
     * Project name
     */
    projectName: string;

    /**
     * Framework used
     */
    framework: string;

    /**
     * Current status
     */
    status: DeploymentStatus;

    /**
     * Deployment URL
     */
    url: string | null;

    /**
     * Creation timestamp
     */
    createdAt: string;

    /**
     * Last update timestamp
     */
    updatedAt: string;

    /**
     * Deployment logs
     */
    logs?: string[];

    /**
     * Error message (if failed)
     */
    error?: string;
  }

  /**
   * List deployments options
   */
  export interface ListDeploymentsOptions {
    /**
     * Maximum number of results
     * @default 20
     */
    limit?: number;

    /**
     * Pagination offset
     * @default 0
     */
    offset?: number;
  }

  /**
   * List deployments result
   */
  export interface ListDeploymentsResult {
    /**
     * Array of deployments
     */
    deployments: DeploymentStatusDetail[];

    /**
     * Total number of deployments
     */
    total: number;

    /**
     * Current limit
     */
    limit: number;

    /**
     * Current offset
     */
    offset: number;
  }

  /**
   * Validation result
   */
  export interface ValidationResult {
    /**
     * Whether the configuration is valid
     */
    valid: boolean;

    /**
     * Account name
     */
    account?: string;

    /**
     * Account tier
     */
    tier?: string;
  }

  /**
   * Event callback data for deployStart event
   */
  export interface DeployStartEventData {
    projectName: string;
  }

  /**
   * Event callback data for deploySuccess event
   */
  export interface DeploySuccessEventData extends DeploymentResult {}

  /**
   * Event callback data for deployError event
   */
  export interface DeployErrorEventData {
    error: string;
  }

  /**
   * Event callback data for statusUpdate event
   */
  export interface StatusUpdateEventData extends DeploymentStatusDetail {}

  /**
   * Event callback data for deploymentDeleted event
   */
  export interface DeploymentDeletedEventData {
    deploymentId: string;
  }

  /**
   * Event names
   */
  export type EventName = 
    | 'deployStart'
    | 'deploySuccess'
    | 'deployError'
    | 'statusUpdate'
    | 'deploymentDeleted';

  /**
   * Event callback functions
   */
  export type EventCallback<T = any> = (data: T) => void;

  /**
   * LastMile SDK Main Class
   */
  export class LastMile {
    /**
     * Current configuration
     */
    config: LastMileConfig;

    /**
     * Current deployment status (if any)
     */
    deploymentStatus: DeploymentResult | null;

    /**
     * Create a new LastMile SDK instance
     * @param config - Configuration options
     */
    constructor(config: LastMileConfig);

    /**
     * Deploy code to production
     * @param deployment - Deployment configuration
     * @returns Promise resolving to deployment result
     */
    deploy(deployment: DeploymentConfig): Promise<DeploymentResult>;

    /**
     * Get deployment status
     * @param deploymentId - The deployment ID
     * @returns Promise resolving to deployment status
     */
    getStatus(deploymentId: string): Promise<DeploymentStatusDetail>;

    /**
     * Poll deployment status until complete
     * @param deploymentId - The deployment ID
     * @param interval - Polling interval in ms (default: 2000)
     * @returns Promise resolving to final deployment status
     */
    pollStatus(deploymentId: string, interval?: number): Promise<DeploymentStatusDetail>;

    /**
     * List all deployments
     * @param options - Query options
     * @returns Promise resolving to list of deployments
     */
    listDeployments(options?: ListDeploymentsOptions): Promise<ListDeploymentsResult>;

    /**
     * Delete a deployment
     * @param deploymentId - The deployment ID
     * @returns Promise resolving to deletion result
     */
    deleteDeployment(deploymentId: string): Promise<{ message: string; deploymentId: string }>;

    /**
     * Add event listener
     * @param event - Event name
     * @param callback - Callback function
     */
    on(event: 'deployStart', callback: EventCallback<DeployStartEventData>): void;
    on(event: 'deploySuccess', callback: EventCallback<DeploySuccessEventData>): void;
    on(event: 'deployError', callback: EventCallback<DeployErrorEventData>): void;
    on(event: 'statusUpdate', callback: EventCallback<StatusUpdateEventData>): void;
    on(event: 'deploymentDeleted', callback: EventCallback<DeploymentDeletedEventData>): void;
    on(event: EventName, callback: EventCallback): void;

    /**
     * Remove event listener
     * @param event - Event name
     * @param callback - Callback function (optional - removes all if not provided)
     */
    off(event: EventName, callback?: EventCallback): void;

    /**
     * Validate configuration
     * @returns Promise resolving to validation result
     */
    validateConfig(): Promise<ValidationResult>;

    /**
     * Get SDK version
     * @returns SDK version string
     */
    getVersion(): string;
  }

  export default LastMile;
}

/**
 * Global LastMile for browser usage
 */
declare global {
  interface Window {
    LastMile: typeof import('@lastmile/deployment-sdk').LastMile;
  }
}
