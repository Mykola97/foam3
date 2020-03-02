 foam.CLASS({
  package: 'net.nanopay.tx.alterna',
  name: 'AlternaCOTransaction',
  extends: 'net.nanopay.tx.cico.COTransaction',

  javaImports: [
    'net.nanopay.tx.model.TransactionStatus'
  ],

  properties: [
    {
      class: 'String',
      name: 'confirmationLineNumber',
      visibility: 'RO'
    },
    {
      class: 'String',
      name: 'returnCode',
      visibility: 'RO'
    },
    {
      class: 'String',
      name: 'returnDate',
      visibility: 'RO'
    },
    {
      class: 'String',
      name: 'returnType',
      visibility: 'RO'
    },
    {
      class: 'String',
      name: 'padType'
    },
    {
      class: 'String',
      name: 'txnCode'
    },
    {
      class: 'String',
      name: 'description',
      visibility: 'RO'
    }
  ],

  methods: [
    {
      name: 'limitedCopyFrom',
      args: [
        {
          name: 'other',
          type: 'net.nanopay.tx.model.Transaction'
        },
      ],
      javaCode: `
        super.limitedCopyFrom(other);
        if ( other instanceof AlternaCOTransaction ) {
          setConfirmationLineNumber(((AlternaCOTransaction)other).getConfirmationLineNumber());
          setReturnCode(((AlternaCOTransaction)other).getReturnCode());
          setReturnDate(((AlternaCOTransaction)other).getReturnDate());
          setReturnType(((AlternaCOTransaction)other).getReturnType());
          setPadType(((AlternaCOTransaction)other).getPadType());
          setTxnCode(((AlternaCOTransaction)other).getTxnCode());
          setDescription(((AlternaCOTransaction)other).getDescription());
       }
      `
    },
    {
      name: 'isActive',
      type: 'Boolean',
      javaCode: `
         return
           getStatus().equals(TransactionStatus.PENDING) ||
           getStatus().equals(TransactionStatus.DECLINED);
      `
    }
  ]
});
