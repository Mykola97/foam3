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
    'hasPassedCompliance',
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
              isEnabled: function() {
                return this.signUpStatus !== self.ContactStatus.ACTIVE;
              },
              code: function(X) {
                X.controllerView.add(self.Popup.create(null, X).tag({
                  class: 'net.nanopay.contacts.ui.modal.ContactWizardModal',
                  // Setting data enables the edit flow.
                  data: this
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
                if ( self.hasPassedCompliance() ) {
                  X.menuDAO.find('sme.quickAction.request').then((menu) => {
                    menu.handler.view = Object.assign(menu.handler.view, {
                      invoice: self.Invoice.create({ payerId: this.id }),
                      isPayable: false
                    });
                    menu.launch(X, X.controllerView);
                  });
                }
              }
            }),
            this.Action.create({
              name: 'sendMoney',
              code: function(X) {
                if ( self.hasPassedCompliance() ) {
                  X.menuDAO.find('sme.quickAction.send').then((menu) => {
                    menu.handler.view = Object.assign(menu.handler.view, {
                      invoice: self.Invoice.create({ payeeId: this.id }),
                      isPayable: true
                    });
                    menu.launch(X, X.controllerView);
                  });
                }
              }
            }),
            this.Action.create({
              name: 'delete',
              code: function(X) {
                X.controllerView.add(self.Popup.create(null, X).tag({
                  class: 'net.nanopay.contacts.ui.modal.DeleteContactView',
                  contact: this
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
              // class: 'net.nanopay.contacts.ui.modal.ContactModal'
              class: 'net.nanopay.contacts.ui.modal.ContactWizardModal'
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
