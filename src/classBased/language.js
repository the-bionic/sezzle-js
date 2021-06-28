import Utils from './utils';


class language {

    constructor(numberOfPayments) {
      this._numberOfPayments  = numberOfPayments;
      this._isEU = Utils.getWidgetBaseUrl() === 'https://widget.eu.sezzle.com';
      this._defaultLanguage = this._isEU ? "en-GB" : "en";
      this._translations = {
        'en': `or ${this._numberOfPayments} interest-free payments of %%price%% with %%logo%% %%info%%`,
        'fr': `ou ${this._numberOfPayments} paiements de %%price%% sans intérêts avec %%logo%% %%info%%`,
        'de': `oder ${this._numberOfPayments} zinslose Zahlungen von je %%price%% mit %%logo%% %%info%%`,
        'es': `o ${this._numberOfPayments} pagos sin intereses de %%price%% con %%logo%% %%info%%`,
        'en-GB': `or ${this._numberOfPayments} payments of %%price%% with %%logo%% %%info%% - no fee`,
        'fr-FR': `ou ${this._numberOfPayments} paiements de %%price%% avec %%logo%% %%info%% – pas de frais`,
        'de-DE': `oder ${this._numberOfPayments} mal %%price%% mit %%logo%% %%info%% - kostenlos`,
        'es-ES': `o ${this._numberOfPayments} cuotas de %%price%% con %%logo%% %%info%% - sin coste`,
      };
      this._language =  null;
      this._browserLanguage = null;
    }
  
    _setBrowserLanguage() {
      this._browserLanguage = navigator.language || navigator.browserLanguage || this._defaultLanguage
    }

    getTranslation() {
      return this._translations[this._language];
    }
  
    setLanguage(lang) {
      let language;
      if(typeof(lang) === 'function') {
        language = lang();
      } else {
        language = lang;
      }
      if (!language || typeof(language) !== 'string') {
        this._language = this._defaultLanguage ;
        return;
      }
      const langCode = language.substring(0,2).toLowerCase();
      const locale = language.split('-')[1];
      if (this._isEU) {
        if(locale && this._checkIfLanguageIsValid(language)) {
          this._language = language;
        } else if(this._checkIfLanguageIsValid(`${langCode}-${langCode.toUpperCase()}`)) {
          this._language = `${langCode}-${langCode.toUpperCase()}`;
        } else {
          this._language = this._defaultLanguage;
        }
      } else if(this._checkIfLanguageIsValid(langCode)) {
        this._language = langCode;
      } else {
        this._language = this._defaultLanguage;
      }
      document.sezzleLanguage = this._language;
    }


  
    _checkIfLanguageIsValid(lang) {
      let validityCounter =  0;
      let availableLanguages = Object.getOwnPropertyNames(this._translations);
      availableLanguages.forEach(l=>{
        if(l === lang) validityCounter++;
      });
      return validityCounter>0;
    }
  
    constructWidgetTemplate(widgetTemplate) {
      if (typeof (widgetTemplate) === 'object' && widgetTemplate != null) {
        if (!widgetTemplate.en && !widgetTemplate[this._language]) {
          console.warn("Please specify atleast 'en' key in altVersionTemplate, rendering default widget template.");
          return this.getTranslation(this._numberOfPayments); 
        }
        return widgetTemplate[this._language] || widgetTemplate.en;
      }
      return widgetTemplate;
    }
  
    init() {
      this._setBrowserLanguage();
    }
  
    getLanguage() {
      return this._language;
    }
      
    getBrowserLanguage() {
      return this._browserLanguage;
    }
  }
  
  export default language;