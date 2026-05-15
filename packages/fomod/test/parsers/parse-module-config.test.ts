/* eslint-disable complexity */
import {describe, it, expect} from 'vitest';
import {parseModuleConfig} from '../../src/parsers';

const wrap = ((inner: string): string => `<?xml version="1.0" encoding="utf-8"?>\n<config>${inner}</config>`);

// Minimal valid plugin for reuse in tests
const minimalPlugin = ((name: string, type = 'Optional'): string => `
  <plugin name="${name}">
    <description>desc</description>
    <files><file source="a.esp" /></files>
    <typeDescriptor><type name="${type}" /></typeDescriptor>
  </plugin>`);

// Minimal valid install step for reuse
const minimalStep = ((name: string, groupInner: string): string => `
  <installStep name="${name}">
    <optionalFileGroups>
      ${groupInner}
    </optionalFileGroups>
  </installStep>`);

const minimalGroup = ((name: string, type: string, pluginInner: string): string => `
  <group name="${name}" type="${type}">
    <plugins>${pluginInner}</plugins>
  </group>`);

describe('parseModuleConfig', (() => {
  describe('root element', (() => {
    it('throws on missing <config> root', (() => {
      expect(() => parseModuleConfig('<other />')).toThrow('Missing root <config> element');
    }));

    it('parses minimal config with only moduleName', (() => {
      const result = parseModuleConfig(wrap('<moduleName>Test</moduleName>'));
      expect(result.moduleName.value).toBe('Test');
    }));
  }));

  describe('moduleName', (() => {
    it('parses text content as value', (() => {
      const result = parseModuleConfig(wrap('<moduleName>My Mod</moduleName>'));
      expect(result.moduleName.value).toBe('My Mod');
    }));

    it('defaults position to Left', (() => {
      const result = parseModuleConfig(wrap('<moduleName>Test</moduleName>'));
      expect(result.moduleName.position).toBe('Left');
    }));

    it('parses position attribute', (() => {
      const result = parseModuleConfig(wrap('<moduleName position="Right">Test</moduleName>'));
      expect(result.moduleName.position).toBe('Right');
    }));

    it('parses RightOfImage position', (() => {
      const result = parseModuleConfig(wrap('<moduleName position="RightOfImage">Test</moduleName>'));
      expect(result.moduleName.position).toBe('RightOfImage');
    }));

    it('defaults colour to 000000', (() => {
      const result = parseModuleConfig(wrap('<moduleName>Test</moduleName>'));
      expect(result.moduleName.colour).toBe('000000');
    }));

    it('parses colour attribute', (() => {
      const result = parseModuleConfig(wrap('<moduleName colour="FF0000">Test</moduleName>'));
      expect(result.moduleName.colour).toBe('FF0000');
    }));
  }));

  describe('moduleImage', (() => {
    it('omits moduleImage when absent', (() => {
      const result = parseModuleConfig(wrap('<moduleName>Test</moduleName>'));
      expect(result.moduleImage).toBeUndefined();
    }));

    it('parses path', (() => {
      const result = parseModuleConfig(wrap('<moduleName>Test</moduleName><moduleImage path="header.png" />'));
      expect(result.moduleImage?.path).toBe('header.png');
    }));

    it('defaults showImage to true', (() => {
      const result = parseModuleConfig(wrap('<moduleName>Test</moduleName><moduleImage path="h.png" />'));
      expect(result.moduleImage?.showImage).toBe(true);
    }));

    it('parses showImage=false', (() => {
      const result = parseModuleConfig(wrap('<moduleName>Test</moduleName><moduleImage path="h.png" showImage="false" />'));
      expect(result.moduleImage?.showImage).toBe(false);
    }));

    it('defaults showFade to true', (() => {
      const result = parseModuleConfig(wrap('<moduleName>Test</moduleName><moduleImage path="h.png" />'));
      expect(result.moduleImage?.showFade).toBe(true);
    }));

    it('parses showFade=false', (() => {
      const result = parseModuleConfig(wrap('<moduleName>Test</moduleName><moduleImage path="h.png" showFade="false" />'));
      expect(result.moduleImage?.showFade).toBe(false);
    }));

    it('defaults height to -1', (() => {
      const result = parseModuleConfig(wrap('<moduleName>Test</moduleName><moduleImage path="h.png" />'));
      expect(result.moduleImage?.height).toBe(-1);
    }));

    it('parses height', (() => {
      const result = parseModuleConfig(wrap('<moduleName>Test</moduleName><moduleImage path="h.png" height="200" />'));
      expect(result.moduleImage?.height).toBe(200);
    }));
  }));

  describe('moduleDependencies', (() => {
    it('omits when absent', (() => {
      const result = parseModuleConfig(wrap('<moduleName>Test</moduleName>'));
      expect(result.moduleDependencies).toBeUndefined();
    }));

    it('parses fileDependency', (() => {
      const result = parseModuleConfig(wrap(`
        <moduleName>Test</moduleName>
        <moduleDependencies>
          <fileDependency file="Fallout4.esm" state="Active" />
        </moduleDependencies>
      `));
      expect(result.moduleDependencies?.items).toHaveLength(1);
      expect(result.moduleDependencies?.items[0]).toEqual({
        type: 'fileDependency',
        value: {
          file: 'Fallout4.esm',
          state: 'Active'
        }
      });
    }));

    it('parses flagDependency', (() => {
      const result = parseModuleConfig(wrap(`
        <moduleName>Test</moduleName>
        <moduleDependencies>
          <flagDependency flag="myFlag" value="on" />
        </moduleDependencies>
      `));
      expect(result.moduleDependencies?.items[0]).toEqual({
        type: 'flagDependency',
        value: {
          flag: 'myFlag',
          value: 'on'
        }
      });
    }));

    it('parses gameDependency', (() => {
      const result = parseModuleConfig(wrap(`
        <moduleName>Test</moduleName>
        <moduleDependencies>
          <gameDependency version="1.10.163" />
        </moduleDependencies>
      `));
      expect(result.moduleDependencies?.items[0]).toEqual({
        type: 'gameDependency',
        value: {version: '1.10.163'}
      });
    }));

    it('parses fommDependency', (() => {
      const result = parseModuleConfig(wrap(`
        <moduleName>Test</moduleName>
        <moduleDependencies>
          <fommDependency version="0.13.21" />
        </moduleDependencies>
      `));
      expect(result.moduleDependencies?.items[0]).toEqual({
        type: 'fommDependency',
        value: {version: '0.13.21'}
      });
    }));

    it('defaults operator to And', (() => {
      const result = parseModuleConfig(wrap(`
        <moduleName>Test</moduleName>
        <moduleDependencies>
          <fileDependency file="a.esm" state="Active" />
        </moduleDependencies>
      `));
      expect(result.moduleDependencies?.operator).toBe('And');
    }));

    it('parses operator=Or', (() => {
      const result = parseModuleConfig(wrap(`
        <moduleName>Test</moduleName>
        <moduleDependencies operator="Or">
          <fileDependency file="a.esm" state="Active" />
        </moduleDependencies>
      `));
      expect(result.moduleDependencies?.operator).toBe('Or');
    }));

    it('parses multiple dependency types together', (() => {
      const result = parseModuleConfig(wrap(`
        <moduleName>Test</moduleName>
        <moduleDependencies operator="And">
          <fileDependency file="a.esm" state="Active" />
          <flagDependency flag="f" value="v" />
          <gameDependency version="1.0" />
        </moduleDependencies>
      `));
      expect(result.moduleDependencies?.items).toHaveLength(3);
    }));

    it('parses nested dependencies (recursive compositeDependency)', (() => {
      const result = parseModuleConfig(wrap(`
        <moduleName>Test</moduleName>
        <moduleDependencies operator="And">
          <fileDependency file="a.esm" state="Active" />
          <dependencies operator="Or">
            <fileDependency file="b.esm" state="Active" />
            <fileDependency file="c.esm" state="Active" />
          </dependencies>
        </moduleDependencies>
      `));
      expect(result.moduleDependencies?.items).toHaveLength(2);
      const nested = result.moduleDependencies?.items[1];
      expect(nested?.type).toBe('dependencies');
      if(nested?.type === 'dependencies') {
        expect(nested.value.operator).toBe('Or');
        expect(nested.value.items).toHaveLength(2);
      }
    }));

    it('parses multiple fileDependency elements', (() => {
      const result = parseModuleConfig(wrap(`
        <moduleName>Test</moduleName>
        <moduleDependencies>
          <fileDependency file="a.esm" state="Active" />
          <fileDependency file="b.esm" state="Missing" />
          <fileDependency file="c.esm" state="Inactive" />
        </moduleDependencies>
      `));
      const fileDeps = result.moduleDependencies?.items.filter(i => (i.type === 'fileDependency'));
      expect(fileDeps).toHaveLength(3);
    }));
  }));

  describe('requiredInstallFiles', (() => {
    it('omits when absent', (() => {
      const result = parseModuleConfig(wrap('<moduleName>Test</moduleName>'));
      expect(result.requiredInstallFiles).toBeUndefined();
    }));

    it('parses files', (() => {
      const result = parseModuleConfig(wrap(`
        <moduleName>Test</moduleName>
        <requiredInstallFiles>
          <file source="a.esp" destination="b.esp" />
        </requiredInstallFiles>
      `));
      expect(result.requiredInstallFiles?.files).toHaveLength(1);
      expect(result.requiredInstallFiles?.files[0]?.source).toBe('a.esp');
      expect(result.requiredInstallFiles?.files[0]?.destination).toBe('b.esp');
    }));

    it('parses folders', (() => {
      const result = parseModuleConfig(wrap(`
        <moduleName>Test</moduleName>
        <requiredInstallFiles>
          <folder source="textures" destination="data/textures" />
        </requiredInstallFiles>
      `));
      expect(result.requiredInstallFiles?.folders).toHaveLength(1);
      expect(result.requiredInstallFiles?.folders[0]?.source).toBe('textures');
    }));

    it('parses mixed files and folders', (() => {
      const result = parseModuleConfig(wrap(`
        <moduleName>Test</moduleName>
        <requiredInstallFiles>
          <file source="a.esp" />
          <folder source="textures" />
          <file source="b.esp" />
        </requiredInstallFiles>
      `));
      expect(result.requiredInstallFiles?.files).toHaveLength(2);
      expect(result.requiredInstallFiles?.folders).toHaveLength(1);
    }));

    it('returns empty arrays when no files or folders', (() => {
      const result = parseModuleConfig(wrap(`
        <moduleName>Test</moduleName>
        <requiredInstallFiles>
          <file source="a.esp" />
        </requiredInstallFiles>
      `));
      expect(result.requiredInstallFiles?.folders).toEqual([]);
    }));
  }));

  describe('fileSystemItem attributes', (() => {
    it('defaults destination to undefined when omitted', (() => {
      const result = parseModuleConfig(wrap(`
        <moduleName>Test</moduleName>
        <requiredInstallFiles><file source="a.esp" /></requiredInstallFiles>
      `));
      expect(result.requiredInstallFiles?.files[0]?.destination).toBeUndefined();
    }));

    it('defaults alwaysInstall to false', (() => {
      const result = parseModuleConfig(wrap(`
        <moduleName>Test</moduleName>
        <requiredInstallFiles><file source="a.esp" /></requiredInstallFiles>
      `));
      expect(result.requiredInstallFiles?.files[0]?.alwaysInstall).toBe(false);
    }));

    it('parses alwaysInstall=true', (() => {
      const result = parseModuleConfig(wrap(`
        <moduleName>Test</moduleName>
        <requiredInstallFiles><file source="a.esp" alwaysInstall="true" /></requiredInstallFiles>
      `));
      expect(result.requiredInstallFiles?.files[0]?.alwaysInstall).toBe(true);
    }));

    it('defaults installIfUsable to false', (() => {
      const result = parseModuleConfig(wrap(`
        <moduleName>Test</moduleName>
        <requiredInstallFiles><file source="a.esp" /></requiredInstallFiles>
      `));
      expect(result.requiredInstallFiles?.files[0]?.installIfUsable).toBe(false);
    }));

    it('parses installIfUsable=true', (() => {
      const result = parseModuleConfig(wrap(`
        <moduleName>Test</moduleName>
        <requiredInstallFiles><file source="a.esp" installIfUsable="true" /></requiredInstallFiles>
      `));
      expect(result.requiredInstallFiles?.files[0]?.installIfUsable).toBe(true);
    }));

    it('defaults priority to 0', (() => {
      const result = parseModuleConfig(wrap(`
        <moduleName>Test</moduleName>
        <requiredInstallFiles><file source="a.esp" /></requiredInstallFiles>
      `));
      expect(result.requiredInstallFiles?.files[0]?.priority).toBe(0);
    }));

    it('parses priority', (() => {
      const result = parseModuleConfig(wrap(`
        <moduleName>Test</moduleName>
        <requiredInstallFiles><file source="a.esp" priority="5" /></requiredInstallFiles>
      `));
      expect(result.requiredInstallFiles?.files[0]?.priority).toBe(5);
    }));
  }));

  describe('installSteps', (() => {
    it('omits when absent', (() => {
      const result = parseModuleConfig(wrap('<moduleName>Test</moduleName>'));
      expect(result.installSteps).toBeUndefined();
    }));

    it('parses a single install step', (() => {
      const result = parseModuleConfig(wrap(`
        <moduleName>Test</moduleName>
        <installSteps>
          ${minimalStep('Step 1', minimalGroup('G1', 'SelectAny', minimalPlugin('P1')))}
        </installSteps>
      `));
      expect(result.installSteps?.installSteps).toHaveLength(1);
      expect(result.installSteps?.installSteps[0]?.name).toBe('Step 1');
    }));

    it('parses multiple install steps', (() => {
      const group = minimalGroup('G', 'SelectAny', minimalPlugin('P'));
      const result = parseModuleConfig(wrap(`
        <moduleName>Test</moduleName>
        <installSteps>
          ${minimalStep('Step 1', group)}
          ${minimalStep('Step 2', group)}
        </installSteps>
      `));
      expect(result.installSteps?.installSteps).toHaveLength(2);
    }));

    it('defaults order to Ascending', (() => {
      const result = parseModuleConfig(wrap(`
        <moduleName>Test</moduleName>
        <installSteps>
          ${minimalStep('S', minimalGroup('G', 'SelectAny', minimalPlugin('P')))}
        </installSteps>
      `));
      expect(result.installSteps?.order).toBe('Ascending');
    }));

    it('parses order=Explicit', (() => {
      const result = parseModuleConfig(wrap(`
        <moduleName>Test</moduleName>
        <installSteps order="Explicit">
          ${minimalStep('S', minimalGroup('G', 'SelectAny', minimalPlugin('P')))}
        </installSteps>
      `));
      expect(result.installSteps?.order).toBe('Explicit');
    }));

    it('parses order=Descending', (() => {
      const result = parseModuleConfig(wrap(`
        <moduleName>Test</moduleName>
        <installSteps order="Descending">
          ${minimalStep('S', minimalGroup('G', 'SelectAny', minimalPlugin('P')))}
        </installSteps>
      `));
      expect(result.installSteps?.order).toBe('Descending');
    }));
  }));

  describe('installStep visibility', (() => {
    it('omits visible when absent', (() => {
      const result = parseModuleConfig(wrap(`
        <moduleName>Test</moduleName>
        <installSteps>
          ${minimalStep('S', minimalGroup('G', 'SelectAny', minimalPlugin('P')))}
        </installSteps>
      `));
      expect(result.installSteps?.installSteps[0]?.visible).toBeUndefined();
    }));

    it('parses visible dependency', (() => {
      const result = parseModuleConfig(wrap(`
        <moduleName>Test</moduleName>
        <installSteps>
          <installStep name="S">
            <visible operator="And">
              <flagDependency flag="show" value="true" />
            </visible>
            <optionalFileGroups>
              ${minimalGroup('G', 'SelectAny', minimalPlugin('P'))}
            </optionalFileGroups>
          </installStep>
        </installSteps>
      `));
      const visible = result.installSteps?.installSteps[0]?.visible;
      expect(visible?.operator).toBe('And');
      expect(visible?.items).toHaveLength(1);
      expect(visible?.items[0]?.type).toBe('flagDependency');
    }));
  }));

  describe('groups', (() => {
    it('parses group name and type', (() => {
      const result = parseModuleConfig(wrap(`
        <moduleName>Test</moduleName>
        <installSteps>
          ${minimalStep('S', minimalGroup('Main Files', 'SelectExactlyOne', minimalPlugin('P')))}
        </installSteps>
      `));
      const group = result.installSteps?.installSteps[0]?.optionalFileGroups.groups[0];
      expect(group?.name).toBe('Main Files');
      expect(group?.type).toBe('SelectExactlyOne');
    }));

    it('parses all group types', (() => {
      const types = (['SelectAtLeastOne', 'SelectAtMostOne', 'SelectExactlyOne', 'SelectAll', 'SelectAny'] as const);
      for(const groupType of types) {
        const result = parseModuleConfig(wrap(`
          <moduleName>Test</moduleName>
          <installSteps>
            ${minimalStep('S', minimalGroup('G', groupType, minimalPlugin('P')))}
          </installSteps>
        `));
        expect(result.installSteps?.installSteps[0]?.optionalFileGroups.groups[0]?.type).toBe(groupType);
      }
    }));

    it('parses multiple groups', (() => {
      const result = parseModuleConfig(wrap(`
        <moduleName>Test</moduleName>
        <installSteps>
          ${minimalStep('S', `
            ${minimalGroup('G1', 'SelectAny', minimalPlugin('P1'))}
            ${minimalGroup('G2', 'SelectAll', minimalPlugin('P2'))}
          `)}
        </installSteps>
      `));
      expect(result.installSteps?.installSteps[0]?.optionalFileGroups.groups).toHaveLength(2);
    }));

    it('defaults group order to Ascending', (() => {
      const result = parseModuleConfig(wrap(`
        <moduleName>Test</moduleName>
        <installSteps>
          ${minimalStep('S', minimalGroup('G', 'SelectAny', minimalPlugin('P')))}
        </installSteps>
      `));
      expect(result.installSteps?.installSteps[0]?.optionalFileGroups.order).toBe('Ascending');
    }));

    it('parses group order=Explicit', (() => {
      const result = parseModuleConfig(wrap(`
        <moduleName>Test</moduleName>
        <installSteps>
          <installStep name="S">
            <optionalFileGroups order="Explicit">
              ${minimalGroup('G', 'SelectAny', minimalPlugin('P'))}
            </optionalFileGroups>
          </installStep>
        </installSteps>
      `));
      expect(result.installSteps?.installSteps[0]?.optionalFileGroups.order).toBe('Explicit');
    }));
  }));

  describe('plugins', (() => {
    it('parses plugin name and description', (() => {
      const result = parseModuleConfig(wrap(`
        <moduleName>Test</moduleName>
        <installSteps>
          ${minimalStep('S', minimalGroup('G', 'SelectAny', minimalPlugin('My Plugin')))}
        </installSteps>
      `));
      const plugin = result.installSteps?.installSteps[0]?.optionalFileGroups.groups[0]?.plugins.plugins[0];
      expect(plugin?.name).toBe('My Plugin');
      expect(plugin?.description).toBe('desc');
    }));

    it('parses plugin image', (() => {
      const result = parseModuleConfig(wrap(`
        <moduleName>Test</moduleName>
        <installSteps>
          ${minimalStep('S', minimalGroup('G', 'SelectAny', `
            <plugin name="P">
              <description>d</description>
              <image path="img.png" />
              <files><file source="a.esp" /></files>
              <typeDescriptor><type name="Optional" /></typeDescriptor>
            </plugin>
          `))}
        </installSteps>
      `));
      const plugin = result.installSteps?.installSteps[0]?.optionalFileGroups.groups[0]?.plugins.plugins[0];
      expect(plugin?.image?.path).toBe('img.png');
    }));

    it('omits image when absent', (() => {
      const result = parseModuleConfig(wrap(`
        <moduleName>Test</moduleName>
        <installSteps>
          ${minimalStep('S', minimalGroup('G', 'SelectAny', minimalPlugin('P')))}
        </installSteps>
      `));
      const plugin = result.installSteps?.installSteps[0]?.optionalFileGroups.groups[0]?.plugins.plugins[0];
      expect(plugin?.image).toBeUndefined();
    }));

    it('parses plugin files', (() => {
      const result = parseModuleConfig(wrap(`
        <moduleName>Test</moduleName>
        <installSteps>
          ${minimalStep('S', minimalGroup('G', 'SelectAny', `
            <plugin name="P">
              <description>d</description>
              <files>
                <file source="a.esp" destination="b.esp" />
                <folder source="tex" />
              </files>
              <typeDescriptor><type name="Optional" /></typeDescriptor>
            </plugin>
          `))}
        </installSteps>
      `));
      const plugin = result.installSteps?.installSteps[0]?.optionalFileGroups.groups[0]?.plugins.plugins[0];
      expect(plugin?.files?.files).toHaveLength(1);
      expect(plugin?.files?.folders).toHaveLength(1);
    }));

    it('parses multiple plugins in a group', (() => {
      const result = parseModuleConfig(wrap(`
        <moduleName>Test</moduleName>
        <installSteps>
          ${minimalStep('S', minimalGroup('G', 'SelectAny', `
            ${minimalPlugin('P1')}
            ${minimalPlugin('P2')}
            ${minimalPlugin('P3')}
          `))}
        </installSteps>
      `));
      expect(result.installSteps?.installSteps[0]?.optionalFileGroups.groups[0]?.plugins.plugins).toHaveLength(3);
    }));

    it('defaults plugin order to Ascending', (() => {
      const result = parseModuleConfig(wrap(`
        <moduleName>Test</moduleName>
        <installSteps>
          ${minimalStep('S', minimalGroup('G', 'SelectAny', minimalPlugin('P')))}
        </installSteps>
      `));
      expect(result.installSteps?.installSteps[0]?.optionalFileGroups.groups[0]?.plugins.order).toBe('Ascending');
    }));

    it('parses plugin order=Explicit', (() => {
      const result = parseModuleConfig(wrap(`
        <moduleName>Test</moduleName>
        <installSteps>
          ${minimalStep('S', `
            <group name="G" type="SelectAny">
              <plugins order="Explicit">${minimalPlugin('P')}</plugins>
            </group>
          `)}
        </installSteps>
      `));
      expect(result.installSteps?.installSteps[0]?.optionalFileGroups.groups[0]?.plugins.order).toBe('Explicit');
    }));
  }));

  describe('conditionFlags', (() => {
    it('parses condition flags on a plugin', (() => {
      const result = parseModuleConfig(wrap(`
        <moduleName>Test</moduleName>
        <installSteps>
          ${minimalStep('S', minimalGroup('G', 'SelectAny', `
            <plugin name="P">
              <description>d</description>
              <files><file source="a.esp" /></files>
              <conditionFlags>
                <flag name="optA">selected</flag>
              </conditionFlags>
              <typeDescriptor><type name="Optional" /></typeDescriptor>
            </plugin>
          `))}
        </installSteps>
      `));
      const plugin = result.installSteps?.installSteps[0]?.optionalFileGroups.groups[0]?.plugins.plugins[0];
      expect(plugin?.conditionFlags?.flags).toHaveLength(1);
      expect(plugin?.conditionFlags?.flags[0]).toEqual({
        name: 'optA',
        value: 'selected'
      });
    }));

    it('parses multiple condition flags', (() => {
      const result = parseModuleConfig(wrap(`
        <moduleName>Test</moduleName>
        <installSteps>
          ${minimalStep('S', minimalGroup('G', 'SelectAny', `
            <plugin name="P">
              <description>d</description>
              <files><file source="a.esp" /></files>
              <conditionFlags>
                <flag name="a">1</flag>
                <flag name="b">2</flag>
              </conditionFlags>
              <typeDescriptor><type name="Optional" /></typeDescriptor>
            </plugin>
          `))}
        </installSteps>
      `));
      const flags = result.installSteps?.installSteps[0]?.optionalFileGroups.groups[0]?.plugins.plugins[0]?.conditionFlags?.flags;
      expect(flags).toHaveLength(2);
      expect(flags?.[0]?.name).toBe('a');
      expect(flags?.[1]?.name).toBe('b');
    }));

    it('omits conditionFlags when absent', (() => {
      const result = parseModuleConfig(wrap(`
        <moduleName>Test</moduleName>
        <installSteps>
          ${minimalStep('S', minimalGroup('G', 'SelectAny', minimalPlugin('P')))}
        </installSteps>
      `));
      const plugin = result.installSteps?.installSteps[0]?.optionalFileGroups.groups[0]?.plugins.plugins[0];
      expect(plugin?.conditionFlags).toBeUndefined();
    }));
  }));

  describe('pluginTypeDescriptor', (() => {
    it('parses static type', (() => {
      const result = parseModuleConfig(wrap(`
        <moduleName>Test</moduleName>
        <installSteps>
          ${minimalStep('S', minimalGroup('G', 'SelectAny', minimalPlugin('P', 'Required')))}
        </installSteps>
      `));
      const td = result.installSteps?.installSteps[0]?.optionalFileGroups.groups[0]?.plugins.plugins[0]?.typeDescriptor;
      expect('type' in td!).toBe(true);
      if('type' in td!) {
        expect(td.type?.name).toBe('Required');
      }
    }));

    it('parses all pluginTypeEnum values', (() => {
      const types = (['Required', 'Optional', 'Recommended', 'NotUsable', 'CouldBeUsable'] as const);
      for(const t of types) {
        const result = parseModuleConfig(wrap(`
          <moduleName>Test</moduleName>
          <installSteps>
            ${minimalStep('S', minimalGroup('G', 'SelectAny', minimalPlugin('P', t)))}
          </installSteps>
        `));
        const td = result.installSteps?.installSteps[0]?.optionalFileGroups.groups[0]?.plugins.plugins[0]?.typeDescriptor;
        if('type' in td!) {
          expect(td.type?.name).toBe(t);
        }
      }
    }));

    it('parses dependencyType with defaultType and patterns', (() => {
      const result = parseModuleConfig(wrap(`
        <moduleName>Test</moduleName>
        <installSteps>
          ${minimalStep('S', minimalGroup('G', 'SelectAny', `
            <plugin name="P">
              <description>d</description>
              <files><file source="a.esp" /></files>
              <typeDescriptor>
                <dependencyType>
                  <defaultType name="Optional" />
                  <patterns>
                    <pattern>
                      <dependencies operator="Or">
                        <fileDependency file="x.esp" state="Active" />
                      </dependencies>
                      <type name="Recommended" />
                    </pattern>
                  </patterns>
                </dependencyType>
              </typeDescriptor>
            </plugin>
          `))}
        </installSteps>
      `));
      const td = result.installSteps?.installSteps[0]?.optionalFileGroups.groups[0]?.plugins.plugins[0]?.typeDescriptor;
      expect('dependencyType' in td!).toBe(true);
      if('dependencyType' in td!) {
        expect(td.dependencyType?.defaultType.name).toBe('Optional');
        expect(td.dependencyType?.patterns.patterns).toHaveLength(1);
        expect(td.dependencyType?.patterns.patterns[0]?.dependencies.operator).toBe('Or');
        expect(td.dependencyType?.patterns.patterns[0]?.type.name).toBe('Recommended');
      }
    }));
  }));

  describe('conditionalFileInstalls', (() => {
    it('omits when absent', (() => {
      const result = parseModuleConfig(wrap('<moduleName>Test</moduleName>'));
      expect(result.conditionalFileInstalls).toBeUndefined();
    }));

    it('parses a single pattern', (() => {
      const result = parseModuleConfig(wrap(`
        <moduleName>Test</moduleName>
        <conditionalFileInstalls>
          <patterns>
            <pattern>
              <dependencies operator="And">
                <flagDependency flag="optA" value="selected" />
              </dependencies>
              <files>
                <file source="patch.esp" destination="patch.esp" />
              </files>
            </pattern>
          </patterns>
        </conditionalFileInstalls>
      `));
      const patterns = result.conditionalFileInstalls?.patterns.patterns;
      expect(patterns).toHaveLength(1);
      expect(patterns?.[0]?.dependencies.operator).toBe('And');
      expect(patterns?.[0]?.dependencies.items).toHaveLength(1);
      expect(patterns?.[0]?.files.files).toHaveLength(1);
      expect(patterns?.[0]?.files.files[0]?.source).toBe('patch.esp');
    }));

    it('parses multiple patterns', (() => {
      const result = parseModuleConfig(wrap(`
        <moduleName>Test</moduleName>
        <conditionalFileInstalls>
          <patterns>
            <pattern>
              <dependencies><flagDependency flag="a" value="1" /></dependencies>
              <files><file source="a.esp" /></files>
            </pattern>
            <pattern>
              <dependencies><flagDependency flag="b" value="2" /></dependencies>
              <files><file source="b.esp" /></files>
            </pattern>
          </patterns>
        </conditionalFileInstalls>
      `));
      expect(result.conditionalFileInstalls?.patterns.patterns).toHaveLength(2);
    }));
  }));

  describe('array coercion (single element)', (() => {
    it('wraps single plugin in array', (() => {
      const result = parseModuleConfig(wrap(`
        <moduleName>Test</moduleName>
        <installSteps>
          ${minimalStep('S', minimalGroup('G', 'SelectAny', minimalPlugin('P')))}
        </installSteps>
      `));
      expect(Array.isArray(result.installSteps?.installSteps[0]?.optionalFileGroups.groups[0]?.plugins.plugins)).toBe(true);
    }));

    it('wraps single group in array', (() => {
      const result = parseModuleConfig(wrap(`
        <moduleName>Test</moduleName>
        <installSteps>
          ${minimalStep('S', minimalGroup('G', 'SelectAny', minimalPlugin('P')))}
        </installSteps>
      `));
      expect(Array.isArray(result.installSteps?.installSteps[0]?.optionalFileGroups.groups)).toBe(true);
    }));

    it('wraps single installStep in array', (() => {
      const result = parseModuleConfig(wrap(`
        <moduleName>Test</moduleName>
        <installSteps>
          ${minimalStep('S', minimalGroup('G', 'SelectAny', minimalPlugin('P')))}
        </installSteps>
      `));
      expect(Array.isArray(result.installSteps?.installSteps)).toBe(true);
    }));

    it('wraps single file in array', (() => {
      const result = parseModuleConfig(wrap(`
        <moduleName>Test</moduleName>
        <requiredInstallFiles>
          <file source="a.esp" />
        </requiredInstallFiles>
      `));
      expect(Array.isArray(result.requiredInstallFiles?.files)).toBe(true);
    }));

    it('wraps single folder in array', (() => {
      const result = parseModuleConfig(wrap(`
        <moduleName>Test</moduleName>
        <requiredInstallFiles>
          <folder source="tex" />
        </requiredInstallFiles>
      `));
      expect(Array.isArray(result.requiredInstallFiles?.folders)).toBe(true);
    }));

    it('wraps single flag in array', (() => {
      const result = parseModuleConfig(wrap(`
        <moduleName>Test</moduleName>
        <installSteps>
          ${minimalStep('S', minimalGroup('G', 'SelectAny', `
            <plugin name="P">
              <description>d</description>
              <files><file source="a.esp" /></files>
              <conditionFlags><flag name="f">v</flag></conditionFlags>
              <typeDescriptor><type name="Optional" /></typeDescriptor>
            </plugin>
          `))}
        </installSteps>
      `));
      const flags = result.installSteps?.installSteps[0]?.optionalFileGroups.groups[0]?.plugins.plugins[0]?.conditionFlags?.flags;
      expect(Array.isArray(flags)).toBe(true);
    }));

    it('wraps single pattern in array', (() => {
      const result = parseModuleConfig(wrap(`
        <moduleName>Test</moduleName>
        <conditionalFileInstalls>
          <patterns>
            <pattern>
              <dependencies><flagDependency flag="a" value="1" /></dependencies>
              <files><file source="a.esp" /></files>
            </pattern>
          </patterns>
        </conditionalFileInstalls>
      `));
      expect(Array.isArray(result.conditionalFileInstalls?.patterns.patterns)).toBe(true);
    }));

    it('wraps single fileDependency in array', (() => {
      const result = parseModuleConfig(wrap(`
        <moduleName>Test</moduleName>
        <moduleDependencies>
          <fileDependency file="a.esm" state="Active" />
        </moduleDependencies>
      `));
      expect(result.moduleDependencies?.items).toHaveLength(1);
    }));
  }));

  describe('full integration', (() => {
    it('parses a complete config with all sections', (() => {
      const xml = wrap(`
        <moduleName position="Left" colour="FF0000">Full Mod</moduleName>
        <moduleImage path="header.png" showImage="true" showFade="false" height="100" />
        <moduleDependencies operator="And">
          <fileDependency file="Fallout4.esm" state="Active" />
          <gameDependency version="1.10.163" />
        </moduleDependencies>
        <requiredInstallFiles>
          <file source="req/a.esp" destination="a.esp" alwaysInstall="true" priority="1" />
          <folder source="req/tex" destination="tex" />
        </requiredInstallFiles>
        <installSteps order="Explicit">
          <installStep name="Choose">
            <visible operator="And">
              <flagDependency flag="prereq" value="true" />
            </visible>
            <optionalFileGroups order="Explicit">
              <group name="Main" type="SelectExactlyOne">
                <plugins order="Explicit">
                  <plugin name="Option A">
                    <description>First</description>
                    <image path="a.png" />
                    <files><file source="a/f.esp" destination="f.esp" /></files>
                    <conditionFlags><flag name="optA">sel</flag></conditionFlags>
                    <typeDescriptor><type name="Recommended" /></typeDescriptor>
                  </plugin>
                  <plugin name="Option B">
                    <description>Second</description>
                    <conditionFlags><flag name="optB">sel</flag></conditionFlags>
                    <files><file source="b/f.esp" destination="f.esp" /></files>
                    <typeDescriptor>
                      <dependencyType>
                        <defaultType name="Optional" />
                        <patterns>
                          <pattern>
                            <dependencies operator="Or">
                              <fileDependency file="x.esp" state="Active" />
                              <flagDependency flag="optA" value="sel" />
                            </dependencies>
                            <type name="Recommended" />
                          </pattern>
                        </patterns>
                      </dependencyType>
                    </typeDescriptor>
                  </plugin>
                </plugins>
              </group>
            </optionalFileGroups>
          </installStep>
        </installSteps>
        <conditionalFileInstalls>
          <patterns>
            <pattern>
              <dependencies operator="And">
                <flagDependency flag="optA" value="sel" />
              </dependencies>
              <files><file source="patch/a.esp" destination="a_patch.esp" /></files>
            </pattern>
          </patterns>
        </conditionalFileInstalls>
      `);

      const config = parseModuleConfig(xml);

      // moduleName
      expect(config.moduleName).toEqual({
        value: 'Full Mod',
        position: 'Left',
        colour: 'FF0000'
      });

      // moduleImage
      expect(config.moduleImage).toEqual({
        path: 'header.png',
        showImage: true,
        showFade: false,
        height: 100
      });

      // moduleDependencies
      expect(config.moduleDependencies?.operator).toBe('And');
      expect(config.moduleDependencies?.items).toHaveLength(2);

      // requiredInstallFiles
      expect(config.requiredInstallFiles?.files).toHaveLength(1);
      expect(config.requiredInstallFiles?.files[0]?.alwaysInstall).toBe(true);
      expect(config.requiredInstallFiles?.files[0]?.priority).toBe(1);
      expect(config.requiredInstallFiles?.folders).toHaveLength(1);

      // installSteps
      expect(config.installSteps?.order).toBe('Explicit');
      expect(config.installSteps?.installSteps).toHaveLength(1);
      const step = config.installSteps!.installSteps[0]!;
      expect(step.name).toBe('Choose');
      expect(step.visible?.items).toHaveLength(1);

      // groups
      const groups = step.optionalFileGroups.groups;
      expect(groups).toHaveLength(1);
      expect(groups[0]?.type).toBe('SelectExactlyOne');

      // plugins
      const plugins = groups[0]!.plugins.plugins;
      expect(plugins).toHaveLength(2);
      expect(plugins[0]?.name).toBe('Option A');
      expect(plugins[0]?.image?.path).toBe('a.png');
      expect(plugins[0]?.conditionFlags?.flags[0]).toEqual({
        name: 'optA',
        value: 'sel'
      });
      expect(plugins[1]?.name).toBe('Option B');

      // dependencyType on plugin B
      const td = plugins[1]!.typeDescriptor;
      expect('dependencyType' in td).toBe(true);
      if('dependencyType' in td) {
        expect(td.dependencyType?.defaultType.name).toBe('Optional');
        expect(td.dependencyType?.patterns.patterns[0]?.dependencies.operator).toBe('Or');
        expect(td.dependencyType?.patterns.patterns[0]?.dependencies.items).toHaveLength(2);
      }

      // conditionalFileInstalls
      expect(config.conditionalFileInstalls?.patterns.patterns).toHaveLength(1);
      expect(config.conditionalFileInstalls?.patterns.patterns[0]?.files.files[0]?.source).toBe('patch/a.esp');
    }));
  }));
}));
