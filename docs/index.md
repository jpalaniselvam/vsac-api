# VSAC API CLI & SDK

## Introduction
This project aims to provide a robust Command Line Interface (CLI) and Software Development Kit (SDK) for interacting with the **Value Set Authority Center (VSAC)** APIs. It facilitates the downloading and management of value sets using both **FHIR** and **SVS** standards.

## Features
- **CLI Tool**: Easily download value sets directly from the terminal using FHIR or SVS APIs.
- **SDK Integration**: A comprehensive SDK to integrate VSAC API capabilities into your own applications.
- **Dual API Support**: Full support for both:
    - **FHIR API**
    - **SVS API**
- **Advanced Caching**: Built-in caching layer to optimize performance and reduce API calls. Supported providers include:
    - File System
    - In-Memory
    - AWS S3
    - SQL-compatible databases
    - Custom third-party cache layers
- **Publish to NPM**: The project is published to NPM with tree shaking in mind.

## Technical Specifications
The project is built with modern web technologies to ensure performance and maintainability:
- **Language**: TypeScript
- **Runtime**: Node.js
- **Styling/Output**: `chalk` for rich terminal output
- **Core Modules**: Utilizes native Node.js `http`, `fs`, and `os` modules for minimal dependencies.

## API Documentation

### SVS API
Detailed documentation for the SVS API implementation can be found here:
- [SVS API Documentation](SVS.md)

### FHIR API
*Documentation for the FHIR API is currently under development.*

## Roadmap
- [ ] Implement CLI for downloading value sets via FHIR/SVS.
- [ ] Develop SDK for programmatic API usage.
- [ ] Implement caching strategies (FS, Memory, S3, SQL).
- [ ] Add support for custom cache providers.
- [ ] Publish to npm