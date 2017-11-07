
foam.CLASS({
  package: 'net.nanopay.ui.topNavigation',
  name: 'UserTopNavView',
  extends: 'foam.u2.Element',

  documentation: 'View user name and user nav settings',

  imports: [ 'user' ],

  requires: [ 'foam.nanos.menu.SubMenuView', 'foam.nanos.menu.Menu' ],

  axioms: [
    foam.u2.CSS.create({
      code: function CSS() {/*
        ^ {
          display: inline-block;
          float: right;
          margin: 10px 50px 0 0;
        }
        ^ h1 {
          margin: 0;
          padding: 15px;
          font-size: 15px;
          display: inline-block;
          font-weight: 100;
          color: white;
          position: relative;
          bottom: 5;
        }
        ^carrot {
          width: 0; 
          height: 0; 
          border-left: 5px solid transparent;
          border-right: 5px solid transparent;
          border-top: 5px solid white;
          display: inline-block;
          position: relative;
          right: 10;
          bottom: 7;
          cursor: pointer;
        }
        ^ img{
          width: 25px;
          height: 25px;
          display: inline-block;
          position: relative;
          top: 5;
          right: 10;
          padding-right: 15px;
        }
        ^user-name:hover {
          cursor: pointer;
        }
        ^ .foam-nanos-menu-SubMenuView-inner {
          position: absolute;
          float: right;
          z-index: 10000;
          width: 208px;
          height: 160px;
          background: white;
          box-shadow: 2px 2px 2px 2px rgba(0, 0, 0, 0.19);
          top: 65px;
          right: 15px;
        }
        ^ .foam-nanos-menu-SubMenuView-inner > div {
          height: 40px;
          padding-left: 50px;
          font-size: 14px;
          font-weight: 300;
          color: #093649;
          line-height: 25px;
        }
        ^ .foam-nanos-menu-SubMenuView-inner > div:last-child {
          background-color: #f6f9f9;
          box-shadow: 0 -1px 0 0 #e9e9e9;
          font-size: 14px;
          color: #c82e2e;
        }
        ^ .foam-nanos-menu-SubMenuView-inner > div:hover {
          background-color: #59aadd;
          color: white;
          cursor: pointer;
        }
        ^ .foam-nanos-menu-SubMenuView-inner::after {
          content: ' ';
          position: absolute;
          height: 0;
          width: 0;
          border: 8px solid transparent;
          border-bottom-color: white;
          -ms-transform: translate(120px, -175.5px);
          transform: translate(120px, -175.5px);
        }
      */}
    })
  ],

  methods: [
    function initE() {
      
      this
        .addClass(this.myClass())
        /*.tag({class:'foam.u2.tag.Image', data: 'images/alert-exclamation.png'})
        .tag({class: 'foam.u2.tag.Image', data: 'images/bell.png'})*/
        .start('h1')
          .add( this.user.firstName$ ).addClass(this.myClass('user-name'))
            .on('click', function() {
              this.tag(this.SubMenuView.create({menu: this.Menu.create({id: 'settings'})}))
            }.bind(this))
        .end()
        .start('div')
          .addClass(this.myClass('carrot'))
            .on('click', function() {
              this.tag(this.SubMenuView.create({menu: this.Menu.create({id: 'settings'})}))
            }.bind(this))
        .end();
    }
  ]
});