foam.CLASS({
  package: 'net.nanopay.ui',
  name: 'FooterView',
  extends: 'foam.u2.View',

  documentation: 'View to display footer, including copyright label',

  imports: [
    'webApp'
  ],

  axioms: [
    foam.u2.CSS.create({
      code: function CSS() {/*
        ^ {
          width: 100%;
          min-width: 992px;
          margin: auto;
          position: relative;
          top: 60;
        }
        ^ h3{
          font-size: 14px;
          font-weight: 300;
          text-align: center;
          color: #262626;
          display: inline-block;
          opacity: 0.6;
          float: left;
          margin-left: 25px;
        }
        ^ .copyright-label {
          margin-right: 50px;
          float: right;
          opacity: 0.6;
          font-family: Roboto;
          font-size: 14px;
          font-weight: 300;
          font-style: normal;
          font-stretch: normal;
          line-height: normal;
          letter-spacing: 0.2px;
          text-align: left;
          color: #272727;
          width: auto !Important;
          padding: 0 10px !Important;
        }
        .net-nanopay-ui-ActionView-goToTerm {
          background: transparent;
          opacity: 0.6;
          font-family: Roboto;
          font-size: 14px;
          font-weight: 300;
          font-style: normal;
          font-stretch: normal;
          line-height: normal;
          letter-spacing: 0.2px;
          text-align: left;
          color: #272727;
          width: auto !Important;
          padding: 0 10px !Important;
        }
        .net-nanopay-ui-ActionView-goToTerm:hover {
          text-decoration: underline;
          font-family: Roboto;
          font-size: 14px;
          font-weight: 300;
          font-style: normal;
          font-stretch: normal;
          line-height: normal;
          letter-spacing: 0.2px;
          text-align: left;
          color: #272727;
        }
        .net-nanopay-ui-ActionView-goToPrivacy {
          background: transparent;
          opacity: 0.6;
          font-family: Roboto;
          font-size: 14px;
          font-weight: 300;
          font-style: normal;
          font-stretch: normal;
          line-height: normal;
          letter-spacing: 0.2px;
          text-align: left;
          color: #272727;
          width: auto !Important;
          padding: 0 10px !Important;
        }
        .net-nanopay-ui-ActionView-goToPrivacy:hover {
          text-decoration: underline;
          font-family: Roboto;
          font-size: 14px;
          font-weight: 300;
          font-style: normal;
          font-stretch: normal;
          line-height: normal;
          letter-spacing: 0.2px;
          text-align: left;
          color: #272727;
        }
        .net-nanopay-ui-ActionView-goToNanopay {
          background: transparent;
          opacity: 0.6;
          font-family: Roboto;
          font-size: 14px;
          font-weight: 300;
          font-style: normal;
          font-stretch: normal;
          line-height: normal;
          letter-spacing: 0.2px;
          text-align: left;
          color: #272727;
          width: auto !Important;
          padding: 0 10px !Important;
        }
        .net-nanopay-ui-ActionView-goToNanopay:hover {
          text-decoration: underline;
          font-family: Roboto;
          font-size: 14px;
          font-weight: 300;
          font-style: normal;
          font-stretch: normal;
          line-height: normal;
          letter-spacing: 0.2px;
          text-align: left;
          color: #272727;
        }
      */}
    })
  ],

  methods: [
    function initE(){
      this.SUPER();
      this
        .addClass(this.myClass())
        .start()
          .start('h3')
            .start(this.GO_TO_NANOPAY).end()
            .add('|')
            .start(this.GO_TO_TERM).end()
            .add('|')
            .start(this.GO_TO_PRIVACY).end()
          .end()
          .start('h3').addClass('copyright-label').add('Copyright © 2018 ' + this.webApp + '. All right reserved.').end()
        .end();
    }
  ],

  actions: [
     {
      name: 'goToNanopay',
      label: 'nanopay.net',
      code: function(X) {
        var self = this;
        var nanopayURL = 'https://nanopay.net';
        self.window.location.assign(nanopayURL);
      }
    },
    {
      name: 'goToTerm',
      label: 'Terms and Conditions',
      code: function(X) {
        var self = this;
        //var alternaUrl = self.window.location.orgin + "/termsandconditions/"
        var termsURL = 'https://nanopay.net/termsandconditions/';
        self.window.location.assign(termsURL);
      }
    },
    {
      name: 'goToPrivacy',
      label: 'Privacy Policy',
      code: function(X) {
        var self = this;
        //var alternaUrl = self.window.location.orgin + "/privacy-policy/"
        var priacyURL = 'https://nanopay.net/privacy-policy/';
        self.window.location.assign(privacyURL);
      }
    }
  ]
});
