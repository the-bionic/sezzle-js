/* eslint-disable prefer-destructuring */
import Utils from './utils';

class Modal {
  constructor(config) {
    this._config = config;
    this._scrollDistance = 0;
    this._modalNode = null;
    this._sezzleElement = null;
    this._configGroupIndex = null;
    this._vendorsSupportedForDualInstall = ['ap', 'qp', 'affirm', 'klarna'];
    this._translations = {
      en: [
        {id: "sezzle-header", text: "Sezzle it now."},
        {id: "desktop-header", text: "Pay us back later."},
        {id: "mobile-header", text: "Pay us back later."},
        {id: "desktop-main-1", text: "Check out with Sezzle and split your entire order into "},
        {id: "desktop-main-2", text: "4 interest-free payments over 6 weeks."},
        {id: "mobile-main", text: "Check out with Sezzle and split your entire order into 4 interest-free payments over 6 weeks."},
        {id: "pie-1", text: "today"},
        {id: "pie-2", text: "week 2"},
        {id: "pie-3", text: "week 4"},
        {id: "pie-4", text: "week 6"},
        {id: "single-feature-1", text: "No Interest, Ever"},
        {id: "single-feature-2", text: "Plus no fees if you pay on time"},
        {id: "single-feature-3", text: "No Impact to Your"},
        {id: "single-feature-4", text: "Credit Score"},
        {id: "single-feature-5", text: "Instant Approval"},
        {id: "single-feature-6", text: "Decisions"},
        {id: "desktop-footer-1", text: "Just select"},
        {id: "desktop-footer-2", text: "Sezzle"},
        {id: "desktop-footer-3", text: "at checkout!"},
        {id: "mobile-footer-1", text: "Just select Sezzle"},
        {id: "mobile-footer-2", text: "at checkout!"},
        {id: "terms", text: "Subject to approval."},
      ],
      fr: [
        {id: "sezzle-header", text: "Sezzlez maintenant."},
        {id: "desktop-header", text: "Payez-nous plus tard."},
        {id: "mobile-header", text: "Payez-nous plus tard."},
        {id: "desktop-main-1", text: "Payez avec Sezzle pour répartir le montant de votre commande en 4 versements sans intérêts"},
        {id: "desktop-main-2", text: "étalés sur 6 semaines."},
        {id: "mobile-main", text: "Payez avec Sezzle pour répartir le montant de votre commande en 4 versements sans intérêts étalés sur 6 semaines."},
        {id: "pie-1", text: "aujourd'hui"},
        {id: "pie-2", text: "semaine 2"},
        {id: "pie-3", text: "semaine 4"},
        {id: "pie-4", text: "semaine 6"},
        {id: "single-feature-1", text: "Pas d'intérêts, jamais."},
        {id: "single-feature-2", text: "Pas de frais non plus si vous payez aux dates prévues"},
        {id: "single-feature-3", text: "Pas d'impact sur"},
        {id: "single-feature-4", text: "votre cote de crédit"},
        {id: "single-feature-5", text: "Décisions d'approbation"},
        {id: "single-feature-6", text: "instantanées"},
        {id: "desktop-footer-1", text: "Vous n'avez qu'à choisir"},
        {id: "desktop-footer-2", text: "Sezzle"},
        {id: "desktop-footer-3", text: "au moment de régler"},
        {id: "mobile-footer-1", text: "Vous n'avez qu'à choisir Sezzle"},
        {id: "mobile-footer-2", text: "au moment de régler"},
        {id: "terms", text: "Sous réserve d'approbation."}, 
      ],
    de:[
      {id: "sezzle-header", text: "Jetzt Sezzlen."},
      {id: "desktop-header", text: "Später zahlen."},
      {id: "mobile-header", text: "Später zahlen."},
      {id: "desktop-main-1", text: "Checke einfach mit Sezzle aus und zahle deine gesamte Bestellung in"},
      {id: "desktop-main-2", text: "4 zinslosen Raten über 3 Monate."},
      {id: "mobile-main", text: "Checke einfach mit Sezzle aus und zahle deine gesamte Bestellung in 4 zinslosen Raten über 3 Monate."},
      {id: "pie-1", text: "heute"},
      {id: "pie-2", text: "30 Tage"},
      {id: "pie-3", text: "60 Tage"},
      {id: "pie-4", text: "90 Tage"},
      {id: "single-feature-1", text: "Keine Zinsen. Punkt."},
      {id: "single-feature-2", text: "Zudem keine Gebühren, wenn du pünktlich zahlst"},
      {id: "single-feature-3", text: "Keine Auswirkungen auf deine"},
      {id: "single-feature-4", text: "Schufa-Score"},
      {id: "single-feature-5", text: "Sofortige"},
      {id: "single-feature-6", text: "Decisions"},
      {id: "desktop-footer-1", text: "Kreditentscheidung"},
      {id: "desktop-footer-2", text: "Einfach Sezzle"},
      {id: "desktop-footer-3", text: "beim Checkout wählen"},
      {id: "mobile-footer-1", text: "Einfach Sezzle"},
      {id: "mobile-footer-2", text: "beim Checkout wählen!"},
      {id: "terms", text: "Vorbehaltlich unserer Zustimmung."},
    ],
    es:[
      {id: "sezzle-header", text: "Sezzle ahora."},
      {id: "desktop-header", text: "Páganos más tarde."},
      {id: "mobile-header", text: "Páganos más tarde."},
      {id: "desktop-main-1", text: "Complete el pedido con Sezzle y divida toda su compra en"},
      {id: "desktop-main-2", text: "4 pagos sin intereses durante 6 semanas."},
      {id: "mobile-main", text: "Complete el pedido con Sezzle y divida toda su compra en 4 pagos sin intereses durante 6 semanas."},
      {id: "pie-1", text: "hoy"},
      {id: "pie-2", text: "Semana 2"},
      {id: "pie-3", text: "Semana 4"},
      {id: "pie-4", text: "Semana 6"},
      {id: "single-feature-1", text: "Sin interés, nunca"},
      {id: "single-feature-2", text: "Además, no hay tarifas si paga a tiempo"},
      {id: "single-feature-3", text: "Sin impacto en su"},
      {id: "single-feature-4", text: "puntaje crediticio"},
      {id: "single-feature-5", text: "Decisiones de"},
      {id: "single-feature-6", text: "aprobación instantáneas"},
      {id: "desktop-footer-1", text: "¡Simplemente seleccione"},
      {id: "desktop-footer-2", text: "Sezzle"},
      {id: "desktop-footer-3", text: "al finalizar la compra"},
      {id: "mobile-footer-1", text: "¡Simplemente seleccione Sezzle"},
      {id: "mobile-footer-2", text: "al finalizar la compra!"},
      {id: "terms", text: "Sujeto a aprobación."},
    ]
    }
  }

  /**
   * ************* PUBLIC FUNCTIONS ***************
  */

  addClickEventForModal(sezzleElement, configGroupIndex) {
    this._sezzleElement = sezzleElement;
    this._configGroupIndex = configGroupIndex;
    this._sezzleAddClickEvent();
    this._addClickEventForOtherVendors();
  }

  renderModals() {
    // This should always happen before rendering the widget
    this._renderModal();
    this._renderOtherVendorModals();
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
            document.body.ariaHidden = true;
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

  changeInnerHTML() {
    if(document.sezzleLanguage !== "en"){
      window.setTimeout(()=>{
       let toBeEditedNodes  = document.getElementsByClassName('sezzle-fill');
       Array.prototype.forEach.call(toBeEditedNodes, (el, i) => {
        let translatedArray = this._translations[document.sezzleLanguage]
        el.innerText =  translatedArray[i].text
       })
      },100)
     }
   }

  _addClickEventForOtherVendors() {
    this._vendorsSupportedForDualInstall.forEach((vendor) => {
      const modalLinks = this._sezzleElement.getElementsByClassName(`${vendor}-modal-info-link`);
      Array.prototype.forEach.call(modalLinks, (modalLink) => {
        modalLink.addEventListener('click', (event) => {
          this._disableBodyScroll(true);
          // Show modal node
          document.getElementsByClassName(`sezzle-${vendor}-modal`)[0].style.display = 'block';
          document.body.ariaHidden = true;
          // log on click event
          Utils.logEvent(`onclick-${vendor}`, this._configGroupIndex);
        });
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
      // clear scroll distance
      this._scrollDistance = 0;
    }
  }

  async _renderModal() {
    this._modalNode = document.createElement('div');
    if (!document.getElementsByClassName('sezzle-checkout-modal-lightbox').length) {
      this._modalNode.className = 'sezzle-checkout-modal-lightbox close-sezzle-modal';
      this._modalNode.style.display = 'none';
      document.body.ariaHidden = false;
      this._modalNode.tabindex = '-1';
      this._modalNode.role = 'dialog';
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
      let sezzleModalToGet;
      if(document.sezzleDefaultModalVersion === "sezzle-modal-3.0.0-{%%s%%}.html"){
        sezzleModalToGet = `${this._config.apiEndpoints.sezzleAssetsCDN}${document.sezzleDefaultModalVersion.replace('{%%s%%}', "en")}`;
      } else {
        sezzleModalToGet = `${this._config.apiEndpoints.sezzleAssetsCDN}${document.sezzleDefaultModalVersion.replace('{%%s%%}', modalLanguage)}`;
      }
      const response = await Utils.httpRequestWrapper('GET', sezzleModalToGet);
      this._modalNode.innerHTML = response;
    }
    document.getElementsByTagName('html')[0].appendChild(this._modalNode);
    this._closeSezzleModalHandler();
  }

  /**
   * @description This is only for sezzle modal
   */
  _closeSezzleModalHandler() {
    Array.prototype.forEach.call(document.getElementsByClassName('close-sezzle-modal'), (el) => {
      el.addEventListener('click', (event) => {
        this._disableBodyScroll(false);
        // Display the modal node
        this._modalNode.style.display = 'none';
        document.body.ariaHidden = false;
        // Add hidden class hide the item
        this._modalNode.getElementsByClassName('sezzle-modal')[0].className = 'sezzle-modal sezzle-checkout-modal-hidden';
        document.querySelector('.sezzle-checkout-button-wrapper').getElementsByTagName('button')[0].focus();
      });
    });
    // Event listener to prevent close in modal if click happens within sezzle-checkout-modal
    let sezzleModal = document.getElementsByClassName('sezzle-modal')[0];
    // backwards compatability check
    if (!sezzleModal) sezzleModal = document.getElementsByClassName('sezzle-checkout-modal')[0];
    sezzleModal.addEventListener('click', (event) => event.stopPropagation());
  }

  /**
   * @description dynamic rendering based on this._vendorsSupportedForDualInstall
   */
  _renderOtherVendorModals() {
    this._vendorsSupportedForDualInstall.forEach((vendor) => {
      if (document.getElementsByClassName(`${vendor}-modal-info-link`).length > 0) {
        const modalNode = document.createElement('div');
        modalNode.className = `sezzle-checkout-modal-lightbox sezzle-${vendor}-modal`;
        modalNode.style = 'position: center';
        modalNode.style.display = 'none';
        document.body.ariaHidden = false;
        modalNode.tabindex = '-1';
        modalNode.role = 'dialog';
        modalNode.innerHTML = this._config[`${vendor}ModalHTML`] || '';
        document.getElementsByTagName('html')[0].appendChild(modalNode);
        // Event listener for close in modal
        modalNode.addEventListener('click', (event) => {
          this._disableBodyScroll(false);
          modalNode.style.display = 'none';
          document.body.ariaHidden = false;
          document.querySelector('.sezzle-checkout-button-wrapper').getElementsByClassName('no-sezzle-info')[0].focus();
          event.stopPropagation();
        });
      }
    });
  }
}

export default Modal;
