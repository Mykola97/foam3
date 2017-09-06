
foam.CLASS({
  package: 'net.nanopay.interac.ui.modals',
  name: 'ExportModal',
  extends: 'foam.u2.View',

  documentation: 'Export Modal',

  requires: [
    'net.nanopay.b2b.ui.modals.ModalHeader'
  ],

  properties: [
    {
      name: 'purpose',
      view: {
        class: 'foam.u2.view.ChoiceView',
        choices: [
          'XML',
          'JSON',
          'PACS 008'
        ],
      },
      // factory: function() {
      //   this.viewData.purpose = 'General';
      //   return 'General';
      // },
      // postSet: function(oldValue, newValue) {
      //   switch(newValue) {
      //     case 'General' :
      //       this.viewData.purpose = 'General';
      //       break;
      //     case 'Other' :
      //       this.viewData.purpose = 'Other';
      //       break;
      //   }
      // }
    },
  ],

  axioms: [
    foam.u2.CSS.create({
      code: function CSS() {/*

      ^{
        width: 448px;
        margin: auto;
      }

      ^ .payNow-Container{
        width: 448px;
        height: 40.8px;
        background-color: #093649;
      }

      ^ .payNow-Text{
        width: 57px;
        height: 40px;
        font-family: Roboto;
        font-size: 14px;
        line-height: 2.86;
        letter-spacing: 0.2px;
        text-align: left;
        color: #ffffff;
        margin-left: 19px;
        margin-right: 332px;
        display: inline-block;
      } 
      
      ^ .amount-Text{
        width: 51px;
        height: 16px;
        font-family: Roboto;
        font-size: 14px;
        font-weight: bold;
        letter-spacing: 0.2px;
        text-align: left;
        color: #093649;
        margin-left: 20px;
        margin-bottom: 20px;
        margin-right: 75px;
        display: inline-block;
      }

      ^ .paymentMethod-Text{
        width: 165px;
        height: 16px;
        font-family: Robotol
        font-size: 14px;
        font-weight: 300;
        letter-spacing: 0.2px;
        text-align: left;
        color: #093649;
        margin-right: 263px;
        margin-left: 20px;
        margin-bottom: 8px;
        margin-top: 15px;
      }

      ^ .note-Text{
        width: 31px;
        height: 16px;
        font-family: Roboto;
        font-size: 14px;
        font-weight: 300;
        letter-spacing: 0.2px;
        text-align: left;
        color: #093649;
        margin-bottom: 8px;
        margin-left: 20px;
      }

      ^ .Input-Box{
        width: 408px;
        height: 60px;
        background-color: #ffffff;
        border: solid 1px rgba(164, 179, 184, 0.5);
        margin-left: 20px;
        margin-right: 20px;
        margin-bottom: 10px;
        margin-top: 5px;
        padding-left: 5px;
        padding-right: 5px;
        font-size: 12px;
        font-weight: 300;
        letter-spacing: 0.2px;
        font-family: Roboto;
        color: #093649;
        text-align: left;
      }

      ^ .payNow-Button{
        width: 135px;
        height: 40px;
        border-radius: 2px;
        background-color: #59aadd;
        cursor: pointer;
        text-align: center;
        color: #ffffff;
        font-family: Roboto;
        font-size: 14px;
        line-height: 2.86;
        letter-spacing: 0.2px;
        margin-top: 5px;
        margin-left: 293px;
        margin-right: 20px;
        margin-bottom: 20px;
      }

      ^ .purposeContainer {
        position: relative;
        margin-bottom: 20px;
      }

      ^ .foam-u2-tag-Select {
        width: 125px;
        height: 40px;
        border-radius: 0;
        margin-left: 20px;

        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;

        padding: 12px 20px;
        border: solid 1px rgba(164, 179, 184, 0.5);
        background-color: white;
        outline: none;
      }

      ^ .foam-u2-tag-Select:hover {
        cursor: pointer;
      }

      ^ .foam-u2-tag-Select:focus {
        border: solid 1px #59A5D5;
      }

      ^ .caret {
        position: relative;
      }

      ^ .caret:before {
        content: '';
        position: absolute;
        top: -22px;
        left: 125px;
        border-top: 7px solid #a4b3b8;
        border-left: 7px solid transparent;
        border-right: 7px solid transparent;
      }

      ^ .caret:after {
        content: '';
        position: absolute;
        left: 12px;
        top: 0;
        border-top: 0px solid #ffffff;
        border-left: 0px solid transparent;
        border-right: 0px solid transparent;
      }
      ^ .foam-u2-ActionView-convertInvoice{
        position: relative;
        top: -40px;
        width: 125px;
        cursor: pointer;
        opacity: 0.01;
      }
    */}
    })
  ],
  
  methods: [
    function initE(){
      this.SUPER();
      var self = this;
      
      this
      .tag(this.ModalHeader.create({
        title: 'Export'
      }))
      .addClass(this.myClass())
        .start()
          .start().addClass('paymentMethod-Text').add("Data Type").end()
          .start('div').addClass('purposeContainer')
            .tag(this.PURPOSE)
            .start('div').addClass('caret').end()
          .end()
          .start().addClass('note-Text').add("Note").end()
          .start('input').addClass('Input-Box').end()
          .start().addClass('payNow-Button').add('Export').add(this.CONVERT_INVOICE).end()
        .end()
      .end()
    } 
  ],

  actions: [
    function convertInvoice(){
      //CALL CONVERSION
    }
  ]
})