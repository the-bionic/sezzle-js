import SezzleConfig from './sezzleConfig';

class SezzleJS {
  constructor(options) {
    this._configInst = new SezzleConfig(options).init();
  }

  init() {
    console.log('Config Instance we have!', this._configInst);
  }
}

export default SezzleJS;
