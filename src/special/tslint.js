import path from 'path';
import requirePackageName from 'require-package-name';
import { loadConfig } from '../utils/linters';
import { wrapToArray } from '../utils/index';

function resolvePresetPackage(preset, rootDir) {
  if (preset.startsWith('./') || preset.startsWith('../')) {
    return path.resolve(rootDir, preset);
  }
  return preset;
}

function checkConfig(config, rootDir) {
  return wrapToArray(config.extends)
    .filter(preset => !preset.startsWith('tslint:'))
    .map(preset => resolvePresetPackage(preset, rootDir))
    .filter(preset => !path.isAbsolute(preset))
    .map(requirePackageName);
}

export default function parseTSLint(content, filename, deps, rootDir) {
  const config = loadConfig('tslint', filename, content);
  if (config) {
    return checkConfig(config, rootDir);
  }

  return [];
}
