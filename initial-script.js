  (function(callback) {
    if(typeof window.Fingerprint2 === 'undefined' || window.Fingerprint2.VERSION != "1.4.1") {
      var script = document.createElement("script")
      script.type = "text/javascript";
      script.src = 'https://cdn.jsdelivr.net/fingerprintjs2/1.4.1/fingerprint2.min.js';
      script.onload = function() {
        new Fingerprint2().get(function(result, components){
          callback(result);
        });
      };
      document.getElementsByTagName("head")[0].appendChild(script);
    } else {
      new Fingerprint2().get(function(result, components){
        callback(result);
      });
    }
  })(function(fingerprint) {
    var el = document.createElement('script'); 
    el.src = 'https://widget.sezzle.com/v1/javascript/price-widget?uuid='+document.sezzleConfig["merchantID"]+'&fingerprint='+fingerprint
    document.getElementsByTagName('head')[0].appendChild(el);
  });