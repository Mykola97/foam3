foam.CLASS({
  package: 'net.nanopay.model',
  name: 'BankAccountInfo',
  extends: 'net.nanopay.model.AccountInfo',

  documentation: 'Bank account information.',

  tableColumns: [ 'accountName', 'transitNumber', 'bankNumber', 'accountNumber', 'status', 'run' ],

  properties: [
    {
      class: 'String',
      name: 'id'
    },
    {
      class: 'String',
      name: 'accountName',
      label: 'Account Name'
    },
    {
      class: 'String',
      name: 'transitNumber',
      label: 'Transit No.'
    },
    {
      class: 'String',
      name: 'accountNumber',
      label: 'Account No.',
      tableCellFormatter: function(str) {
        this.start()
          .add('***' + str.substring(str.length - 4, str.length))
      }
    },
    {
      class: 'String',
      name: 'status',
      tableCellFormatter: function(a) {
        var colour = ( a == 'verified' ) ? '#2cab70' : '#f33d3d';
        this.start()
          .add(a)
          .style({
            'color': colour,
            'text-transform': 'capitalize'
          })
        .end();
      }
    },
    {
      class: 'String',
      name: 'xeroId'
    },
    {
      class: 'String',
      name: 'currencyCode'
    }
  ],

  actions: [
    {
      name: 'run',
      icon: 'images/ic-options-hover.svg',
      code: function() {
        foam.nanos.menu.SubMenuView.create({menu: foam.nanos.menu.Menu.create({id: 'accountSettings'})});
      }
    }
  ]
});


foam.RELATIONSHIP({
  cardinality: '1:*',
  sourceModel: 'net.nanopay.model.Bank',
  targetModel: 'net.nanopay.model.BankAccountInfo',
  forwardName: 'bankNumber',
  inverseName: 'bankAccount'
});