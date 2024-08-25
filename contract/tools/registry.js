import { useRegistry, useChain, ConfigContext } from 'starshipjs';
import path from 'path';

export const makeGetFile = () => filePath => {
  return path.join(path.dirname(new URL(import.meta.url).pathname), filePath);
};

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
