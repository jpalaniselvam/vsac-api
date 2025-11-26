# VSAC Utility SDK

Node.js SDK for interacting with VSAC (Value Set Authority Center) Endpoints.

## Installation

```bash
npm install vsac-api
```

## Features

- ✅ **TypeScript First**: Full TypeScript implementation with comprehensive type definitions
- ✅ **Built using Node.js built-in `http`/`https` client** (no external HTTP dependencies)
- ✅ **Automatic XML to JSON conversion** using `fast-xml-parser`
- ✅ **All responses returned in JSON format**
- ✅ **Promise-based API**
- ✅ **Comprehensive error handling**
- ✅ **Full IntelliSense support** with TypeScript types

## Usage

### Initialize the SDK

```javascript
import { UtilitySDK } from 'vsac-api';

const sdk = new UtilitySDK({
  baseURL: 'https://vsac.nlm.nih.gov'
});
```

### API Methods

#### Get All Programs

```javascript
const programs = await sdk.getPrograms();
// Returns: { Program: [{ name: "...", description: "..." }, ...] }
```

#### Get Program Details

```javascript
const program = await sdk.getProgram('CMS FHIR® eCQM');
// Returns: { name: "...", description: "...", release: [...] }
```

#### Get Programs for OID

```javascript
const oidPrograms = await sdk.getOidPrograms('2.16.840.1.114222.4.11.836');
// Returns: { Program: [{ name: "...", description: "..." }, ...] }
```

#### Get OID Program Details

```javascript
const oidProgram = await sdk.getOidProgram(
  '2.16.840.1.114222.4.11.836',
  'CMS Pre-rulemaking eCQM'
);
// Returns: { name: "...", description: "...", release: [...] }
```

#### Get OID Versions

```javascript
const versions = await sdk.getOidVersions('2.16.840.1.114222.4.11.836');
// Returns: { VersionList: { _oid: '...', version: [...] } }
// Note: XML response automatically converted to JSON
```

#### Get All Profiles

```javascript
const profiles = await sdk.getProfiles();
// Returns: { ProfileList: { profile: [...] } }
// Note: XML response automatically converted to JSON
```

#### Get Latest Profile for Program

```javascript
const latestProfile = await sdk.getProgramLatestProfile('CMS eCQM');
// Returns: { name: "...", requestTime: "..." }
```

#### Get Tag Names

```javascript
const tagNames = await sdk.getTagNames();
// Returns: { tagNames: { name: [...] } }
// Note: XML response automatically converted to JSON
```

#### Get Tag Values

```javascript
const tagValues = await sdk.getTagValues('CMS eMeasure ID');
// Returns: { tagValues: { _tagName: '...', value: [...] } }
// Note: XML response automatically converted to JSON
```

## Complete Example

```javascript
import { UtilitySDK } from 'vsac-api';

async function main() {
  const sdk = new UtilitySDK({
    baseURL: 'https://vsac.nlm.nih.gov'
  });

  try {
    // Get all programs
    const programs = await sdk.getPrograms();
    console.log('Programs:', programs);

    // Get specific program
    const program = await sdk.getProgram('CMS FHIR® eCQM');
    console.log('Program details:', program);

    // Get versions for an OID (XML automatically converted to JSON)
    const versions = await sdk.getOidVersions('2.16.840.1.114222.4.11.836');
    console.log('Versions:', versions);

  } catch (error) {
    console.error('Error:', error.message);
  }
}

main();
```

## Error Handling

The SDK provides clear error messages for common scenarios:

```javascript
try {
  const program = await sdk.getProgram('Invalid Program');
} catch (error) {
  console.error(error.message);
  // Possible errors:
  // - "Program name is required"
  // - "HTTP 404: Not Found"
  // - "Request failed: ..."
  // - "Failed to parse response: ..."
}
```

## Configuration

### Constructor Options

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `baseURL` | string | Yes | Base URL for the VSAC API (e.g., 'https://vsac.nlm.nih.gov') |

## XML to JSON Conversion

All XML responses are automatically converted to JSON format using `fast-xml-parser` with the following configuration:

- Attributes are prefixed with `@_`
- Text nodes are named `#text`
- Attribute values are parsed to their appropriate types
- XML declaration is ignored

Example XML:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<VersionList oid="2.16.840.1.114222.4.11.836">
    <version>Latest</version>
    <version>eCQM Update 2025-05-08</version>
</VersionList>
```

Converted JSON:
```json
{
  "VersionList": {
    "_oid": "2.16.840.1.114222.4.11.836",
    "version": [
      "Latest",
      "eCQM Update 2025-05-08"
    ]
  }
}
```

## Testing

This project includes comprehensive E2E integration tests that make real API calls to VSAC.

### Quick Start

```bash
# Install dependencies
npm install

# Create .env file with your API key
cp env.example .env

# Run all E2E tests
npm run test:e2e

# Run tests in watch mode
npm run test:e2e:watch

# Open Vitest UI
npm run test:e2e:ui
```

## API Reference

See the [Utility Endpoints Documentation](./docs/UtilityEndpoints.md) for detailed information about each endpoint.

## License

Apache 2.0

## Author

Jeyamurugan Palaniselvam
