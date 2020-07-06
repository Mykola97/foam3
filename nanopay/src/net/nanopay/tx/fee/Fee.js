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
  name: 'Fee',

  documentation: 'Describes the fee type.',

  sections: [
    {
      name: 'basicInfo',
      title: 'Basic Info'
    },
    {
      name: '_defaultSection',
      title: 'Administrative',
      permissionRequired: true
    }
  ],

  tableColumns: [
    'id',
    'name',
    'label',
    'formula'
  ],

  properties: [
    {
      class: 'String',
      name: 'id',
      visibility: 'RO'
    },
    {
      class: 'String',
      name: 'name',
      validationPredicates: [
        {
          args: ['name'],
          predicateFactory: function(e) {
            return e.REG_EXP(net.nanopay.tx.fee.Fee.NAME, /^[a-zA-Z]+[\_a-zA-Z0-9]*$/);
          },
          errorString: 'Invalid name.'
        }
      ],
      required: true,
      section: 'basicInfo'
    },
    {
      class: 'String',
      name: 'label',
      label: 'Display Name',
      section: 'basicInfo'
    },
    {
      class: 'foam.core.Enum',
      of: 'net.nanopay.tx.fee.FeeType',
      name: 'type',
      documentation: 'Determines fee type.',
      value: 'SENDING',
      section: 'basicInfo',
      visibility: 'HIDDEN'    // not being used in FeeEngine
    },
    {
      name: 'isPassThroughFee',
      class: 'Boolean',
      value: false,
      section: 'basicInfo',
      visibility: 'HIDDEN'    // not being used in FeeEngine
    },
    {
      class: 'foam.mlang.ExprProperty',
      name: 'formula',
      view: { class: 'foam.u2.view.JSONTextView' },
      tableCellFormatter: function(value) {
        this.add(value.toString());
      }
    },
    {
      class: 'foam.mlang.predicate.PredicateProperty',
      name: 'predicate',
      view: { class: 'foam.u2.view.JSONTextView' },
      factory: function () {
        return foam.mlang.predicate.True.create();
      },
      javaFactory: 'return foam.mlang.MLang.TRUE;'
    }
  ],

  methods: [
    {
      name: 'getFee',
      type: 'Long',
      args: [
        { name: 'obj', type: 'FObject' }
      ],
      javaCode: `
        if ( getFormula() != null ) {
          var result = getFormula().f(obj);
          if ( result instanceof Number ) {
            return ((Number) result).longValue();
          }
        }
        return 0l;
      `
    },
    {
      name: 'getRate',
      type: 'java.lang.Number',
      args: [
        { name: 'obj', type: 'FObject' }
      ],
      javaCode: 'return getFee(obj);'
    },
    {
      name: 'toString',
      type: 'String',
      javaCode: `
        var sb = new StringBuilder();
        sb.append(getClass().getSimpleName())
          .append(" id:").append(getId())
          .append(", name:").append(getName());

        if ( getFormula() != null ) {
          sb.append(", formula:").append(getFormula().toString());
        }
        return sb.toString();
      `
    }
  ]
 });
