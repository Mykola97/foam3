foam.CLASS({
  package: 'net.nanopay.tx.model',
  name: 'TransactionPurpose',
  documentation: 'Purpose of the transaction',
  ids: [ 'purposeCode' ],
  properties: [
    {
      class: 'String',
      name: 'purposeCode',
      required: true
    },
    {
      class: 'String',
      name: 'formatType',
      documentation: 'Determines if ISO20022 or proprietary',
      required: true
    },
    {
      class: 'String',
      name: 'classificationName'
    },
    {
      class: 'String',
      name: 'classificationNumber'
    },
    {
      class: 'String',
      name: 'description',
      required: true
    },
    {
      class: 'Boolean',
      name: 'isB2B',
      required: true
    },
    {
      class: 'Boolean',
      name: 'isP2P',
      required: true
    }
  ]
});
