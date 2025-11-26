import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env file
config({ path: resolve(process.cwd(), '.env') });

// Log test environment info
console.log('\n Vitest E2E Test Environment');
console.log(`Base URL: ${process.env.VSAC_BASE_URL || 'https://vsac.nlm.nih.gov'}`);
console.log(`API Key: ${process.env.VSAC_API_KEY ? '***configured***' : 'not set'}`);
