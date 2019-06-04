foam.CLASS({
  package: 'net.nanopay.tx',
  name: 'JackieRuleOnCreate',
  extends: 'net.nanopay.meter.compliance.AbstractComplianceRuleAction',

  documentation: `Creates an approval request if a Compliance Transaction is encountered.`,

  implements: ['foam.nanos.ruler.RuleAction'],

  javaImports: [
    'foam.core.ContextAgent',
    'foam.core.X',
    'foam.util.SafetyUtil',
    'net.nanopay.approval.ApprovalRequest',
    'net.nanopay.tx.ComplianceTransaction',
    'net.nanopay.tx.model.Transaction',

  ],

  properties: [
    {
      name: 'jackieId',
      class: 'Long',
      value: 8233
      //class: 'Reference',
      //of: 'foam.nanos.auth.Group',
    }
  ],

  methods: [
    {
      name: 'applyAction',
      javaCode: `
        ComplianceTransaction ct = (ComplianceTransaction) obj;
        Transaction headTx = ct;

        agent.submit(x, ContextAgent() {
          @Override
          public void execute(X x) {

            while ( ! SafetyUtil.isEmpty(headTx.getParent())) {
              headTx = headTx.findParent(x);
            }
            ApprovalRequest req = new ApprovalRequest.Builder(x)
              .setDaoKey("localTransactionDAO")
              .setObjId(ct.getId())
              .setApprover(getJackieId())
              //.setDescription("Main Summary txn: "+headTx.getSummary()+" The Id of Summary txn: "+headTx.getId()+ )
              .build();
            requestApproval(x, req);
          }
        });
      `
    }
  ]
});
