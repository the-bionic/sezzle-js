/* eslint-disable class-methods-use-this */
import RenderAwesomeSezzle from './renderAwesomeSezzle';
import Utils from './utils';
import Modal from './modal';

class sezzleDOMFunctions {
  constructor() {
    this._configInst = null;
    this._modalInst = new Modal();
    this._renderAwesomeSezzleInst = new RenderAwesomeSezzle();
    this._allConfigsUsePriceClassElement = true;
    this._els = [];
    this._intervalInMs = 2000;
    // Functions required in RenderAwesomeSezzle, will be sent as param! Didn't make sense to put in utils
    this.funtionsForRenderSezzle = {
      getPriceText: this.getPriceText,
      isProductEligible: this.isProductEligible,
      getFormattedPrice: this.getFormattedPrice,
      getElementsByXPath: this.getElementsByXPath,
    };
  }

  /**
   * ************* PUBLIC FUNCTIONS ***************
  */

  /**
   * All steps required to show the widget
  */
  init(_configInst) {
    this._configInst = _configInst;

    this._configInst.configGroups.forEach((configGroup, index) => {
      if (configGroup.hasPriceClassElement) {
        this._renderAwesomeSezzleInst.render(
          configGroup.priceElements[0], configGroup.renderElements[0],
          0, index,
          this.funtionsForRenderSezzle, this._configInst,
        );
        this._startObserve(configGroup.priceElements[0], (mutations) => {
          this._mutationCallBack(mutations, index);
        });
      } else {
        this._allConfigsUsePriceClassElement = false;
      }
    });
    if (!this._allConfigsUsePriceClassElement) this._sezzleWidgetCheckInterval();
    this._modalInst.renderModals(this._configInst);
  }

  /**
   * This function fetches all the elements that is pointed to by the given xpath
   * @param xindex - Current xpath index value to be resolved [initial value is always 0]
   * @param elements - Array of current elements to be resolved [initial value is the element root(s)
   * of the search path]
   *
   * @return All the elements which are pointed to by the xpath
  */
  getElementsByXPath(xpath = [], xindex = 0, elements = null) {
    // Break condition
    if (xindex === xpath.length) return elements;
    // If elements are not provided, root the search at the document object
    if (elements === null) elements = [document];

    let children = [];
    const elementArray = Array.prototype.slice.call(elements);

    for (let index = 0; index < elementArray.length; index++) {
      const element = elementArray[index];
      // If parent path
      if (xpath[xindex] === '..') {
        children.push(element.parentElement);
      } else if (xpath[xindex][0] === '#') { // If this is an ID
        children.push(element.getElementById(xpath[xindex].substr(1)));
        // If this is a class
      } else if (xpath[xindex][0] === '.') {
        // If there is only one '.' return the element
        if (xpath[xindex].trim().length === 1) {
          children.push(element);
        }
        // eslint-disable-next-line no-loop-func
        Array.prototype.forEach.call(element.getElementsByClassName(xpath[xindex].substr(1)), (el) => {
          children.push(el);
        });
      } else if (xpath[xindex].indexOf('child') === 0) { // If this is a child indicator
        const childNumber = xpath[xindex].split('-')[1];
        const childElement = element.childNodes[childNumber];
        if (typeof (childElement) !== 'undefined') {
          if (childElement.nodeName === '#text') { // if it's a text node we wrap it
            const newSpan = document.createElement('span');
            newSpan.appendChild(document.createTextNode(childElement.nodeValue));
            element.replaceChild(newSpan, childElement);
            children.push(newSpan);
          } else {
            children.push(childElement);
          }
        } else {
          children.push(element);
        }
      } else { // If this is a tag
        let indexToTake = 0;
        if (xpath[xindex].split('-').length > 1) {
          if (xpath[xindex].split('-')[1] >= 0) {
            indexToTake = parseInt(xpath[xindex].split('-')[1], 10);
          }
        }
        // eslint-disable-next-line no-loop-func
        Array.prototype.forEach.call(element.getElementsByTagName(xpath[xindex].split('-')[0]), (el, index) => {
          if (index === indexToTake) children.push(el);
        });
      }
    }

    children = children.filter((c) => c !== null);
    return this.getElementsByXPath(xpath, xindex + 1, children);
  }

  /**
	 * Formats a price as Sezzle needs it
	 * @param element Element that contains price text
	 * @param configGroupIndex index of the config group which element belongs to
	 * @param priceText (optional) if defined, it contains the proper price text parsed from element
	*/
  getFormattedPrice(element, configGroupIndex, priceText) {
    if (!priceText) priceText = this.getPriceText(element, configGroupIndex);
    // Get the price string - useful for formtting Eg: 120.00(string)
    const priceString = this._parsePriceString(priceText, true);
    // Get the price in float from the element - useful for calculation Eg : 120.00(float)
    const price = this._parsePrice(priceText);
    // Will be used later to replace {price} with price / this.numberOfPayments Eg: ${price} USD
    let formatter = priceText.replace(priceString, '{price}');
    // replace other strings not wanted in text
    this._configInst.configGroups[configGroupIndex].ignoredFormattedPriceText.forEach((ignoredString) => {
      formatter = formatter.replace(ignoredString, '');
    });
    // get the sezzle installment price
    const sezzleInstallmentPrice = (price / this._configInst.numberOfPayments).toFixed(2);
    // format the string
    const sezzleInstallmentFormattedPrice = formatter.replace('{price}', sezzleInstallmentPrice);
    return sezzleInstallmentFormattedPrice;
  }

  /**
	 * Gets price text
	 * @param element Element that contains the price text
	*/
  getPriceText(element, configGroupIndex) {
    if (this._configInst.configGroups[configGroupIndex].ignoredPriceElements === []) {
      return element.textContent;
    }

    this._configInst.configGroups[configGroupIndex].ignoredPriceElements.forEach((subpaths) => {
      // get all elements pointed to by the xPath. Search is rooted at element
      this.getElementsByXPath(subpaths, 0, [element]).forEach((ignoredPriceElement) => {
        // mark the element to be ignored
        ignoredPriceElement.classList.add('sezzle-ignored-price-element');
      });
    });
    // if no ignored elements are found, return the whole inner text of the element
    if (!element.getElementsByClassName('sezzle-ignored-price-element').length) {
      return element.textContent;
    }
    // deep clone
    const clone = element.cloneNode(true);
    // remove all marked elements
    Array.prototype.forEach.call(clone.getElementsByTagName('*'), (element) => {
      if (Array.prototype.slice.call(element.classList).indexOf('sezzle-ignored-price-element') !== -1) {
        clone.removeChild(element);
      }
    });
    // remove all markers
    Array.prototype.forEach.call(element.getElementsByClassName('sezzle-ignored-price-element'), (element) => {
      element.classList.remove('sezzle-ignored-price-element');
    });
    return clone.textContent;
  }

  /**
	 * Is the product eligible for sezzle pay
	 * @param price Price of product
	*/
  isProductEligible(priceText, configGroupIndex) {
    const price = this._parsePrice(priceText);
    this._configInst.configGroups[configGroupIndex].productPrice = price;
    const priceInCents = price * 100;
    return priceInCents >= this._configInst.minPrice && priceInCents <= this._configInst.maxPrice;
  }

  /**
   * ************* PRIVATE FUNCTIONS ***************
  */

  /**
	 * This function starts observing for change
	 * in given Price element
	 * @param element to be observed
	 * @return void
	*/
  _startObserve(element, callback) {
    // TODO : Need a way to unsubscribe to prevent memory leak
    // Deleted elements should not be observed
    // That is handled
    const observer = new MutationObserver(callback);
    observer.observe(element, this._configInst.mutationObserverConfig);
    return observer;
  }

  /**
	 * Mutation observer callback function
	 * This observer observes for any change in a
	 * given DOM element (Price element in our case)
	 * and act on that
	*/
  _mutationCallBack(mutations, configGroupIndex) {
    mutations.filter((mutation) => mutation.type === 'childList')
      .forEach((mutation) => {
        try {
          const priceIndex = mutation.target.dataset.sezzleindex;
          const price = this.getFormattedPrice(mutation.target, configGroupIndex);
          const sezzlePriceElement = document.getElementsByClassName(`sezzleindex-${priceIndex}`)[0];
          if (sezzlePriceElement) {
            if (!/\d/.test(price)) {
              sezzlePriceElement.parentElement.parentElement.parentElement.classList.add('sezzle-hidden');
            } else {
              sezzlePriceElement.parentElement.parentElement.parentElement.classList.remove('sezzle-hidden');
            }
            sezzlePriceElement.textContent = price;
            // Check if the price is still valid for widget
            // Price may change dynamically due to any reason,
            // like, updating product category
            const priceText = this.getPriceText(mutation.target, configGroupIndex);
            if (!this.isProductEligible(priceText, configGroupIndex)) {
              sezzlePriceElement.parentElement.parentElement.parentElement.classList.add('sezzle-hidden');
            }
          }
        } catch (e) {
          console.warn(e);
        }
      });
  }

  /**
   * This function start an observation on related elements to the price element
   * for any change and perform an action based on that
  */
  _observeRelatedElements(priceElement, sezzleElement, targets) {
    if (targets) {
      targets.forEach((target) => {
        if (typeof (target.relatedPath) === 'string'
          && (typeof (target.action) === 'function' || typeof (target.initialAction) === 'function')) {
          const elements = this.getElementsByXPath(
            Utils.breakXPath(target.relatedPath),
            0,
            [priceElement],
          );
          if (elements.length > 0) {
            if (typeof (target.action) === 'function') {
              this._startObserve(elements[0], (mutation) => {
                target.action(mutation, sezzleElement);
              });
            }
            if (typeof (target.initialAction) === 'function') {
              target.initialAction(elements[0], sezzleElement);
            }
          }
        }
      });
    }
  }

  /**
   * Looks for newly added price elements
  */
  _sezzleWidgetCheckInterval() {
    this._configInst.configGroups.forEach((configGroup, index) => {
      if (configGroup.xpath === []) return;
      const elements = this.getElementsByXPath(configGroup.xpath);
      elements.forEach((e) => {
        if (!e.hasAttribute('data-sezzleindex')) {
          this._els.push({
            element: e,
            toRenderElement: this._getElementToRender(e, index),
            deleted: false,
            observer: null,
            configGroupIndex: index,
          });
        }
      });
    });
    // add the sezzle widget to the price elements
    this._els.forEach((el, index) => {
      if (!el.element.hasAttribute('data-sezzleindex')) {
        const sz = this._renderAwesomeSezzleInst.render(
          el.element, el.toRenderElement,
          index, el.configGroupIndex, this, this._configInst,
        );
        if (sz) {
          el.observer = this._startObserve(el.element, (mutations) => {
            this._mutationCallBack(mutations, el.configGroupIndex);
          });
          this._modalInst.addClickEventForModal(sz, el.configGroupIndex);
          this._observeRelatedElements(el.element, sz, this._configInst.configGroups[el.configGroupIndex].relatedElementActions);
        } else {
          // remove the element from the els array
          delete this._els[index];
        }
      }
    });
    // refresh the array
    this._els = this._els.filter((e) => e !== undefined);
    // Find the deleted price elements
    // remove corresponding Sezzle widgets if exists
    this._els.forEach((el, index) => {
      if (el.element.parentElement === null && !el.deleted) { // element is deleted
        // Stop observing for changes in the element
        if (el.observer !== null) el.observer.disconnect();
        // Mark that element as deleted
        el.deleted = true;
        // Delete the corresponding sezzle widget if exist
        const tmp = document.getElementsByClassName(`sezzlewidgetindex-${index}`);
        if (tmp.length) {
          const sw = tmp[0];
          sw.parentElement.removeChild(sw);
        }
      }
    });
    // Hide elements ex: afterpay
    for (let index = 0, len = this._configInst.configGroups.length; index < len; index++) {
      this._hideSezzleHideElements(index);
    }
    setTimeout(() => this._sezzleWidgetCheckInterval(), this._intervalInMs);
  }

  /**
   * This function finds out the element where Sezzle's widget
   * will be rendered. By default it would return the parent element
   * of the given price element. If the over ride path is found and
   * it leads to a valid element then that element will be returned
   * @param element - This is the price element
   * @param index - Index of the config group that element belongs to
   * @return the element where Sezzle's widget will be rendered
  */
  _getElementToRender(element, index = 0) {
    let toRenderElement = null;
    if (this._configInst.configGroups[index].rendertopath !== null) {
      const path = Utils.breakXPath(this._configInst.configGroups[index].rendertopath);
      toRenderElement = element;
      for (let i = 0; i < path.length; i++) {
        const p = path[i];
        if (toRenderElement === null) {
          break;
        } else if (p === '.') {
          // eslint-disable-next-line no-continue
          continue;
        } else if (p === '..') {
          // One level back
          toRenderElement = toRenderElement.parentElement;
        } else if (p[0] === '.') {
          // The class in the element
          toRenderElement = toRenderElement.getElementsByClassName(p.substr(1)).length
            ? toRenderElement.getElementsByClassName(p.substr(1))[0]
            : null;
        } else if (p[0] === '#') {
          // The ID in the element
          toRenderElement = document.getElementById(p.substr(1));
        } else if (p === '::first-child') {
          // rendered as first child
          toRenderElement = toRenderElement.children.length > 0
            ? toRenderElement.firstElementChild
            : null;
          this._configInst.configGroups[index].widgetIsFirstChild = true;
        } else {
          // If this is a tag
          // indexes are 0-indexed (e.g. span-2 means third span)
          let indexToTake = 0;
          if (p.split('-').length > 1) {
            if (p.split('-')[1] >= 0) {
              indexToTake = parseInt(p.split('-')[1], 10);
            }
          }
          toRenderElement = toRenderElement.getElementsByTagName(p.split('-')[0]).length > indexToTake
            ? toRenderElement.getElementsByTagName(p.split('-')[0])[indexToTake]
            : null;
        }
      }
    }
    // return the element's parent if toRenderElement is null
    return toRenderElement || element.parentElement;
  }

  /**
	 * Hide elements pointed to by this.hideClasses
	*/
  _hideSezzleHideElements(configGroupIndex) {
    this._configInst.configGroups[configGroupIndex].hideClasses.forEach((subpaths) => {
      this.getElementsByXPath(subpaths).forEach((element) => {
        if (!element.classList.contains('sezzle-hidden')) {
          element.classList.add('sezzle-hidden');
        }
      });
    });
  }

  /**
   * This is helper function for formatPrice
   * @param n char value
   * @return boolean [if it's numeric or not]
  */
  _isNumeric(n) {
    // eslint-disable-next-line no-restricted-globals
    return !isNaN(parseFloat(n)) && isFinite(n);
  }

  /**
   * This is helper function for formatPrice
   * @param n char value
   * @return boolean [if it's alphabet or not]
  */
  _isAlphabet(n) {
    return /^[a-zA-Z()]+$/.test(n);
  }

  /**
   * This function will return the price string
   * @param price - string value
   * @param includeComma - comma should be added to the string or not
   * @return string
  */
  _parsePriceString(price, includeComma) {
    let formattedPrice = '';
    for (let i = 0; i < price.length; i++) {
      if (this._isNumeric(price[i]) || price[i] === '.' || (includeComma && price[i] === ',')) {
        // If current is a . and previous is a character, it can be something like Rs.
        // so ignore it
        // eslint-disable-next-line no-continue
        if (i > 0 && price[i] === '.' && this._isAlphabet(price[i - 1])) continue;
        formattedPrice += price[i];
      }
    }
    return formattedPrice;
  }

  /**
   * This function will format the price
   * @param price - string value
   * @return float
  */
  _parsePrice(price) {
    return parseFloat(this._parsePriceString(price, false));
  }
}

export default sezzleDOMFunctions;
