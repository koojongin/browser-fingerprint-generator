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
/**
 * ie support
 */
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
 * 전달받은 activeOptions[]를 기반으로 exclude할 option wrapper를 만들어낸다.
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
 * brower fingerprint를 만들기 전 재료들을 모아 base64로 encoding하여 전달 한다.
 * 기존 fingerprintjs는 클라이언트에서 만들어내서 이 부분을 서버에서 하고자 할때 사용한다.
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

const getFingerprint = getFingerprintWithBToA;
const activeOptions = ['userAgent', 'screenResolution', 'timezone'];

window.requestIdleCallback(async () => {
  const fingerprint = await getFingerprint({ activeOptions });
  document.querySelector('body').innerHTML = `your fingerprint is ${fingerprint}.`;

  const ta = `<textarea>${fingerprint}</textarea>`;
  document.querySelector('body').insertAdjacentHTML('beforeend',ta);
});
