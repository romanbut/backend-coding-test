/**
 * Class that implements custom error wrapper that provides additional data
 */
class BackendError extends Error {
  /**
   * @param {string} errorCode - basic error code
   * @param {string} message - detailed error description
   * @param {number} statusCode - associated HTTP error code
   */
  constructor(errorCode, message, statusCode = 500) {
    super(message);
    this.errorCode = errorCode;
    this.statusCode = statusCode;
  }
}

module.exports = BackendError;

