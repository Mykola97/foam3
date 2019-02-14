foam.CLASS({
  package: 'net.nanopay.sme.ui',
  name: 'BusinessRowView',
  extends: 'foam.u2.View',

  implements: [
    'foam.mlang.Expressions'
  ],

  documentation: `
    A single row in a list of businesses.
  `,

  imports: [
    'businessDAO',
    'user'
  ],

  requires: [
    'net.nanopay.auth.AgentJunctionStatus',
    'net.nanopay.model.Business'
  ],

  css: `
    ^ {
      background: white;
      border-radius: 3px;
      padding: 0 24px;
      box-shadow: 0 1px 1px 0 #dae1e9;
      border: solid 1px #e2e2e3;
      background-color: #ffffff;
      margin-bottom: 8px;
      height: 78px;
      box-sizing: border-box;
    }
    ^:hover {
      cursor: pointer;
    }
    ^row {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    ^:hover ^oval {
      background-color: #604aff;
    }
    ^business-name {
      font-size: 16px;
      font-weight: 800;
      font-style: normal;
      font-stretch: normal;
      line-height: 1.5;
      letter-spacing: normal;
      color: %PRIMARYCOLOR%;
    }
    ^oval {
      width: 32px;
      height: 32px;
      background-color: #e2e2e3;
      color: #ffffff;
      border-radius: 20px;
      text-align: center;
      font-size: 25px;
    }
    ^status {
      color: #f91c1c;
      margin-right: 27px;
      font-size: 11px;
    }
    ^status-dot {
      background-color: #f91c1c;
      margin-right: 6px;
      height: 4px;
      width: 4px;
      border-radius: 999px;
      margin-top: 1px;
    }
  `,

  messages: [
    { name: 'DISABLED', message: 'Disabled' }
  ],

  properties: [
    {
      class: 'FObjectProperty',
      of: 'foam.nanos.auth.UserUserJunction',
      name: 'data',
      documentation: 'Set this to the business you want to display in this row.'
    },
    {
      class: 'FObjectProperty',
      of: 'net.nanopay.model.Business',
      name: 'business'
    }
  ],

  methods: [
    function initE() {
        this.businessDAO
          .find(this.data.targetId).then((business) => {
            this.business = business;
          });

      this.start()
        .addClass(this.myClass())
        .addClass(this.myClass('row'))
        .start('span')
          .addClass(this.myClass('business-name'))
          .add(this.slot(function(business) {
            return business ? business.businessName : '';
          }))
        .end()
        .start()
          .addClass(this.myClass('row'))
          .start()
            .addClass(this.myClass('row'))
            .show(this.data$.map((data) => {
              return data.status === this.AgentJunctionStatus.DISABLED;
            }))
            .start()
              .addClass(this.myClass('status-dot'))
            .end()
            .start()
              .addClass(this.myClass('status'))
              .add(this.DISABLED)
            .end()
          .end()
          .start()
            .addClass(this.myClass('oval'))
            .add('➔')
          .end()
        .end()
      .end();
    }
  ]
});
