import { useRegistry, useChain, ConfigContext } from 'starshipjs';
import path from 'path';

// export const makeGetFile = () => filePath => {
//   return path.join(path.dirname(new URL(import.meta.url).pathname), filePath);
// };

/**
 * @param {Object} [options]
 * @param {string} [options.dirname]
 * @param {Function} [options.join]
 * @returns {(filePath: string) => string}
 */
export const makeGetFile = ({
  dirname = path.dirname(new URL(import.meta.url).pathname),
  join = path.join,
} = {}) => {
  return filePath => {
    return join(dirname, filePath);
  };
};

/**
 * @param {(path: string) => string} getFile
 * @returns { (options?: { config?: string }) => Promise<{ useChain: any }> }
 */
export const makeSetupRegistry = getFile => {
  let initialized = false;

  const setupRegistry = async ({ config = '../config.yaml' } = {}) => {
    if (initialized) return { useChain };
    const configFile = getFile(config);
    console.log('configFile', configFile);
    const fetcher = await useRegistry(configFile);
    await ConfigContext.init(configFile, fetcher);
    initialized = true;
    return { useChain };
  };

  return setupRegistry;
};
