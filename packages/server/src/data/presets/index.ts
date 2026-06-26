import { kuaidaPreset } from "./kuaida/index.js";
import { xtablePreset } from "./xtable-v2/index.js";
import { filePreset } from "./file/index.js";
import { mockPreset } from "./mock/index.js";

export const presets = [mockPreset, kuaidaPreset, xtablePreset, filePreset];
