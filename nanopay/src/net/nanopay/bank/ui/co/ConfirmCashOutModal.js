foam.CLASS({
  package: 'net.nanopay.bank.ui.co',
  name: 'ConfirmCashOutModal',
  extends: 'foam.u2.View',

  imports: [ 'closeDialog', 'onCashOutSuccess', 'cashOut' ],

  documentation: 'Pop up modal for confirming cash out.',

  axioms: [
    foam.u2.CSS.create({
      code: function CSS() {/*
        ^ {
          width: 448px;
          height: 288px;
          margin: auto;
        }
        ^ .cashOutContainer {
          width: 448px;
          height: 288px;
          border-radius: 2px;
          background-color: #ffffff;
          box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.02);
        }
        ^ .popUpHeader {
          width: 448px;
          height: 40px;
          background-color: #093649;
        }
        ^ .popUpTitle {
          width: 198px;
          height: 40px;
          font-family: Roboto;
          font-size: 14px;
          line-height: 40.5px;
          letter-spacing: 0.2px;
          text-align: left;
          color: #ffffff;
          margin-left: 20px;
          display: inline-block;
        }
        ^ .foam-u2-ActionView-closeButton {
          width: 24px;
          height: 24px;
          margin: 0;
          margin-top: 5px;
          margin-right: 20px;
          cursor: pointer;
          display: inline-block;
          float: right;
          outline: 0;
          border: none;
          background: transparent;
          box-shadow: none;
        }
        ^ .foam-u2-ActionView-closeButton:hover {
          background: transparent;
          background-color: transparent;
        }
        ^ .label {
          font-family: Roboto;
          font-size: 14px;
          font-weight: bold;
          letter-spacing: 0.2px;
          color: #093649;
          margin-top: 20px;
          margin-bottom: 0;
          display: inline-block;
          vertical-align: top;
        }
        ^ .bankInfoDiv {
          display: inline-block;
          margin-left: 35px;
          margin-top: 18px;
        }
        ^ .bankLogo {
          width: 24px;
          height: 24px;
          float: left;
          clear: both;
          margin-bottom: 5px;
        }
        ^ .bankName {
          width: 200px;
          font-size: 12px;
          line-height: 1.33;
          letter-spacing: 0.2px;
          color: #093649;
          clear: both;
        }
        ^ .accountNumber {
          font-size: 12px;
          line-height: 1.33;
          letter-spacing: 0.2px;
          color: #093649;
          margin-top: 5px;
        }
        ^ .amount {
          font-size: 12px;
          line-height: 1.33;
          letter-spacing: 0.2px;
          color: #093649;
          display: inline-block;
          margin-top: 22px;
          margin-left: 75px;
        }
        ^ .foam-u2-ActionView-cashOutBtn {
          font-family: Roboto;
          width: 136px;
          height: 40px;
          border-radius: 2px;
          background: #59a5d5;
          border: solid 1px #59a5d5;
          display: inline-block;
          color: white;
          text-align: center;
          cursor: pointer;
          font-size: 14px;
          margin: 0;
          margin-right: 20px;
          outline: none;
          float: right;
          box-shadow: none;
          font-weight: normal;
          margin-top: 74px;
        }
        ^ .foam-u2-ActionView-cashOutBtn:hover {
          background: #3783b3;
          border-color: #3783b3;
        }
        ^ .foam-u2-ActionView-back {
          font-family: Roboto;
          width: 136px;
          height: 40px;
          background: rgba(164, 179, 184, 0.1);
          border-radius: 2px;
          border: solid 1px #ebebeb;
          display: inline-block;
          color: #093649;
          text-align: center;
          cursor: pointer;
          font-size: 14px;
          margin: 0;
          outline: none;
          float: left;
          margin-left: 20px;
          box-shadow: none;
          font-weight: normal;
          margin-top: 74px;
        }
        ^ .foam-u2-ActionView-back:hover {
          background: #ebebeb;
        }
    */}
    })
  ],

  methods: [
    function initE() {
      this.SUPER();
      var self = this;

      this.addClass(this.myClass())
      .start()
        .start().addClass('cashOutContainer')
          .start().addClass('popUpHeader')
            .start().add(this.Title).addClass('popUpTitle').end()
            .add(this.CLOSE_BUTTON)
          .end()
          .start().add(this.bankLabel).addClass('label').end()
          .start('div').addClass('bankInfoDiv')
            .start({class: 'foam.u2.tag.Image', data: 'images/bmo-logo.svg'}).addClass('bankLogo').end()
            .start().add('Bank Name').addClass('bankName').end()
            .start().add('xxxx123456').addClass('accountNumber').end()
          .end()
          .br()
          .start().add(this.amountLabel).addClass('label').end()
          .start().add('$30000.00').addClass('amount').end()
          .start('div')
            .add(this.BACK)
            .add(this.CASH_OUT_BTN)
          .end()
        .end()
      .end()
    }
  ],

  messages: [
    { name: 'Title', message: 'Cash Out' },
    { name: 'bankLabel', message: 'Bank Account' },
    { name: 'amountLabel', message: 'Amount' },
    { name: 'backBtnTitle', message: 'Back' }
  ],

  actions: [
    {
      name: 'closeButton',
      icon: 'images/ic-cancelwhite.svg',
      code: function(X) {
        X.closeDialog();
      }
    },
    {
      name: 'back',
      label: this.backBtnTitle,
      code: function (X) {
        X.closeDialog();
        X.cashOut();
      }
    },
    {
      name: 'cashOutBtn',
      label: 'Cash Out',
      code: function (X) {
        X.closeDialog();
        X.onCashOutSuccess();
      }
    }
  ]
})