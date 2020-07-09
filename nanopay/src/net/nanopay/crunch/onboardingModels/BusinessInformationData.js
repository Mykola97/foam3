/**
 * NANOPAY CONFIDENTIAL
 *
 * [2020] nanopay Corporation
 * All Rights Reserved.
 *
 * NOTICE:  All information contained herein is, and remains
 * the property of nanopay Corporation.
 * The intellectual and technical concepts contained
 * herein are proprietary to nanopay Corporation
 * and may be covered by Canadian and Foreign Patents, patents
 * in process, and are protected by trade secret or copyright law.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from nanopay Corporation.
 */

foam.CLASS({
  package: 'net.nanopay.crunch.onboardingModels',
  name: 'BusinessInformationData',

  documentation: `
    This model represents the Basic Info of a Business in the onboarding model.
    It is made up of the BusinessDetailSection.
  `,

  implements: [
    'foam.core.Validatable'
  ],

  requires: [
    'foam.nanos.auth.User',
    'net.nanopay.model.Business'
  ],

  imports: [
    'businessTypeDAO'
  ],

  javaImports: [
    'foam.dao.DAO',
    'foam.nanos.auth.Subject',
    'foam.nanos.auth.User',
    'net.nanopay.model.Business',
    'static foam.mlang.MLang.INSTANCE_OF'
  ],

  sections: [
    {
      name: 'businessDetailsSection',
      title: 'Enter the business details'
    }
  ],

  messages: [
    { name: 'PLACE_HOLDER', message: 'Please select...' },
    { name: 'BUSINESS_TYPE_ERROR', message: 'Please select type of business.' },
    { name: 'NATURE_OF_BUSINESS_ERROR', message: 'Please select nature of business.' },
    { name: 'SOURCE_OF_FUNDS_ERROR', message: 'Please provide primary source of funds.' },
    { name: 'OPERATING_NAME_ERROR', message: 'Please enter business name.' },
    { name: 'YES', message: 'Yes' },
    { name: 'NO', message: 'No' },
    { name: 'OTHER_LABEL', message: 'Other' },
    { name: 'BUSINESS_LABEL', message: 'Does your business operate under a different name?' },
    { name: 'OPERATING_NAME_LABEL', message: 'Enter your operating name' },
    { name: 'NATURE_LABEL', message: 'Nature of business' },
    { name: 'PRIMARY_LABEL', message: 'Primary source of funds' },
    { name: 'OPTION_ONE', message: 'Purchase of goods produced' },
    { name: 'OPTION_TWO', message: 'Completion of service contracts' },
    { name: 'OPTION_THREE', message: 'Investment Income' },
    { name: 'OPTION_FOUR', message: 'Brokerage Fees' },
    { name: 'OPTION_FIVE', message: 'Consulting Fees' },
    { name: 'OPTION_SIX', message: 'Sale of investments' },
    { name: 'OPTION_SEVEN', message: 'Inheritance' },
    { name: 'OPTION_EIGHT', message: 'Grants, loans, and other sources of financing' }
  ],

  properties: [
    net.nanopay.model.Business.BUSINESS_TYPE_ID.clone().copyFrom({
      section: 'businessDetailsSection',
      label: 'Type of business',
      view: function(_, X) {
        return {
            class: 'foam.u2.view.ChoiceView',
            placeholder: X.data.PLACE_HOLDER,
            dao: X.businessTypeDAO,
            objToChoice: function(a) {
              return [a.id, a.name];
          }
        };
      },
      validationPredicates: [
        {
          args: ['businessTypeId'],
          predicateFactory: function(e) {
            return e.NEQ(net.nanopay.crunch.onboardingModels.BusinessInformationData.BUSINESS_TYPE_ID, 0);
          },
          errorMessage: 'BUSINESS_TYPE_ERROR'
        }
      ]
    }),
    {
      section: 'businessDetailsSection',
      class: 'Reference',
      of: 'net.nanopay.model.BusinessSector',
      name: 'businessSectorId',
      documentation: 'Represents the specific economic grouping for the business.',
      label: this.NATURE_LABEL,
      view: { class: 'net.nanopay.business.NatureOfBusiness' },
      validationPredicates: [
        {
          args: ['businessSectorId'],
          predicateFactory: function(e) {
            return e.NEQ(net.nanopay.crunch.onboardingModels.BusinessInformationData.BUSINESS_SECTOR_ID, 0);
          },
          errorMessage: 'NATURE_OF_BUSINESS_ERROR'
        }
      ]
    },
    net.nanopay.model.Business.SOURCE_OF_FUNDS.clone().copyFrom({
      section: 'businessDetailsSection',
      label: this.PRIMARY_LABEL,
      view: function(_, X) {
        return {
          class: 'foam.u2.view.ChoiceWithOtherView',
          otherKey: this.OTHER_LABEL,
          choiceView: {
            class: 'foam.u2.view.ChoiceView',
            placeholder: X.data.PLACE_HOLDER,
            choices: [
              X.data.OPTION_ONE,
              X.data.OPTION_TWO,
              X.data.OPTION_THREE,
              X.data.OPTION_FOUR,
              X.data.OPTION_FIVE,
              X.data.OPTION_SIX,
              X.data.OPTION_SEVEN,
              X.data.OPTION_EIGHT,
              X.data.OTHER_LABEL
            ]
          }
        };
      },
      validationPredicates: [
        {
          args: ['sourceOfFunds'],
          predicateFactory: function(e) {
            return e.GT(
              foam.mlang.StringLength.create({
                arg1: net.nanopay.crunch.onboardingModels.BusinessInformationData.SOURCE_OF_FUNDS
              }), 0);
          },
          errorMessage: 'SOURCE_OF_FUNDS_ERROR'
        }
      ]
    }),
    {
      section: 'businessDetailsSection',
      class: 'Boolean',
      name: 'operatingUnderDifferentName',
      label: this.BUSINESS_LABEL,
      view: function(_, X) {
        return {
          class: 'foam.u2.view.RadioView',
          choices: [
            [true, X.data.YES],
            [false, X.data.NO]
          ],
          isHorizontal: true
        };
      }
    },
    net.nanopay.model.Business.OPERATING_BUSINESS_NAME.clone().copyFrom({
      section: 'businessDetailsSection',
      view: {
        class: 'foam.u2.TextField',
        placeholder: this.OPERATING_NAME_LABEL
      },
      visibility: function(operatingUnderDifferentName) {
        return operatingUnderDifferentName ? foam.u2.DisplayMode.RW : foam.u2.DisplayMode.HIDDEN;
      },
      validationPredicates: [
        {
          args: ['operatingUnderDifferentName', 'operatingBusinessName'],
          predicateFactory: function(e) {
            return e.OR(
              e.EQ(net.nanopay.crunch.onboardingModels.BusinessInformationData.OPERATING_UNDER_DIFFERENT_NAME, false),
              e.NEQ(net.nanopay.crunch.onboardingModels.BusinessInformationData.OPERATING_BUSINESS_NAME, '')
            );
          },
          errorMessage: 'OPERATING_NAME_ERROR'
        }
      ]
    })
  ],

  methods: [
    {
      name: 'validate',
      javaCode: `
        java.util.List<foam.core.PropertyInfo> props = getClassInfo().getAxiomsByClass(foam.core.PropertyInfo.class);
        for ( foam.core.PropertyInfo prop : props ) {
          try {
            prop.validateObj(x, this);
          } catch ( IllegalStateException e ) {
            throw e;
          }
        }

        DAO userDAO = (DAO) x.get("userDAO");
        Long businessId = ((User) ((Subject) x.get("subject")).getUser()).getId();
        User businessUser = (User) (userDAO.find(businessId)).fclone();
        Business business = (Business) businessUser;
        business.setBusinessTypeId(getBusinessTypeId());
        userDAO.put(business);
      `,
    }
  ]
});
