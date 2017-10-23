foam.CLASS({
  package: 'net.nanopay.tx.model',
  name: 'Transaction',

  imports: [
    'userDAO'
  ],

  properties: [
    {
      class: 'Long',
      name: 'id',
      label: 'Transaction ID'
    },
    {
      class: 'String',
      name: 'status'
    },
    {
      class: 'String',
      name: 'referenceNumber'
    },
    {
      class: 'Long',
      name: 'impsReferenceNumber',
      label: 'IMPS Reference Number'
    },
    {
      class: 'Long',
      name: 'payerId',
      label: 'Payer',
      tableCellFormatter: function(payerId, X) {
        var self = this;
        X.userDAO.find(payerId).then(function(payer) {
          self.start()
            .start('h4').style({ 'margin-bottom': 0 }).add(payer.firstName).end()
            .start('p').style({ 'margin-top': 0 }).add(payer.email).end()
          .end();
        })
      }
    },
    {
      class: 'Long',
      name: 'payeeId',
      label: 'Payee',
      tableCellFormatter: function(payeeId, X) {
        var self = this;
        X.userDAO.find(payeeId).then(function(payee) {
          self.start()
            .start('h4').style({ 'margin-bottom': 0 }).add(payee.firstName).end()
            .start('p').style({ 'margin-top': 0 }).add(payee.email).end()
          .end();
        })
      }
    },
    {
      class: 'Currency',
      name: 'amount',
      label: 'Amount',
      tableCellFormatter: function(amount) {
        //this.start({ class: 'foam.u2.tag.Image', data: 'images/canada.svg' })
        var formattedAmount = amount/100;
        this.start().add('$', formattedAmount.toFixed(2)).end()
      },
    },
    {
      class: 'Currency',
      name: 'receivingAmount',
      label: 'Receiving Amount',
      transient: true,
      expression: function(amount, fees, rate) {
        var receivingAmount = (amount - fees) * rate;
        return receivingAmount;
      },
      tableCellFormatter: function(receivingAmount) {
        this.start({ class: 'foam.u2.tag.Image', data: 'images/india.svg' })
            .add(' INR ', ( receivingAmount/100 ).toFixed(2))
      }
    },
    {
      class: 'String',
      name: 'challenge',
      documentation: 'Randomly generated challenge'
    },
    {
      class: 'DateTime',
      name: 'date',
      label: 'Date & Time'
    },
    {
      class: 'Currency',
      name: 'tip'
    },
    {
      class: 'Double',
      name: 'rate',
      tableCellFormatter: function(rate){
        this.start().add(rate.toFixed(2)).end()
      }
    },
    {
      class: 'FObjectArray',
      name: 'fees',
      of: 'net.nanopay.tx.model.Fee'
    },
    // TODO: field for tax as well? May need a more complex model for that
    {
      class: 'Currency',
      name: 'total',
      transient: true,
      expression: function (amount, tip, fees) {
        return amount + tip + fees;
      }
    },
    {
      class: 'FObjectProperty',
      of: 'net.nanopay.tx.model.TransactionPurpose',
      name: 'purpose',
      documentation: 'Transaction purpose'
    },
    {
      class: 'String',
      name: 'notes',
      documentation: 'Transaction notes'
    }
  ]
});
