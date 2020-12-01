const trackingURL = "https://widget.sezzle.com/v1/event/log"
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
      if(body=== null){
        xhr.setRequestHeader("Content-Type", "application/json");
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
      if(body === null){
        xhr.send();
      }else{
        xhr.send(JSON.stringify(body))
      }
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

  /*
	* Is Mobile Browser
	*/
  static _isMobileBrowser() {
    // eslint-disable-next-line max-len
    return /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4));
  }

  /**
   * @description sends payload as message to the sezzle iframe which further logs event
   * @param {string} eventName
   * @param {object} _configInstance
   * @param {number} configGroupIndex
   */
  static logEvent(eventName, _configInstance, configGroupIndex) {
    if (!_configInstance.noTracking) {
      this.httpRequestWrapper('post',trackingURL,{
        event_name: eventName,
        button_version: document.sezzleButtonVersion,
        ip_address: _configInstance.ip,
        merchant_site: window.location.hostname,
        is_mobile_browser: this._isMobileBrowser(),
        user_agent: navigator.userAgent,
        merchant_uuid: _configInstance.merchantID,
        page_url: window.location.href,
        product_price: configGroupIndex !== undefined ? _configInstance.configGroups[configGroupIndex].productPrice : null,
        sezzle_config: JSON.stringify(_configInstance.config),
      }).then((r)=>{
        console.log(r)
      },e=>{
        console.log(e)
      })
      // const sezzleFrame = window.frames.szl;
      // if (sezzleFrame) {
      //   const viewport = { width: null, height: null };
      //   viewport.width = window.screen && window.screen.width ? window.screen.width : console.log('Cant fetch viewport width');
      //   viewport.height = window.screen && window.screen.height ? window.screen.height : console.log('Cant fetch viewport height');

      //   setTimeout(() => {
      //     sezzleFrame.postMessage({
      //       event_name: eventName,
      //       button_version: document.sezzleButtonVersion,
      //       cart_id: this._getCookie('cart'),
      //       ip_address: _configInstance.ip,
      //       merchant_site: window.location.hostname,
      //       is_mobile_browser: this._isMobileBrowser(),
      //       user_agent: navigator.userAgent,
      //       merchant_uuid: _configInstance.merchantID,
      //       page_url: window.location.href,
      //       viewport,
      //       product_price: configGroupIndex !== undefined ? _configInstance.configGroups[configGroupIndex].productPrice : null,
      //       sezzle_config: JSON.stringify(_configInstance.config),
      //     }, 'https://tracking.sezzle.com');
      //   }, 100);
      // }
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
}

// eslint-disable-next-line import/prefer-default-export
// export const { httpRequestWrapper } = new Utils();
export default Utils;
