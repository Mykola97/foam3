foam.CLASS({
  package: 'net.nanopay.tx.ruler',
  name: 'TransactionLimitRule',
  extends: 'foam.nanos.ruler.Rule',
  abstract: true,

  documentation: 'Abstract class for transaction limits, never to be instantiated.',

  javaImports: [
    'foam.core.X',
    'foam.dao.DAO',
    'net.nanopay.tx.model.Transaction',
    'static foam.mlang.MLang.*'
  ],

  properties: [
    {
      name: 'name',
      visibility: 'RO',
      expression: function(limit, send, period) {
        return `${limit} ${send ? 'sending' : 'receiving'} ${period.label} transaction limit`;
      }
    },
    {
      class: 'String',
      name: 'ruleGroup',
      value: 'transactionLimits',
      visibility: 'RO',
      permissionRequired: true
    },
    {
      class: 'Enum',
      of: 'foam.nanos.ruler.Operations',
      name: 'operation',
      value: 'CREATE',
      visibility: 'RO',
    },
    {
      class: 'Long',
      name: 'limit',
      label: 'Maximum Transaction Size',
      section: 'basicInfo',
      validationPredicates: [
        {
          args: ['limit'],
          predicateFactory: function(e) {
            return e.GT(net.nanopay.tx.ruler.TransactionLimitRule.LIMIT, 0);
          },
          errorString: 'Please set a transaction limit.'
        }
      ]
    },
    {
      class: 'Boolean',
      name: 'send',
      value: true,
      label: 'Apply Limit To',
      section: 'basicInfo',
      view: {
        class: 'foam.u2.view.ChoiceView',
        choices: [
          [true, 'Sending'],
          [false, 'Receiving'],
        ]
      }
    },
    {
      class: 'foam.core.Enum',
      of: 'net.nanopay.util.Frequency',
      name: 'period',
      value: 'DAILY',
      section: 'basicInfo',
      label: 'Transaction Limit Time Frame'
    },
    {
      class: 'Map',
      name: 'currentLimits',
      visibility: 'RO',
      permissionRequired: true,
      javaFactory: `
        return new java.util.HashMap<Object, TransactionLimitState>();
      `,
      documentation: 'Stores map of objects and current running limits.'
    },
    {
      name: 'daoKey',
      value: 'localTransactionDAO',
      visibility: 'RO',
    },
    {
      name: 'action',
      transient: true,
      javaFactory: `
        return new TransactionLimitRuleAction.Builder(getX())
          .setSend(this.getSend())
          .setLimit(this.getLimit())
          .setPeriod(this.getPeriod())
          .setCurrentLimits(this.getCurrentLimits())
          .build();
      `,
    },
    {
      name: 'predicate',
      transient: true
    }
  ],

  methods: [
    {
      name: 'updateLimitAmount',
      args: [
        {
          name: 'amount',
          type: 'Long'
        },
        {
          name: 'msPeriod',
          type: 'Long'
        }
      ],
      type: 'Long',
      javaCode: `
      return Math.max(amount - msPeriod * getLimit() / getPeriod().getMs(), 0);
      `
    },
    {
      name: 'updateRule',
      type: 'foam.nanos.ruler.Rule',
      args: [
        {
          name: 'rule',
          type: 'foam.nanos.ruler.Rule'
        }
      ],
      javaCode: `
      TransactionLimitRule ret = (TransactionLimitRule) rule.fclone();
      if ( ret.getSend() != getSend() ) {
        throw new RuntimeException("send property cannot be changed");
      }
      ret.clearAction();
      return ret;
      `
    }
  ]
});
