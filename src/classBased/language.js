import Utils from './utils';


class language {

    constructor(numberOfPayments) {
      this._numberOfPayments  = numberOfPayments;
      this._defaultLanguage = "en";
      this._translations = {
        'en': `or ${this._numberOfPayments} interest-free payments of %%price%% with %%logo%% %%info%%`,
        'fr': `ou ${this._numberOfPayments} paiements de %%price%% sans intérêts avec %%logo%% %%info%%`,
        'de': `oder ${this._numberOfPayments} zinslose Zahlungen von je %%price%% mit %%logo%% %%info%%`,
        'es': `o ${this._numberOfPayments} pagos sin intereses de %%price%% con %%logo%% %%info%%`,
        'en-GB': `or ${this._numberOfPayments} payments of %%price%% with %%logo%% %%info%% - no fee`,
        'fr-FR': `ou ${this._numberOfPayments} paiements de %%price%% avec %%logo%% %%info%% – pas de frais`,
        'de-DE': `oder ${this._numberOfPayments} mal %%price%% mit %%logo%% %%info%% - kostenlos`,
      };
      this._language =  null;
      this._browserLanguage = null;
    }
  
    _setBrowserLanguage() {
      this._browserLanguage = navigator.language || navigator.browserLanguage || this._defaultLanguage
    }

    getLanguageLocale(lang){
      const northAmericaRegion = ['US', 'CA', 'MX', 'IN', 'GU', 'PR', 'AS', 'MP', 'VI', '', null, undefined];
      let countryCode = document.sezzleCountryCode;
      if(this._checkIfLanguageIsValid(lang)) {
        if(northAmericaRegion.indexOf(countryCode) > -1){
          return {
            region:'US',
            language: lang.split("-")[0],
            error: null
          };
        } else {
          var language = null;
          if(!lang.split("-")[1]){
            if (lang==="en") {
              language = "en-GB"
            } else {
              language = this._checkIfLanguageIsValid(`${lang}-${lang.toUpperCase()}`) ? `${lang}-${lang.toUpperCase()}`: lang;
            }
          }
          return {
            region:'EU',
            language: language || lang,
            error: null
          };
        }
      } else {
        return {
          error: 'Invalid language'
        };
      }
    }

    getTranslation() {
      if(this._checkIfLanguageIsValid(this._language)){
        const langVar = this.getLanguageLocale(this._language);
        if(langVar.error === null && this._translations[langVar.language] !== undefined) {
          return this._translations[langVar.language];      
        }  
      }
      return this._translations[this._defaultLanguage];
    }
  
    setLanguage(lang) {
      const typeOfLanguageOption = typeof(lang);
      let languageCovertedToString = typeOfLanguageOption === "string" ? lang : (typeOfLanguageOption === "function" ? lang() : null);
      let locale = typeOfLanguageOption === "string" || typeOfLanguageOption === "function" ?  this.getLanguageLocale(languageCovertedToString)  : {error: 'Invalid language'};
      if (languageCovertedToString === null || locale.error != null || !this._checkIfLanguageIsValid(languageCovertedToString)){
        this._language = this._browserLanguage;
      } else {
        this._language = locale.language
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