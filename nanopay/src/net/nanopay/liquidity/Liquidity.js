foam.CLASS({
  package: 'net.nanopay.liquidity',
  name: 'Liquidity',

  requires: [
    'net.nanopay.account.Account',
    'net.nanopay.account.DigitalAccount'
  ],

  implements: [
    'foam.mlang.Expressions'
  ],

  properties: [
    {
      class: 'Boolean',
      name: 'active',
      documentation: 'Determines whether Liquidity is active, and notifications and/or re-balancing is to occur',
    },
    {
      class: 'Boolean',
      name: 'enableRebalancing',
      documentation: 'Triggeres automatic transaction on accounts.'
    },
    {
      class: 'Currency',
      name: 'threshold',
      documentation: 'The balance when liquidity should be triggered.'
    },
    {
      class: 'Currency',
      name: 'resetBalance',
      documentation: 'Account balance must match reset amount after liquidity transaction was generated.'
    },
    {
      class: 'Reference',
      of: 'net.nanopay.account.Account',
      name: 'pushPullAccount',
      label: 'push/pull account',
      documentation: 'Account associated to setting.',
      view: function(_, X) {
        return foam.u2.view.RichChoiceView.create({
          search: true,
          selectionView: { class: 'net.nanopay.ui.AccountSelectionView' },
          rowView: { class: 'net.nanopay.ui.AccountRowView' },
          sections: [
            {
              dao: X.accountDAO
            }
          ]
        });
      }
    }
  ]
});
