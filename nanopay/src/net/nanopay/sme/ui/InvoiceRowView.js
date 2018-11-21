foam.CLASS({
  package: 'net.nanopay.sme.ui',
  name: 'InvoiceRowView',
  extends: 'foam.u2.View',

  documentation: `
    A single row in a list of invoices.

    USAGE:

      properties: [
        ...
        {
          class: 'foam.dao.DAOProperty',
          name: 'myDAO'
        }
        ...
      ]

      initE() {
        ...
        .select(this.myDAO$proxy, function(invoice) {
          return this.E().start({
            class: 'net.nanopay.sme.ui.InvoiceRowView',
            data: invoice
          })
            .on('click', function() {
              // Do something with the invoice if you want.
            })
          .end();
        })
        ...
      }
  `,

  imports: [
    'user',
    'stack',
    'notificationDAO'
  ],

  requires: [
    'net.nanopay.invoice.model.InvoiceStatus',
    'foam.nanos.notification.Notification',
    'foam.u2.dialog.NotificationMessage'
  ],

  css: `
    ^ {
      cursor: pointer;
      box-shadow: 0 1px 1px 0 #dae1e9;
      background: white;
      border-bottom: 1px solid #e2e2e3;
      padding: 12px 24px;
    }

    ^row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 4px;
      min-height: 27px;
    }

    ^ .quick-action-button {
      cursor: pointer;
      font-size: 10px;
      color: #604aff;
      background: white;
      border: 1px solid #604aff;
      border-radius: 4px;
      width: 70px;
      height: 24px;
    }

    ^ .quick-action-button:hover {
        color: white;
        background: #604aff;;
      }

    ^.min-height-row {
      min-height: 27px;
    }
  `,

  properties: [
    {
      name: 'INVOICE_STATUS_FOR_QUICK_ACTION',
      factory: function() {
        return [this.InvoiceStatus.UNPAID, this.InvoiceStatus.OVERDUE];
      }
    },
    {
      class: 'FObjectProperty',
      of: 'net.nanopay.invoice.model.Invoice',
      name: 'data',
      documentation: 'Set this to the invoice you want to display in this row.'
    },
    {
      class: 'String',
      name: 'currencyFormatted',
      value: '...',
      documentation: `Used internally to show the formatted currency value.`
    },
    {
      name: 'isMouseover',
      class: 'Boolean',
      value: false
    },
    {
      name: 'showQuickAction',
      expression: function(isMouseover, data, INVOICE_STATUS_FOR_QUICK_ACTION) {
        return isMouseover && INVOICE_STATUS_FOR_QUICK_ACTION
          .indexOf(data.status) != -1;
      }
    },
    {
      name: 'isPayable',
      expression: function(data, user) {
        return data.payerId === user.id;
      }
    }
  ],

  messages: [
    { name: 'REMINDER_SENT_SUCCESSFULLY', message: 'Reminder was successfully sent to ${0}.' },
    { name: 'REMINDER_ERROR_MESSAGE', message: 'An error occurred while sending a reminder to ${0}' }
  ],

  methods: [
    function initE() {
      var label = this.data.payeeId === this.user.id ?
        this.data.payer.businessName || this.data.payer.label() :
        this.data.payee.businessName || this.data.payee.label();
      var dueDateFormatted = this.data.dueDate ?
        'Due ' + this.data.dueDate.toISOString().slice(0, 10) :
        '';

      this.data.destinationCurrency$find.then((currency) => {
        this.currencyFormatted = currency.format(this.data.amount) + ' ' +
          currency.alphabeticCode;
      });

      this
        .addClass(this.myClass())
          .on('mouseover', () => this.isMouseover = true)
          .on('mouseout', () => this.isMouseover = false)
          .start()
            .addClass(this.myClass('row'))
            .start('span').add(label).end()
            .start('span')
              .call(
                this.data.STATUS.tableCellFormatter.f,
                [this.data.status, this.data]
              )
            .end()
          .end()
          .start()
            .addClass(this.myClass('row')).addClass('min-height-row')
            .start('span').add(this.currencyFormatted$).end()
            .start()
              .start().show(this.showQuickAction$)
                .start('button').addClass('quick-action-button')
                  .add(this.isPayable ? 'Pay Now' : 'Remind')
                  .on('click', (e) => this.isPayable ? this.payNow(e) : this.remind(e))
                .end()
              .end()
              .start().hide(this.showQuickAction$).add(dueDateFormatted).end()
            .end()
        .end();
    },

    function payNow(event) {
      event.preventDefault();
      event.stopPropagation();
      this.stack.push({
        class: 'net.nanopay.sme.ui.SendRequestMoney',
        isPayable: this.isPayable,
        isForm: false,
        isDetailView: true,
        hasSaveOption: false,
        invoice: this.data
      });
    },

    async function remind(event) {
      event.preventDefault();
      event.stopPropagation();

      var notification = this.Notification.create();
      notification.emailIsEnabled = true;
      // TODO: set email template when ready
      notification.userId = this.data.payerId;

      try {
        await this.notificationDAO.put(notification);
        var successMessage = this.REMINDER_SENT_SUCCESSFULLY.replace('${0}', this.data.payee.businessName || this.data.payee.label());
        this.add(this.NotificationMessage.create({ message: successMessage }));
      } catch (exception) {
        var errorMessage = this.REMINDER_ERROR_MESSAGE.replace('${0}', this.data.payee.businessName || this.data.payee.label());
        this.add(this.NotificationMessage.create({ message: errorMessage, type: 'error' }));
        console.error(exception);
      }
    }
   ]
});
