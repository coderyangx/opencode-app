import { kuaidaPreset } from './kuaida/index.js';
import { kuaidaMockPreset } from './kuaida/index-mock.js';
import { xtablePreset } from './xtable-v2/index.js';
import { filePreset } from './file/index.js';
import { mockPreset } from './mock/index.js';

export const presets = [mockPreset, kuaidaPreset, kuaidaMockPreset, xtablePreset, filePreset];
