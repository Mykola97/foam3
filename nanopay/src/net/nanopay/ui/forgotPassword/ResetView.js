foam.CLASS({
  package: 'net.nanopay.ui.forgotPassword',
  name: 'ResetView',
  extends: 'foam.u2.View',

  documentation: 'Forgot Password Reset View',

  imports: [
    'stack',
    'resetPasswordToken'
  ],

  exports: [
    'as data'
  ],

  requires: [
    'foam.nanos.auth.User',
    'net.nanopay.ui.NotificationMessage'
  ],

  axioms: [
    foam.u2.CSS.create({
      code: function CSS() {/*

      ^{
        width: 490px;
        margin: auto;
      }

      ^ .Message-Container{
        width: 490px;
        height: 251px;
        border-radius: 2px;
        background-color: #ffffff;
        padding-top: 5px;
      }

      ^ .Reset-Password{
        width: 225;
        height: 30px;
        font-family: Roboto;
        font-size: 30px;
        font-weight: bold;
        line-height: 1;
        letter-spacing: 0.5px;
        text-align: left;
        color: #093649;
        margin-top: 20px;
        margin-bottom: 30px;
      }

      ^ p{
        display: inline-block;
      }

      ^ .newPassword-Text{
        width: 182px;
        height: 16px;
        font-family: Roboto;
        font-size: 14px;
        font-weight: 300;
        letter-spacing: 0.2px;
        text-align: left;
        color: #093649;
        margin-top: 15px;
        margin-left: 20px;
        margin-right: 288px;
        margin-bottom: 5px;
      }

      ^ .confirmPassword-Text{
        width: 182px;
        height: 16px;
        font-family: Roboto;
        font-size: 14px;
        font-weight: 300;
        letter-spacing: 0.2px;
        text-algin: left;
        color: #093649;
        margin-left: 20px;
        margin-bottom: 5px;
        margin-top: 10px;
      }
      
      ^ .net-nanopay-ui-ActionView-confirm {
        width: 450px;
        height: 40px;
        border-radius: 2px;
        border: solid 1px #59a5d5;
        margin-left: 20px;
        margin-right: 20px;
        background-color: #59aadd;
        text-align: center;
        line-height: 40px;
        cursor: pointer;
        color: #ffffff;
        margin-top: 10px;
      }

      ^ .net-nanopay-ui-ActionView-confirm span {
        display: block;
        font-size: 12px;
        line-height: 40px;
        letter-spacing: 0.2px;
      }

      ^ .net-nanopay-ui-ActionView-confirm:hover {
        background: none;
        cursor: pointer;
        background-color: #20B1A7;
      }

      ^ .link{
        margin-left: 2px;
        color: #59a5d5;
        cursor: pointer;
      }
    */}
  })
  ],

  properties: [
    {
      class: 'String',
      name: 'token',
      factory: function () {
        var search = /([^&=]+)=?([^&]*)/g;
        var query  = window.location.search.substring(1);

        var decode = function (s) {
          return decodeURIComponent(s.replace(/\+/g, ' '));
        };

        var params = {};
        var match;

        while ( match = search.exec(query) ) {
          params[decode(match[1])] = decode(match[2]);
        }

        return params.token || null;
      }
    },
    {
      class: 'String',
      name: 'newPassword',
      view: 'foam.u2.view.PasswordView'
    },
    {
      class: 'String',
      name: 'confirmPassword',
      view: 'foam.u2.view.PasswordView'
    }
  ],

  methods: [
    function initE(){
    this.SUPER();
    var self = this;

    this
      .addClass(this.myClass())
      .start()
        .start().addClass('Reset-Password').add("Reset Password").end()
        .start().addClass('Message-Container')
          .start().addClass('newPassword-Text').add("New Password").end()
          .start(this.NEW_PASSWORD).addClass('full-width-input').end()
          .start().addClass('confirmPassword-Text').add("Confirm Password").end()
          .start(this.CONFIRM_PASSWORD).addClass('full-width-input').end()
          .start('div')
            .tag(this.CONFIRM, { showLabel: true })
          .end()
        .end()
        .start('p').add("Remember your password?").end()
        .start('p').addClass('link')
          .add('Sign in.')
          .on('click', function(){ self.stack.push({ class: 'net.nanopay.auth.ui.SignInView' })})
        .end()
      .end()
    }
  ],

  actions: [
    {
      name: 'confirm',
      label: 'Confirm',
      isEnabled: function (newPassword, confirmPassword) {
        return newPassword && confirmPassword;
      },
      code: function (X, obj) {
        var self = this;

        var user = this.User.create({
          password: this.newPassword
        });

        this.resetPasswordToken.processToken(user, this.token).then(function (result) {
          self.stack.push({ class: 'net.nanopay.ui.forgotPassword.SuccessView' });
        }).catch(function (err) {
          self.add(self.NotificationMessage.create({ message: err.message, type: 'error' }));
        });
      }
    }
  ]
});
