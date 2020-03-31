foam.CLASS({
  package: 'net.nanopay.invoice.ruler',
  name: 'SetPaymentSentDateRule',

  documentation: `Sets invoice payment sent date when CI transaction is settled.`,

  implements: ['foam.nanos.ruler.RuleAction'],

  javaImports: [
    'foam.core.ContextAgent',
    'foam.core.X',
    'foam.dao.DAO',
    'foam.nanos.logger.Logger',
    'net.nanopay.invoice.model.Invoice',
    'net.nanopay.tx.model.Transaction',

    'java.util.Date'
  ],

  methods: [
    {
      name: 'applyAction',
      javaCode: `
      agency.submit(x, new ContextAgent() {
        @Override
        public void execute(X x) {
          DAO invoiceDAO = (DAO) x.get("invoiceDAO");
          Transaction transaction = (Transaction) obj;
          Invoice invoice = (Invoice) invoiceDAO.find(transaction.getInvoiceId());

          try {
            invoice.setPaymentSentDate(new Date());
            invoiceDAO.put(invoice);
          } catch (Throwable e) {
            ((Logger) x.get("logger")).error("Payment sent date was not updated on invoice: " , invoice.getId(), " Error: ", e);
          }
        }
      }, "set payment sent date on invoice");
      `
    }
  ]
});
