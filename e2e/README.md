# E2E Integration Tests

This directory contains end-to-end integration tests for the VSAC API SDK. These tests make **real HTTP calls** to the VSAC API endpoints.

## 📋 Prerequisites

1. **Network Connection**: Tests require internet access to reach VSAC API
2. **API Key** (if required): Some endpoints may require authentication
3. **Node.js**: Version 18 or higher

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the project root:

```bash
cp env.example .env
```

Edit `.env` and add your configuration:

```env
VSAC_BASE_URL=https://vsac.nlm.nih.gov
VSAC_API_KEY=your-api-key-here
```

> **Note**: Get your API key from [UTS (UMLS Terminology Services)](https://uts.nlm.nih.gov/uts/)

### 3. Run Tests

```bash
# Run all E2E tests
npm run test:e2e

# Run tests in watch mode
npm run test:e2e:watch

# Run tests with UI
npm run test:e2e:ui

# Run a specific test file
npm run test:e2e -- utility-sdk.test.ts

# Run a specific test by name
npm run test:e2e -- -t "should get all programs"
```

## 🔧 Test Configuration

Tests are configured in `vitest.config.ts`:

- **Timeout**: 30 seconds per test (API calls can be slow)
- **Environment**: Node.js
- **Reporter**: Verbose output
- **Coverage**: V8 provider with HTML/JSON reports

## 📊 Viewing Test Results

### Console Output

Tests provide detailed console output including:
- Number of items returned (programs, versions, etc.)
- Specific values retrieved
- Pass/fail status for each test

### Coverage Reports

Generate coverage reports:

```bash
npm run test:e2e -- --coverage
```

View HTML coverage report:
```bash
# Windows
start coverage/index.html

# macOS
open coverage/index.html

# Linux
xdg-open coverage/index.html
```
