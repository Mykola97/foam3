/**
 * NANOPAY CONFIDENTIAL
 *
 * [2020] nanopay Corporation
 * All Rights Reserved.
 *
 * NOTICE:  All information contained herein is, and remains
 * the property of nanopay Corporation.
 * The intellectual and technical concepts contained
 * herein are proprietary to nanopay Corporation
 * and may be covered by Canadian and Foreign Patents, patents
 * in process, and are protected by trade secret or copyright law.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from nanopay Corporation.
 */

foam.CLASS({
  package: 'net.nanopay.sme.ui',
  name: 'SendRequestMoney',
  extends: 'net.nanopay.ui.wizard.WizardView',

  documentation: `This class extends the general WizardView & is used for
                  both sending & requesting money. When a user wants to pay from
                  the invoice overview view, the app will redirect to this view.`,

  implements: [
    'foam.mlang.Expressions',
  ],

  imports: [
    'subject',
    'appConfig',
    'auth',
    'checkAndNotifyAbilityToPay',
    'checkAndNotifyAbilityToReceive',
    'contactDAO',
    'ctrl',
    'fxService',
    'menuDAO',
    'notificationDAO',
    'notify',
    'pushMenu',
    'stack',
    'transactionDAO',
    'userDAO',
    'transactionPlannerDAO',
    'quickbooksService',
    'xeroService',
  ],

  exports: [
    'existingButton',
    'invoice',
    'isApproving',
    'isDetailView',
    'isForm',
    'isList',
    'isLoading',
    'isPayable',
    'loadingSpin',
    'newButton',
    'predicate',
    'requestTxn',
    'txnQuote',
    'updateInvoiceDetails',
    'forceUpdate'
  ],

  requires: [
    'foam.log.LogLevel',
    'foam.nanos.app.Mode',
    'net.nanopay.admin.model.AccountStatus',
    'net.nanopay.admin.model.ComplianceStatus',
    'net.nanopay.auth.PublicUserInfo',
    'net.nanopay.bank.CanReceiveCurrency',
    'net.nanopay.contacts.ContactStatus',
    'net.nanopay.fx.FXLineItem',
    'net.nanopay.invoice.model.Invoice',
    'net.nanopay.invoice.model.InvoiceStatus',
    'net.nanopay.tx.AbliiTransaction',
    'net.nanopay.tx.model.Transaction',
    'net.nanopay.tx.FxSummaryTransactionLineItem',
    'net.nanopay.tx.TransactionQuote',
    'net.nanopay.ui.LoadingSpinner',
    'foam.u2.dialog.Popup',
  ],

  axioms: [
    { class: 'net.nanopay.ui.wizard.WizardCssAxiom' }
  ],

  css: `
    ^ .title {
      font-size: 26px !important;
      font-weight: 900 !important;
      margin-top: 20px !important;
      margin-bottom: 15px !important;
      margin-left: 50px !important;
    }
    ^ .positionColumn {
      padding-left: 50px !important;
    }
    ^ .subTitle {
      display: none !important;
    }
    ^ .wizardBody {
      position: relative;
      width: 992px;
      margin: auto;
    }
    ^ .navigationContainer {
      width: 100%;
    }
    ^ .exitContainer {
      display: flex;
    }
    ^ .net-nanopay-sme-ui-InfoMessageContainer {
      font-size: 14px;
      line-height: 1.5;
      margin-top: 35px;
    }
  `,

  constants: {
    DETAILS_VIEW_ID: 'send-request-money-details',
    PAYMENT_VIEW_ID: 'send-request-money-payment',
    REVIEW_VIEW_ID: 'send-request-money-review'
  },

  properties: [
    {
      class: 'Boolean',
      name: 'isPayable',
      documentation: 'Determines displaying certain elements related to payables or receivables.'
    },
    {
      class: 'Boolean',
      name: 'isApproving',
      documentation: 'When true, wizard will be used for approving payables made by employees with lower authorization levels.',
      postSet: function(_, newV) {
        this.isPayable = true;
      }
    },
    {
      // TODO: change this property to an eunm
      class: 'String',
      name: 'type',
      documentation: 'Associated to type of wizard. Payable or receivables. Used as GUI representation.'
    },
    {
      class: 'Boolean',
      name: 'newButton',
      expression: function(isForm) {
        return isForm;
      },
      documentation: 'This property is for the new button border highlight.'
    },
    {
      class: 'Boolean',
      name: 'existingButton',
      expression: function(isForm) {
        return ! isForm;
      },
      documentation: 'This property is for the existing button border highlight.'
    },
    {
      class: 'Boolean',
      name: 'isForm',
      value: true,
      documentation: `Form stands for the new invoice form
      or the draft invoice form.`
    },
    {
      class: 'Boolean',
      name: 'isDetailView',
      value: false,
      documentation: 'DetailView stands for the invoice detail view.'
    },
    {
      class: 'Boolean',
      name: 'isList',
      value: false,
      documentation: 'List stands for the invoice list'
    },
    {
      class: 'foam.dao.DAOProperty',
      name: 'invoiceDAO',
      expression: function(isPayable) {
        if ( isPayable ) {
          return this.subject.user.expenses;
        }
        return this.subject.user.sales;
      }
    },
    {
      name: 'predicate',
      documentation: `
        Set this if you want to filter the list of existing invoices by some
        predicate when pushing this view on the stack.
      `
    },
    {
      name: 'loadingSpin',
      factory: function() {
        return this.LoadingSpinner.create();
      }
    },
    {
      name: 'isLoading',
      value: false,
      postSet: function(_, n) {
        this.loadingSpin.text = this.PROCESSING_NOTICE;
        if ( n ) {
          this.loadingSpin.show();
          this.loadingSpin.showText = true;
          return;
        }
        this.loadingSpin.hide();
        this.loadingSpin.showText = false;
      }
    },
    {
      name: 'hasSaveOption',
      expression: function(isForm, position) {
        return isForm &&
          this.invoice.status !== this.InvoiceStatus.DRAFT &&
          position === 0;
      },
      documentation: `An expression is required for the 1st step of the
        send/request payment flow to show the 'Save as draft' button.`
    },
    {
      name: 'hasNextOption',
      expression: function(isList) {
        return ! isList;
      },
      documentation: `An expression is required for the 1st step of the
        send/request payment flow to show the 'Save as draft' button.`
    },
    {
      name: 'hasExitOption',
      value: true
    },
    {
      name: 'saveLabel',
      value: 'Save as draft',
      documentation: 'This property is for the customized label of save button'
    },
    {
      class: 'FObjectProperty',
      name: 'invoice',
      factory: function() {
        return this.Invoice.create({});
      }
    },
    {
      class: 'Boolean',
      name: 'permitToPay'
    },
    {
      class: 'Boolean',
      name: 'forceUpdate',
      value: false
    },
    'updateInvoiceDetails',
    {
      class: 'FObjectProperty',
      name: 'requestTxn',
      factory: function() {
        return this.AbliiTransaction.create();
      }
    },
    {
      class: 'Boolean',
      name: 'reQuote',
      value: false
    },
    {
      class: 'FObjectProperty',
      name: 'txnQuote',
    }
  ],

  messages: [
    { name: 'SAVE_DRAFT_ERROR', message: 'An error occurred while saving the draft ' },
    { name: 'INVOICE_ERROR', message: 'Invoice Error: An error occurred while saving the ' },
    { name: 'TRANSACTION_ERROR', message: 'Transaction Error: An error occurred while saving the ' },
    { name: 'BANK_ACCOUNT_REQUIRED', message: 'Please select a bank account that has been verified.' },
    { name: 'QUOTE_ERROR', message: 'An unexpected error occurred while fetching the exchange rate.' },
    { name: 'CONTACT_ERROR', message: 'Need to choose a contact.' },
    { name: 'AMOUNT_ERROR', message: 'Invalid Amount.' },
    { name: 'DUE_DATE_ERROR', message: 'Invalid Due Date.' },
    { name: 'ISSUE_DATE_ERROR', message: 'Invalid Issue Date.' },
    { name: 'DRAFT_SUCCESS', message: 'Draft saved successfully.' },
    { name: 'COMPLIANCE_ERROR', message: 'Business must pass compliance to make a payment.' },
    { name: 'CONTACT_NOT_FOUND', message: 'Contact not found.' },
    { name: 'INVOICE_AMOUNT_ERROR', message: 'This amount exceeds your sending limit.' },
    { name: 'WAITING_FOR_RATE', message: 'Waiting for FX quote.' },
    { name: 'RATE_REFRESH', message: 'The exchange rate expired, please ' },
    { name: 'RATE_REFRESH_SUBMIT', message: ' submit again.' },
    { name: 'RATE_REFRESH_APPROVE', message: ' approve again.' },
    { name: 'PROCESSING_NOTICE', message: 'Processing your transaction, this can take up to 30 seconds.' },
    {
      name: 'TWO_FACTOR_REQUIRED',
      message: `You require two-factor authentication to continue this payment.
          Please go to the Personal Settings page to set up two-factor authentication.`
    },
    { name: 'INR_RATE_LIMIT', message: 'This transaction exceeds your total daily limit for payments to India. For help, contact support at support@ablii.com' }
  ],

  methods: [
    function init() {
      this.isLoading = false;
      this.loadingSpin.onDetach(() => {
        this.loadingSpin = this.LoadingSpinner.create({ isHidden: true });
      });
      if ( this.isApproving ) {
        this.title = 'Approve payment';
      } else {
        this.title = this.isPayable === true ? 'Send payment' : 'Request payment';
      }

      this.type = this.isPayable ? 'payable' : 'receivable';

      this.views = [
        {
          parent: 'sendRequestMoney',
          id: this.DETAILS_VIEW_ID,
          label: 'Details',
          subtitle: 'Select payable',
          view: {
            class: 'net.nanopay.sme.ui.SendRequestMoneyDetails',
            type: this.type
          }
        }
      ];

      if ( ! this.isApproving ) {
        this.views.push({
          parent: 'sendRequestMoney',
          id: this.PAYMENT_VIEW_ID,
          label: 'Payment details',
          subtitle: 'Select payment method',
          view: {
            class: 'net.nanopay.sme.ui.SendRequestMoneyPayment',
            type: this.type
          }
        });
      }

      this.views.push({
        parent: 'sendRequestMoney',
        id: this.REVIEW_VIEW_ID,
        label: 'Review',
        subtitle: 'Review payment',
        view: {
          class: 'net.nanopay.sme.ui.SendRequestMoneyReview'
        }
      });

      this.exitLabel = 'Cancel';
      this.hasExitOption = true;

      this.auth.check(this, 'invoice.pay').then((result) => {
        this.permitToPay = result;
      });

      this.SUPER();
    },

    function initE() {
      var checkAndNotifyAbility;

      var checkAndNotifyAbility = this.isPayable ?
        this.checkAndNotifyAbilityToPay :
        this.checkAndNotifyAbilityToReceive;

      checkAndNotifyAbility().then((result) => {
        if ( ! result ) {
          this.pushMenu('sme.main.dashboard');
          return;
        }
      });

      this.SUPER();
      this.addClass('full-screen');
    },

    function invoiceDetailsValidation(invoice) {
      if ( invoice.amount > this.Invoice.ABLII_MAX_AMOUNT ) {
        this.notify(this.INVOICE_AMOUNT_ERROR, '', this.LogLevel.ERROR, true);
        return false;
      }
      if ( ! invoice.contactId ) {
        this.notify(this.CONTACT_ERROR, '', this.LogLevel.ERROR, true);
        return false;
      } else if ( ! invoice.amount || invoice.amount < 0 ) {
        this.notify(this.AMOUNT_ERROR, '', this.LogLevel.ERROR, true);
        return false;
      } else if ( ! (invoice.dueDate instanceof Date && ! isNaN(invoice.dueDate.getTime())) ) {
        this.notify(this.DUE_DATE_ERROR, '', this.LogLevel.ERROR, true);
        return false;
      } else if ( ! (invoice.issueDate instanceof Date && ! isNaN(invoice.issueDate.getTime())) ) {
        this.notify(this.ISSUE_DATE_ERROR, '', this.LogLevel.ERROR, true);
        return false;
      } else if ( invoice.account == 0 && invoice.destinationAccount == 0  ) {
        this.notify(this.BANK_ACCOUNT_REQUIRED, '', this.LogLevel.ERROR, true);
        return false;
      }
      return true;
    },

    async function paymentValidation() {
      if ( ! this.viewData.bankAccount || ! foam.util.equals(this.viewData.bankAccount.status, net.nanopay.bank.BankAccountStatus.VERIFIED) ) {
        this.notify(this.BANK_ACCOUNT_REQUIRED, '', this.LogLevel.ERROR, true);
        return false;
      } else if ( ! this.viewData.quote && this.isPayable ) {
        this.notify(this.QUOTE_ERROR, '', this.LogLevel.ERROR, true);
        return false;
      }

      // Validate transaction line items
      if ( this.type === 'payable' ) {
        try {
          for ( i =0; i < this.viewData.quote.lineItems.length; i++ ) {
            if ( this.viewData.quote.lineItems[i].requiresUserInput ) {
              this.viewData.quote.lineItems[i].validate();
            }
          }
        } catch (e) {
          this.notify(e, '', this.LogLevel.ERROR, true);
          return false;
        }

        for ( i=0; i < this.viewData.quote.lineItems.length; i++ ) {
          if ( this.viewData.quote.lineItems[i].requiresUserInput ) {
            this.requestTxn.lineItems.push(this.viewData.quote.lineItems[i]);
            if ( ! this.requote && this.viewData.quote.lineItems[i].quoteOnChange ) {
              this.reQuote = true;
            }
          }
        }

        if ( this.reQuote ) {
          this.isLoading = true;
          this.updateInvoiceDetails = await this.getQuote();
          this.forceUpdate = true;
          this.isLoading = false;
          this.reQuote = false;
        }
      }

      return true;
    },

    function getExpired( time, transaction) {

      let quoteExpiry = null;
      for ( i=0; i < this.viewData.quote.lineItems.length; i++ ) {
        if ( ( this.FXLineItem.isInstance(this.viewData.quote.lineItems[i]) || this.FxSummaryTransactionLineItem.isInstance(this.viewData.quote.lineItems[i]) ) && this.viewData.quote.lineItems[i].expiry ) {
          if ( quoteExpiry == null ) {
            quoteExpiry = this.viewData.quote.lineItems[i].expiry;
            quoteExpiry = Date.UTC(quoteExpiry.getFullYear(), quoteExpiry.getMonth(), quoteExpiry.getDate(), quoteExpiry.getHours(), quoteExpiry.getMinutes(), quoteExpiry.getSeconds());
          } else {
            let temp = this.viewData.quote.lineItems[i].expiry;
            temp = Date.UTC(temp.getFullYear(), temp.getMonth(), temp.getDate(), temp.getHours(), temp.getMinutes(), temp.getSeconds());
            quoteExpiry = quoteExpiry < temp ? quoteExpiry : temp;
          }
        }
      }

      if ( quoteExpiry == null ) return false;

      let utc1 =  Date.UTC(time.getFullYear(), time.getMonth(), time.getDate(), time.getHours(), time.getMinutes(), time.getSeconds());
      return Math.floor(( quoteExpiry-utc1 )) <= 0;
    },

    async function getQuote() {
      var quote = await this.transactionPlannerDAO.put(
        this.TransactionQuote.create({
          requestTransaction: this.requestTxn
        })
      );
      this.txnQuote = quote;
      return quote.plan;
    },

    async function submit() {
      this.isLoading = true;
      var checkAndNotifyAbility;

      var checkAndNotifyAbility = this.isPayable ?
        this.checkAndNotifyAbilityToPay :
        this.checkAndNotifyAbilityToReceive;

      var result = await checkAndNotifyAbility();
      if ( ! result ) {
        return;
      }

      this.invoice.processPaymentOnCreate = false;

      // Confirm Invoice information:
      if ( this.invoice.draft ) {
        this.invoice.draft = false;
        this.invoice = await this.invoiceDAO.put(this.invoice);
      }

      // invoice payer/payee should be populated from InvoiceSetDestDAO
      try {
        // Calling put here makes display 'invoice was created' message in invoice history.
        // We want to show this message only when we are creating a new invoice.

        // a flag for determining if we are creating a new invoice
        const isNewInvoice = this.invoice.id === 0;
        if ( isNewInvoice ) {
          this.invoice = await this.invoiceDAO.put(this.invoice);
        }
      } catch (error) {
        console.error('@SendRequestMoney (Invoice put): ' + error.message);
        this.notify(this.INVOICE_ERROR + this.type, '', this.LogLevel.ERROR, true);
        this.isLoading = false;
        return;
      }

      // Uses the transaction retrieved from transactionQuoteDAO retrieved from invoiceRateView.
      if ( this.isPayable ) {
        var transaction = this.viewData.quote ? this.viewData.quote : null;
        transaction.invoiceId = this.invoice.id;
        // confirm fxquote is still valid
        if ( transaction != null && this.getExpired(new Date(), transaction) ) {
          transaction = await this.getQuote();
          transaction.invoiceId = this.invoice.id;
          this.notify(this.RATE_REFRESH + ( this.isApproving ? this.RATE_REFRESH_APPROVE : this.RATE_REFRESH_SUBMIT), '', this.LogLevel.WARN, true);
          this.isLoading = false;
          this.updateInvoiceDetails = transaction;
          this.forceUpdate = true;
          return;
        }

        if ( this.viewData.isDomestic ) {
          if ( ! transaction ) this.notify(this.QUOTE_ERROR, '', this.LogLevel.ERROR, true);
          try {
            let tem = await this.transactionDAO.put(transaction);
          } catch (error) {
            console.error('@SendRequestMoney (Transaction put): ' + error.message);
            if ( error.message && error.message.includes('exceed') ) {
              this.notify(error.message, '', this.LogLevel.ERROR, true);
            } else {
              this.notify(this.TRANSACTION_ERROR + this.type, '', this.LogLevel.ERROR, true);
            }
            this.isLoading = false;
            return;
          }
        } else {
          try {
            //transaction.isQuoted = true; TODO: Investigate why were we doing this
            let tem = await this.transactionDAO.put(transaction);
          } catch ( error ) {
            console.error('@SendRequestMoney (Accept and put transaction quote): ' + error.message);
            if ( error.message && error.message.includes('[Transaction Validation error] ') ) {
              let temp = error.message.split('[Transaction Validation error] ');
              this.notify(temp[1], '', this.LogLevel.ERROR, true);
            } else if ( error.message && error.message == 'Exceed INR Transaction limit' ) {
              this.notify(this.INR_RATE_LIMIT, '', this.LogLevel.ERROR, true);
            } else {
              this.notify(this.TRANSACTION_ERROR + this.type, '', this.LogLevel.ERROR, true);
            }
            this.isLoading = false;
            return;
          }
        }
      }
      // Get the invoice again because the put to the transactionDAO will have
      // updated the invoice's status and other fields like transactionId.

      try {
        if ( this.invoice.id != 0 ) this.invoice = await this.invoiceDAO.find(this.invoice.id);
        else this.invoice = await this.invoiceDAO.put(this.invoice); // Flow for receivable

        let service = null;
        if ( this.invoice.xeroId && this.invoice.status == this.InvoiceStatus.PROCESSING )  service = this.xeroService;
        if ( this.invoice.quickId && this.invoice.status == this.InvoiceStatus.PROCESSING ) service = this.quickbooksService;

        if ( service != null ) service.invoiceResync(null, this.invoice);

        ctrl.stack.push({
          class: 'net.nanopay.sme.ui.MoneyFlowSuccessView',
          invoice: this.invoice
        });
      } catch ( error ) {
        this.isLoading = false;
        console.error('@SendRequestMoney (Invoice/Integration Sync): ' + error.message);
        this.notify(this.TRANSACTION_ERROR + this.type, '', this.LogLevel.ERROR, true);
        return;
      }
      this.isLoading = false;
    },

    // Validates invoice and puts draft invoice to invoiceDAO.
    async function saveDraft(invoice) {
      if ( ! this.invoiceDetailsValidation(this.invoice) ) return;
      try {
        await this.invoiceDAO.put(invoice);
        this.notify(this.DRAFT_SUCCESS, '', this.LogLevel.INFO, true);
        this.pushMenu(this.isPayable
          ? 'sme.main.invoices.payables'
          : 'sme.main.invoices.receivables');
      } catch (error) {
        console.error('@SendRequestMoney (Invoice put after quote transaction put): ' + error.message);
        this.notify(this.SAVE_DRAFT_ERROR + this.type, '', this.LogLevel.ERROR, true);
        return;
      }
    },
    async function populatePayerIdOrPayeeId() {
      try {
        if ( ! this.invoice.payee || ! this.invoice.payer ) {
          var contact = await this.subject.user.contacts.find(this.invoice.contactId);
          if ( this.isPayable ) {
            this.invoice.payeeId = contact.businessId || contact.id;
          } else {
            this.invoice.payerId = contact.businessId || contact.id;
          }
        }
      } catch (err) {
        if ( this.invoice.payerId && this.invoice.payeeId && err.id == 'foam.nanos.auth.AuthorizationException' ) return;
        console.error('@SendRequestMoney (Populate invoice fields): ' + err.message);
        this.notify(this.CONTACT_NOT_FOUND, '', this.LogLevel.ERROR, true);
      }
    }
  ],

  actions: [
    {
      name: 'save',
      isAvailable: function(hasSaveOption) {
        return hasSaveOption;
      },
      isEnabled: function(errors) {
        return ! errors;
      },
      code: function() {
        this.invoice.status = this.InvoiceStatus.DRAFT;
        this.invoice.draft = true;
        this.saveDraft(this.invoice);
      }
    },
    {
      name: 'goNext',
      isAvailable: function(hasNextOption) {
        return hasNextOption;
      },
      isEnabled: function(errors, isLoading) {
        if ( this.subject.user.address.countryId === 'CA' ) {
          return ! errors && ! isLoading;
        } else {
          return this.auth.check(null, 'strategyreference.read.9319664b-aa92-5aac-ae77-98daca6d754d').then(function(cadPerm) {
            return cadPerm && ! errors && ! isLoading;
          });
        }
      },
      code: async function() {
        var currentViewId = this.views[this.position].id;
        switch ( currentViewId ) {
          case this.DETAILS_VIEW_ID:
            if ( ! this.invoiceDetailsValidation(this.invoice) ) return;
            if ( ! this.subject.realUser.twoFactorEnabled && this.isPayable && this.permitToPay ) {
              if ( this.appConfig.mode === this.Mode.PRODUCTION ||
                   this.appConfig.mode === this.Mode.DEMO ) {
                this.notify(this.TWO_FACTOR_REQUIRED, '', this.LogLevel.ERROR, true);
                return;
              } else {
                // report but don't fail/error - facilitates automated testing
                this.notify(this.TWO_FACTOR_REQUIRED, '', this.LogLevel.WARN, true);
              }
            }
            this.populatePayerIdOrPayeeId().then(() => {
              this.subStack.push(this.views[this.subStack.pos + 1].view);
            });
            break;
          case this.PAYMENT_VIEW_ID:
            if ( ! await this.paymentValidation() ) return;
            this.populatePayerIdOrPayeeId().then(() => {
              this.subStack.push(this.views[this.subStack.pos + 1].view);
            });
            break;
          case this.REVIEW_VIEW_ID:
            if ( ! this.viewData.quote && this.isPayable && ! this.viewData.isDomestic ) {
              this.notify(this.WAITING_FOR_RATE, '', this.LogLevel.WARN, true);
              return;
            }
            this.submit();
            break;
          /* Redirects users back to dashboard if none
             of the above conditions are matched */
          default:
            this.pushMenu('sme.main.dashboard');
        }
      }
    },
    {
      name: 'exit',
      isEnabled: function(errors, isLoading) {
        return ! isLoading;
      },
      code: function() {
        if ( this.stack.depth === 1 ) {
          this.pushMenu('sme.main.dashboard');
        } else {
          this.stack.back();
        }
      }
    },
    {
      name: 'goBack',
      isEnabled: function(isLoading) {
        return ! isLoading;
      },
      isAvailable: function(hasBackOption) {
        return hasBackOption;
      },
      code: function(X) {
        if ( this.position <= 0 ) {
          X.stack.back();
          return;
        }
        this.subStack.back();
      }
    },
    {
      name: 'otherOption',
      isAvailable: function(hasOtherOption) {
        return hasOtherOption;
      },
      code: function(X) {
        this.ctrl.add(this.Popup.create().tag({
          class: 'net.nanopay.invoice.ui.modal.MarkAsVoidModal',
          invoice: this.invoice
        }));
      }
    },
  ]
});
