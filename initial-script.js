function getUUID() {
  var uuid = document.sezzleMerchantUUID || '';
  if (uuid === '') {
      // fallback if uuid does not exist
      uuid = document.sezzleConfig["merchantID"];
  }
  return uuid;
}

(function() {
  var uuid = getUUID();
  var el = document.createElement('script');
  el.src = 'https://widget.sezzle.com/v1/javascript/price-widget?uuid=' + uuid
  document.getElementsByTagName('head')[0].appendChild(el);
})();