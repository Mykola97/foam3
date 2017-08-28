
foam.CLASS({
  package: 'net.nanopay.interac.ui.etransfer',
  name: 'TransferWizard',
  extends: 'net.nanopay.interac.ui.shared.wizardView.WizardView',

  documentation: 'Pop up that extends WizardView for e-transfer',

  axioms: [
    foam.u2.CSS.create({code: net.nanopay.interac.ui.shared.wizardView.WizardView.getAxiomsByClass(foam.u2.CSS)[0].code}),
    foam.u2.CSS.create({
      code: function CSS() {/*
      ^ .topRow {
        width: 100%;
        height: 40px;
        box-sizing: border-box;
        margin-bottom: 20px;
      }

      ^ .interacImage {
        width: 90px;
        height: 40px;
        object-fit: contain;
        float: right;
      }

      ^ p {
        margin: 0;
        color: #093649;
        font-size: 14px;
        font-weight: 300;
        letter-spacing: 0.2px;
        margin-bottom: 8;
      }

      ^ .pDetails {
        opacity: 0.7;
        font-size: 12px;
        line-height: 1.17;
        letter-spacing: 0.2px;
        color: #093649;
      }

      ^ .bold {
        font-weight: bold;
        margin-bottom: 20px;
        letter-spacing: 0.4px;
        text-align: left;
      }

      ^ .detailsCol {
        display: inline-block;
        vertical-align: top;
        width: 320px;
      }

      ^ .divider {
        display: inline-block;
        vertical-align: top;
        width: 2px;
        height: 520;
        box-sizing: border-box;
        background-color: #a4b3b8;
        opacity: 0.3;
        margin: auto 51px;
      }

      ^ .fromToCol {
        display: inline-block;
        vertical-align: top;
        width: 300px;
      }

      ^ .fromToCard {
        box-sizing: border-box;
        padding: 20px;
        width: 300px;
        border-radius: 2px;
        background-color: #ffffff;
        border: solid 1px rgba(164, 179, 184, 0.5);
        margin-bottom: 20px;
      }

      ^ .pricingCol {
        display: inline-block;
        vertical-align: top;
        width: 160px;
        box-sizing: border-box;
      }

      ^ .pPricing {
        font-size: 12px;
        margin-bottom: 10px;
      }
    */}})
  ],

  methods: [
    function init() {
      this.views = [
        { parent: 'etransfer', id: 'etransfer-transfer-details',     label: 'Account & Payee',      view: { class: 'net.nanopay.interac.ui.etransfer.TransferDetails' } },
        { parent: 'etransfer', id: 'etransfer-transfer-amount',      label: 'Amount',               view: { class: 'net.nanopay.interac.ui.etransfer.TransferAmount'  } },
        { parent: 'etransfer', id: 'etransfer-transfer-review',      label: 'Review',               view: { class: 'net.nanopay.interac.ui.etransfer.TransferReview'  } }
      ];
      this.SUPER();
    }
  ],

  actions: [
    {
      name: 'goBack',
      label: 'Back',
      isAvailable: function(position) {
        return position == 3 || position == 0 ? false : true;
      },
      code: function() {
        this.subStack.back();
      }
    },
    {
      name: 'goNext',
      label: 'Next',
      isAvailable: function(position, errors) {
        if ( errors ) return false; // Error present
        if ( position < 2 ) return true; // Valid next
        return false; // Not in dialog
      },
      code: function() {
        var self = this;
        if ( this.position == 2 ) { // On Review Transfer page.

          return;
        }

        this.subStack.push(this.views[this.subStack.pos + 1].view); // otherwise
      }
    }
  ]
})
