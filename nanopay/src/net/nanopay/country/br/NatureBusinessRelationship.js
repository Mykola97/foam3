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
  package: 'net.nanopay.country.br',
  name: 'NatureBusinessRelationship',

  documentation: `Nature of Business Relationship with a Brazilian Brokerage Exchange`,

  sections: [
    {
      name: 'businessRelationship',
      title: 'Nature of Business Relationship'
    }
  ],

  messages: [
    { name: 'PLACE_HOLDER', message: 'Please select...' },
    { name: 'BUSINESS_TYPE_ERROR', message: 'Please select one of Nature Business Relationship' },
  ],

  properties: [
    {
      section: 'businessRelationship',
      class: 'String',
      name: 'NatureOfBusinessRelationship',
      label:'Nature of Business Relationship with a Brazilian Brokerage Exchange',
      view: function(_, X) {
        return {
          class: 'foam.u2.view.ChoiceView',
          placeholder: X.data.PLACE_HOLDER,
          choices: [
            'Intermediação Brokerage',
            'Compra / Venda Moeda Estrangeira (Buy / Sell Foreign Currency)',
            'Cartão Pré - Pago Prepaid Card',
            'Remessas internacionais (International Remittances)',
            'Western Union'
          ]
        };
      },
      validationPredicates: [
        {
          args: ['NatureOfBusinessRelationship'],
          predicateFactory: function(e) {
            return e.GT(
              foam.mlang.StringLength.create({
                arg1: net.nanopay.country.br.NatureBusinessRelationship.NATURE_OF_BUSINESS_RELATIONSHIP
              }), 0);
          },
          errorMessage: 'BUSINESS_TYPE_ERROR'
        }
      ]
    },
  ],
});

