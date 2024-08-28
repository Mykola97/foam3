/**
 * @license
 * Copyright 2017 The FOAM Authors. All Rights Reserved.
 * http://www.apache.org/licenses/LICENSE-2.0
 */

foam.CLASS({
  package: 'foam.mlang',
  name: 'Days',
  extends: 'foam.mlang.AbstractExpr',
  documentation: 'Return the number of calendar days since the specified date.',

/*
  implements: [
    'foam.core.Serializable'
  ],
  */

  javaImports:[
    'java.time.LocalDate',
    'java.time.ZoneId',
    'java.time.temporal.ChronoUnit',
    'java.util.Date'
  ],

  properties: [
    {
      class: 'foam.mlang.ExprProperty',
      name: 'arg1'
    }
  ],

  methods: [
    {
      type: 'FObject',
      name: 'fclone',
      javaCode: 'return this;'
    },
    {
      name: 'f',
      code: function f(obj) {
        var millisecondsPerDay = 24 * 60 * 60 * 1000;
        var from = this.arg1.f(obj);
        var now = new Date(Date.now());
        from.setMinutes(from.getMinutes() - from.getTimezoneOffset());
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());

        var days = Math.floor(Math.abs(now - from) / millisecondsPerDay);
        return days;
      },
      javaCode: `
        LocalDate d = LocalDate.ofInstant(((Date) getArg1().f(obj)).toInstant(), ZoneId.systemDefault());
        return ChronoUnit.DAYS.between(d, LocalDate.now());
      `
    },
    {
      name: 'toString',
      type: 'String',
      code: function() { return 'DAYS(\'' + this.arg1.toString() + '\')'; },
      javaCode: ' return "DAYS(\'" + getArg1() + "\')"; '
    }
  ]
});
