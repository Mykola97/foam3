/**
  * @license
  * Copyright 2021 The FOAM Authors. All Rights Reserved.
  * http://www.apache.org/licenses/LICENSE-2.0
  */

foam.CLASS({
  package: 'foam.u2.view',
  name: 'SimpleIntervalScheduleView',
  extends: 'foam.u2.View',

  requires: [
    'foam.u2.detail.SectionedDetailPropertyView',
    'foam.u2.layout.Grid',
    'foam.u2.layout.GUnit'
  ],
  imports: ['displayWidth?'],
  css: `
    ^ {
      width: 100%;
      display: flex;
      align-self: center;
    }
    ^container {
      display: grid;
      gap: 12px 8px;
    }
    ^fullWidth {
      grid-column: span 12;
    }
    ^halfWidth {
      grid-column: span 6;
    }
  `,

  properties: [
    'data',
  ],
  methods: [
    function render() {
      var self = this;
      let data = this.data;
      var el = this.E().style(
        { 'grid-template-columns': this.displayWidth$.map(dw => {
            dw = dw || foam.u2.layout.DisplayWidth.XL;
            return `repeat(${dw.cols}, 1fr)`;
          })
        }
      ).addClass(this.myClass('container'));
      this
      .addClass()
      .start()
        .style(
          { 'grid-template-columns': this.displayWidth$.map(dw => {
              dw = dw || foam.u2.layout.DisplayWidth.XL;
              return `repeat(${dw.cols}, 1fr)`;
            })
          }
        ).addClass(this.myClass('container'))
        .start(data.START_DATE.__).addClass(this.myClass('fullWidth')).end()
        .start(data.REPEAT.__).addClass(this.myClass('halfWidth')).end()
        .start(data.FREQUENCY.__).addClass(this.myClass('halfWidth')).end()
        .add(this.slot(function(data$frequency) {
          if ( data$frequency == 'WEEK' )
            return this.E().add(data.DAY_OF_WEEK.__).addClass(this.myClass('fullWidth'));
          if ( data$frequency == 'MONTH' )
            return self.addGrid().addClass(this.myClass('fullWidth'))
              .start(data.MONTHLY_CHOICE.__).addClass(this.myClass('fullWidth')).end()
              .start()
                .addClass(this.myClass('fullWidth'))
                .add(this.slot(function(data$monthlyChoice) {
                  if ( ! data$monthlyChoice ) return this.E().show(false);
                  if ( data$monthlyChoice == 'EACH' )
                    return this.E().add(data.DAY_OF_MONTH.__);
                  return self.addGrid()
                    .start(data.SYMBOLIC_FREQUENCY.__).addClass(this.myClass('halfWidth')).end()
                    .start(data.EXPANDED_DAY_OF_WEEK.__).addClass(this.myClass('halfWidth')).end();
                }))
              .end();
          return this.E().show(false);
        }))
        .start(data.ENDS.__).addClass(this.myClass('halfWidth')).end()
        .start().addClass(this.myClass('halfWidth')).add(this.slot(function(data$ends) {
          return data$ends ? (data$ends == foam.nanos.cron.ScheduleEnd.ON ? self.data.ENDS_ON.__ : self.data.ENDS_AFTER.__) : '';
        })).end()
      .end();
    },
    function addGrid() {
      return this.E().style(
        { 'grid-template-columns': this.displayWidth$.map(dw => {
            dw = dw || foam.u2.layout.DisplayWidth.XL;
            return `repeat(${dw.cols}, 1fr)`;
          })
        }
      ).addClass(this.myClass('container'));
    }
  ]
});

