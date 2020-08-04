/* global Fingerprint2, _ */
/**
 * browser independent checklist.
 * https://github.com/fingerprintjs/fingerprintjs2/wiki/Browser-independent-components
 * ie support와 fingerprint data ready를 위한 time cost를 고려해야한다.
 */
const allOptions = [
  'userAgent',
  'webdriver',
  'language',
  'colorDepth',
  'deviceMemory',
  'pixelRatio',
  'hardwareConcurrency',
  'screenResolution',
  'availableScreenResolution',
  'timezoneOffset',
  'timezone',
  'sessionStorage',
  'localStorage',
  'indexedDb',
  'addBehavior',
  'openDatabase',
  'cpuClass',
  'platform',
  'doNotTrack',
  'plugins',
  'canvas',
  'webgl',
  'webglVendorAndRenderer',
  'adBlock',
  'hasLiedLanguages',
  'hasLiedResolution',
  'hasLiedOs',
  'hasLiedBrowser',
  'touchSupport',
  'fonts',
  'fontsFlash',
  'audio',
  'enumerateDevices',
];
// ie support
window.requestIdleCallback = window.requestIdleCallback
  || function (cb) {
    const start = Date.now();
    return setTimeout(() => {
      cb({
        didTimeout: false,
        timeRemaining() {
          return Math.max(0, 50 - (Date.now() - start));
        },
      });
    }, 1);
  };

/**
 *
 * @param activeOptions
 * @returns {Promise<any>}
 */
function getMaterialOfFingerprintWithOptions({ activeOptions = [] }) {
  const excludeOptions = allOptions.filter((option) => activeOptions.indexOf(option) === -1);
  const optionsWrapper = {
    excludes: _.mapValues(_.keyBy(excludeOptions), () => true),
  };
  return Fingerprint2
    .getPromise(optionsWrapper);
}

/**
 *
 * @param activeOptions
 * @returns {PromiseLike<string>} encoded string of stringified json to base64.
 */
function getFingerprintWithBToA({ activeOptions = [] }) {
  return getMaterialOfFingerprintWithOptions({ activeOptions })
    .then((components) => components.reduce((current, nextRemain) => {
      // eslint-disable-next-line no-param-reassign
      if (current.key) { current = { [current.key]: current.value }; }
      // eslint-disable-next-line no-param-reassign
      current[nextRemain.key] = nextRemain.value;
      return current;
    }))
    .then((r) => window.btoa(JSON.stringify(r)));
}

/**
 *
 * @type {function({activeOptions?: *}): PromiseLike<string>}
 */
const getFingerprint = getFingerprintWithBToA;
const activeOptions = ['userAgent', 'screenResolution', 'timezone'];

window.requestIdleCallback(async () => {
  const fingerprint = await getFingerprint({ activeOptions });
  document.querySelector('body').innerHTML = `your fingerprint is ${fingerprint}.`;

  const ta = `<textarea>${fingerprint}</textarea>`;
  document.querySelector('body').insertAdjacentHTML('beforeend',ta);
});
