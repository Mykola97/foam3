foam.CLASS({
  package: 'net.nanopay.liquidity',
  name: 'PreventAccountLiquidityLoopRule',

  documentation: `When an account is created or updated this rule prevents money 
    from infinitely looping through multiple accounts via Liquidity Settings.`,

  implements: ['foam.nanos.ruler.RuleAction'],

  javaImports: [
    'foam.dao.DAO',
    'java.util.HashSet',
    'net.nanopay.account.DigitalAccount',
    'net.nanopay.liquidity.Liquidity',
    'net.nanopay.liquidity.LiquiditySettings'
  ],

  properties: [
    {
      class: 'String',
      name: 'message'
    }
  ],

  methods: [
    {
      name: 'applyAction',
      javaCode: `
        DigitalAccount account = (DigitalAccount) obj;
        checkLiquidityLoop(x, account, true, this.getMessage());
        checkLiquidityLoop(x, account, false, this.getMessage());
      `
    },
    {
      name: 'checkLiquidityLoop',
      args: [
        {
          name: 'x',
          type: 'Context'
        },
        {
          name: 'account',
          type: 'net.nanopay.account.DigitalAccount'
        },
        {
          name: 'checkHighLiquidity',
          type: 'Boolean'
        },
        {
          name: 'message',
          type: 'String'
        }
      ],
      javaCode: `
        DAO accountDAO = (DAO) x.get("localAccountDAO");
        HashSet<Long> seenAccountIds = new HashSet<>();

        while ( account != null ) {
          if ( seenAccountIds.contains(account.getId()) ) {
            throw new RuntimeException(message);
          }
          seenAccountIds.add(account.getId());
          LiquiditySettings nextLiquiditySetting = account.findLiquiditySetting(x);
          if ( nextLiquiditySetting == null ) return;
          
          Liquidity nextLiquidity = checkHighLiquidity ? nextLiquiditySetting.getHighLiquidity() : nextLiquiditySetting.getLowLiquidity();
          if ( nextLiquidity == null || ! nextLiquidity.getRebalancingEnabled() ) return;
          try {
            account = (DigitalAccount) accountDAO.find(nextLiquidity.getPushPullAccount());
          } catch (ClassCastException e) {
            return;
          }
        }
      `
    }
  ]
});
