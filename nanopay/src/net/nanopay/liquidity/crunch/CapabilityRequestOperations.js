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

foam.ENUM({
  package: 'net.nanopay.liquidity.crunch',
  name: 'CapabilityRequestOperations',

  values: [
    {
      name: 'ASSIGN_ACCOUNT_BASED',
      label: 'Assign Transactional Role',
    },
    {
      name: 'ASSIGN_GLOBAL',
      label: 'Assign Admin Role',
    },
    /** Hiding revoking for liquid demo
    {
      name: 'REVOKE_ACCOUNT_BASED',
      label: 'Revoke Transactional Role',
    },
    {
      name: 'REVOKE_GLOBAL',
      label: 'Revoke Admin Role',
    }
    */
  ]
});
  