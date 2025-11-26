# Unit Tests

This directory contains unit tests for the VSAC API SDK. These tests focus on testing core logic without making real API calls.

## Running Tests

### Run all unit tests
```bash
npm test tests/
```

### Run specific test file
```bash
npm test tests/svsClient.test.ts
npm test tests/utilityClient.test.ts
npm test tests/xmlParser.test.ts
npm test tests/httpClient.test.ts
```

### Run tests in watch mode
```bash
npm test -- --watch tests/
```

### Run tests with coverage
```bash
npm run test:coverage
```

### Run tests with UI
```bash
npm test -- --ui tests/
```

## Test Philosophy

### Unit Tests vs E2E Tests

**Unit Tests** (this directory):
- Test individual functions and methods in isolation
- Mock external dependencies (HTTP calls, etc.)
- Fast execution (no network calls)
- Focus on logic, validation, and edge cases
- Can run without API credentials
- Run frequently during development

**E2E Tests** (`e2e/` directory):
- Test complete workflows with real API calls
- Require valid API credentials
- Slower execution (network latency)
- Focus on integration and real-world scenarios
- Validate actual API responses
- Run before releases or major changes

## Writing New Unit Tests

When adding new functionality, follow these guidelines:

1. **Test file naming**: Use `[module-name].test.ts` format
2. **Test organization**: Group related tests using `describe` blocks
3. **Test naming**: Use descriptive test names that explain what is being tested
4. **Arrange-Act-Assert**: Structure tests clearly:
   ```typescript
   it('should do something', () => {
       // Arrange: Set up test data
       const input = 'test';
       
       // Act: Execute the code being tested
       const result = functionUnderTest(input);
       
       // Assert: Verify the result
       expect(result).toBe('expected');
   });
   ```
5. **Mock external dependencies**: Use `vi.spyOn()` to mock HTTP calls, file system, etc.
6. **Test edge cases**: Empty strings, null, undefined, invalid inputs, etc.
7. **Test error paths**: Ensure errors are thrown with appropriate messages

## Coverage Goals

Aim for high coverage of:
- ✅ Configuration validation
- ✅ Input parameter validation
- ✅ Data transformation logic
- ✅ Error handling
- ✅ Edge cases

Lower priority for coverage:
- Network I/O (tested in E2E)
- External library internals (fast-xml-parser, etc.)

## Continuous Integration

These unit tests should run on every commit/PR to ensure code quality and catch regressions early.
