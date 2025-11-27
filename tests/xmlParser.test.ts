import { describe, it, expect, beforeEach } from 'vitest';
import { XmlParser } from '../src/lib/common/xmlParser.js';

/**
 * Unit Tests for XmlParser
 *
 * These tests focus on testing XML parsing logic:
 * - Valid XML parsing
 * - Attribute handling
 * - Error handling for invalid XML
 * - Edge cases
 */

describe('XmlParser - Unit Tests', () => {
  let parser: XmlParser;

  beforeEach(() => {
    parser = new XmlParser();
  });

  describe('Constructor', () => {
    it('should create parser instance', () => {
      expect(parser).toBeDefined();
      expect(parser).toBeInstanceOf(XmlParser);
    });
  });

  describe('parse - Valid XML', () => {
    it('should parse simple XML', () => {
      const xml = '<?xml version="1.0"?><root><item>value</item></root>';
      const result = parser.parse(xml) as any;

      expect(result).toBeDefined();
      expect(result.root).toBeDefined();
      expect(result.root.item).toBe('value');
    });

    it('should parse XML with attributes', () => {
      const xml = '<?xml version="1.0"?><root id="123" name="test"><item>value</item></root>';
      const result = parser.parse(xml) as any;

      expect(result).toBeDefined();
      expect(result.root).toBeDefined();
      expect(result.root._id).toBe(123); // parseAttributeValue converts to number
      expect(result.root._name).toBe('test');
      expect(result.root.item).toBe('value');
    });

    it('should parse XML with nested elements', () => {
      const xml = `<?xml version="1.0"?>
                <root>
                    <parent>
                        <child>value1</child>
                        <child>value2</child>
                    </parent>
                </root>`;
      const result = parser.parse(xml) as any;

      expect(result).toBeDefined();
      expect(result.root.parent).toBeDefined();
      expect(result.root.parent.child).toBeDefined();
      expect(Array.isArray(result.root.parent.child)).toBe(true);
      expect(result.root.parent.child).toHaveLength(2);
    });

    it('should parse XML with multiple attributes', () => {
      const xml = `<?xml version="1.0"?>
                <ValueSet ID="2.16.840.1.114222.4.11.837" displayName="Ethnicity" version="20200507">
                    <Concept code="2135-2" codeSystem="2.16.840.1.113883.6.238"/>
                </ValueSet>`;
      const result = parser.parse(xml) as any;

      expect(result.ValueSet).toBeDefined();
      expect(result.ValueSet._ID).toBe('2.16.840.1.114222.4.11.837');
      expect(result.ValueSet._displayName).toBe('Ethnicity');
      expect(result.ValueSet._version).toBe(20200507); // parseAttributeValue converts to number
      expect(result.ValueSet.Concept._code).toBe('2135-2');
    });

    it('should parse XML with namespaces', () => {
      const xml = `<?xml version="1.0"?>
                <ns0:RetrieveValueSetResponse xmlns:ns0="urn:ihe:iti:svs:2008">
                    <ns0:ValueSet ID="test">
                        <ns0:ConceptList>
                            <ns0:Concept code="123"/>
                        </ns0:ConceptList>
                    </ns0:ValueSet>
                </ns0:RetrieveValueSetResponse>`;
      const result = parser.parse(xml) as any;

      expect(result).toBeDefined();
      expect(result['ns0:RetrieveValueSetResponse']).toBeDefined();
      expect(result['ns0:RetrieveValueSetResponse']['ns0:ValueSet']).toBeDefined();
    });

    it('should handle text nodes with attributes', () => {
      const xml = '<?xml version="1.0"?><root><item id="1">text content</item></root>';
      const result = parser.parse(xml) as any;

      expect(result.root.item).toBeDefined();
      expect(result.root.item._id).toBe(1);
      expect(result.root.item['#text']).toBe('text content');
    });

    it('should trim whitespace in values', () => {
      const xml = '<?xml version="1.0"?><root><item>  value with spaces  </item></root>';
      const result = parser.parse(xml) as any;

      expect(result.root.item).toBe('value with spaces');
    });

    it('should parse numeric attribute values', () => {
      const xml =
        '<?xml version="1.0"?><root count="42" price="19.99" active="true"><item/></root>';
      const result = parser.parse(xml) as any;

      expect(result.root._count).toBe(42);
      expect(result.root._price).toBe(19.99);
      expect(result.root._active).toBe(true);
    });

    it('should parse boolean attribute values', () => {
      const xml = '<?xml version="1.0"?><root enabled="true" disabled="false"><item/></root>';
      const result = parser.parse(xml) as any;

      expect(result.root._enabled).toBe(true);
      expect(result.root._disabled).toBe(false);
    });
  });

  describe('parse - Edge Cases', () => {
    it('should parse XML without declaration', () => {
      const xml = '<root><item>value</item></root>';
      const result = parser.parse(xml) as any;

      expect(result).toBeDefined();
      expect(result.root.item).toBe('value');
    });

    it('should parse empty elements', () => {
      const xml = '<?xml version="1.0"?><root><empty/></root>';
      const result = parser.parse(xml) as any;

      expect(result).toBeDefined();
      expect(result.root.empty).toBeDefined();
    });

    it('should parse self-closing tags with attributes', () => {
      const xml = '<?xml version="1.0"?><root><item id="123" name="test"/></root>';
      const result = parser.parse(xml) as any;

      expect(result.root.item).toBeDefined();
      expect(result.root.item._id).toBe(123);
      expect(result.root.item._name).toBe('test');
    });

    it('should handle CDATA sections', () => {
      const xml = '<?xml version="1.0"?><root><![CDATA[Special <content> & data]]></root>';
      const result = parser.parse(xml) as any;

      expect(result).toBeDefined();
      expect(result.root).toContain('Special');
    });

    it('should parse XML with special characters in text', () => {
      const xml =
        '<?xml version="1.0"?><root><item>Text with &lt; &gt; &amp; &quot; &apos;</item></root>';
      const result = parser.parse(xml) as any;

      expect(result.root.item).toBeDefined();
      expect(result.root.item).toContain('<');
      expect(result.root.item).toContain('>');
    });
  });

  describe('parse - Array Handling', () => {
    it('should create array for multiple elements with same name', () => {
      const xml = `<?xml version="1.0"?>
                <root>
                    <item>value1</item>
                    <item>value2</item>
                    <item>value3</item>
                </root>`;
      const result = parser.parse(xml) as any;

      expect(Array.isArray(result.root.item)).toBe(true);
      expect(result.root.item).toHaveLength(3);
      expect(result.root.item[0]).toBe('value1');
      expect(result.root.item[1]).toBe('value2');
      expect(result.root.item[2]).toBe('value3');
    });

    it('should not create array for single element', () => {
      const xml = '<?xml version="1.0"?><root><item>value</item></root>';
      const result = parser.parse(xml) as any;

      expect(Array.isArray(result.root.item)).toBe(false);
      expect(result.root.item).toBe('value');
    });

    it('should handle mixed content arrays', () => {
      const xml = `<?xml version="1.0"?>
                <root>
                    <item id="1">value1</item>
                    <item id="2">value2</item>
                </root>`;
      const result = parser.parse(xml) as any;

      expect(Array.isArray(result.root.item)).toBe(true);
      expect(result.root.item[0]._id).toBe(1);
      expect(result.root.item[1]._id).toBe(2);
    });
  });

  describe('parse - Real-world VSAC XML Examples', () => {
    it('should parse RetrieveValueSet response', () => {
      const xml = `<?xml version="1.0" encoding="UTF-8"?>
                <ns0:RetrieveValueSetResponse xmlns:ns0="urn:ihe:iti:svs:2008">
                    <ns0:ValueSet ID="2.16.840.1.114222.4.11.837" displayName="Ethnicity" version="20200507">
                        <ns0:ConceptList>
                            <ns0:Concept code="2135-2" codeSystem="2.16.840.1.113883.6.238" 
                                        codeSystemName="CDCREC" codeSystemVersion="1.2" 
                                        displayName="Hispanic or Latino"/>
                        </ns0:ConceptList>
                    </ns0:ValueSet>
                </ns0:RetrieveValueSetResponse>`;

      const result = parser.parse(xml) as any;

      expect(result['ns0:RetrieveValueSetResponse']).toBeDefined();
      expect(result['ns0:RetrieveValueSetResponse']['ns0:ValueSet']._ID).toBe(
        '2.16.840.1.114222.4.11.837'
      );
      expect(
        result['ns0:RetrieveValueSetResponse']['ns0:ValueSet']['ns0:ConceptList']
      ).toBeDefined();
      expect(
        result['ns0:RetrieveValueSetResponse']['ns0:ValueSet']['ns0:ConceptList']['ns0:Concept']
      ).toBeDefined();
      expect(
        result['ns0:RetrieveValueSetResponse']['ns0:ValueSet']['ns0:ConceptList']['ns0:Concept']
          ._code
      ).toBe('2135-2');
    });

    it('should parse RetrieveMultipleValueSets response', () => {
      const xml = `<?xml version="1.0" encoding="UTF-8"?>
                <ns0:RetrieveMultipleValueSetsResponse xmlns:ns0="urn:ihe:iti:svs:2008">
                    <ns0:DescribedValueSet ID="2.16.840.1.114222.4.11.836" displayName="Race" version="20200507">
                        <ns0:Source>CDC</ns0:Source>
                        <ns0:Purpose>Clinical decision support</ns0:Purpose>
                        <ns0:Type>Extensional</ns0:Type>
                        <ns0:Binding>Static</ns0:Binding>
                        <ns0:Status>Active</ns0:Status>
                        <ns0:RevisionDate>2020-05-07</ns0:RevisionDate>
                        <ns0:ConceptList/>
                    </ns0:DescribedValueSet>
                </ns0:RetrieveMultipleValueSetsResponse>`;

      const result = parser.parse(xml) as any;

      expect(result['ns0:RetrieveMultipleValueSetsResponse']).toBeDefined();
      const valueSet = result['ns0:RetrieveMultipleValueSetsResponse']['ns0:DescribedValueSet'];
      expect(valueSet._ID).toBe('2.16.840.1.114222.4.11.836');
      expect(valueSet['ns0:Source']).toBe('CDC');
      expect(valueSet['ns0:Status']).toBe('Active');
    });
  });
});
