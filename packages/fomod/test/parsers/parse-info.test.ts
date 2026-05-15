import {describe, it, expect} from 'vitest';
import {parseInfo} from '../../src';

const wrap = ((inner: string): string => `<?xml version="1.0" encoding="utf-8"?>\n<fomod>${inner}</fomod>`);

describe('parseInfo', (() => {
  describe('root element', (() => {
    it('throws on missing <fomod> root', (() => {
      expect(() => parseInfo('<other />')).toThrow('Missing root <fomod> element');
    }));

    it('throws on empty <fomod> (self-closing)', (() => {
      expect(() => parseInfo('<fomod />')).toThrow('Missing root <fomod> element');
    }));
  }));

  describe('standard fields', (() => {
    it('parses Name', (() => {
      const result = parseInfo(wrap('<Name>Test Mod</Name>'));
      expect(result.Name).toBe('Test Mod');
    }));

    it('parses Author', (() => {
      const result = parseInfo(wrap('<Author>John Doe</Author>'));
      expect(result.Author).toBe('John Doe');
    }));

    it('parses Description', (() => {
      const result = parseInfo(wrap('<Description>A cool mod.</Description>'));
      expect(result.Description).toBe('A cool mod.');
    }));

    it('parses Website', (() => {
      const result = parseInfo(wrap('<Website>https://example.com</Website>'));
      expect(result.Website).toBe('https://example.com');
    }));

    it('parses Id', (() => {
      const result = parseInfo(wrap('<Id>12345</Id>'));
      expect(result.Id).toBe('12345');
    }));

    it('parses all fields together', (() => {
      const xml = wrap(`
        <Name>Test Mod</Name>
        <Author>John Doe</Author>
        <Version>1.0</Version>
        <Description>A mod.</Description>
        <Website>https://example.com</Website>
        <Id>99</Id>
      `);
      const result = parseInfo(xml);
      expect(result).toEqual({
        Name: 'Test Mod',
        Author: 'John Doe',
        Version: '1.0',
        Description: 'A mod.',
        Website: 'https://example.com',
        Id: '99'
      });
    }));

    it('omits absent optional fields', (() => {
      const result = parseInfo(wrap('<Name>Only Name</Name>'));
      expect(result).toEqual({Name: 'Only Name'});
      expect(result).not.toHaveProperty('Author');
      expect(result).not.toHaveProperty('Version');
      expect(result).not.toHaveProperty('Description');
      expect(result).not.toHaveProperty('Website');
      expect(result).not.toHaveProperty('Id');
    }));
  }));

  describe('Version handling', (() => {
    it('parses plain string Version', (() => {
      const result = parseInfo(wrap('<Version>2.0</Version>'));
      expect(result.Version).toBe('2.0');
    }));

    it('preserves Version with decimal points as string', (() => {
      const result = parseInfo(wrap('<Version>1.2.3</Version>'));
      expect(result.Version).toBe('1.2.3');
    }));

    it('parses Version with MachineVersion attribute', (() => {
      const result = parseInfo(wrap('<Version MachineVersion="1.2.3">v1.2.3</Version>'));
      expect(result.Version).toEqual({
        value: 'v1.2.3',
        MachineVersion: '1.2.3'
      });
    }));

    it('parses Version with MachineVersion when text differs from attribute', (() => {
      const result = parseInfo(wrap('<Version MachineVersion="2.0.0">Version 2 Beta</Version>'));
      expect(result.Version).toEqual({
        value: 'Version 2 Beta',
        MachineVersion: '2.0.0'
      });
    }));

    it('preserves numeric-looking Version as string', (() => {
      const result = parseInfo(wrap('<Version>3</Version>'));
      expect(result.Version).toBe('3');
      expect(typeof result.Version).toBe('string');
    }));
  }));

  describe('extension elements (xs:any)', (() => {
    it('passes through a single unknown element', (() => {
      const result = parseInfo(wrap('<Name>Mod</Name><CustomTag>custom value</CustomTag>'));
      expect(result.Name).toBe('Mod');
      expect(result.CustomTag).toBe('custom value');
    }));

    it('passes through multiple unknown elements', (() => {
      const result = parseInfo(wrap(`
        <Name>Mod</Name>
        <Foo>bar</Foo>
        <Baz>qux</Baz>
      `));
      expect(result.Foo).toBe('bar');
      expect(result.Baz).toBe('qux');
    }));

    it('does not include XML attributes as extension keys', (() => {
      const xml = '<?xml version="1.0" encoding="utf-8"?><fomod xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><Name>Mod</Name></fomod>';
      const result = parseInfo(xml);
      for(const key of Object.keys(result)) {
        expect(key).not.toMatch(/^@_/);
      }
    }));
  }));

  describe('whitespace and encoding', (() => {
    it('trims whitespace from values', (() => {
      const result = parseInfo(wrap('<Name>  Spaced Mod  </Name>'));
      expect(result.Name).toBe('Spaced Mod');
    }));

    it('handles XML entities', (() => {
      const result = parseInfo(wrap('<Name>Mod &amp; More</Name>'));
      expect(result.Name).toBe('Mod & More');
    }));

    it('handles CDATA in Description', (() => {
      const result = parseInfo(wrap('<Description><![CDATA[Line 1\nLine 2]]></Description>'));
      expect(result.Description).toContain('Line 1');
      expect(result.Description).toContain('Line 2');
    }));
  }));

  describe('coercion', (() => {
    it('coerces numeric Name to string', (() => {
      const result = parseInfo(wrap('<Name>42</Name>'));
      expect(result.Name).toBe('42');
      expect(typeof result.Name).toBe('string');
    }));

    it('coerces numeric Id to string', (() => {
      const result = parseInfo(wrap('<Id>100</Id>'));
      expect(result.Id).toBe('100');
      expect(typeof result.Id).toBe('string');
    }));
  }));
}));
