
/**
 *
 * @param {Array of path to the price tag (example: ['.price-class', '#product-price', 'span'])} targetXPath
 */
var SezzleJS = function(targetXPath = '') {
  this.xpath = targetXPath.split('/');
  this._config = { attributes: true, childList: true, characterData: true };
}

/**
 * This function fetches all the elements that has price in it based on the given x-path
 * @param xindex - Current xpath index value to be resolved [initial value is always 0]
 * @param elements - Array of current elements to be resolved [initial value is always null]
 *
 * @return All the elements with price in it that matches the xpath
 */
SezzleJS.prototype.getAllPriceElements = function(xindex = 0, elements = null) {
  // Break condition
  if (xindex === this.xpath.length) {
    return elements;
  }

  // Intialy when elements is null
  // We give document to it
  if (elements === null) {
    elements = [document];
  }
  var children = [];
  for(var elemnt of Array.from(elements)) {
    // If this is an ID
    if (this.xpath[xindex][0] === '#') {
      children.push(elemnt.getElementById(this.xpath[xindex].substr(1)));
    } else
    // If this is a class
    if (this.xpath[xindex][0] === '.') {
      Array.from(
        elemnt.getElementsByClassName(this.xpath[xindex].substr(1))
      )
      .forEach(function(el) {
          children.push(el);
      })
    } else
    // If this is a tag
    {
      var indexToTake = 0;
      if (this.xpath[xindex].split('-').length > 1) {
        if (this.xpath[xindex].split('-')[1] >= 0) {
          indexToTake = parseInt(this.xpath[xindex].split('-')[1]);
        }
      }
      Array.from(
        elemnt.getElementsByTagName(this.xpath[xindex].split('-')[0])
      )
      .forEach(function(el, index) {
          if (index === indexToTake) children.push(el);
      });
    }
  }
  children = children.filter(function(c) {return c !== null});
  return this.getAllPriceElements(xindex + 1, children);
}

/**
 * This is helper function for formatPrice
 * @param n char value
 * @return boolean [if it's numeric or not]
 */
SezzleJS.prototype.isNumeric = function(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

/**
 * This function will format the price
 * @param price - string value
 * @return float
 */
SezzleJS.prototype.parsePrice = function(price) {
  var formattedPrice = '';
  for (var i = 0; i < price.length; i++) {
    if (this.isNumeric(price[i]) || price[i] == '.') {
      formattedPrice += price[i];
    }
  }
  return parseFloat(formattedPrice);
}

/**
 * This function loads up CSS dynamically to clients page
 * @return void
 */
SezzleJS.prototype.loadCSS = function() {
  // Check if the CSS is already there
  var links = document.getElementsByTagName('link');

  var url = 'https://d3svog4tlx445w.cloudfront.net/shopify-app/assets/sezzle-shopify-styles-global0.1.120.css';
  if (!Array.from(links).find(function(link) {
    return link.href === url;
  })) {
    var link = document.createElement( "link" );
    link.href = url;
    link.type = "text/css";
    link.rel = "stylesheet";
    link.media = "screen,print";
    document.getElementsByTagName( "head" )[0].appendChild( link );
  }
}

/**
 * This function will set Sezzle's elements with
 * the price element in parallel
 * @param element - This is the price element
 * @param index - Index of the element in the page
 * @return void
 */
SezzleJS.prototype.renderAwesomeSezzle = function(element, index = 0) {
  // Set data index to each price element for tracking
  element.dataset.sezzleindex = index;

  // Get the price from the element
  var price = this.parsePrice(element.innerHTML);

  // Get parent elelemnt
  var parent = element.parentElement;

  // root node for sezzle
  var sezzle = document.createElement('div');
  sezzle.className = "sezzle-shopify-info-button sezzle-product-page-widget sezzle-haatichai"

  // node level - 1
  var node = document.createElement("div");
  node.className = "sezzle-checkout-button-wrapper sezzle-left sezzle-haatichai";

  // price node level - 1.1
  var priceNode = document.createElement("div");
  priceNode.className = "sezzle-button-text sezzle-left";

  // price text node level - 1.1.1
  var priceText = document.createTextNode("or 4 automatic, interest free payments");

  // Adding priceText node to priceNode level - 1.1
  priceNode.appendChild(priceText);

  // price value span node level - 1.1.1
  var priceSpanNode = document.createElement("span");
  priceSpanNode.className = "payment-amount sezzleindex-" + index;

  // price value text node level - 1.1.1.1
  var priceValueText = document.createTextNode(
    ' of $' + Math.round((price / 4) * 100) / 100
  );

  // Adding price value to priceSpanNode - level - 1.1.2
  priceSpanNode.appendChild(priceValueText)

  // Adding priceSpanNode to priceNode level - 1.1
  priceNode.appendChild(priceSpanNode);

  // Adding priceNode to main node level - 1
  node.appendChild(priceNode);

  // Logo node level - 1.1
  var logoNode = document.createElement("div");
  logoNode.className = "sezzle-checkout-button open-sezzle-modal sezzle-left szl-light";

  // Loge node first child level - 1.1.1
  var logoNode1 = document.createElement("div");
  logoNode1.className = "sezzle-inline-text";

  // Logo node first child text - 1.1.1.1
  var logoNode1Text = document.createTextNode('with ');
  logoNode1Text.className = "sezzle-inline-text"
  logoNode1.appendChild(logoNode1Text); // 1.1.1

  // Add logeNode1 to logoNode level - 1.1
  logoNode.appendChild(logoNode1);

  // Logo node second child level - 1.1.2
  var logoNode2 = document.createElement("img");
  logoNode2.className = "szl-light-image";
  logoNode2.src = "https://d3svog4tlx445w.cloudfront.net/branding/sezzle-logos/png/sezzle-logo-sm-100w.png";

  // Add logeNode1 to logoNode level - 1.1
  logoNode.appendChild(logoNode2);

  // // Logo node third child level - 1.1.3
  // var logoNode3 = document.createElement("img");
  // logoNode3.className = "szl-dark-image";
  // logoNode3.src = "https://d3svog4tlx445w.cloudfront.net/branding/sezzle-logos/png/sezzle-logo-all-black-sm-100w.png";

  // Add logeNode1 to logoNode level - 1.1
  // logoNode.appendChild(logoNode3);

  // Loge node first child level - 1.1.4
  var logoNode4 = document.createElement("div");
  logoNode4.className = "sezzle-know-more";

  // Logo node first child text - 1.1.4.1
  var logoNode4Text = document.createTextNode(' Learn more');
  logoNode4.appendChild(logoNode4Text); // 1.1.4

  // Add logeNode1 to logoNode level - 1.1
  logoNode.appendChild(logoNode4);

  // Adding logoNode to main node
  node.appendChild(logoNode);

  // Adding main node to sezzel node
  sezzle.appendChild(node);

  // Adding sezzle to parent node
  parent.appendChild(sezzle);
}

/**
 * Mutation observer
 * This observer observe for any change in a
 * given DOM element (Price element in our case)
 * and act on that
 */
SezzleJS.prototype.observer = new MutationObserver(function(mutations) {
  mutations
    .filter(function(mutation) { return mutation.type === 'childList' })
    .forEach(function(mutation) {
      var s = new SezzleJS();
      var price = s.parsePrice(mutation.target.innerText);
      delete s;
      var priceIndex = mutation.target.dataset.sezzleindex;
      document.getElementsByClassName('sezzleindex-' + priceIndex)[0]
        .innerText = ' of $' + Math.round((price / 4) * 100) / 100;
    });
});

/**
 * This function start observing for change
 * in given Price element
 * @param element to be observed
 * @return void
 */
SezzleJS.prototype.startObserve = function(element) {
  // TODO : Need a way to unsubscribe to prevent memory leak
  this.observer.observe(element, this._config);
}


// Example

var s = new SezzleJS(
  '.product-price'
);
s.loadCSS();
var els = s.getAllPriceElements();
els.forEach((el, index) => {
  s.renderAwesomeSezzle(el, index);
  s.startObserve(el);
});