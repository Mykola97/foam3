foam.CLASS({
  package: 'net.nanopay.settings.business',
  name: 'BusinessProfileView',
  extends: 'foam.u2.View',

  requires: [
    'net.nanopay.ui.ExpandContainer',
    'net.nanopay.settings.business.PrincipalOwnersDetailView'
  ],

  imports: [
    'stack',
    'user'
  ],

  documentation: 'View displaying business information',

  css: `
    ^{
      width: 100%;
      background-color: #edf0f5;
      margin: auto;
      padding-bottom: 60px;
    }
    ^ .businessSettingsContainer {
      width: 992px;
      padding-left: 20px;
      margin: auto;
    }
    ^ .Container {
      width: 992px;
      min-height: 80px;
      padding-top: 40px;
      padding-left: 20px;
      border-radius: 2px;
      background-color: white;
      box-sizing: border-box;
    }
    ^ .profileImg {
      width: 80px;
      height: 80px;
    }
    ^ .profileImgDiv {
      margin-bottom: 20px;
      margin-top: 20px;
      line-height: 80px;
      position: relative;
    }
    ^ .companyName {
      font-family: 'Roboto';
      font-size: 14px;
      font-weight: 300;
      letter-spacing: 0.2px;
      color: #093649;
      margin-left: 140px;
      display: inline-block;
      line-height: 16px;
      position: absolute;
      top: 40%;
    }
    ^ .labelDiv {
      margin-bottom: 30px;
      margin-right: 20px;
    }
    ^ .inlineDiv {
      display: inline-block;
      margin-right: 40px;
      vertical-align: top;
    }
    ^ .topInlineDiv {
      display: inline-block;
      vertical-align: top;
    }
    ^ .labelTitle {
      font-family: Roboto;
      font-size: 14px;
      font-weight: bold;
      letter-spacing: 0.2px;
      text-align: left;
      color: #093649;
      margin-bottom: 15px;
    }
    ^ .businessHourLabels {
      width: 30px;
      font-size: 14px;
      font-weight: bold;
      letter-spacing: 0.2px;
      text-align: left;
      color: #093649;
      margin-bottom: 15px;
      display: inline-block;
    }
    ^ .labelContent {
      font-family: Roboto;
      font-size: 14px;
      font-weight: 300;
      letter-spacing: 0.2px;
      color: #093649;
      display: flex;
      width: 185px;
      height: 20px;
    }
    ^ .foam-u2-ActionView-editProfile {
      text-decoration: underline;
      font-size: 12px;
      line-height: 16px;
      letter-spacing: 0.2px;
      color: #59a5d5;
      display: inline-block;
      margin-left: 40px;
      cursor: pointer;
      opacity: 1;
    }
    ^ .net-nanopay-ui-ActionView-editProfile {
      color: #59a5d5;
      background-color: white;
      text-decoration: underline;
      margin-left: 42px;
      height: 15px;
    }
    ^ .net-nanopay-ui-ActionView-editProfile:hover {
      cursor: pointer;
    }
    ^ .net-nanopay-ui-ActionView-editProfile:active {
      color: #2974a3;
    }
    ^ .dayOfWeekDiv {
      margin-top: 20px;
    }
    ^ .shopperImage{
      right: 0 !important;
    }
    ^ .net-nanopay-ui-ExpandContainer{
      width: 1000px;
      margin-top: 30px;
    }
  `,

  properties: [
    'businessSectorName',
    'businessTypeName',
    {
      class: 'Boolean',
      name: 'businessHoursEnabled',
      value: false
    }
  ],

  messages: [
    {
      name: 'MondayLabel', message: 'Mon.'
    },
    {
      name: 'TuesdayLabel', message: 'Tue.'
    },
    {
      name: 'WednesdayLabel', message: 'Wed.'
    },
    {
      name: 'ThursdayLabel', message: 'Thu.'
    },
    {
      name: 'FridayLabel', message: 'Fri.'
    },
    {
      name: 'ToLabel', message: 'To'
    }
  ],

  methods: [
    function initE() {
      this.SUPER();
      var self = this;
      var ownerProfile = this.ExpandContainer.create({ title: 'Principle Owner(s) Profile', link: 'Edit Profile', linkView: 'net.nanopay.settings.business.EditPrincipalOwnersView' });
      var businessProfile = this.ExpandContainer.create({ title: 'Business Profile', link: 'Edit Profile', linkView: 'net.nanopay.settings.business.EditBusinessProfileView' });

      this.user.businessTypeId$find.then(function(type) {
        self.businessTypeName = type.name;
      });
      this
      .addClass(this.myClass())
      .start(businessProfile)
      .start().addClass('businessSettingsContainer')
          .start().addClass('profileImgDiv')
            .tag({
              class: 'foam.nanos.auth.ProfilePictureView',
              placeholderImage: 'images/business-placeholder.png',
              data$: this.user.businessProfilePicture$,
              uploadHidden: true
            })
            .start().add(this.user.businessName).addClass('companyName').end()
          .end()
          .start()
            .start().addClass('inlineDiv')
              .start().addClass('labelDiv')
                .start().add('Business Phone').addClass('labelTitle').end()
                .start().add(this.user.businessPhone.number).addClass('labelContent').end()
              .end()
              .start().addClass('labelDiv')
                .start().add('Business Registration Number').addClass('labelTitle').end()
                .start().add(this.user.businessRegistrationNumber).addClass('labelContent').end()
              .end()
            .end()
            .start().addClass('inlineDiv')
              .start().addClass('labelDiv')
                .start().add('Website').addClass('labelTitle').end()
                .start().add(this.user.website).addClass('labelContent').end()
              .end()
              .start().addClass('labelDiv')
                .start().add('Registration Authority').addClass('labelTitle').end()
                .start().add(this.user.businessRegistrationAuthority).addClass('labelContent').end()
              .end()
            .end()
            .start().addClass('inlineDiv')
              .start().addClass('labelDiv')
                .start().add('Business Type').addClass('labelTitle').end()
                .start().add(this.businessTypeName$).addClass('labelContent').end()
              .end()
              .start().addClass('labelDiv')
                .start().add('Registration Date').addClass('labelTitle').end()
                .start().add(this.user.businessRegistrationDate ? this.user.businessRegistrationDate.toISOString().substring(0,10) : '').addClass('labelContent').end()
              .end()
            .end()
            .start().addClass('topInlineDiv')
              .start().addClass('labelDiv')
                .start().add('Business Address').addClass('labelTitle').end()
                .startContext()
                  .start().hide(this.user.businessAddress.structured$)
                    .start().add(this.user.businessAddress.address1).addClass('labelContent').end()
                    .start().add(this.user.businessAddress.address2).addClass('labelContent').end()
                  .end()
                  .start().show(this.user.businessAddress.structured$)
                    .start().add(this.user.businessAddress.streetNumber +" "+this.user.businessAddress.streetName).addClass('labelContent').end()
                    .start().add(this.user.businessAddress.suite).addClass('labelContent').end()
                  .end()
                .endContext()
                .start().add(this.user.businessAddress.city + ", "+this.user.businessAddress.regionId).addClass('labelContent').end()
                .start().add(this.user.businessAddress.countryId).addClass('labelContent').end()
                .start().add(this.user.businessAddress.postalCode).addClass('labelContent').end()
              .end()
            .end()
          .end()
        .end()
        this
        .addClass(this.myClass())
        .start(ownerProfile)
          .add(this.PrincipalOwnersDetailView.create({ user: this.user}))
        .end()
        .callIf( this.user.type == 'Merchant', function() {
          this.tag({ class: 'net.nanopay.settings.business.BusinessHoursView' });
        })
      .end()
    }
  ],

  actions: [
    {
      name: 'editProfile',
      label: 'Edit Profile',
      code: function (X) {
        X.stack.push({ class: 'net.nanopay.settings.business.EditBusinessView', showCancel: true });
      }
    }
  ]
});
