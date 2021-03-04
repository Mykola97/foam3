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
  package: 'net.nanopay.approval',
  name: 'AuthenticatedApprovalDAO',
  extends: 'foam.dao.ProxyDAO',

  javaImports: [
    'foam.core.X',
    'foam.core.FObject',
    'foam.dao.*',
    'foam.mlang.order.Comparator',
    'foam.mlang.predicate.Predicate',
    'foam.nanos.auth.*',
    'foam.util.SafetyUtil',
    'foam.nanos.approval.ApprovalRequest',
    
    'static foam.mlang.MLang.EQ'
  ],

  constants: [
    {
      name: 'GLOBAL_APPROVAL_READ',
      type: 'String',
      value: 'approval.read.*'
    },
    {
      name: 'GLOBAL_APPROVAL_UPDATE',
      type: 'String',
      value: 'approval.update.*'
    },
    {
      name: 'GLOBAL_APPROVAL_REMOVE',
      type: 'String',
      value: 'approval.remove.*'
    }
  ],

  axioms: [
    {
      name: 'javaExtras',
      buildJavaClass: function(cls) {
        cls.extras.push(`
          public AuthenticatedApprovalDAO(X x, DAO delegate) {
            setDelegate(delegate);
            setX(x);
          }  
        `
        );
      }
    }
  ],

  methods: [
    {
      name: 'put_',
      javaCode: `
        ApprovalRequest approvalRequest = (ApprovalRequest) obj;
        Long userId = ((Subject) x.get("subject")).getUser().getId();
        AuthService authService = (AuthService) x.get("auth");
        DAO approvalRequestDAO = (DAO) x.get("approvalRequestDAO");
        ApprovalRequest currentApprovalRequestInDAO = (ApprovalRequest) approvalRequestDAO.find(approvalRequest.getId());

        if ( 
          ! authService.check(x, GLOBAL_APPROVAL_UPDATE) &&
          ! SafetyUtil.equals(approvalRequest.getApprover(), userId) &&
          ! ( 
            SafetyUtil.equals(approvalRequest.getCreatedBy(), userId) &&
            currentApprovalRequestInDAO == null
          )
        ){
          throw new AuthorizationException();
        }

        return super.put_(x, obj);
      `
    },
    {
      name: 'find_',
      javaCode: `
        ApprovalRequest ret = (ApprovalRequest) super.find_(x, id);
        if ( ret != null ) {
          long currentUserId = ((Subject) x.get("subject")).getUser().getId();
          AuthService authService = (AuthService) x.get("auth");

          if ( ! authService.check(x, GLOBAL_APPROVAL_READ) && ! SafetyUtil.equals(currentUserId, ret.getApprover()) ) {
            throw new AuthorizationException();
          }
        }

        return ret;
      `
    },
    {
      name: 'select_',
      javaCode: `
        User user = ((Subject) x.get("subject")).getUser();
        AuthService auth = (AuthService) x.get("auth");

        if ( user == null ) {
          throw new AuthenticationException();
        }

        boolean global = auth.check(x, GLOBAL_APPROVAL_READ);
        DAO dao = global ? getDelegate() : getDelegate().where(EQ(ApprovalRequest.APPROVER, user.getId()));
        return dao.select_(x, sink, skip, limit, order, predicate);
      `
    },
    {
      name: 'remove_',
      javaCode: `
        AuthService auth = (AuthService) x.get("auth");

        if ( ! auth.check(x, GLOBAL_APPROVAL_REMOVE) ) {
          throw new AuthenticationException();
        }
        return getDelegate().remove_(x, obj);
      `
    }
  ]
});

