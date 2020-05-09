export const loop = (..._: any[]) => {}
/**
 * Checks if we're running in a browser environment.
 */
export const isBrowser = typeof window !== 'undefined';

/**
 * Checks whether we're running from a local file system.
 */
export const isLocalFileSystem = isBrowser && window.location.protocol === 'file:';

/**
 * Checks whether we're running on a production build or not.
 */
export const isProduction = process.env.NODE_ENV === 'production';

/**
 * Checks whether a variable is defined.
 *
 * @param {*} variable Variable to check
 */
export const isDefined = (variable: any) => typeof variable !== 'undefined';

/**
 * Checks whether a variable is defined and not null.
 *
 * @param {*} variable Variable to check
 */
export const isProvided = (variable: any) => isDefined(variable) && variable !== null;

/**
 * Checkes whether a variable provided is a string.
 *
 * @param {*} variable Variable to check
 */
export const isString = (variable: any) => typeof variable === 'string';

/**
 * Checks whether a variable provided is an ArrayBuffer.
 *
 * @param {*} variable Variable to check
 */
export const isArrayBuffer = (variable: any) => variable instanceof ArrayBuffer;

/**
 * Checkes whether a variable provided is a Blob.
 *
 * @param {*} variable Variable to check
 */
export const isBlob = (variable: any) => {
  if (!isBrowser) {
    throw new Error('Attempted to check if a variable is a Blob on a non-browser environment.');
  }

  return variable instanceof Blob;
};

/**
 * Checkes whether a variable provided is a File.
 *
 * @param {*} variable Variable to check
 */
export const isFile = (variable: any) => {
  if (!isBrowser) {
    throw new Error('Attempted to check if a variable is a File on a non-browser environment.');
  }

  return variable instanceof File;
};

/**
 * Checks whether a string provided is a data URI.
 *
 * @param {String} str String to check
 */
export const isDataURI = (str: string) => isString(str) && /^data:/.test(str);

export const dataURItoUint8Array = (dataURI: string) => {
  if (!isDataURI(dataURI)) {
    throw new Error('dataURItoUint8Array was provided with an argument which is not a valid data URI.');
  }

  let byteString;
  if (dataURI.split(',')[0].indexOf('base64') >= 0) {
    byteString = atob(dataURI.split(',')[1]);
  } else {
    byteString = unescape(dataURI.split(',')[1]);
  }

  const ia = new Uint8Array(byteString.length);
  for (let i = 0; i < byteString.length; i += 1) {
    ia[i] = byteString.charCodeAt(i);
  }

  return ia;
};

export const getPixelRatio = () => (isBrowser && window.devicePixelRatio) || 1;

const consoleOnDev = (method: 'log' | 'warn' | 'error', ...message: any[]) => {
  if (!isProduction) {
    // eslint-disable-next-line no-console
    console[method](...message);
  }
};

export const warnOnDev = (...message: string[]) => consoleOnDev('warn', ...message);

export const errorOnDev = (...message: any[]) => consoleOnDev('error', ...message);

export const displayCORSWarning = () => {
  if (isLocalFileSystem) {
    warnOnDev('Loading PDF as base64 strings/URLs might not work on protocols other than HTTP/HTTPS. On Google Chrome, you can use --allow-file-access-from-files flag for debugging purposes.');
  }
};

export const cancelRunningTask = (runningTask: { cancel: () => void; }) => {
  if (runningTask && runningTask.cancel) runningTask.cancel();
};

export const makePageCallback = (page: any, scale: number) => {
  Object.defineProperty(page, 'width', { get() { return this.view[2] * scale; }, configurable: true });
  Object.defineProperty(page, 'height', { get() { return this.view[3] * scale; }, configurable: true });
  Object.defineProperty(page, 'originalWidth', { get() { return this.view[2]; }, configurable: true });
  Object.defineProperty(page, 'originalHeight', { get() { return this.view[3]; }, configurable: true });
  return page;
};

export const isCancelException = (error: { name: string; }) => error.name === 'RenderingCancelledException';

export const loadFromFile = (file: Blob) => new Promise((resolve, reject) => {
  const reader: any = new FileReader();

  reader.onload = () => resolve(new Uint8Array(reader.result));
  reader.onerror = (event: any) => {
    switch (event.target.error.code) {
      case event.target.error.NOT_FOUND_ERR:
        return reject(new Error('Error while reading a file: File not found.'));
      case event.target.error.NOT_READABLE_ERR:
        return reject(new Error('Error while reading a file: File not readable.'));
      case event.target.error.SECURITY_ERR:
        return reject(new Error('Error while reading a file: Security error.'));
      case event.target.error.ABORT_ERR:
        return reject(new Error('Error while reading a file: Aborted.'));
      default:
        return reject(new Error('Error while reading a file.'));
    }
  };
  reader.readAsArrayBuffer(file);

  return null;
});