foam.CLASS({
  package: 'net.nanopay.tx',
  name: 'FOPplanner',
  documentation: 'A planner for planning Free of Payment (FOP) type transactions',
  
  implements: ['foam.nanos.ruler.RuleAction'],

  javaImports: [
    'foam.nanos.logger.Logger',
    'net.nanopay.tx.SecurityTransaction',
    'net.nanopay.tx.model.Transaction',
    'net.nanopay.account.SecuritiesAccount',
    'java.util.List',
    'java.util.ArrayList'
  ],


  methods: [
    {
      name: 'applyAction',
      javaCode: `
        TransactionQuote txq = (TransactionQuote) obj;
        // --> Probably not needed.   Transaction tx = txq.getRequestTransaction();
        SecurityTransaction plan = new SecurityTransaction.Builder(x).build();

        plan.setSourceCurrency(txq.getSourceUnit());
        plan.setDestinationCurrency(txq.getDestinationUnit());

        plan.setSourceAccount(txq.getSourceAccount().getId()); //TODO add the security so we know which account to actually get.
        plan.setDestinationAccount(txq.getDestinationAccount().getId());

        plan.setIsQuoted(true);
        plan.setTransfers(
          createTransfers_(getX(), plan,
          ((SecuritiesAccount) txq.getSourceAccount()).getSecurityAccount(x,txq.getSourceUnit()).getId(),
          ((SecuritiesAccount) txq.getDestinationAccount()).getSecurityAccount(x,txq.getDestinationUnit()).getId()
        ));

        txq.addPlan(plan);
      `
    },
    {
      name: 'createTransfers_',
      args: [
        {
          name: 'x',
          type: 'Context'
        },
        {
          name: 'newPlan',
          type: 'net.nanopay.tx.SecurityTransaction'
        },
        {
          name: 'transferFrom',
          type: 'Long'
        },
        {
          name: 'transferTo',
          type: 'Long'
        },
      ],
      type: 'net.nanopay.tx.Transfer[]',
      javaCode: `
        List all = new ArrayList();
        TransactionLineItem[] lineItems = newPlan.getLineItems();
        for ( int i = 0; i < lineItems.length; i++ ) {
          TransactionLineItem lineItem = lineItems[i];
          Transfer[] transfers = lineItem.createTransfers(x, null, newPlan);
          for ( int j = 0; j < transfers.length; j++ ) {
            all.add(transfers[j]);
          }
        }
        all.add(new Transfer.Builder(x).setAccount(transferFrom).setAmount(-newPlan.getTotal()).build());
        all.add(new Transfer.Builder(x).setAccount(transferTo).setAmount(newPlan.getTotal()).build());
        if (newPlan.findSourceAccount(x) instanceof BrokerAccount )
        return (Transfer[]) all.toArray(new Transfer[0]);
      `
    }
  ]
});
