foam.CLASS({
  package: 'net.nanopay.tx',
  name: 'CompositeTransaction',
  extends: 'net.nanopay.tx.model.Transaction',

  javaImports: [
    'net.nanopay.tx.model.Transaction',
    'net.nanopay.tx.model.TransactionStatus',
    'foam.core.FObject',
    'foam.dao.DAO',
    'foam.nanos.logger.Logger',
    'java.util.ArrayList',
    'java.util.List'
  ],

  properties: [
    {
      class: 'Reference',
      of: 'net.nanopay.tx.model.Transaction',
      targetDAOKey: 'localTransactionDAO',
      name: 'current',
    },
    {
      class: 'FObjectArray',
      visibility: foam.u2.Visibility.RO,
      name: 'queued',
      of: 'net.nanopay.tx.model.Transaction',
      factory: function() {
        return [];
      },
      javaType: 'Transaction[]',
      javaFactory: `
        return new Transaction[0];
      `
    },
    {
      // Array of References
      class: 'Array',
      name: 'completed',
      javaType: 'Long[]',
      javaFactory: `
        return new Long[getQueued().length];
      `
    },
    {
      name: 'status',
      javaFactory: `
        Transaction txn = (Transaction) findCurrent(getX());
        if ( txn != null ) {
          return txn.getStatus();
        }
        return TransactionStatus.COMPLETED;
     `
    }
  ],

  methods: [
    {
      name: 'add',
      code: function add(transaction) {
        this.queued.push(transaction);
      },
      args: [
        {
          name: 'x',
          javaType: 'foam.core.X'
        },
        {
          name: 'transaction',
          javaType: 'Transaction'
        }
      ],
      javaCode: `
        Transaction[] queued = getQueued();
        synchronized (queued) {
          Transaction[] replacement = new Transaction[queued.length + 1];
          System.arraycopy(queued, 0, replacement, 0, queued.length);
          replacement[queued.length] = transaction;
          setQueued(replacement);
        }
        // Logger logger = (Logger) getX().get("logger");
        // logger.debug(this.getClass().getSimpleName(), "add", this);
      `
    },
    {
      name: 'remove',
      code: function remove(transaction) {
        this.queued = this.queued.filter(function(t) {
          return t.id != transaction.id;
        });
      },
      args: [
        {
          name: 'x',
          javaType: 'foam.core.X'
        },
        {
          name: 'transaction',
          javaType: 'net.nanopay.tx.model.Transaction'
        }
      ],
      javaCode: `
        Transaction[] queued = getQueued();
        synchronized (queued) {
          int index = -1;
          for ( int i = 0; i < queued.length; i++ ) {
            if ( queued[i].getId() == transaction.getId()) {
              index = i;
              break;
            }
          }
          if ( index > -1 ) {
            Transaction[] replacement = new Transaction[queued.length - 1];
            System.arraycopy(queued, 0, replacement, 0, index);
            if ( index < queued.length ) {
              System.arraycopy(queued, index + 1, replacement, index, queued.length - ( index + 1 ) );
            }
            setQueued(replacement);
          }
        }
        // Logger logger = (Logger) getX().get("logger");
        // logger.debug(this.getClass().getSimpleName(), "remove", this);
      `
    },
    {
      name: 'next',
      args: [
        {
          name: 'x',
          javaType: 'foam.core.X'
        }
      ],
      javaCode: `
        // Logger logger = (Logger) getX().get("logger");
        // logger.debug(this.getClass().getSimpleName(), "next", this);
        if ( getCurrent() != 0 ) {
          Long[] completed = java.util.Arrays.copyOf(getCompleted(), getCompleted().length + 1);
          completed[completed.length -1] = getCurrent();
          setCompleted(completed);
          setCurrent(0);
        }
        if ( getQueued().length > 0 ) {
          Transaction txn = getQueued()[0];
          remove(x, txn);
          txn.setParent(getId());
          DAO dao = (DAO) getX().get("localTransactionDAO");
          txn = (Transaction) dao.put(txn);
          txn = (Transaction) dao.find_(x, txn.getId());
          if ( txn.getStatus() == TransactionStatus.COMPLETED ) {
            // Digital -> Digital Transactions complete immediately, for example.
            next(x);
          } else {
            setCurrent(txn.getId());
          }
        }
`
    },
    {
      name: 'createTranfers',
      args: [
        {
          name: 'x',
          javaType: 'foam.core.X'
        }
      ],
      javaReturns: 'Transfer[]',
      javaCode: `
        return new Transfer[] {};
      `
    },
    {
      name: 'transactions',
      javaReturns: 'Transaction[]',
      javaCode: `
        ArrayList<Transaction> list = java.util.Arrays.stream(getQueued()).collect(java.util.stream.Collectors.toCollection(ArrayList::new));
        Transaction cur = findCurrent(getX());
        if ( cur != null ) {
          list.add(cur);
        }
        DAO dao = (DAO) getX().get("localTransactionDAO");
        Long[] completed = getCompleted();
        for ( int i = 0; i < completed.length; i++ ) {
          Transaction txn = (Transaction) dao.find_(getX(), completed[i]);
          list.add(txn);
        }
        return list.toArray(new Transaction[list.size()]);
      `
    },
    {
      name: 'toString',
      javaString: 'String',
      javaCode: `
        StringBuilder sb = new StringBuilder();
        sb.append(this.getClass().getSimpleName());
        sb.append("[");
        Transaction[] txns = transactions();
        for ( int i = 0; i < txns.length; i++ ) {
          sb.append(txns[i]);
          sb.append(", ");
        }
        sb.append("]");
        return sb.toString();
      `
    }
  ]
});
