import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';

/**
 * Cache interface for storing and retrieving data
 */
export interface Cache {
    /**
     * Get a value from the cache
     * @param key - Cache key
     * @returns Cached value or null if not found or expired
     */
    get(key: string): Promise<unknown | null>;

    /**
     * Set a value in the cache
     * @param key - Cache key
     * @param value - Value to cache
     * @param ttl - Time to live in milliseconds (optional)
     */
    set(key: string, value: unknown, ttl?: number): Promise<void>;
}

/**
 * File-based cache implementation
 * Stores cache entries as files with expiration timestamp in the filename
 * Format: <hash>.<expiration_timestamp>.json
 */
export class FileCache implements Cache {
    private cacheDir: string;
    private defaultTTL: number;

    /**
     * Create a new FileCache
     * @param cacheDir - Directory to store cache files
     * @param defaultTTL - Default time to live in milliseconds (default: 1 hour)
     */
    constructor(cacheDir: string, defaultTTL: number = 3600000) {
        this.cacheDir = cacheDir;
        this.defaultTTL = defaultTTL;
        this.ensureCacheDir();
    }

    /**
     * Ensure the cache directory exists
     */
    private async ensureCacheDir(): Promise<void> {
        try {
            await fs.mkdir(this.cacheDir, { recursive: true });
        } catch (error) {
            // Ignore error if directory already exists
        }
    }

    /**
     * Generate a hash for the cache key
     */
    private getHash(key: string): string {
        return crypto.createHash('md5').update(key).digest('hex');
    }

    /**
     * Get a value from the cache
     */
    async get(key: string): Promise<unknown | null> {
        const hash = this.getHash(key);

        try {
            const files = await fs.readdir(this.cacheDir);
            const cacheFile = files.find(file => file.startsWith(hash) && file.endsWith('.json'));

            if (!cacheFile) {
                return null;
            }

            // Parse expiration timestamp from filename
            // Format: <hash>.<expiration_timestamp>.json
            const parts = cacheFile.split('.');
            if (parts.length < 3) {
                return null; // Invalid filename format
            }

            const expirationTimestamp = parts[1];
            if (!expirationTimestamp) {
                return null; // Missing expiration timestamp
            }

            const expirationTime = parseInt(expirationTimestamp, 10);
            if (Date.now() > expirationTime) {
                // Cache expired, delete file
                await fs.unlink(path.join(this.cacheDir, cacheFile));
                return null;
            }

            // Cache valid, read file
            const content = await fs.readFile(path.join(this.cacheDir, cacheFile), 'utf-8');
            return JSON.parse(content);
        } catch (error) {
            return null;
        }
    }

    /**
     * Set a value in the cache
     */
    async set(key: string, value: unknown, ttl?: number): Promise<void> {
        const hash = this.getHash(key);
        const expirationTime = Date.now() + (ttl || this.defaultTTL);
        const filename = `${hash}.${expirationTime}.json`;
        const filePath = path.join(this.cacheDir, filename);

        try {
            // Remove any existing cache files for this key
            const files = await fs.readdir(this.cacheDir);
            const existingFiles = files.filter(file => file.startsWith(hash) && file.endsWith('.json'));

            await Promise.all(existingFiles.map(file => fs.unlink(path.join(this.cacheDir, file))));

            // Write new cache file
            await fs.writeFile(filePath, JSON.stringify(value), 'utf-8');
        } catch (error) {
            // Ignore write errors
        }
    }
}
