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
  package: 'net.nanopay.partner.treviso.onboarding',
  name: 'BRBeneficialOwner',
  extends: 'net.nanopay.model.BeneficialOwner',

  documentation: `
    A beneficial owner is a person who owns part of a business.
    has 2 modes:
    1) 'percent' which assumes everything is pre-populated with user(signingOfficer) data
    2) ...anything else, which assumes nothing and entire object is visible.
    This model is the Brazil extension of the generic BusinessDirector model.
  `,

  javaImports: [
    'net.nanopay.country.br.BrazilVerificationService',
  ],

  imports: [
    'brazilVerificationService'
  ],

  tableColumns: [
    'id',
    'business.id',
    'firstName',
    'lastName'
  ],

  messages: [
    { name: 'INVALID_NATIONALITY', message: 'Nationality required' },
    { name: 'YES', message: 'Yes' },
    { name: 'NO', message: 'No' },
    { name: 'RICHCHOICE_SELECTION_TITLE', message: 'Countries' },
    { name: 'PROOF_OF_ADDRESS', message: 'Proof of address documents required' },
    { name: 'PROOF_OF_IDENTIFICATION', message: 'Proof of identication documents required' }
  ],

  properties: [
    {
      name: 'birthday',
      validationPredicates: [],
      hidden: true
    },
    {
      class: 'EMail',
      name: 'email',
      section: 'requiredSection',
      required: true,
      visibility: function(mode, showFullOwnerDetails) {
        return mode === 'percent' && ! showFullOwnerDetails ? foam.u2.DisplayMode.HIDDEN : mode === 'percent' && showFullOwnerDetails ? foam.u2.DisplayMode.RO : foam.u2.DisplayMode.RW;
      }
    },
    {
      class: 'Reference',
      targetDAOKey: 'countryDAO',
      name: 'nationality',
      of: 'foam.nanos.auth.Country',
      section: 'requiredSection',
      documentation: `Defined nationality of beneficial owner.`,
      view: function(_, X) {
        return {
          class: 'foam.u2.view.RichChoiceView',
          search: true,
          placeholder: X.data.PLACEHOLDER,
          sections: [
            {
              heading: X.data.RICHCHOICE_SELECTION_TITLE,
              dao: X.countryDAO
            }
          ]
        };
      },
      validationPredicates: [
        {
          args: ['nationality', 'showValidation'],
          predicateFactory: function(e) {
            return e.OR(
              e.EQ(
                net.nanopay.partner.treviso.onboarding.BRBeneficialOwner
                  .SHOW_VALIDATION,
                false),
              e.GT(
                foam.mlang.StringLength.create({
                  arg1: net.nanopay.partner.treviso.onboarding.BRBeneficialOwner
                    .NATIONALITY }),
                 0)
            );
          },
          errorMessage: 'INVALID_NATIONALITY'
        }
      ]
    },
    {
      class: 'FObjectProperty',
      name: 'cpf',
      label: '',
      of: 'net.nanopay.country.br.CPF',
      required: true,
      section: 'requiredSection',
      visibility: function(mode, showFullOwnerDetails) {
        return mode === 'percent' && ! showFullOwnerDetails ? foam.u2.DisplayMode.HIDDEN : foam.u2.DisplayMode.RW;
      },
      factory: function() {
        return net.nanopay.country.br.CPF.create({}, this.__subContext__);
      },
      view: function(_, X) {
        let forceIntoRO = X.data.mode === 'percent' && X.data.showFullOwnerDetails;
        var x = forceIntoRO ? X.createSubContext({ controllerMode: foam.u2.ControllerMode.VIEW }) : X;
        return foam.u2.view.FObjectView.create({ classIsFinal: true }, x);
      }
    },
    {
      class: 'Boolean',
      name: 'PEPHIORelated',
      label: 'Is the owner considered a politically exposed person (PEP)?',
      documentation: `Determines whether the user is a domestic or foreign _Politically
        Exposed Person (PEP), or related to any such person.
      `,
      section: 'requiredSection',
      help: `
      As defined in item 7 of Bacen Circular Letter 3430/2010 -
      “For the purposes of the provisions of § 1 of art. 4 of Circular No. 3,461, of 2009,
      are clients examples of situations that characterize close relationships and lead to
      the classification of permanentas politically exposed persons:
      I – constitution of politically exposed persons as attorneys or representatives;
      II - control, direct or indirect, by a politically exposed person, in the case of a corporate client;
      and III – habitual movement of financial resources from or to a politically exposed person Client of the institution,
                not justified by economic events, such as the acquisition of goods or provision of services;".

      `,
      value: false,
      visibility: function(mode, showFullOwnerDetails) {
        return mode === 'percent' && ! showFullOwnerDetails ? foam.u2.DisplayMode.HIDDEN : mode === 'percent' && showFullOwnerDetails ? foam.u2.DisplayMode.RO : foam.u2.DisplayMode.RW;
      },
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
    {
      class: 'Boolean',
      name: 'hasSignedContratosDeCambio',
      label: 'Has this business owner signed the foreign exchange contract?',
      section: 'requiredSection',
      help: `
        Foreign exchange contract (Contratos de câmbio) is a legal arrangement in which the
        parties agree to transfer between them a certain amount of foreign exchange at a
        predetermined rate of exchange, and as of a predetermined date.
      `,
      visibility: function(mode, showFullOwnerDetails) {
        return mode === 'percent' && ! showFullOwnerDetails ? foam.u2.DisplayMode.HIDDEN : mode === 'percent' && showFullOwnerDetails ? foam.u2.DisplayMode.RO : foam.u2.DisplayMode.RW;
      },
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
    {
      class: 'foam.nanos.fs.FileArray',
      name: 'documentsOfAddress',
      label: 'Please upload proof of address',
      section: 'requiredSection',
      view: function(_, X) {
        let forceIntoRO = X.data.mode === 'percent' && X.data.showFullOwnerDetails;
        var x = forceIntoRO ? X.createSubContext({ controllerMode: foam.u2.ControllerMode.VIEW }) : X;
        return foam.u2.view.DocumentUploadView.create({ data$: X.data.documentsOfAddress$ }, x);
      },
      validateObj: function(documentsOfAddress) {
        if ( documentsOfAddress.length === 0 ) {
          return this.PROOF_OF_ADDRESS;
        }
      },
      visibility: function(mode, showFullOwnerDetails) {
        return mode === 'percent' && ! showFullOwnerDetails ? foam.u2.DisplayMode.HIDDEN : foam.u2.DisplayMode.RW;
      }
    },
    {
      class: 'foam.nanos.fs.FileArray',
      name: 'documentsOfId',
      label: 'Please upload proof of identification',
      section: 'requiredSection',
      view: function(_, X) {
        let forceIntoRO = X.data.mode === 'percent' && X.data.showFullOwnerDetails;
        var x = forceIntoRO ? X.createSubContext({ controllerMode: foam.u2.ControllerMode.VIEW }) : X;
        return foam.u2.view.DocumentUploadView.create({ data$: X.data.documentsOfId$ }, x);
      },
      validateObj: function(documentsOfId) {
        if ( documentsOfId.length === 0 ) {
          return this.PROOF_OF_IDENTIFICATION;
        }
      },
      visibility: function(mode, showFullOwnerDetails) {
        return mode === 'percent' && ! showFullOwnerDetails ? foam.u2.DisplayMode.HIDDEN : foam.u2.DisplayMode.RW;
      },
    }
  ],

  methods: [
    function installInWizardlet(w) {
      this.cpf.installInWizardlet(w);
    },

    function fromUser(u) {
      var common = [
        'firstName', 'lastName', 'jobTitle', 'address',
        'email'
      ];
      for ( let p of common ) this[p] = u[p];
      return this;
    }
  ]
});
