/* eslint-disable max-lines */
import type {Meta, StoryObj} from '@storybook/react';
import type {FileSystemItem, ModuleConfiguration} from '@sweetroll/fomod';

import {FomodInstaller} from '../src/components/FomodInstaller';

const file = ((source: string, destination?: string): FileSystemItem => ({
  source: source,
  destination: destination,
  alwaysInstall: false,
  installIfUsable: false,
  priority: 0
}));

const simpleConfig: ModuleConfiguration = {
  moduleName: {
    value: 'Enhanced Textures Pack',
    position: 'Left',
    colour: '000000'
  },
  installSteps: {
    installSteps: [
      {
        name: 'Texture Quality',
        optionalFileGroups: {
          groups: [
            {
              name: 'Resolution',
              type: 'SelectExactlyOne',
              plugins: {
                plugins: [
                  {
                    name: '1K Textures',
                    description: 'Low resolution textures for older hardware.',
                    typeDescriptor: {type: {name: 'Optional'}},
                    files: {
                      files: [file('textures/1k/', 'Data/textures/')],
                      folders: []
                    }
                  },
                  {
                    name: '2K Textures',
                    description: 'Balanced quality and performance. Recommended for most systems.',
                    typeDescriptor: {type: {name: 'Recommended'}},
                    files: {
                      files: [file('textures/2k/', 'Data/textures/')],
                      folders: []
                    }
                  },
                  {
                    name: '4K Textures',
                    description: 'Maximum quality. Requires a modern GPU with 8GB+ VRAM.',
                    typeDescriptor: {type: {name: 'Optional'}},
                    files: {
                      files: [file('textures/4k/', 'Data/textures/')],
                      folders: []
                    }
                  }
                ],
                order: 'Explicit'
              }
            }
          ],
          order: 'Explicit'
        }
      },
      {
        name: 'Optional Extras',
        optionalFileGroups: {
          groups: [
            {
              name: 'Additional Options',
              type: 'SelectAny',
              plugins: {
                plugins: [
                  {
                    name: 'Parallax Mapping',
                    description: 'Adds depth to flat surfaces using parallax occlusion mapping.',
                    typeDescriptor: {type: {name: 'Optional'}},
                    files: {
                      files: [file('parallax/', 'Data/textures/parallax/')],
                      folders: []
                    }
                  },
                  {
                    name: 'Enhanced Normal Maps',
                    description: 'Higher quality normal maps for improved surface detail.',
                    typeDescriptor: {type: {name: 'Optional'}},
                    files: {
                      files: [file('normals/', 'Data/textures/normals/')],
                      folders: []
                    }
                  },
                  {
                    name: 'Glow Maps',
                    description: 'Adds glow effects to windows and magical objects.',
                    typeDescriptor: {type: {name: 'Optional'}},
                    files: {
                      files: [file('glow/', 'Data/textures/glow/')],
                      folders: []
                    }
                  }
                ],
                order: 'Explicit'
              }
            }
          ],
          order: 'Explicit'
        }
      }
    ],
    order: 'Explicit'
  }
};

const multiGroupConfig: ModuleConfiguration = {
  moduleName: {
    value: 'Complete Weather Overhaul',
    position: 'Left',
    colour: '1a3a5c'
  },
  moduleImage: {
    path: 'https://placehold.co/800x100',
    showImage: true,
    showFade: true,
    height: -1
  },
  requiredInstallFiles: {
    files: [file('core/weather.esp', 'Data/weather.esp')],
    folders: []
  },
  installSteps: {
    installSteps: [
      {
        name: 'Weather Style',
        optionalFileGroups: {
          groups: [
            {
              name: 'Climate Preset',
              type: 'SelectExactlyOne',
              plugins: {
                plugins: [
                  {
                    name: 'Natural',
                    description: 'Realistic weather patterns based on real-world climate data.',
                    typeDescriptor: {type: {name: 'Recommended'}},
                    conditionFlags: {
                      flags: [{
                        name: 'weatherStyle',
                        value: 'natural'
                      }]
                    }
                  },
                  {
                    name: 'Fantasy',
                    description: 'Dramatic, otherworldly weather with vivid colours.',
                    typeDescriptor: {type: {name: 'Optional'}},
                    conditionFlags: {
                      flags: [{
                        name: 'weatherStyle',
                        value: 'fantasy'
                      }]
                    }
                  },
                  {
                    name: 'Grim',
                    description: 'Dark, overcast skies with frequent fog and rain.',
                    typeDescriptor: {type: {name: 'Optional'}},
                    conditionFlags: {
                      flags: [{
                        name: 'weatherStyle',
                        value: 'grim'
                      }]
                    }
                  }
                ],
                order: 'Explicit'
              }
            },
            {
              name: 'Night Sky',
              type: 'SelectExactlyOne',
              plugins: {
                plugins: [
                  {
                    name: 'Vanilla Stars',
                    description: 'Keep the default night sky.',
                    typeDescriptor: {type: {name: 'Optional'}}
                  },
                  {
                    name: 'Galaxy Nebulae',
                    description: 'Adds visible nebulae and the Milky Way.',
                    typeDescriptor: {type: {name: 'Optional'}}
                  },
                  {
                    name: 'Dense Starfield',
                    description: 'Thousands of visible stars on clear nights.',
                    typeDescriptor: {type: {name: 'Optional'}}
                  }
                ],
                order: 'Explicit'
              }
            }
          ],
          order: 'Explicit'
        }
      },
      {
        name: 'Compatibility',
        optionalFileGroups: {
          groups: [
            {
              name: 'Lighting Mod Patches',
              type: 'SelectAny',
              plugins: {
                plugins: [
                  {
                    name: 'ELFX Patch',
                    description: 'Compatibility patch for Enhanced Lights and FX.',
                    typeDescriptor: {type: {name: 'Optional'}},
                    files: {
                      files: [file('patches/elfx.esp', 'Data/patches/elfx.esp')],
                      folders: []
                    }
                  },
                  {
                    name: 'RLO Patch',
                    description: 'Compatibility patch for Realistic Lighting Overhaul.',
                    typeDescriptor: {type: {name: 'Optional'}},
                    files: {
                      files: [file('patches/rlo.esp', 'Data/patches/rlo.esp')],
                      folders: []
                    }
                  },
                  {
                    name: 'ENB Preset',
                    description: 'Pre-configured ENB settings tuned for this weather mod.',
                    typeDescriptor: {type: {name: 'Optional'}},
                    files: {
                      files: [file('enb/enbseries.ini', 'enbseries.ini')],
                      folders: []
                    }
                  }
                ],
                order: 'Explicit'
              }
            }
          ],
          order: 'Explicit'
        }
      },
      {
        name: 'Performance',
        optionalFileGroups: {
          groups: [
            {
              name: 'Performance Options',
              type: 'SelectAtMostOne',
              plugins: {
                plugins: [
                  {
                    name: 'Reduced Particle Effects',
                    description: 'Halves the number of weather particles for better FPS.',
                    typeDescriptor: {type: {name: 'Optional'}}
                  },
                  {
                    name: 'Simplified Cloud Meshes',
                    description: 'Uses lower-poly cloud meshes.',
                    typeDescriptor: {type: {name: 'Optional'}}
                  }
                ],
                order: 'Explicit'
              }
            }
          ],
          order: 'Explicit'
        }
      }
    ],
    order: 'Explicit'
  }
};

const conditionalConfig: ModuleConfiguration = {
  moduleName: {
    value: 'Mod With Conditions',
    position: 'Left',
    colour: '333333'
  },
  installSteps: {
    installSteps: [
      {
        name: 'Base Options',
        optionalFileGroups: {
          groups: [
            {
              name: 'Core',
              type: 'SelectAll',
              plugins: {
                plugins: [
                  {
                    name: 'Base Files',
                    description: 'Required base files.',
                    typeDescriptor: {type: {name: 'Required'}},
                    conditionFlags: {
                      flags: [{
                        name: 'coreInstalled',
                        value: 'true'
                      }]
                    }
                  }
                ],
                order: 'Explicit'
              }
            }
          ],
          order: 'Explicit'
        }
      },
      {
        name: 'Conditional Step',
        visible: {
          operator: 'And',
          items: [
            {
              type: 'flagDependency',
              value: {
                flag: 'coreInstalled',
                value: 'true'
              }
            }
          ]
        },
        optionalFileGroups: {
          groups: [
            {
              name: 'Advanced Options',
              type: 'SelectAny',
              plugins: {
                plugins: [
                  {
                    name: 'Extra Feature A',
                    description: 'Only visible because core was installed.',
                    typeDescriptor: {type: {name: 'Optional'}}
                  },
                  {
                    name: 'Extra Feature B',
                    description: 'Another conditional option.',
                    typeDescriptor: {type: {name: 'Optional'}}
                  }
                ],
                order: 'Explicit'
              }
            }
          ],
          order: 'Explicit'
        }
      }
    ],
    order: 'Explicit'
  }
};

const meta = ({
  title: 'Components/FomodInstaller',
  component: FomodInstaller,
  args: {
    config: simpleConfig,
    onInstall: (() => {
      // NO-OP
    }),
    onCancel: (() => {
      // NO-OP
    })
  }
} satisfies Meta<typeof FomodInstaller>);

type Story = StoryObj<typeof meta>;

const Simple: Story = {};

const MultiGroup: Story = {args: {config: multiGroupConfig}};

const WithConditionalSteps: Story = {args: {config: conditionalConfig}};

const WithFileStates: Story = {
  args: {
    config: multiGroupConfig,
    fileStates: {
      'elfx.esp': 'Active',
      'rlo.esp': 'Missing'
    },
    gameVersion: '1.6.1170'
  }
};

export default meta;
export {
  MultiGroup,
  Simple,
  WithConditionalSteps,
  WithFileStates
};
