/**
* @license
* Copyright 2024 The FOAM Authors. All Rights Reserved.
* http://www.apache.org/licenses/LICENSE-2.0
*/


foam.CLASS({
  package: 'foam.dashboard.view',
  name: 'ViewImgCard',
  extends: 'foam.dashboard.view.Card',
  
  documentation: 'A dashboard card the takes a view, background color and an img',
  
  css: `
  ^ {
    position: relative;
    container-type: inline-size; 
    container-name: main-container;
    padding: 3.2rem;
    overflow: hidden;
  }
  ^view-container {
    position: relative;
    z-index: 2; 
    width: 75%;
  }
  ^ img{
    position: absolute;
    bottom: 0;
    right: 0;
    z-index: 1;
  }
  @container main-container (min-width: 600px) {
    ^ img{
      position: absolute;
      top: 50%;
      right: 5%;
      bottom: auto; 
      transform: translateY(-50%); 
    }
  }
  `,
  properties: [
    {
      name: 'backgroundColor',
      class: 'String'
    },
    {
      name: 'imgWidth',
      class: 'String'
    },
    {
      class: 'String',
      name: 'img'
    },
    {
      class: 'foam.u2.ViewSpec',
      name: 'innerView'
    }
  ],
  methods: [
    function init() {
      this.addClass(this.myClass())
        .style({ background: foam.CSS.returnTokenValue(this.backgroundColor, this.cls_, this.__subContext__) })
        .start().addClass(this.myClass('view-container'))
          .tag(this.innerView)
        .end()
        .start(foam.u2.tag.Image, {data: this.img, displayWidth: this.imgWidth })
        .addClass(this.myClass('img')).end();
    }
  ]
});
