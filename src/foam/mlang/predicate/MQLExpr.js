/**
 * @license
 * Copyright 2017 The FOAM Authors. All Rights Reserved.
 * http://www.apache.org/licenses/LICENSE-2.0
 */

foam.CLASS({
  package: 'foam.mlang.predicate',
  name: 'MQLExpr',
  extends: 'foam.mlang.predicate.AbstractPredicate',
  implements: [ 'foam.core.Serializable' ],

  documentation: `Stores mql query as a property and converts it into predicate when f() is called.`,

  javaImports: [
    'foam.core.ClassInfo',
    'foam.core.FObject',
    'foam.lib.parse.PStream',
    'foam.lib.parse.ParserContext',
    'foam.lib.parse.ParserContextImpl',
    'foam.lib.parse.StringPStream',
    'foam.mlang.Constant',
    'foam.parse.QueryParser',
    'java.util.Map',
    'java.util.concurrent.ConcurrentHashMap'
  ],

  javaCode: `
    protected final static Map map__ = new ConcurrentHashMap();
    public static MQLExpr create(String query) {
      MQLExpr p = (MQLExpr) map__.get(query);

      if ( p == null ) {
        p = new MQLExpr();
        p.setQuery(query);
        map__.put(query, p);
      }

      return p;
    }
 `,

  axioms: [
    foam.pattern.Multiton.create({property: 'query'})
  ],

  properties: [
    {
      class: 'Map',
      name: 'specializations_',
      transient: true,
      factory: function() { return {}; },
      javaFactory: 'return new java.util.concurrent.ConcurrentHashMap<ClassInfo, foam.mlang.predicate.Predicate>();'
    },
    {
      class: 'String',
      name: 'query'
    }
  ],

  methods: [
    {
      name: 'f',
      code: function(o) {
        return this.specialization(o.model_).f(o);
      },
      javaCode: `
        if ( ! ( obj instanceof FObject ) )
          return false;

        return specialization(((FObject)obj).getClassInfo()).f(obj);
      `
    },
    {
      name: 'specialization',
      args: [ { name: 'model', type: 'ClassInfo' } ],
      type: 'Predicate',
      code: function(model) {
        return this.specializations_[model.name] ||
          ( this.specializations_[model.name] = this.specialize(model) );
      },
      javaCode: `
        if ( getSpecializations_().get(model) == null ) getSpecializations_().put(model, specialize(model));
        return (Predicate) getSpecializations_().get(model);
      `
    },
    {
      name: 'specialize',
      args: [ { name: 'model', type: 'ClassInfo' } ],
      type: 'Predicate',
      code: function(model) {
        var qp = foam.parse.QueryParser.create({of: model.id});
        var pred = qp.parseString(this.query);
        return pred ? pred.partialEval() : foam.mlang.predicate.False.create();
      },
      javaCode: `
        QueryParser parser = new QueryParser(model);
        StringPStream sps = new StringPStream();
        sps.setString(getQuery());
        PStream ps = sps;
        ParserContext x = new ParserContextImpl();
        x.set("X", getX());
        ps = parser.parse(ps, x);
        if (ps == null)
          return new False();

        return ((foam.mlang.predicate.Nary) ps.value()).partialEval();
      `
    },
    {
      name: 'toString',
      code: function toString() {
        return '(' + this.query + ')';
      },
      javaCode: `
        return "(" + getQuery() + ")";
      `
    }
  ]
});
