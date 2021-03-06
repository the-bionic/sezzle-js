function includeCSS(callback) {
  var head = document.head;
  var link = document.createElement('link');
  link.type = 'text/css';
  link.rel = 'stylesheet';
  theme = (process.env.VERSION === '3.0.0' || process.env.VERSION === '3.0.1') ? (document.sezzleModalTheme || 'default') : 'default';
  link.href = theme === 'grayscale' ? `modals-${process.env.VERSION}/modal_grayscale.scss`:`modals-${process.env.VERSION}/modal.scss`
  head.appendChild(link);
  link.onload = callback;
  link.onerror = callback;
}

function includeHTML() {
  file = `modals-${process.env.VERSION}/modal-${process.env.LANGUAGE}.html`;
  var z, i, elmnt, xhttp;
  /* Loop through a collection of all HTML elements: */
  z = document.getElementById("modal");
  elmnt = z;
  if (file) {
    /* Make an HTTP request using the attribute value as the file name: */
    xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4) {
        if (this.status == 200) { elmnt.innerHTML = this.responseText; }
        if (this.status == 404) { elmnt.innerHTML = "Page not found."; }
      }
    }
    xhttp.open("GET", file, true);
    xhttp.send();
    /* Exit the function: */
    return;
  }
}

includeCSS(includeHTML);
