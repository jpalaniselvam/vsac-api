import { XMLParser, XMLValidator, type X2jOptions } from 'fast-xml-parser';

/**
 * XML Parser utility for converting XML responses to JSON
 */
export class XmlParser {
  private parser: XMLParser;

  constructor(overrideOptions?: X2jOptions) {
    this.parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '_',
      textNodeName: '#text',
      parseAttributeValue: true,
      trimValues: true,
      ignoreDeclaration: true,
      ...overrideOptions
    });
  }

  /**
   * Parse XML string to JSON object
   * @param xmlString - XML string to parse
   * @returns Parsed JSON object
   */
  parse(xmlString: string): unknown {
    if (!this.validate(xmlString)) {
      throw new Error('Invalid XML');
    }
    try {
      return this.parser.parse(xmlString);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to parse XML: ${message}`);
    }
  }

  validate(xmlString: string): boolean {
    return XMLValidator.validate(xmlString) === true;
  }
}
