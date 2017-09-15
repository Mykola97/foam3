foam.CLASS({
  package: 'net.nanopay.invoice.ui',
  name: 'SalesDetailView',
  extends: 'foam.u2.View',

  requires: [ 
    'net.nanopay.invoice.model.Invoice', 
    'foam.u2.dialog.Popup' 
  ],

  imports: [ 
    'stack', 
    'hidePayableSummary', 
    'invoiceDAO', 
    'ctrl'
  ],

  exports: [ 'hidePayableSummary' ],
  
  implements: [
    'foam.mlang.Expressions', 
  ],

  axioms: [
    foam.u2.CSS.create({
      code: function CSS() {/*
        ^ h5{
          opacity: 0.6;
          font-size: 20px;
          font-weight: 300;
          line-height: 1;
          color: #093649;
          padding-top: 70px;
        }
        ^ .foam-u2-ActionView-mainAction{
          right: 250px !important;
        }
        */
      }
    })
  ],


  methods: [
    function initE() {
      this.SUPER();

      this.hideReceivableSummary = true;
      this
        .addClass(this.myClass())
        .tag({ 
          class: 'net.nanopay.invoice.ui.shared.ActionInterfaceButton', 
          detailActions: { 
            invoice: this.data,
            buttonLabel: 'Record Payment', 
            buttonAction: this.recordPaymentModal,
            subMenu1: 'Edit Invoice',
            subMenu2: 'Void' 
          }
        })
        .start('h5').add('Bill from ', this.data.fromUserName).end()
        .tag({ class: 'net.nanopay.invoice.ui.shared.SingleItemView', data: this.data })
    }
  ],

  listeners: [
    function recordPaymentModal(){
      this.ctrl.add(this.Popup.create().tag({class: 'net.nanopay.invoice.ui.modal.RecordPaymentModal'}));
    }
  ]
  
});