
foam.CLASS({
  package: 'net.nanopay.ui.modal',
  name: 'TandCModal',
  extends: 'foam.u2.View',

  documentation: 'Terms and Conditions Modal',

  requires: [
    'net.nanopay.ui.modal.ModalHeader',
  ],

  exports: [
    'as data',
  ],
  implements: [
    'net.nanopay.ui.modal.ModalStyling'
  ],

  properties: [
    'exportData'
  ],

  css:`
  ^ .iframe-container{
    width: 800px;
    border-width: 0px;
    height: 400px;
    padding: 5px;
  }
  ^ .net-nanopay-ui-modal-ModalHeader {
    width: 100%;
  } 
  ^ .net-nanopay-ui-ActionView-printButton {
    float: left;
    margin: 0px 5px 5px 5px;
  } 
  `,

  methods: [
    function initE(){
      this.SUPER();
      var self = this;          
      this
      .start()
        .tag(this.ModalHeader.create({
          title: 'Terms and Conditions'
        }))
        .addClass(this.myClass())
        .start('div')
          .start(this.PRINT_BUTTON).addClass('btn blue-button')
          .end()
        .end()
        .start('iframe').addClass('iframe-container')
          .attrs({id:'print-iframe',name:'print-iframe',src:"http://localhost:8080/service/terms?version="+((this.exportData === undefined )?" ":this.exportData)})
        .end()
      .end()
    },
   
  ],
  actions:[
    {
      name: 'cancelButton',
      label: 'Cancel',
      code: function(X) {
        X.closeDialog();
      }
    },
    {
      name: 'printButton',
      label: 'Print',
      code: function(X) {
        X.window.frames["print-iframe"].focus()
        X.window.frames["print-iframe"].print()
      }
    },
  ],
  listeners: [
   
  ]
});