const trackingURL = document.widgetServerBaseUrl ? `${document.widgetServerBaseUrl}/v1/event/log` : 'https://widget.sezzle.com/v1/event/log';
const sezzleWidgetWrapperClass = 'sezzle-shopify-info-button';
const competitorClasses = ['afterpay-paragraph', 'affirm-as-low-as', 'qp-widget-container'];

/* eslint-disable class-methods-use-this */
class Utils {
  /**
   * Wrapper to make AJAX calls
   * @param {string} method
   * @param {string} url
  */

  static httpRequestWrapper(method, url, body = null) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open(method, url, true);
      if (body !== null) {
        xhr.setRequestHeader('Content-Type', 'application/json');
      }
      xhr.onload = function () {
        if (this.status >= 200 && this.status < 300) {
          resolve(xhr.response);
        } else {
          reject(new Error('Something went wrong, contact the Sezzle team!'));
        }
      };
      xhr.onerror = function () {
        reject(new Error('Something went wrong, contact the Sezzle team!'));
      };
      // eslint-disable-next-line no-unused-expressions
      body === null ? xhr.send() : xhr.send(JSON.stringify(body));
    });
  }

  /**
   * @description
   * @param {string} name
   */
  static _getCookie(name) {
    const value = `;${document.cookie}`;
    const parts = value.split(`;${name}=`);
    if (parts.length === 2) {
      return parts.pop().split(';').shift();
    }
  }


  /**
   * @description - Checks for more than one widget on merchant websites for logging
   */
  static checkForWidgetDuplicacy() {
    return document.getElementsByClassName(sezzleWidgetWrapperClass).length > 1;
  }


  static checkForCompetitorWidget() {
    let count = 0;
    Array.prototype.forEach.call(competitorClasses, (el) => {
      if (document.getElementsByClassName(el)) count++;
    });
    return count > 0;
  }

  /**
   * @description sends payload to widget-server which further logs event
   * @param {string} eventName
   * @param {object} _configInstance
   */
  static logEvent(eventName, _configInstance) {
    if (!_configInstance.noTracking) {
      this.httpRequestWrapper('post', trackingURL, {
        event_name: eventName,
        merchant_uuid: _configInstance.merchantID,
        merchant_site: window.location.hostname,
      });
    }
  }

  /**
   * This is a helper function to break xpath into array
   * @param xpath string Ex: './.class1/#id'
   * @returns string[] Ex: ['.', '.class', '#id']
   */
  // eslint-disable-next-line class-methods-use-this
  static breakXPath(xpath) {
    return xpath.split('/').filter((subpath) => subpath !== '');
  }

  static getWidgetBaseUrl() {
    return document.widgetServerBaseUrl || 'https://widget.sezzle.com';
  }

  static getGeoIpBaseUrl() {
    return document.geoIpBaseUrl || 'https://geoip.sezzle.com';
  }

  static predictBackgroundtheme() {
    let color = window.getComputedStyle(document.body).getPropertyValue('background-color');
    if (color === 'transparent' || color === 'rgba(0, 0, 0, 0)') {
      return 'light';
    }
    // Variables for red, green, blue values
    let r;
    let g;
    let b;
    // Check the format of the color, HEX or RGB?
    if (color.match(/^rgb/)) {
      // If RGB --> store the red, green, blue values in separate variables
      color = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/);
      // eslint-disable-next-line prefer-destructuring
      r = color[1];
      // eslint-disable-next-line prefer-destructuring
      g = color[2];
      // eslint-disable-next-line prefer-destructuring
      b = color[3];
    } else {
      // If hex --> Convert it to RGB
      color = +(`0x${color.slice(1).replace(color.length < 5 && /./g, '$&$&')}`);
      // eslint-disable-next-line no-bitwise
      r = color >> 16;
      // eslint-disable-next-line no-bitwise
      // eslint-disable-next-line no-mixed-operators
      g = color >> 8 & 255;
      // eslint-disable-next-line no-bitwise
      b = color & 255;
    }
    // Luminance
    const lumin = (r * 0.2126) + (g * 0.7152) + (b * 0.0722);
    // Lumosity
    const lumos = (Math.max(r, g, b) + Math.min(r, g, b)) / 2;
    // HSP (Highly Sensitive Poo) equation
    const hsp = Math.sqrt(
      0.299 * (r * r)
      + 0.587 * (g * g)
      + 0.114 * (b * b),
    );
    // Using the HSP value, determine whether the color is light or dark
    if (lumin / 46.795 < 3.6) {
      return 'dark';
    }
    return 'light';
  }
}

// eslint-disable-next-line import/prefer-default-export
// export const { httpRequestWrapper } = new Utils();
export default Utils;
