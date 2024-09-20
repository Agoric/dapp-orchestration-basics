// @ts-check
import '@endo/init';
import { makeNodeBundleCache } from '@endo/bundle-source/cache.js';

const trace = (...msgs) => console.log('[rollup-plugin-core-eval]', ...msgs);

export const coreEvalGlobals = {
  E: 'E',
  Far: 'Far',
};

const redactImportDecls = txt =>
  txt.replace(/^\s*import\b\s*(.*)/gm, '// XMPORT: $1');
const omitExportKewords = txt => txt.replace(/^\s*export\b\s*/gm, '');
// cf. ses rejectImportExpressions
// https://github.com/endojs/endo/blob/ebc8f66e9498f13085a8e64e17fc2f5f7b528faa/packages/ses/src/transforms.js#L143
const hideImportExpr = txt => txt.replace(/\bimport\b/g, 'XMPORT');

export const moduleToScript = () => ({
  name: 'module-to-script',
  generateBundle: (_opts, bundle, _isWrite) => {
    for (const fileName of Object.keys(bundle)) {
      bundle[fileName].code = hideImportExpr(
        redactImportDecls(omitExportKewords(bundle[fileName].code)),
      );
    }
  },
});

export const configureOptions = ({ options }) => {
  const pattern = new RegExp(`options: Fail.*`, 'g');
  const replacement = `options: ${JSON.stringify(options)},`;
  return {
    name: 'configureOptions',
    transform: async (code, _id) => {
      const revised = code.replace(pattern, replacement);
      if (revised === code) return null;
      return { code: revised };
    },
  };
};

export const configureBundleID = ({ name, rootModule, cache }) => {
  // const pattern = new RegExp(`^ *bundleID\\b = Fail.*`);
  // const pattern = new RegExp(`Fail\``);
  // const pattern = /Fail`no bundleID`/
  const pattern = new RegExp(`bundleID\\b = Fail.*`);
  const bundleCacheP = makeNodeBundleCache(cache, {}, s => import(s));
  return {
    name: 'configureBundleID',
    transform: async (code, _id) => {
      trace('transform', name, code, _id);
      // passes in code
      const bundle = await bundleCacheP.then(c =>
        c.load(rootModule, name, trace, { elideComments: true }),
      );
      trace(bundle.endoZipBase64Sha512);
      trace('rootModule: ', rootModule);
      trace('name: ', name);
      const test = JSON.stringify(`z${bundle.endoZipBase64Sha512}`);
      trace(test);
      const revised = code.replace(
        pattern,
        `bundleID = ${JSON.stringify(`b1-${bundle.endoZipBase64Sha512}`)}`,
        // test,
        // () => `b1-${test}`
      );
      trace('revised === code:', revised === code);
      if (revised === code) return null;
      return { code: revised };
    },
  };
};

export const emitPermit = ({ permit, file }) => ({
  name: 'emit-permit',
  generateBundle(_opts, _bundle) {
    this.emitFile({
      type: 'asset',
      fileName: file,
      source: JSON.stringify(permit, null, 2),
    });
  },
});
