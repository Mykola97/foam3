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

/**
 * @license
 * Copyright 2019 The FOAM Authors. All Rights Reserved.
 * http://www.apache.org/licenses/LICENSE-2.0
 */

// TODO: This should be generated automatically
foam.CLASS({
  package: 'net.nanopay.liquidity.ucjQuery.referencespec',
  name: 'ReferenceSpecPropertyView',
  extends: 'foam.u2.view.ModeAltView',

  documentation: 'A view for foam.core.ReferenceSpec properties.',

  properties: [
    [ 'readView', { class: 'net.nanopay.liquidity.ucjQuery.referencespec.ReadWeakReferenceView' } ],
    [ 'writeView', { class: 'net.nanopay.liquidity.ucjQuery.referencespec.WeakReferenceView' } ]
  ],
});

