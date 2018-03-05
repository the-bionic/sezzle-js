### Explanation of each option
  `targetXPath` (optional)
  * Simple
    * Detail - Path to the element in your webpage from where price would be picked up from.
    * Type - `string`
  * Advanced
    * Detail - You may have multiple price elements in one page. So, this option also accepts a list of paths to multiple price elements.
    * Type - `array of strings`
  * Default - `empty`
  
  `renderToPath` (optional)
  * Simple
    * Detail - Path to the element in your webpage where the sezzle widget will be rendered to.
    * Type - `string`
  * Advanced
    * Detail - You may want to place widgets in multiple places. So you can pass multiple paths in an array. The price path in `ith` index of `targetXPath` array will rendered at the path given in `ith` index of this array(`renderToPath`). If you do not pass any thing to `ith` index of this array but there is a path in `ith` index of `targetXPath`, then the widget will be rendered just below the price element.
    * Type - `array of strings`
  * Default - `empty`

  `forcedShow` (optional)
  Shows the widget in every country if `true`. Else it shows up only in the `United States`.
  * Default - `false`
  * Type - `boolean`

  `alignment` (optional)
  Aligns the widget in the parent div.
  * Options - `left`, `center`, `right`.
  * Default - `left`
  * Type - `string`

  `merchantID`
  ID given by Sezzle to the merchant. This can be found in the upper right corner of the sezzle merchant dashboard. Only approved merchants get an ID.
  * Default - `empty`
  * Type - `string`

  `theme` (optional)
  Dark and light theme for the widget to work with different background colors of websites.
  * Options - `dark`, `light`
  * Default - `light`
  * Type - `string`

  `widthType` (optional)
  Number of lines the widget should be rendered on. `thin` renders to 3 lines and `thick` renders to 2 lines.
  * Options - `thin`, `thick`
  * Default - `thick`
  * Type - `string`

  `widgetType` (optional)
  The page type on which this widget is to be rendered.
  * Options - `cart`, `product-page`, `product-preview`
  * Default - `product-page`
  * Type - `string`

  `minPrice` (optional)
  Only shows products with price more than this amount in cents.
  * Type - `number`
  * Default - 0

  `maxPrice` (optional)
  Only shows products with price less than this amount in cents.
  * Type - `number`
  * Default - 100000

  `imageUrl` (optional)
  The sezzle logo can be replaced in the widget with an external image of choice.
  * Type - `string`
  * Default - `empty`

  `hideClasses` (optional)
  The classes of elements that should be hidden when sezzle's logo is showing. This is useful when you want to hide a similar product as Sezzle and is not available in a country where Sezzle is.
  * Type - `array of strings`
  * Default - `[]`

  `priceElementClass` (optional)
  Class to the price element. This option is used instead of `targetXPath` to make the integration simple. You can pass this as a class of your choice else it defaults to `sezzle-price-element`. If you have `just one` element in your page with this class added to it(which should be the price element), the system would pick up price using this.
  * Type - `string`
  * Default - `sezzle-price-element`

  `sezzleWidgetContainerClass` (optional)
  Class to the element in which you want to render the sezzle widget. This option is used instead of `renderToPath` to render the sezzle widget simply. This is supposed to be used with `priceElementClass`. You can pass this as a class of your choice else it defaults to `sezzle-widget-container`. You should have one element in your page which has this as a class and then the system would render the widget in that element.
  * Type - `string`
  * Default - `sezzle-widget-container`

  `hidePrice` (optional)
  Some websites have problems rendering the sezzle widget on variant change. This can be used to not have the price rendered in the sezzle widget and only the text and logo would be shown.
  * Type - `boolean`
  * Default - `false`

  `altVersionTemplate`(optional)
  This is used to change the text of the widget and also change the arrangement of text, logo and the know more url within the widget. Example, `or 4 automatic, interest free payments with %%price%% %%logo%% %%link%%` will render the default widget. `price`, `logo` and `link` within `%% %%` can be put in different places in the string to change arrangement of each of them.
  * Type - `string`
  * Default - `empty`