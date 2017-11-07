foam.CLASS({
  package: 'net.nanopay.tx.model',
  name: 'InformationalFee',
  extends: 'net.nanopay.tx.model.Fee',

  properties: [
    {
      class: 'Long',
      swiftType: 'Int',
      name: 'amount'
    },
    {
      class: 'foam.core.Enum',
      of: 'net.nanopay.tx.model.FeeType',
      name: 'type',
      value: 'net.nanopay.tx.model.FeeType.INFORMATIONAL'
    }
  ],

  methods: [
    {
      name: 'getFee',
      args: [
        {
          name: 'transactionAmount',
          javaType: 'long',
          swiftType: 'Int',
        }
      ],
      javaReturns: 'long',
      swiftReturns: 'Int',
      javaCode: ' return this.getAmount(); ',
      swiftCode: ' return amount ',
      code: function() {
        return this.amount;
      }
    },
    {
      name: 'getTotalAmount',
      args: [
        {
          name: 'transactionAmount',
          javaType: 'long',
          swiftType: 'Int',
        }
      ],
      javaReturns: 'long',
      swiftReturns: 'Int',
      javaCode: ' return getFee(transactionAmount) + transactionAmount; ',
      swiftCode: ' return getFee(transactionAmount) + transactionAmount',
      code: function() {
        return getFee(transactionAmount) + transactionAmount;
      }
    }
  ]
});
