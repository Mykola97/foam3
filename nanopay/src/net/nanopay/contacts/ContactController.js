foam.CLASS({
  package: 'net.nanopay.contacts',
  name: 'ContactController',
  extends: 'foam.comics.DAOController',

  documentation: 'A custom DAOController to work with contacts.',

  requires: [
    'foam.core.Action',
    'foam.u2.dialog.Popup',
    'net.nanopay.contacts.ContactStatus',
    'net.nanopay.invoice.model.Invoice'
  ],

  imports: [
    'user'
  ],

  properties: [
    {
      class: 'foam.dao.DAOProperty',
      name: 'data',
      factory: function() {
        return this.user.contacts;
      }
    },
    {
      name: 'summaryView',
      factory: function() {
        var self = this;
        return {
          class: 'foam.u2.view.ScrollTableView',
          editColumnsEnabled: false,
          contextMenuActions: [
            this.Action.create({
              name: 'edit',
              code: function(X) {
                X.controllerView.add(self.Popup.create(null, X).tag({
                  class: 'net.nanopay.contacts.ui.modal.ContactModal',
                  data: this,
                  isEdit: true
                }));
              }
            }),
            this.Action.create({
              name: 'invite',
              isEnabled: function() {
                return this.signUpStatus === self.ContactStatus.NOT_INVITED;
              },
              code: function(X) {
                X.controllerView.add(self.Popup.create(null, X).tag({
                  class: 'net.nanopay.contacts.ui.modal.InviteContactModal',
                  data: this
                }));
              }
            }),
            this.Action.create({
              name: 'requestMoney',
              code: function(X) {
                X.stack.push({
                  class: 'net.nanopay.sme.ui.SendRequestMoney',
                  invoice: self.Invoice.create({ payerId: this.id }),
                  isPayable: false
                });
              }
            }),
            this.Action.create({
              name: 'sendMoney',
              code: function(X) {
                X.stack.push({
                  class: 'net.nanopay.sme.ui.SendRequestMoney',
                  invoice: self.Invoice.create({ payeeId: this.id }),
                  isPayable: true
                });
              }
            }),
            this.Action.create({
              name: 'delete',
              code: function(X) {
                X.controllerView.add(self.Popup.create(null, X).tag({
                  class: 'net.nanopay.contacts.ui.modal.ContactModal',
                  data: this,
                  isDelete: true
                }));
              }
            })
          ]
        };
      }
    },
    {
      name: 'primaryAction',
      factory: function() {
        return this.Action.create({
          name: 'addContact',
          label: 'Add a Contact',
          code: function(X) {
            this.add(this.Popup.create().tag({
              class: 'net.nanopay.contacts.ui.modal.ContactModal'
            }));
          }
        });
      }
    }
  ],

  listeners: [
    {
      name: 'dblclick',
      code: function onEdit(contact) {
        // Do nothing.
      }
    }
  ]
});
