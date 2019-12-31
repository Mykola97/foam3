/**
 * @license
 * Copyright 2019 The FOAM Authors. All Rights Reserved.
 * http://www.apache.org/licenses/LICENSE-2.0
 */

foam.CLASS({
  package: 'net.nanopay.liquidity.ucjQuery',
  name: 'CachedUCJQueryService',
  documentation: 'A cached implementation of the UCJQueryService interface.',

  javaImports: [
    'java.util.ArrayList',
    'java.util.List',
    'java.util.Map',
    'foam.core.Detachable',
    'java.util.HashMap',
    'foam.core.FObject',
    'foam.dao.Sink',
    'foam.dao.ArraySink',
    'foam.dao.DAO',
    'foam.mlang.MLang',
    'foam.nanos.crunch.UserCapabilityJunction',
    'net.nanopay.liquidity.crunch.AccountTemplate',
    'net.nanopay.liquidity.crunch.ApproverLevel'
  ],

  properties: [
    {
      class: 'Map',
      name: 'cache',
      javaFactory: `
        Map<String,Map> cache = new HashMap<>();

        cache.put("getRolesCache", new HashMap<String,List>());
        cache.put("getUsersCache", new HashMap<String,List>());
        cache.put("getApproversByLevelCache", new HashMap<String,List>());
  
        return cache;
      `
    }
  ],

  methods: [
    {
      name: 'getRoles',
      type: 'List',
      async: true,
      javaThrows: ['java.lang.RuntimeException'],
      args: [
        {
          name: 'userId',
          type: 'Long'
        }
      ],
      javaCode: `
      String cacheKey = String.valueOf(userId);
      String cache = "getRolesCache";

      Map<String,List> getRolesCache = (Map<String,List>) getCache().get(cache);

      if ( ! getRolesCache.containsKey(cacheKey) ){
        Sink purgeSink = new Sink() {
          public void put(Object obj, Detachable sub) {
            purgeCache(cache, cacheKey);
            sub.detach();
          }
          public void remove(Object obj, Detachable sub) {
            purgeCache(cache, cacheKey);
            sub.detach();
          }
          public void eof() {
          }
          public void reset(Detachable sub) {
            purgeCache(cache, cacheKey);
            sub.detach();
          }
        };

        // TODO: PLZ FIX AFTER OPTIMIZATION TO ACCOUNT TEMPLATE
        DAO ucjDAO = (DAO) getX().get("userCapabilityJunctionDAO");

        List ucjsForUser = ((ArraySink) ucjDAO.where(MLang.EQ(UserCapabilityJunction.SOURCE_ID,userId)).select(new ArraySink())).getArray();
        List roleIdsForUser = new ArrayList();

        for ( int i = 0; i < ucjsForUser.size(); i++ ){
          UserCapabilityJunction currentUCJ = (UserCapabilityJunction) ucjsForUser.get(i);

          roleIdsForUser.add(currentUCJ.getTargetId());
        }

        getRolesCache.put(cacheKey, roleIdsForUser);

        ucjDAO.listen(purgeSink, MLang.TRUE);

        return roleIdsForUser;
      } else {
        return getRolesCache.get(cacheKey);
      }
      `
    },
    {
      name: 'getUsers',
      type: 'List',
      async: true,
      javaThrows: ['java.lang.RuntimeException'],
      args: [
        {
          name: 'roleId',
          type: 'String'
        }
      ],
      javaCode: `
      String cacheKey = roleId;
      String cache = "getUsersCache";

      Map<String, List> getUsersCache = (Map<String, List>) getCache().get(cache);

      if (! getUsersCache.containsKey(cacheKey)) {
        Sink purgeSink = new Sink() {
          public void put(Object obj, Detachable sub) {
            purgeCache(cache, cacheKey);
            sub.detach();
          }

          public void remove(Object obj, Detachable sub) {
            purgeCache(cache, cacheKey);
            sub.detach();
          }

          public void eof() {
          }

          public void reset(Detachable sub) {
            purgeCache(cache, cacheKey);
            sub.detach();
          }
        };


        // TODO: PLZ FIX AFTER OPTIMIZATION TO ACCOUNT TEMPLATE
        DAO ucjDAO = (DAO) getX().get("userCapabilityJunctionDAO");

        List ucjsForRole = ((ArraySink) ucjDAO.where(MLang.EQ(UserCapabilityJunction.TARGET_ID, roleId)).select(new ArraySink())).getArray();
        List userIdsForRole = new ArrayList();

        for (int i = 0; i < ucjsForRole.size(); i++) {
          UserCapabilityJunction currentUCJ = (UserCapabilityJunction) ucjsForRole.get(i);

          userIdsForRole.add(currentUCJ.getSourceId());
        }

        getUsersCache.put(cacheKey, userIdsForRole);

        ucjDAO.listen(purgeSink, MLang.TRUE);

        return userIdsForRole;

      } else {
        return getUsersCache.get(cacheKey);
      }
      `
    },
    {
      name: 'getApproversByLevel',
      type: 'List',
      async: true,
      javaThrows: ['java.lang.RuntimeException'],
      args: [
        {
          name: 'roleId',
          type: 'String'
        },
        {
          name: 'level',
          type: 'Integer'
        }
      ],
      javaCode: `
      String cacheKey = 'r' + roleId + 'l' + level;
      String cache = "getApproversByLevelCache";

      Map<String, List> getApproversByLevelCache = (Map<String, List>) getCache().get(cache);

      if (! getApproversByLevelCache.containsKey(cacheKey)) {
        Sink purgeSink = new Sink() {
          public void put(Object obj, Detachable sub) {
            purgeCache(cache, cacheKey);
            sub.detach();
          }

          public void remove(Object obj, Detachable sub) {
            purgeCache(cache, cacheKey);
            sub.detach();
          }

          public void eof() {
          }

          public void reset(Detachable sub) {
            purgeCache(cache, cacheKey);
            sub.detach();
          }
        };

        // TODO: PLZ FIX AFTER OPTIMIZATION TO ACCOUNT TEMPLATE
        DAO ucjDAO = (DAO) getX().get("userCapabilityJunctionDAO");

        List ucjsForApprovers = ((ArraySink) ucjDAO.where(MLang.EQ(UserCapabilityJunction.TARGET_ID, roleId)).select(new ArraySink())).getArray();
        List approverIdsForLevel = new ArrayList();

        for (int i = 0; i < ucjsForApprovers.size(); i++) {
          UserCapabilityJunction currentUCJ = (UserCapabilityJunction) ucjsForApprovers.get(i);

          ApproverLevel approverLevel = (ApproverLevel) currentUCJ.getData();

          if (approverLevel.getApproverLevel() == level) approverIdsForLevel.add(currentUCJ.getSourceId());
        }

        return approverIdsForLevel;

      } else {
        return getApproversByLevelCache.get(cacheKey);
      }
      `
    },
    {
      name: 'purgeCache',
      type: 'void',
      args: [
        {
          name: 'cache',
          type: 'String'
        },
        {
          name: 'cacheKey',
          type: 'String'
        }
      ],
      javaCode: `
      Map<String,List> cacheMap = (HashMap<String,List>) getCache().get(cache);

      cacheMap.remove(cacheKey);
      `
    }
  ]
});
