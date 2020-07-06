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
  package: 'net.nanopay.tx.fee',
  name: 'InformationalFee',
  extends: 'net.nanopay.tx.fee.Fee',

  messages: [
    { name: 'FORMULA_PREFIX', message: 'Informational fee' }
  ],

  properties: [
    'name',
    'label',
    {
      class: 'Long',
      name: 'amount',
      section: 'basicInfo'
    },
    {
      class: 'foam.core.Enum',
      of: 'net.nanopay.tx.fee.FeeType',
      name: 'type',
      value: 'INFORMATIONAL'
    },
    {
      name: 'formula',
      visibility: 'HIDDEN',
      tableCellFormatter: function(_, obj) {
        var formattedAmount = obj.amount / 100;
        this.add(obj.FORMULA_PREFIX, ': $', ctrl.addCommas(formattedAmount.toFixed(2)));
      }
    }
  ],

  methods: [
    {
      name: 'getFee',
      args: [
        {
          name: 'obj',
          type: 'FObject',
        }
      ],
      type: 'Long',
      javaCode: ' return this.getAmount(); ',
      swiftCode: ' return amount ',
      code: function() {
        return this.amount;
      }
    }
  ]
});
