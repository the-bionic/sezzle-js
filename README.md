
### How to use

**Add this to the header of any website you want**
```<script src="https://widget.sezzle.com/v1/javascript/price-widget?uuid=1"></script>```

**Set the document config like so**
```
document.sezzleConfig = {
    targetXPath: '.product-price',
    forcedShow: false,
    alignment: 'left',
    merchantID: '1',
    theme: 'light',
    widthType: 'thin',
    widgetType: 'product-page',
    minPrice: 0,
    maxPrice: 100000,
    imageUrl: ''
  }
```