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
 * Copyright 2018 The FOAM Authors. All Rights Reserved.
 * http://www.apache.org/licenses/LICENSE-2.0
 */
foam.CLASS({
  package: 'net.nanopay.tx',
  name: 'ExpiryLineItem',
  extends: 'net.nanopay.tx.InfoLineItem',

  properties: [
    {
      documentation: 'A Transaction may depend on an FX Quote for example which is only valid for some time window.',
      name: 'expiry',
      label: 'Expires',
      class: 'DateTime',
      tableCellFormatter: function(expiry, X) {
        var self = this;
        this
          .start()
          .add('$', self.formatTime(expires - Date.now()))
          .end();
      }
    }
  ]
});
