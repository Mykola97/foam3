foam.CLASS({
  package: 'net.nanopay.sme.cron',
  name: 'OnboardingReminderCron',
  implements: [
    'foam.core.ContextAgent'
  ],

  javaImports: [
    'foam.dao.ArraySink',
    'foam.dao.DAO',
    'foam.nanos.cron.Cron',
    'foam.nanos.logger.Logger',
    'foam.nanos.notification.Notification',
    'foam.nanos.auth.Group',
    'java.util.Date',
    'java.util.HashMap',
    'java.util.List',
    'java.util.Map',
    'net.nanopay.model.Business',
    'net.nanopay.bank.BankAccount',
    'net.nanopay.bank.BankAccountStatus',
    'static foam.mlang.MLang.*'
  ],
  documentation: 'Send onboarding reminder email to businesses created over 24 hours ago without yet completing their onboarding or setting up their bank account',

  methods: [
    {
      name: 'execute',
      args: [
        {
          name: 'x',
          tpye: 'Context'
        }
      ],
      javaCode:
      `
      Map<String, Object>  args           = null;
      DAO                  businessDAO    = (DAO) x.get("businessDAO");
      Group                group          = (Group) x.get("group");

      // FOR DEFINING THE PERIOD IN WHICH TO CONSIDER SIGN UPS
      Date                 startInterval  = new Date(new Date().getTime() - (1000 * 60 * 60 * 24));
      Date                 endInterval    = null;
      Long                 disruptionDiff = 0L;
      Date                 disruption     = ((Cron)((DAO)x.get("cronDAO")).find("Send Onboarding Reminder Email To Businesses Created Over 24 Hours Ago")).getLastRun();

      // Check if there was no service disruption - if so, add/sub diff from endInterval
      disruptionDiff = disruption == null ? 0 : disruption.getTime() - startInterval.getTime();
      endInterval    = new Date(startInterval.getTime() - (1000 * 60 * 60 * 24) + disruptionDiff );

      List<Business> businessCreatedOverOneDay = ( (ArraySink) businessDAO.where(
        AND(
          GTE(Business.CREATED, endInterval),
          LT(Business.CREATED, startInterval)
        )
        ).select(new ArraySink())).getArray();

      for(Business business: businessCreatedOverOneDay) {
        //check if business has a verfied bank account set up
        boolean verfiedBankAccount = false;
        List<BankAccount> accounts = ( (ArraySink) business.getAccounts(x).where(
          INSTANCE_OF(BankAccount.class)
        ).select(new ArraySink())).getArray();

        for(BankAccount account: accounts){
          if(BankAccountStatus.VERIFIED.equals(account.getStatus())){
            verfiedBankAccount = true;
            break;
          }
        }
        if(!business.getOnboarded() || !verfiedBankAccount){
          //send onboarding reminder email
          args = new HashMap<>();
          try {
            String recepientFirstName = business.getOnboarded() ?
              business.findSigningOfficer(x).getFirstName() :
              business.label();

            args.put("name", recepientFirstName);
            args.put("business", business.getBusinessName());
            args.put("sendTo", business.getEmail());
            args.put(
              "businessRegistrationLink",
              "https://nanopay.atlassian.net/servicedesk/customer/portal/4/topic/1cbf8d4b-9f54-4a15-9c0a-2e636351b803/article/983084"
            );
            args.put(
              "bankAccountSetupLink",
              "https://nanopay.atlassian.net/servicedesk/customer/portal/4/topic/1cbf8d4b-9f54-4a15-9c0a-2e636351b803/article/950332"
            );

            Notification onboardingReminderNotification = new Notification.Builder(x)
            .setBody("Complete Business Regeistration on Ablii")
            .setNotificationType("OnboardingReminder")
            .setGroupId(group.toString())
            .setEmailIsEnabled(true)
            .setEmailArgs(args)
            .setUserId(business.getId())
            .setEmailName("onboarding-reminder")
            .build();

            business.doNotify(x, onboardingReminderNotification);

          } catch (Throwable t) {
            StringBuilder sb = new StringBuilder();
            sb.append("Email meant for business onboarding-reminder Error: Business ");
            sb.append(business.getId());
            ((Logger) x.get("logger")).error(sb.toString(), t);
          }
        }
      }
      `
    }
  ]
});
