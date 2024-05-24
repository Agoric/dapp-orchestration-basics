import '@agoric/vats/src/core/types';

/**
 * In agoric-sdk, the BootstrapPowers.consume['chainStorage'] type includes undefined because
 * of some historical testing practices. It's tedious and unnecessary
 * to check for undefined, so here we override the type to say that it's
 * never undefined.
 *
 * @typedef {PromiseSpaceOf<{ chainStorage: StorageNode }>} NonNullChainStorage
 */
