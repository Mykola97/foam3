foam.CLASS({
  package: 'net.nanopay.sme.ui.dashboard',
  name: 'TopCardsOnDashboard',
  extends: 'foam.u2.Controller',

  documentation: `
    View to display new(May 21 2019) zeplin designs for dashboard
  `,

  implements: [
    'foam.mlang.Expressions',
  ],

  requires: [
    'net.nanopay.account.Account',
    'net.nanopay.bank.BankAccount',
    'net.nanopay.bank.BankAccountStatus',
    'net.nanopay.bank.CABankAccount',
    'net.nanopay.bank.USBankAccount',
    'net.nanopay.model.Invitation',
    'net.nanopay.sme.ui.dashboard.cards.BankIntegrationCard',
    'net.nanopay.sme.ui.dashboard.cards.QBIntegrationCard',
    'net.nanopay.sme.ui.dashboard.cards.SigningOfficerSentEmailCard',
    'net.nanopay.sme.ui.dashboard.cards.UnlockPaymentsCard',
    'net.nanopay.sme.ui.dashboard.cards.UnlockPaymentsCardType',
    'net.nanopay.sme.ui.dashboard.RequireActionView'
  ],

  imports: [
    'accountingIntegrationUtil',
    'agent',
    'businessOnboardingDAO',
    'businessInvitationDAO',
    'user',
    'userDAO'
  ],

  css: `
  ^ .cards {
    margin-top: 20px;
    display: inline-flex;
  }
  ^ .lower-cards {
    margin-top: 20px;
    display: inline-flex;
    margin-bottom: 20px;
  }
  ^ .inner-card {
    margin-left: 20px;
  }
  ^ .divider {
    background-color: #e2e2e3;
    height: 2px;
    margin: 24px 0 0 0;
    width: 97%;
  }
  ^ .subTitle {
    color: #8e9090;
    font-size: 16px;
  }
  ^ .radio-as-arrow-margins {
    float: right;
    margin-top: -12px;
  }
  ^ .radio-as-arrow {
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 0 4px 5px 4px;
    border-color: transparent transparent white transparent;
    position: relative;
    left: 17px;
    bottom: -10px;
    z-index: 0;
    pointer-events:none;
  }
  ^ .radio-as-arrow-down {
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 5px 4px 0 4px;
    border-color: white transparent transparent transparent;
    position: relative;
    left: 17px;
    bottom: -10px;
    z-index: 0;
    pointer-events:none;
  }
  ^ .line {
    width: 100%;
    height: 10px;
    border-bottom: 2px solid #e2e2e3;
    text-align: center;
    margin-top: 15px;
  }
  ^ .divider-half {
    font-size: 14px;
    background-color: %BACKGROUNDCOLOR%;
    padding: 0 10px;
    text-align: center;
    color: #8e9090;
  }
  ^ .foam-u2-CheckBox {
    -webkit-appearance: none;
    background-color: %SECONDARYCOLOR%;
    border-radius: 50%;
    z-index: 10000;

  }
  ^ .foam-u2-CheckBox:checked:after {
    content: none;
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 5px 4px 0 4px;
    border-color: transparent transparent white transparent;
    position: relative;
    left: 17px;
    bottom: -10px;
  }
  `,

  properties: [
    {
      class: 'Boolean',
      name: 'hidePaymentCards',
      documentation: 'The clickable arrow under the title, that toggles the onboarding cards.'
    }
  ],

  messages: [
    { name: 'LOWER_LINE_TXT', message: 'Welcome back ' },
    { name: 'UPPER_TXT', message: 'Your latest Ablii items' }
  ],

  methods: [
    function initE() {
      Promise.all([
        this.user.accounts
          .where(
            this.AND(
              this.OR(
                this.EQ(this.Account.TYPE, this.BankAccount.name),
                this.EQ(this.Account.TYPE, this.CABankAccount.name),
                this.EQ(this.Account.TYPE, this.USBankAccount.name)
              ), this.EQ(this.BankAccount.STATUS, this.BankAccountStatus.VERIFIED))
          ).select().then((result) => result),
        this.accountingIntegrationUtil.getPermission(),
        this.userDAO.find(this.user.id).then((use) => use.hasIntegrated),
        // this.businessOnboardingDAO.find(this.agent.id).then((o) => o),
        this.businessInvitationDAO.where(
          this.AND(
            this.EQ(this.Invitation.GROUP, 'admin'),
            this.EQ(this.Invitation.CREATED_BY, this.user.id)
          )).select().then((result) => result),
        this.user.onboarded
      ]).then((values) => {
          // REFERENCE FOR values
          // bankAccount                     = values[0];
          // userHasPermissionForAccounting  = values[1];
          // userHasIntegratedWithAccounting = values[2];
          // isSigningOfficer                = values[3];
          // isOnboardingCompleted           = values[4];
          let account          = values[0] && values[0].array[0];
          let isBankCompleted  = account && account.id != 0;
          let isAllCompleted   = values[4] && isBankCompleted && values[2];
          let isSigningOfficer = values[3] == undefined; // if not set yet, assume user is signingOfficer
          let sectionsShowing  = ! isSigningOfficer && ! isAllCompleted; // convience boolean for displaying certian sections

          this
            .addClass(this.myClass())

            .start().addClass('subTitle').add(this.LOWER_LINE_TXT + this.user.label() + '!').end()

            .callIf( isSigningOfficer && ! isAllCompleted, () => {
              this.start()
                .addClass('divider')
              .end()

              .start().addClass('radio-as-arrow-margins')
                .add(this.HIDE_PAYMENT_CARDS)
              .end()
              .start().addClass('radio-as-arrow').addClass('radio-as-arrow-margins').hide(this.hidePaymentCards$).end()
              .start().addClass('radio-as-arrow-down').addClass('radio-as-arrow-margins').show(this.hidePaymentCards$).end()
              .start().addClass('cards').hide(this.hidePaymentCards$)
                .start('span')
                  .tag({ class: 'net.nanopay.sme.ui.dashboard.cards.UnlockPaymentsCard', type: this.UnlockPaymentsCardType.DOMESTIC, isComplete: values[4] })
                .end()
                .start('span').addClass('inner-card')
                  .tag({ class: 'net.nanopay.sme.ui.dashboard.cards.UnlockPaymentsCard', type: this.UnlockPaymentsCardType.INTERNATIONAL })
                .end()
              .end();
            })
            .callIfElse(sectionsShowing, () => {
              this.start('span').addClass('card')
                .tag({ class: 'net.nanopay.sme.ui.dashboard.cards.SigningOfficerSentEmailCard' })
              .end();
            }, () => {
              this.start().addClass('lower-cards')
                .start('span')
                  .tag({ class: 'net.nanopay.sme.ui.dashboard.cards.BankIntegrationCard', account: account })
                .end()
                .start('span').addClass('inner-card')
                  .tag({ class: 'net.nanopay.sme.ui.dashboard.cards.QBIntegrationCard', hasPermission: values[1] && values[1][0], hasIntegration: values[2] })
                .end()
              .end();
            })
            .start().addClass('line')
              .start('span')
                .addClass('divider-half').add(this.UPPER_TXT)
              .end()
            .end();
        });
    }
  ]
});
