class SezzleCheckoutButton extends HTMLElement {

    /***************************************************************************
    *                                                                          *
    * All exposed props that enable user to change  behaviour of the button    *
    *                                                                          *
    ***************************************************************************/
    get theme() {
      return this.hasAttribute('theme')?this.getAttribute('theme'):'light';
    }
    get template() {
      return this.hasAttribute('template')?this.getAttribute('template'):'Checkout with %%logo%%';
    }
    get borderType() {
      //isIn:['rounded','semi-rounded','square']
      return this.hasAttribute('borderType')?this.getAttribute('borderType'):'rounded'
    }
  
    constructor() {
      super();
      this.outputString = '';
      this.addFontToDom()
      this.sezzleImages = {
          white: 'https://media.sezzle.com/branding/2.0/Sezzle_Logo_FullColor_WhiteWM.svg',
          colored: 'https://media.sezzle.com/branding/2.0/Sezzle_Logo_FullColor.svg'
      }
      this.selectedImage = this.theme === 'dark'?this.sezzleImages.colored:this.sezzleImages.white
      this.styles = {
        common:`
        <style>
              button {
                  width:auto;
                  height:40px;
                  cursor:pointer;
                  outline:none;
                  border:transparent;
                  font-family:'Comfortaa',cursive;
                  margin-bottom: 10px;
                  font-size: 0.8125em;
                  padding-right: 20px;
                  padding-left: 20px;
                  letter-spacing: 0.15em;
                
              }
              .ripple {
                  background-position: center;
                  transition: background 0.8s;
                  
                }
                .ripple:hover {
                  background: #d784ff radial-gradient(circle, purple 70%, #d784ff 70%) center/15000%;
                  color:white;
                }
                .ripple:active {
                  background-color: #d784ff;
                  background-size: 100%;
                  color:white;
                  transition: background 0s;
                }
                
              img {
                  position: relative;
                  width: 50px;
                  top: 3px;
                  }
              }</style>
        `,
        light:`
        <style>
          button {
            background:#392558;
            color: white;
          }</style>
          `,
        dark:`
        <style>
          button {
            background:#fff;
            color: #392558;
          }</style>
          `,
        semiRounded:`
          <style>
            button{
              border-radius:5px
            }
          </style>
        `,
        rounded:`
          <style>
            button{
              border-radius:300px
            }
          </style>
        `,
        square:`
          <style>
            button{
              border-radius:0px
            }
          </style>
        `
          }
          this.addEventListener('click', e => this.goToCheckoutPage());
          this.rootSezzleElement = this.attachShadow({mode: 'open'});
          this.createButton()
        }
  
  
    /***************************************************************************
    *                                                                          *
    *                  Add styles to the sezzle-button                         *
    *                                                                          *
    ***************************************************************************/
   /*
    *
    * addFontToDom - This function adds font - Comfortaa to the DOM 
    * 
    */
    addFontToDom() {
      var link = document.createElement('link');
      link.setAttribute('rel', 'stylesheet');
      link.setAttribute('type', 'text/css');
      link.setAttribute('href', 'https://fonts.googleapis.com/css?family=Comfortaa&display=swap" rel="stylesheet');
      document.head.appendChild(link);
    }
  
    getAllButtons() {
      const allButton = document.getElementsByTagName('button')
      return Array.from(allButton)
    }
  

  
    mapStyle() {
      var sezzleStyle,sezzleButton =  document.getElementsByTagName('sezzle-button')[0].shadowRoot.children[0]
      console.log(sezzleButton)
      switch(this.borderType) {
        case 'rounded':
        sezzleButton.style.borderRadius = '300px'
        break;
        case 'semiRounded':
        sezzleButton.style.borderRadius = '5px'
        break;
        default:
        sezzleButton.style.borderRadius = '0px'
        break;
      }
    }
  
    createOutputString() {
      this.outputString  += (this.styles.common )+ ' ' + (this.theme === 'light'?this.styles.light:this.styles.dark) + ' '
    }
    parseTemplate() {
      this.template.split(' ').map((el)=>{       
      if(el == '%%logo%%') {
          this.outputString = this.outputString + `<img src='${this.selectedImage}' />` + '</button>'
      }else{
          if(this.outputString === '') {
              this.outputString = `<br/><button class='ripple'>` + el + " "
          }else {
              this.outputString = this.outputString + el + " "
          } 
      }
      })
    }
    createButton() {
      this.parseTemplate()
      this.createOutputString()
  
      this.rootSezzleElement.innerHTML = this.outputString
      this.mapStyle()
    }
    goToCheckoutPage() {
      const pageOrigin = window.location.origin
      window.location.href = pageOrigin + '/checkout'
    }
  }
  
export default SezzleCheckoutButton;