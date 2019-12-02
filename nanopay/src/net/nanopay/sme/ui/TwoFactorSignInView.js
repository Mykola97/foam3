foam.CLASS({
  package: 'net.nanopay.sme.ui',
  name: 'AuthView',
  extends: 'foam.u2.View',
  requires: [
    'foam.core.ArraySlot',
    'foam.u2.TextField'
  ],

  css: `
    ^ {
      width: 80%;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
    }
    ^ input {
      border-width: 1px;
      border-radius: 5px;
      width: 48px;
      height: 48px;
      text-align: center;
      margin: 8px 14px 8px 0;
      font-size: 22px;
    }
    ^ .wrong-code {
      border-color: #f91c1c;
      background-color: #fff6f6;
    }
  `,
  properties: [
    {
      class: 'String',
      name: 'data'
    },
    {
      class: 'Boolean',
      name: 'incorrectCode',
    },
    {
      class: 'Int',
      name: 'currentIndex',
      value: 0,
    },
    {
      class: 'Int',
      name: 'numOfParts',
      value: 6,
      preSet: function(old, nu) {
        if ( nu >= this.numOfParts - 1 ) return this.numOfParts - 1;
        if ( nu <= 0 ) return 0;
        if ( nu < 0 || this.choices.length === 0 ) return 0;
        return nu;
      }
    },
    {
      class: 'FObjectArray',
      of: 'foam.u2.Element',
      name: 'elements'
    }
  ],
  methods: [
    function initE() {
      this.SUPER();
      var self = this;
      for ( let i = 0; i < this.numOfParts; i++ ) {
        var isFirstElement = i === 0;
        let v = this.TextField.create({ onKey: true });
        v.setAttribute('maxlength', 1);
        v.setAttribute('autofocus', isFirstElement);
        v.addClass('input').enableClass('wrong-code', this.incorrectCode$ );
        v.on('focus', () => {
          self.currentIndex = i;
        });
        v.on('keydown', function onkeyDown(e) {
          switch ( e.keyCode ) {
            case 37:
                self.currentIndex--;
                self.elements[self.currentIndex].focus();
            break;
            case 39:
                self.currentIndex++;
                self.elements[self.currentIndex].focus();
            break;
            case 8:
              if ( self.elements[self.currentIndex].data === ' ' || ! self.elements[self.currentIndex].data ) {
                if ( self.currentIndex === 0 ) break;
                self.elements[self.currentIndex - 1].focus();
              };
            break;
          }
        });

        this.tag(v).addClass(this.myClass());
        this.onDetach(v.data$.sub(this.onDataUpdate));
        this.elements.push(v);
      }

      this.onDetach(this.data$.follow(this.ArraySlot.create({
        slots: this.elements.map((elm) => elm.data$)
      }).map((arr) => arr.reduce((str, c) => str + (c || ' '), ''))));
    }
  ],
  listeners: [
    {
      name: 'onDataUpdate',
      code: function(detachable, eventName, propertyName, propertySlot) {
        console.log(this.data);
        if ( propertySlot.get() ) {
          
          if ( this.currentIndex >= this.numOfParts - 1 ) return;
          this.elements[this.currentIndex + 1].focus();
        } else {
          console.log(eventName)
        }
      }
    }
  ],
});


foam.CLASS({
  package: 'net.nanopay.sme.ui',
  name: 'TwoFactorSignInView',
  extends: 'foam.u2.Controller',

  documentation: 'Two-Factor sign in view',

  imports: [
    'loginSuccess',
    'notify',
    'twofactor',
  ],

  requires: [
    'foam.u2.dialog.NotificationMessage',
    'foam.u2.Element',
    'foam.u2.ViewSpec'
  ],

  css: `
    ^ {
      margin-top: 20vh;
    }

    ^button {
      margin-top: 56px;
      cursor: pointer;
      font-size: 16px;
      font-weight: normal;
      font-style: normal;
      font-stretch: normal;
      line-height: 1.5;
      letter-spacing: normal;
      color: #8e9090;
      display: inline;
      position: relative;
      top: 20px;
      left: 20px;
    }

    ^ .link {
      margin-right: 5px;
    }
    ^ .tfa-container {
      border-radius: 2px;
      margin-top: 20px;
      width: 450px;
    }
    ^ .tf-container {
      width: 450px;
      margin: 0 auto 0 0;
    }

    ^verify-button {
      width: 80%;
      height: 48px;
      margin-top: 20px;
    }
    ^ .net-nanopay-sme-ui-AbliiEmptyTopNavView {
      border: 0;
      height: 36px
    }
    ^ .net-nanopay-sme-ui-AbliiEmptyTopNavView img{
      width: auto;
      height: 20px;
      padding-left: 5px;
    }
    ^sme-subtitle {
      text-align: initial;
      margin: 24px 10.5px;
      font-size: 14px;
      letter-spacing: 0.5px;
      color: #093400;
      font-weight: 300;
      line-height: 24px;
    }
    ^TwoFactAuthNote {
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      width: 80%;
    }
    ^TwoFactAuthIntro {
      padding: 0 16px;
      font-size: 14px;
      font-family: Lato-Regular;
      line-height: 1.6;
      height: 63px;
    }
    ^ .error-msg {
      display: flex;
      color: #f91c1c;
    }
  `,

  properties: [
    {
      class: 'Boolean',
      name: 'incorrectCode'
    },
    {
      class: 'String',
      name: 'twoFactorToken',
      view: function(_, X) {
        return {
          class: 'net.nanopay.sme.ui.AuthView',
          incorrectCode$: X.data.incorrectCode$
        };
      }
    },
  ],

  messages: [
    { name: 'TWO_FACTOR_NO_TOKEN', message: 'Please enter a verification code.' },
    { name: 'TWO_FACTOR_LABEL', message: 'Enter verification code' },
    { name: 'TWO_FACTOR_ERROR', message: 'Incorrect code. Please try again.' },
    { name: 'TWO_FACTOR_TITLE', message: 'Two-factor authentication' },
    { name: 'TWO_FACTOR_EXPLANATION', message: `Open your Google Authenticator app on your mobile device to view the 6-digit code and verify your identity` },
    { name: 'TWO_FACTOR_NOTES_1', message: `Need another way to authenticate?` },
    { name: 'TWO_FACTOR_NOTES_2', message: `Contact us` },
    { name: 'GO_BACK', message: 'Go to ablii.com' },
  ],

  methods: [
    function init() {
      this.SUPER();
    },

    async function initE() {
      this.SUPER();
      var split = foam.u2.borders.SplitScreenBorder.create();

      var left = this.Element.create().addClass('cover-img-block')
        .start('img')
          .addClass('sme-image')
          .attr('src', 'images/sign_in_illustration.png')
        .end();

      var right = this.Element.create()
      .addClass(this.myClass())
      .tag({ class: 'net.nanopay.sme.ui.AbliiEmptyTopNavView' })
      .start().addClass('tf-container')
        .start('h2').add(this.TWO_FACTOR_TITLE).end()
        .start().addClass(this.myClass('TwoFactAuthNote'))
          .start('img').attr('src', 'images/phone-iphone-24-px.png').end()
          .start().addClass(this.myClass('TwoFactAuthIntro'))
          .add(this.TWO_FACTOR_EXPLANATION).end()
        .end()
        .start('form')
          .addClass('tfa-container')
          .start('label')
            .add(this.TWO_FACTOR_LABEL)
            .style({ 'font-family': 'Lato-Regular', 'font-size': 12 })
          .end()
          .start()
            .tag(this.TWO_FACTOR_TOKEN)
            .start().addClass('error-msg').show( this.incorrectCode$ )
              .start({
                class: 'foam.u2.tag.Image',
                data: 'images/inline-error-icon.svg',
                displayHeight: 16,
                displayWidth: 16
              })
                .style({
                  'justify-content': 'flex-start',
                  'margin': '0 8px 0 0'
                })
              .end()
              .start('span').add(this.TWO_FACTOR_ERROR).end()
            .end()
          .end()
          .start(this.VERIFY)
          .addClass(this.myClass('verify-button'))
          .end()
        .end()
      .end()
      .start().addClass(this.myClass('sme-subtitle'))
        .start('strong').add(this.TWO_FACTOR_NOTES_1).end()
        .start('span').addClass('app-link')
          .add(this.TWO_FACTOR_NOTES_2)
          .on('click', function() {
            console.log('got you');
          })
        .end()
      .end();

      split.leftPanel.add(left);
      split.rightPanel.add(right);

      this.addClass(this.myClass()).addClass('full-screen')
        .start().addClass('top-bar')
          .start().addClass('top-bar-inner')
            .start().addClass(this.myClass('button'))
              .start()
                .addClass('horizontal-flip')
                .addClass('inline-block')
                .add('➔')
              .end()
              .add(this.GO_BACK)
              .on('click', () => {
                window.location = 'https://www.ablii.com';
              })
            .end()
          .end()
        .end()
      .add(split);
    },

  ],

  actions: [
    {
      name: 'verify',
      code: function(X) {
        var self = this;
        console.log(this.twoFactorToken)
        if ( ! this.twoFactorToken ) {
          this.notify(this.TWO_FACTOR_NO_TOKEN, 'error');
          return;
        }

        this.twofactor.verifyToken(null, this.twoFactorToken)
        .then(function(result) {
          if ( result ) {
            self.loginSuccess = true;
          } else {
            self.incorrectCode = true;
            self.loginSuccess = false;
            self.notify(self.TWO_FACTOR_ERROR, 'error');
          }
        });
      }
    }
  ],
});
