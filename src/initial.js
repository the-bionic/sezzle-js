// adding tracking iframe
if (!document.sezzleConfig.noTracking) {
    var sz_iframe = document.createElement('iframe');
    sz_iframe.width = 0;
    sz_iframe.height = 0;
    sz_iframe.style.display = 'none';
    sz_iframe.style.visibility = 'hidden';
    sz_iframe.name='szl';
    sz_iframe.src = 'https://tracking.sezzle.com';
    document.body.appendChild(sz_iframe);
}