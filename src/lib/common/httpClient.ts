import http from 'node:http';
import https from 'node:https';
import { XmlParser } from './xmlParser.js';
import type { RequestOptions } from '../models/util.js';

/**
 * HTTP Client utility for making API requests
 */
export class HttpClient {
    private baseURL: string;
    private xmlParser: XmlParser;

    constructor(baseURL: string) {
        this.baseURL = baseURL;
        this.xmlParser = new XmlParser();
    }

    /**
     * Make an HTTP GET request
     * @param path - API endpoint path
     * @param options - Additional request options
     * @returns Response data in JSON format
     */
    async get(path: string, options: RequestOptions = {}): Promise<unknown> {
        const url = new URL(path, this.baseURL);
        const protocol = url.protocol === 'https:' ? https : http;

        return new Promise((resolve, reject) => {
            const requestOptions: http.RequestOptions = {
                hostname: url.hostname,
                port: url.port,
                path: url.pathname + url.search,
                method: 'GET',
                headers: {
                    'Accept': 'application/json, application/xml, text/xml',
                    ...options.headers,
                },
            };

            const req = protocol.request(requestOptions, (res: http.IncomingMessage) => {
                let data = '';

                res.on('data', (chunk: Buffer) => {
                    data += chunk;
                });

                res.on('end', () => {
                    try {
                        if (!res.statusCode || res.statusCode < 200 || res.statusCode >= 300) {
                            reject(new Error(`HTTP ${res.statusCode}: ${data}`));
                            return;
                        }

                        const contentType = res.headers['content-type'] || '';

                        let parsedData: unknown;
                        if (contentType.includes('application/json')) {
                            parsedData = JSON.parse(data);
                        } else if (contentType.includes('xml') || data.trim().startsWith('<?xml')) {
                            parsedData = this.xmlParser.parse(data);
                        } else {
                            try {
                                parsedData = JSON.parse(data);
                            } catch {
                                parsedData = this.xmlParser.parse(data);
                            }
                        }

                        resolve(parsedData);
                    } catch (error) {
                        const message = error instanceof Error ? error.message : 'Unknown error';
                        reject(new Error(`Failed to parse response: ${message}`));
                    }
                });
            });

            req.on('error', (error: Error) => {
                reject(new Error(`Request failed: ${error.message}`));
            });

            if (options.timeout) {
                req.setTimeout(options.timeout, () => {
                    req.destroy();
                    reject(new Error('Request timeout'));
                });
            }

            req.end();
        });
    }
}
