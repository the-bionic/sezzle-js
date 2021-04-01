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
      let coreLang = lang.split('-')[0].substring(0,2).toLowerCase();;
      if(this._checkIfLanguageIsValid(lang)) {
        let locale = lang.split('-')[1];
        if(northAmericaRegion.indexOf(locale) > -1){
          return {
            region:'US',
            locale: 'US',
            language: coreLang,
            error: null

          };
        } else {
          return {
            region:'EU',
            locale: locale,
            language: lang,
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
        const langVar =  this.getLanguageLocale(this._language)
        console.log(langVar)
        if(langVar.error === null && this._translations[langVar.language] !== undefined) {
            return this._translations[langVar.language];      
        }  
      }
      return this._translations[this._defaultLanguage];
    }
  
    setLanguage(lang) {
      const typeOfLanguageOption = typeof(lang);
      if(!this._checkIfLanguageIsValid(lang)) {
        this._language = this._browserLanguage;
      } else {
        switch(typeOfLanguageOption) {
          case "string":
            let locale = this.getLanguageLocale(lang);
            if(locale.error === null && locale.region === "US"){
              this._language = locale.language;
            } else {
              this._language = lang;
            }
            break;
          case "function":
            this._language = lang();
            break;
          default:
            this._language = this._browserLanguage;
            break;
        }
      }
      document.sezzleLanguage = this._language;
    }
  
    _checkIfLanguageIsValid(lang) {
      const coreLang =  lang.split("-")[0]
      let validityCounter =  0;
      let availableLanguages = Object.getOwnPropertyNames(this._translations);
      availableLanguages.forEach(l=>{
        if(l === coreLang) validityCounter++;
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