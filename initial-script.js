(function (callback) {
  // set track id
  let track_id = null;
  function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
  function getCookie(name) {
    var value = '; ' + document.cookie;
    var parts = value.split('; ' + name + '=');
    if (parts.length === 2) {
      return parts.pop().split(';').shift();
    }
  }

  track_id = getCookie('szl_uuid');
  if (!track_id) {
    track_id = generateUUID();
    var CookieDate = new Date;
    CookieDate.setFullYear(CookieDate.getFullYear() + 10);
    document.cookie = 'szl_uuid=' + track_id + ';path=/;expires=' + CookieDate.toUTCString() + ';';
  }
  let iframe = document.createElement('iframe');
  iframe.width = 0;
  iframe.height = 0;
  iframe.style.display = 'none';
  iframe.style.visibility = 'hidden';
  let html = '<body>Foor</body>';
  iframe.src = 'https://staging.tracking.sezzle.com?trk_id=' + track_id;
  document.body.appendChild(iframe);
  callback(track_id);

})(function (track_id) {
  var el = document.createElement('script');
  el.src = 'http://localhost:12121/v1/javascript/price-widget?uuid=' + document.sezzleConfig['merchantID'] + '&track_id=' + track_id
  document.getElementsByTagName('head')[0].appendChild(el);
});
