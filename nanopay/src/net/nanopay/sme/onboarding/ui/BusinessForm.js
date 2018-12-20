foam.CLASS({
  package: 'net.nanopay.sme.onboarding.ui',
  name: 'BusinessForm',
  extends: 'net.nanopay.ui.wizard.WizardSubView',
  documentation: 'Second step in the business registration wizard. Responsible for capturing business information.',

  implements: [
    'foam.mlang.Expressions'
  ],

  requires: [
    'foam.nanos.auth.Address',
    'foam.nanos.auth.Country',
    'foam.nanos.auth.Phone',
    'foam.nanos.auth.Region',
    'foam.nanos.auth.User',
    'foam.u2.dialog.NotificationMessage',
    'net.nanopay.model.BusinessSector'
  ],

  imports: [
    'user',
    'businessDAO',
    'businessSectorDAO'
  ],

  css: `
    ^ {
      width: 488px;
    }
    ^ .foam-u2-tag-Select {
      width: 100%;
      height: 35px;
      margin-bottom: 10px;
    }
    ^ .label {
      margin-left: 0px;
      margin-top: 10px;
    }
    ^ .foam-u2-TextField {
      width: 100%;
      height: 35px;
      margin-bottom: 10px;
      padding-left: 5px;
    }
    ^ .foam-u2-view-RadioView {
      display: inline-block;
      float: right;
      margin-top: 15px;
    }
    ^ .foam.u2.CheckBox {
      display: inline-block;
      margin-right: 10px;
    }
    ^ .inline {
      margin: 15px 0px;
    }
    ^ .medium-header {
      margin-top: 10px;
      margin-bottom: 20px;
      font-size: 21px;
    }
    ^ .radio-box {
      position: relative;
      display: inline-block;
      float: right;
      top: -15px;
    }
    ^ .third-party-radio-box {
      position: relative;
      display: inline-block;
      float: right;
      top: -85px;
    }
    ^ .net-nanopay-ui-ActionView-uploadButton {
      margin-top: 25px;
    }
    ^ .choiceDescription {
      margin-top: 10px;
    }
    ^ .label-width {
      width: 200px;
      margin-left: 0px;
      margin-bottom: 20px;
    }
    ^ .residence-business-label {
      width: 200px;
    }
    ^ .po-boxes-label {
      font-weight: 600;
      margin-bottom: 15px;
    }
    .net-nanopay-ui-modal-UploadModal .net-nanopay-ui-modal-ModalHeader {
      display: none;
    }
    .net-nanopay-ui-modal-UploadModal .buttonBox {
      height: auto !important;
      padding: 20px 20px;
      box-sizing: border-box;
      text-align: right;
      background-color: #fafafa;
    }
    .net-nanopay-ui-modal-UploadModal .buttonBox .net-nanopay-ui-ActionView-cancelButton,
    .net-nanopay-ui-modal-UploadModal .buttonBox .net-nanopay-ui-ActionView-submitButton {
      font-family: Lato;
      float: none;
      margin: 0;
    }
    .net-nanopay-ui-modal-UploadModal .buttonBox .net-nanopay-ui-ActionView-cancelButton {
      width: auto;
      background-color: transparent;
      border: none;
      box-shadow: none;
      color: #525455;
    }
    .net-nanopay-ui-modal-UploadModal .buttonBox .net-nanopay-ui-ActionView-cancelButton:hover {
      background-color: transparent;
    }
    .net-nanopay-ui-modal-UploadModal .buttonBox .net-nanopay-ui-ActionView-submitButton {
      margin-left: 24px;
    }
 `,

  properties: [
    {
      class: 'Boolean',
      name: 'operating',
      documentation: 'Toggles additional input for operating business name.',
      factory: function() {
        if ( this.viewData.user.operatingBusinessName.trim() != '' ) return true;
      }
    },
    {
      name: 'holdingCompany',
      documentation: 'Radio button determining business is a holding company.',
      view: {
        class: 'foam.u2.view.RadioView',
        choices: [
          'No',
          'Yes'
        ]
      },
      factory: function() {
        return this.viewData.user.holdingCompany ? 'Yes' : 'No';
      },
      postSet: function(o, n) {
        this.viewData.user.holdingCompany = n == 'Yes';
      }
    },
    {
      name: 'thirdPartyCompany',
      documentation: 'Radio button determining if business is acting on behalf of a 3rd party.',
      view: {
        class: 'foam.u2.view.RadioView',
        choices: [
          'No',
          'Yes'
        ]
      },
      factory: function() {
        return this.viewData.user.thirdParty ? 'Yes' : 'No';
      },
      postSet: function(o, n) {
        this.viewData.user.thirdParty = n == 'Yes';
      }
    },
    {
      name: 'primaryResidence',
      documentation: 'Associates business address to acting users address.',
      view: {
        class: 'foam.u2.view.RadioView',
        choices: [
          'No',
          'Yes'
        ]
      },
      factory: function() {
        return this.viewData.user.primaryResidence ? 'Yes' : 'No';
      },
      postSet: function(o, n) {
        this.viewData.user.primaryResidence = n == 'Yes';
        if ( n ) {
          this.viewData.user.address = this.viewData.user.businessAddress;
        }
      }
    },
    {
      name: 'businessTypeField',
      documentation: 'Dropdown detailing and providing choice selection of business type.',
      view: function(_, X) {
        return foam.u2.view.ChoiceView.create({
          dao: X.businessTypeDAO,
          placeholder: '- Please select - ',
          objToChoice: function(a) {
            return [a.id, a.name];
          }
        });
      },
      factory: function() {
        if ( this.viewData.user.businessTypeId ) return this.viewData.user.businessTypeId;
      },
      postSet: function(o, n) {
        this.viewData.user.businessTypeId = n;
        if ( n == 0 ) {
          this.choiceDescription = "Seller's Permit, Business License, or an IRS Tax Registration Letter";
        } else if ( n == 1 ) {
          this.choiceDescription = 'Partnership Agreement or Certified Copy of the Certificate of Limited Partnership';
        } else if ( n == 3 ) {
          this.choiceDescription = 'Incorporation Records, Articles of Incorporation, Corporate Charter, Certificate of Incorporation, or Articles of Association';
        } else if ( n == 5 ) {
          this.choiceDescription = 'Articles of Incorporation';
        }
      }
    },
    {
      name: 'industryId',
      factory: function() {
        if ( this.viewData.user.businessSectorId ) return this.viewData.user.businessSectorId;
      }
    },
    {
      name: 'industryTopLevel',
      documentation: 'Dropdown detailing and providing choice selection of top level industry/business sectors.',
      view: function(_, X) {
        return foam.u2.view.ChoiceView.create({
          dao: X.businessSectorDAO.where(X.data.EQ(X.data.BusinessSector.PARENT, 0)),
          placeholder: '- Please select - ',
          objToChoice: function(a) {
            return [a.id, a.name];
          }
        });
      },
      factory: function() {
        if ( this.viewData.user.businessSectorId ) return this.viewData.user.businessSectorId;
      },
      postSet: function(o, n) {
        this.industryId = n;
        this.viewData.user.businessSectorId = n;
      }
    },
    {
      class: 'String',
      name: 'registeredBusinessNameField',
      documentation: 'Registered business name field.',
      factory: function() {
        if ( this.viewData.user.organization ) return this.viewData.user.organization;
      },
      postSet: function(o, n) {
        this.viewData.user.organization = n;
      }
    },
    {
      class: 'String',
      name: 'operatingBusinessNameField',
      documentation: 'Operating business name field.',
      factory: function() {
        if ( this.viewData.user.operatingBusinessName ) return this.viewData.user.operatingBusinessName;
      },
      postSet: function(o, n) {
        this.viewData.user.operatingBusinessName = n;
      }
    },
    {
      class: 'String',
      name: 'taxNumberField',
      documentation: 'Tax identification number field.',
      factory: function() {
        if ( this.viewData.user.taxIdentificationNumber ) return this.viewData.user.taxIdentificationNumber;
      },
      postSet: function(o, n) {
        this.viewData.user.taxIdentificationNumber = n;
      }
    },
    {
      class: 'String',
      name: 'targetCustomersField',
      documentation: 'Who the company markets its products and services to',
      factory: function() {
        if ( this.viewData.user.targetCustomers ) return this.viewData.user.targetCustomers;
      },
      postSet: function(o, n) {
        this.viewData.user.targetCustomers = n;
      }
    },
    {
      class: 'String',
      name: 'sourceOfFundsField',
      documentation: 'Where the business receives its money from',
      factory: function() {
        if ( this.viewData.user.sourceOfFunds ) return this.viewData.user.sourceOfFunds;
      },
      postSet: function(o, n) {
        this.viewData.user.sourceOfFunds = n;
      }
    },
    {
      class: 'FObjectProperty',
      name: 'addressField',
      factory: function() {
        return this.viewData.user.businessAddress ?
            this.viewData.user.businessAddress : this.Address.create({});
      },
      view: { class: 'net.nanopay.sme.ui.AddressView' },
      postSet: function(o, n) {
        this.viewData.user.businessAddress = n;
      }
    },
    {
      class: 'String',
      name: 'phoneNumberField',
      documentation: 'Business phone number field.',
      factory: function() {
        if ( this.viewData.user.businessPhone ) return this.viewData.user.businessPhone.number;
      },
      postSet: function(o, n) {
        this.viewData.user.businessPhone.number = n;
      }
    },
    {
      class: 'String',
      name: 'websiteField',
      documentation: 'Business website field.',
      factory: function() {
        if ( this.viewData.user.website ) return this.viewData.user.website;
      },
      postSet: function(o, n) {
        this.viewData.user.website = n;
      }
    },
    {
      class: 'foam.nanos.fs.FileArray',
      name: 'additionalDocuments',
      documentation: 'Additional documents for compliance verification.',
      view: function(_, X) {
        return {
          class: 'net.nanopay.onboarding.b2b.ui.AdditionalDocumentsUploadView',
          documents$: X.viewData.user.additionalDocuments$,
        };
      },
      factory: function() {
        if ( this.viewData.user.additionalDocuments ) {
            return this.viewData.user.additionalDocuments;
        } else {
          return [];
        }
      },
      postSet: function(o, n) {
        this.viewData.user.additionalDocuments = n;
      }
    },
    {
      class: 'String',
      name: 'choiceDescription'
    }
  ],

  messages: [
    { name: 'TITLE', message: 'Tell us about your business' },
    { name: 'BUSINESS_TYPE_LABEL', message: 'Type of Business' },
    { name: 'INDUSTRY_LABEL', message: 'Industry' },
    { name: 'BUSINESS_NAME_LABEL', message: 'Registered Business Name' },
    { name: 'OPERATING_QUESTION', message: 'My business operates under a different name' },
    { name: 'OPERATING_BUSINESS_NAME_LABEL', message: 'Operating Business Name' },
    { name: 'PRODUCTS_AND_SERVICES_LABEL', message: 'Who do you market your products and services to?' },
    { name: 'SOURCE_OF_FUNDS_LABEL', message: 'Source of Funds (what is your primary source of revenue?)' },
    { name: 'TAX_ID_LABEL', message: 'Tax Identification Number (US Only)' },
    { name: 'HOLDING_QUESTION', message: 'Is this a holding company?' },
    { name: 'THIRD_PARTY_QUESTION', message: 'Are you taking instructions from and/or acting on behalf of a 3rd party?' },
    { name: 'SECOND_TITLE', message: 'Business contact information' },
    { name: 'PRIMARY_RESIDENCE_LABEL', message: 'Do you operate this business from your residence?' },
    { name: 'PHONE_NUMBER_LABEL', message: 'Business Phone Number' },
    { name: 'WEBSITE_LABEL', message: 'Website (Optional)' },
    { name: 'THIRD_TITLE', message: 'Add supporting files' },
    { name: 'UPLOAD_DESCRIPTION', message: 'Please upload one of the following:' },
    { name: 'NO_PO_BOXES', message: 'No PO Boxes Allowed' }
  ],

  methods: [
    function initE() {
      var self = this;
      this.hasCloseOption = false;
      this.hasSaveOption = true;
      this.saveLabel = 'Save and Close';
      this.nextLabel = 'Next';

      var choices = this.industryId$.map(function(industryId) {
        return self.businessSectorDAO.where(
          self.EQ(self.BusinessSector.PARENT, industryId)
        );
      });

      this.addClass(this.myClass())
        .start()
          .start().addClass('medium-header').add(this.SECOND_TITLE).end()
          .start().addClass('po-boxes-label').add(this.NO_PO_BOXES).end()
          .start(this.ADDRESS_FIELD).end()
          .start().addClass('label-input').addClass('half-container').addClass('left-of-container')
            .start().addClass('label').add(this.PHONE_NUMBER_LABEL).end()
            .start(this.PHONE_NUMBER_FIELD).addClass('input-field').end()
          .end()
          .start().addClass('label-input').addClass('half-container')
            .start().addClass('label').add(this.WEBSITE_LABEL).end()
            .start(this.WEBSITE_FIELD).addClass('input-field').end()
          .end()
          .start().addClass('inline').addClass('residence-business-label').add(this.PRIMARY_RESIDENCE_LABEL).end()
          .start().add(this.PRIMARY_RESIDENCE).addClass('radio-box').end()
          .start().addClass('medium-header').add(this.TITLE).end()
          .start().addClass('label-input')
            .start().addClass('label').add(this.BUSINESS_TYPE_LABEL).end()
            .start(this.BUSINESS_TYPE_FIELD).end()
          .end()
          .start().addClass('label-input').addClass('half-container').addClass('left-of-container')
            .start().addClass('label').add(this.INDUSTRY_LABEL).end()
            .start(this.INDUSTRY_TOP_LEVEL).end()
          .end()
          .start().addClass('label-input').addClass('half-container')
            .start({
              class: 'foam.u2.view.ChoiceView',
                objToChoice: function(a) {
                  return [a.id, a.name];
                },
                dao$: choices
            }).end()
          .end()

          .start().addClass('label-input')
            .start().addClass('label').add(this.BUSINESS_NAME_LABEL).end()
            .start(this.REGISTERED_BUSINESS_NAME_FIELD).addClass('input-field').end()
          .end()
          .tag({ class: 'foam.u2.CheckBox', data$: this.operating$ })
          .start().addClass('inline').add(this.OPERATING_QUESTION).end()
          .start().show(this.operating$)
            .start().addClass('label-input')
              .start().addClass('label').add(this.OPERATING_BUSINESS_NAME_LABEL).end()
              .start(this.OPERATING_BUSINESS_NAME_FIELD).end()
            .end()
          .end()
          .start().addClass('label-input')
            .start().addClass('label').add(this.PRODUCTS_AND_SERVICES_LABEL).end()
            .start(this.TARGET_CUSTOMERS_FIELD).addClass('input-field').end()
          .end()
          .start().addClass('label-input')
            .start().addClass('label').add(this.SOURCE_OF_FUNDS_LABEL).end()
            .start(this.SOURCE_OF_FUNDS_FIELD).addClass('input-field').end()
          .end()
          .start().addClass('label-input')
            .start().addClass('label').add(this.TAX_ID_LABEL).end()
            .start(this.TAX_NUMBER_FIELD).addClass('input-field').end()
          .end()
          .start().addClass('label-input')
            .start().addClass('inline').add(this.HOLDING_QUESTION).end()
            .start(this.HOLDING_COMPANY).addClass('radio-box').end()
          .end()
          .start().addClass('label-input')
            .start().addClass('inline').addClass('label-width').add(this.THIRD_PARTY_QUESTION).end()
            .start(this.THIRD_PARTY_COMPANY).addClass('third-party-radio-box').end()
          .end()
          .start()
          .start().addClass('medium-header').add(this.THIRD_TITLE).end()
          .start().add(this.UPLOAD_DESCRIPTION).end()
          .start().add(this.choiceDescription$).addClass('choiceDescription').end()
          .start(this.ADDITIONAL_DOCUMENTS).end()
        .end();
    },

    async function saveFiles(newDocs) {
      if ( newDocs && newDocs.length > 0 ) {
        this.user.additionalDocuments = this.user
          .additionalDocuments.concat(newDocs);
        var result = await this.businessDAO.put(this.user);
        this.viewData.user.additionalDocuments = result.additionalDocuments;
      }
    }
  ]
});
