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
  package: 'net.nanopay.model',
  name: 'BusinessDirector',
  documentation: `
    A business director is a person from a group of managers who leads or
    supervises a particular area of a company.
  `,

  imports: [
    'countryDAO'
  ],

  properties: [
    {
      name: 'type',
      hidden: true
    },
    {
      class: 'String',
      name: 'firstName',
      gridColumns: 6,
      minLength: 1
    },
    {
      class: 'String',
      name: 'lastName',
      gridColumns: 6,
      minLength: 1
    },
    {
      class: 'String',
      name: 'foreignId',
      label: 'RG/RNE:(National/Passport/Foreign ID)',
      required: true,
      visibility: function (type) {
        return type == 'BR' ?
        foam.u2.DisplayMode.RW :
        foam.u2.DisplayMode.HIDDEN;
      }
    },
    {
      class: 'String',
      name: 'cpf',
      required: true,
      visibility: function (type) {
        return type == 'BR' ?
        foam.u2.DisplayMode.RW :
        foam.u2.DisplayMode.HIDDEN;
      }
    },
    {
      class: 'Reference',
      targetDAOKey: 'countryDAO',
      name: 'nationality',
      of: 'foam.nanos.auth.Country',
      documentation: `Defined nationality of business director.`,
      required: true,
      visibility: function (type) {
        return type == 'BR' ?
        foam.u2.DisplayMode.RW :
        foam.u2.DisplayMode.HIDDEN;
      },
      view: function(_, X) {
        return {
          class: 'foam.u2.view.RichChoiceView',
          search: true,
          sections: [
            {
              heading: 'Countries',
              dao: X.countryDAO
            }
          ]
        };
      }
    }
  ]
});
