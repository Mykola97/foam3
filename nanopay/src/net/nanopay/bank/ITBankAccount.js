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
  package: 'net.nanopay.bank',
  name: 'ITBankAccount',
  label: 'Italy',
  extends: 'net.nanopay.bank.EUBankAccount',

  documentation: 'Italian bank account information.',

  javaImports: [
    'foam.core.ValidationException',
    'foam.util.SafetyUtil'
  ],

  constants: [
    {
      name: 'INSTITUTION_NUMBER_PATTERN',
      type: 'Regex',
      value: /^\d{5}$/
    },
    {
      name: 'BRANCH_ID_PATTERN',
      type: 'Regex',
      value: /^\d{5}$/
    },
    {
      name: 'ACCOUNT_NUMBER_PATTERN',
      type: 'Regex',
      value: /^[a-zA-Z0-9]{12}$/
    },
    {
      name: 'ROUTING_CODE_PATTERN',
      type: 'Regex',
      value: /^(\d{5})(\d{5})$/
    }
  ],

  properties: [
    {
      name: 'country',
      value: 'IT',
      visibility: 'RO'
    },
    {
      name: 'flagImage',
      label: '',
      value: 'images/flags/italy.svg',
      visibility: 'RO'
    },
    {
      name: 'denomination',
      section: 'accountInformation',
      gridColumns: 12,
      value: 'EUR',
    },
    {
      name: 'institutionNumber',
      updateVisibility: 'RO',
      validateObj: function(institutionNumber, iban) {
        if ( iban )
          var ibanMsg = this.ValidationIBAN.create({}).validate(iban);

        if ( ! iban || (iban && ibanMsg != 'passed') ) {
          if ( institutionNumber === '' ) {
            return this.INSTITUTION_NUMBER_REQUIRED;
          } else if ( ! INSTITUTION_NUMBER_PATTERN.test(institutionNumber) ) {
            return this.INSTITUTION_NUMBER_INVALID;
          }
        }
      }
    },
    {
      name: 'accountNumber',
      updateVisibility: 'RO',
      preSet: function(o, n) {
        return /^[\d\w]*$/.test(n) ? n : o;
      },
      tableCellFormatter: function(str, obj) {
        if ( ! str ) return;
        var displayAccountNumber = obj.mask(str);
        this.start()
          .add(displayAccountNumber);
        this.tooltip = displayAccountNumber;
      },
      validateObj: function(accountNumber, iban) {
        if ( iban )
          var ibanMsg = this.ValidationIBAN.create({}).validate(iban);

        if ( ! iban || (iban && ibanMsg != 'passed') ) {
          if ( accountNumber === '' ) {
            return this.ACCOUNT_NUMBER_REQUIRED;
          } else if ( ! ACCOUNT_NUMBER_PATTERN.test(accountNumber) ) {
            return this.ACCOUNT_NUMBER_INVALID;
          }
        }
      }
    },
    {
      name: 'desc',
      visibility: 'HIDDEN'
    },
    {
      name: 'branchId',
      visibility: 'HIDDEN'
    },
    {
      name: 'bankRoutingCode',
      javaPostSet: `
        if ( ! SafetyUtil.isEmpty(val) ) {
          var matcher = ROUTING_CODE_PATTERN.matcher(val);
          if ( matcher.find() ) {
            var institutionNumber = matcher.group(1);
            var branchId = matcher.group(2);

            // Update institution and branch
            clearInstitution();
            clearBranch();
            setInstitutionNumber(institutionNumber);
            setBranchId(branchId);
          }
        }
      `
    }
  ],

  methods: [
    {
      name: 'validate',
      javaCode: `
        super.validate(x);

        var accountNumber = this.getAccountNumber();
        if ( SafetyUtil.isEmpty(accountNumber) ) {
          throw new ValidationException(this.ACCOUNT_NUMBER_REQUIRED);
        }
        if ( ! ACCOUNT_NUMBER_PATTERN.matcher(accountNumber).matches() ) {
          throw new ValidationException(this.ACCOUNT_NUMBER_INVALID);
        }

        if ( SafetyUtil.isEmpty(getSwiftCode()) ) {
          var institutionNumber = this.getInstitutionNumber();
          if ( SafetyUtil.isEmpty(institutionNumber) ) {
            throw new ValidationException(this.INSTITUTION_NUMBER_REQUIRED);
          }
          if ( ! INSTITUTION_NUMBER_PATTERN.matcher(institutionNumber).matches() ) {
            throw new ValidationException(this.INSTITUTION_NUMBER_INVALID);
          }

          var branchId = this.getBranchId();
          if ( SafetyUtil.isEmpty(branchId) ) {
            throw new ValidationException(this.BRANCH_ID_REQUIRED);
          }
          if ( ! BRANCH_ID_PATTERN.matcher(branchId).matches() ) {
            throw new ValidationException(this.BRANCH_ID_INVALID);
          }
        }
      `
    }
  ]
});
