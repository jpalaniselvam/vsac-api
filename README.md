# VSAC API SDK

A modern, type-safe Node.js SDK for interacting with the National Library of Medicine's Value Set Authority Center (VSAC) APIs.

## Installation

```bash
npm install @cql-labs/vsac-api
```

## Features

- **TypeScript First**: Full TypeScript implementation with comprehensive type definitions
- **Zero External Runtime Dependencies**: Built using standard Web API (`fetch`) for maximum compatibility
- **Cross-Platform**: Works in Node.js, Bun, and Deno
- **Automatic XML to JSON**: Seamlessly handles VSAC's XML responses by converting them to typed JSON objects
- **Caching**: Built-in support for caching strategies (memory, file based) to reduce API calls

## Quick Start

```typescript
import { SVSClient, UtilityClient } from '@cql-labs/vsac-api';

// Initialize the SVS Client
const svs = new SVSClient({
  baseURL: 'https://vsac.nlm.nih.gov/vsac/svs',
  apiKey: process.env.UMLS_API_KEY
});

// Initialize the Utility Client
const utility = new UtilityClient('https://vsac.nlm.nih.gov');

// Fetch a Value Set
const valueSet = await svs.retrieveValueSet('2.16.840.1.114222.4.11.837');
console.log(valueSet.displayName);
```

## Examples

We have provided comprehensive examples in the `examples/` directory to help you get started:

- **[SVS Examples](./examples/svs-examples.ts)**: Demonstrates retrieving Value Sets, searching by tags, and handling metadata.
- **[Utility Examples](./examples/utility-examples.ts)**: Shows how to query programs, releases, and profiles.

To run the examples locally:

1. Clone the repository
2. Install dependencies: `npm install`
3. Set your `UMLS_API_KEY` in a `.env` file
4. Run an example:

   ```bash
   # Run with Bun
   bun run examples/svs-examples.ts

   # Or with Node (using tsx or similar)
   npx tsx examples/svs-examples.ts
   ```

## API Documentation & Reference

### Bruno API Collections

We use [Bruno](https://www.usebruno.com/) for documenting and testing VSAC API endpoints. You can find the collections in the `reference/` directory.

To use them:

1. Download and install **Bruno**.
2. Open Bruno and select **Open Collection**.
3. Navigate to the `reference/SVS` directory in this repository.
4. You can now explore and test the VSAC APIs directly.

## Contributing

We welcome contributions! Please follow these steps to contribute:

1. **Fork the repository** on GitHub.
2. **Clone your fork** locally.
3. **Install dependencies**: `npm install`.
4. **Create a branch** for your feature or fix.
5. **Make your changes**. Ensure you follow the coding style (Prettier).
6. **Run tests**:
   ```bash
   npm test          # Run unit tests
   npm run test:e2e  # Run end-to-end tests (requires API key)
   ```
7. **Refactor & Format**: `npm run format`.
8. **Push** your branch and submit a **Pull Request**.

## License

Apache 2.0

## Author

Jeyamurugan Palaniselvam
