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
  package: 'net.nanopay.fx.lianlianpay.model',
  name: 'PreProcessResult',

  documentation: 'Represents a pre-process result',

  properties: [
    {
      class: 'FObjectProperty',
      of: 'net.nanopay.fx.lianlianpay.model.PreProcessResultSummary',
      name: 'summary',
      documentation: 'Summary information'
    },
    {
      class: 'FObjectArray',
      of: 'net.nanopay.fx.lianlianpay.model.PreProcessResultResponse',
      name: 'responses',
      documentation: 'Disbursement instruction pre-process response'
    }
  ]
});
