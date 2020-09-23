/* eslint-disable prefer-destructuring */
import Utils from './utils';

class Modal {
  constructor(config) {
    this._config = config;
    this._scrollDistance = 0;
    this._modalNode = null;
    this._sezzleElement = null;
    this._configGroupIndex = null;
  }

  /**
   * ************* PUBLIC FUNCTIONS ***************
  */

  addClickEventForModal(sezzleElement, configGroupIndex) {
    this._sezzleElement = sezzleElement;
    this._configGroupIndex = configGroupIndex;
    this._sezzleAddClickEvent();
    this._apAddClickEvent();
    this._qpAddClickEvent();
    this._affirmAddClickEvent();
    this._klarnaAddClickEvent();
  }

  renderModals() {
    // This should always happen before rendering the widget
    this._renderModal();
    // only render APModal if ap-modal-link exists
    if (document.getElementsByClassName('ap-modal-info-link').length > 0) {
      this._renderAPModal();
    }
    // only render QPModal if qp-modal-link exists
    if (document.getElementsByClassName('quadpay-modal-info-link').length > 0) {
      this._renderQPModal();
    }
    // render affirm modal if affirm-modal-info-link exists
    if (document.getElementsByClassName('affirm-modal-info-link').length > 0) {
      this._renderAffirmModal();
    }
    // render klarna modal if klarna-modal-info-link exists
    if (document.getElementsByClassName('klarna-modal-info-link').length > 0) {
      this._renderKlarnaModal();
    }
  }

  /**
   * ************* PRIVATE FUNCTIONS ***************
  */

  _sezzleAddClickEvent() {
    const sezzleModalLinks = this._sezzleElement.getElementsByClassName('sezzle-modal-link');
    Array.prototype.forEach.call(sezzleModalLinks, (modalLink) => {
      modalLink.addEventListener('click', (event) => {
        if (!event.target.classList.contains('no-sezzle-info')) {
          let modalNode;
          // Makes sure to get rid of AP, QP, Affirm, and Klarna modals in our Sezzle modal event listener
          const modals = document.getElementsByClassName('sezzle-checkout-modal-lightbox');
          Array.prototype.forEach.call(modals, (element) => {
            if (!element.classList.contains('sezzle-ap-modal' || 'sezzle-qp-modal' || 'sezzle-affirm-modal' || 'sezzle-klarna-modal')) {
              modalNode = element;
            }
          });
          if (modalNode) {
            this._disableBodyScroll(true);
            modalNode.style.display = 'block'; // Remove hidden class to show the item
            const modals = modalNode.getElementsByClassName('sezzle-modal');
            if (modals.length) {
              modals[0].className = 'sezzle-modal';
            }
            // log on click event
            Utils.logEvent('onclick', this._configGroupIndex);
          }
        }
      });
    });
  }

  _apAddClickEvent() {
    const apModalLinks = this._sezzleElement.getElementsByClassName('ap-modal-info-link');
    Array.prototype.forEach.call(apModalLinks, (modalLink) => {
      modalLink.addEventListener('click', () => {
        // Show modal node
        document.getElementsByClassName('sezzle-ap-modal')[0].style.display = 'block';
        // log on click event
        Utils.logEvent('onclick-afterpay', this._configGroupIndex);
      });
    });
  }

  _qpAddClickEvent() {
    const qpModalLinks = this._sezzleElement.getElementsByClassName('quadpay-modal-info-link');
    Array.prototype.forEach.call(qpModalLinks, (modalLink) => {
      modalLink.addEventListener('click', () => {
        // Show modal node
        document.getElementsByClassName('sezzle-qp-modal')[0].style.display = 'block';
        // log on click event
        Utils.logEvent('onclick-quadpay', this._configGroupIndex);
      });
    });
  }

  _affirmAddClickEvent() {
    const affirmModalLinks = this._sezzleElement.getElementsByClassName('affirm-modal-info-link');
    Array.prototype.forEach.call(affirmModalLinks, (modalLink) => {
      modalLink.addEventListener('click', () => {
        // Show modal node
        document.getElementsByClassName('sezzle-affirm-modal')[0].style.display = 'block';
        // log on click event
        Utils.logEvent('onclick-affirm', this._configGroupIndex);
      });
    });
  }

  _klarnaAddClickEvent() {
    const klarnaModalLinks = this._sezzleElement.getElementsByClassName('klarna-modal-info-link');
    Array.prototype.forEach.call(klarnaModalLinks, (modalLink) => {
      modalLink.addEventListener('click', () => {
        // Show modal node
        document.getElementsByClassName('sezzle-klarna-modal')[0].style.display = 'block';
        // log on click event
        Utils.logEvent('onclick-klarna', this._configGroupIndex);
      });
    });
  }

  /**
   * @description Adds/removes styles to stop body scroll when modal is open. Also
   * records/restores the scroll position to avoid side effects of position: fixed
   * @param {boolean} -> disable/enable scroll
  */
  _disableBodyScroll(disable) {
    const bodyElement = document.body;
    // Add styles if modal is open
    if (disable) {
      // Cross-browser
      this._scrollDistance = window.pageYOffset || (document.documentElement.clientHeight
        ? document.documentElement.scrollTop
        : document.body.scrollTop) || 0;
      bodyElement.classList.add('sezzle-modal-open');
      // reset scroll in background because of previous step
      bodyElement.style.top = `${this._scrollDistance * -1}px`;
    } else {
      // Remove styles if modal closes and resets body scroll position as well modal scroll to 0,0
      bodyElement.classList.remove('sezzle-modal-open');
      window.scrollTo(0, this._scrollDistance);
      bodyElement.style.top = 0;
      // reset modal scroll
      document.getElementsByClassName('sezzle-modal')[0].scrollTop = 0;
    }
  }

  async _renderModal() {
    this._modalNode = document.createElement('div');
    if (!document.getElementsByClassName('sezzle-checkout-modal-lightbox').length) {
      this._modalNode.className = 'sezzle-checkout-modal-lightbox close-sezzle-modal';
      this._modalNode.style.display = 'none';
      this._modalNode.style.maxHeight = '100%';
    } else {
      this._modalNode = document.getElementsByClassName('sezzle-checkout-modal-lightbox')[0];
    }
    if (this._config.altModalHTML) {
      this._modalNode.innerHTML = this._config.altModalHTML;
    } else if (document.sezzleDefaultModalVersion && document.sezzleModalAvailableLanguages) {
      // Convert document.sezzleModalAvailableLanguages into Array
      const availableLanguages = document.sezzleModalAvailableLanguages.split(',').map((singleLanguage) => singleLanguage.trim());
      let modalLanguage;
      if (availableLanguages.indexOf(this._config.language) > -1) {
        modalLanguage = this._config.language;
      } else {
        modalLanguage = 'en';
      }
      const sezzleModalToGet = `${this._config.apiEndpoints.sezzleAssetsCDN}${document.sezzleDefaultModalVersion.replace('{%%s%%}', modalLanguage)}`;
      const response = await Utils.httpRequestWrapper('GET', sezzleModalToGet);
      this._modalNode.innerHTML = response;
    }
    document.getElementsByTagName('html')[0].appendChild(this._modalNode);
    this._closeSezzleModalHandler();
  }

  _closeSezzleModalHandler() {
    Array.prototype.forEach.call(document.getElementsByClassName('close-sezzle-modal'), (el) => {
      el.addEventListener('click', () => {
        this._disableBodyScroll(false);
        // Display the modal node
        this._modalNode.style.display = 'none';
        // Add hidden class hide the item
        this._modalNode.getElementsByClassName('sezzle-modal')[0].className = 'sezzle-modal sezzle-checkout-modal-hidden';
      });
    });
    // Event listener to prevent close in modal if click happens within sezzle-checkout-modal
    let sezzleModal = document.getElementsByClassName('sezzle-modal')[0];
    // backwards compatability check
    if (!sezzleModal) sezzleModal = document.getElementsByClassName('sezzle-checkout-modal')[0];
    sezzleModal.addEventListener('click', (event) => event.stopPropagation());
  }

  _renderAPModal() {
    const modalNodeAP = document.createElement('div');
    modalNodeAP.className = 'sezzle-checkout-modal-lightbox close-sezzle-modal sezzle-ap-modal';
    modalNodeAP.style = 'position: center';
    modalNodeAP.style.display = 'none';
    modalNodeAP.innerHTML = this._config.apModalHTML;
    document.getElementsByTagName('html')[0].appendChild(modalNodeAP);
    // Event listener for close in modal
    Array.prototype.forEach.call(document.getElementsByClassName('close-sezzle-modal'), (el) => {
      el.addEventListener('click', () => { modalNodeAP.style.display = 'none'; });
    });
    // Event listener to prevent close in modal if click happens within sezzle-checkout-modal
    let sezzleModal = document.getElementsByClassName('sezzle-modal')[0];
    // backwards compatability check
    if (!sezzleModal) sezzleModal = document.getElementsByClassName('sezzle-checkout-modal-lightbox')[0];
    sezzleModal.addEventListener('click', (event) => event.stopPropagation());
  }

  _renderQPModal() {
    const modalNodeQP = document.createElement('div');
    modalNodeQP.className = 'sezzle-checkout-modal-lightbox close-sezzle-modal sezzle-qp-modal';
    modalNodeQP.style = 'position: center';
    modalNodeQP.style.display = 'none';
    modalNodeQP.innerHTML = this._config.qpModalHTML;
    document.getElementsByTagName('html')[0].appendChild(modalNodeQP);
    // Event listener for close in modal
    Array.prototype.forEach.call(document.getElementsByClassName('close-sezzle-modal'), (el) => {
      el.addEventListener('click', () => { modalNodeQP.style.display = 'none'; });
    });
    // Event listener to prevent close in modal if click happens within sezzle-checkout-modal
    let sezzleModal = document.getElementsByClassName('sezzle-modal')[0];
    // backwards compatability check
    if (!sezzleModal) sezzleModal = document.getElementsByClassName('sezzle-checkout-modal-lightbox')[0];
    sezzleModal.addEventListener('click', (event) => event.stopPropagation());
  }

  _renderAffirmModal() {
    const modalNodeAffirm = document.createElement('div');
    modalNodeAffirm.className = 'sezzle-checkout-modal-lightbox close-sezzle-modal sezzle-affirm-modal';
    modalNodeAffirm.style = 'position: center';
    modalNodeAffirm.style.display = 'none';
    modalNodeAffirm.innerHTML = this._config.affirmModalHTML;
    document.getElementsByTagName('html')[0].appendChild(modalNodeAffirm);
    // Event listener for close in modal
    Array.prototype.forEach.call(document.getElementsByClassName('close-sezzle-modal'), (el) => {
      el.addEventListener('click', () => { modalNodeAffirm.style.display = 'none'; });
    });
    // Event listener to prevent close in modal if click happens within sezzle-checkout-modal
    let sezzleModal = document.getElementsByClassName('sezzle-modal')[0];
    // backwards compatability check
    if (!sezzleModal) sezzleModal = document.getElementsByClassName('sezzle-checkout-modal-lightbox')[0];
    sezzleModal.addEventListener('click', (event) => event.stopPropagation());
  }

  _renderKlarnaModal() {
    const modalNodeKlarna = document.createElement('div');
    modalNodeKlarna.className = 'sezzle-checkout-modal-lightbox close-sezzle-modal sezzle-klarna-modal';
    modalNodeKlarna.style = 'position: center';
    modalNodeKlarna.style.display = 'none';
    modalNodeKlarna.innerHTML = this._config.klarnaModalHTML;
    document.getElementsByTagName('html')[0].appendChild(modalNodeKlarna);
    // Event listener for close in modal
    Array.prototype.forEach.call(document.getElementsByClassName('close-sezzle-modal'), (el) => {
      el.addEventListener('click', () => { modalNodeKlarna.style.display = 'none'; });
    });
    // Event listener to prevent close in modal if click happens within sezzle-checkout-modal
    let sezzleModal = document.getElementsByClassName('sezzle-modal')[0];
    // backwards compatability check
    if (!sezzleModal) sezzleModal = document.getElementsByClassName('sezzle-checkout-modal-lightbox')[0];
    sezzleModal.addEventListener('click', (event) => event.stopPropagation());
  }
}

export default Modal;
