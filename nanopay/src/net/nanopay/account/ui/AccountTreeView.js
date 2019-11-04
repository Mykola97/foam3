foam.CLASS({
  package: 'net.nanopay.account.ui',
  name: 'AccountTreeView',
  extends: 'foam.u2.Element',

  implements: [
    'foam.mlang.Expressions'
  ],

  imports: [
    'accountDAO'
  ],

  requires: [
    'net.nanopay.account.ui.AccountTreeGraph',
    'foam.u2.layout.Cols',
    'net.nanopay.account.DigitalAccount',
    'net.nanopay.account.AggregateAccount',
    'foam.graphics.ZoomMapView'
  ],

  documentation: `
    A customized Tree View for accounts based on the Liquid design
  `,

  css: `
    ^header {
      border-bottom: solid 1px #e7eaec;
      height: 39px;
      width: 100%;
      font-size: 12px;
      font-weight: 600;
      line-height: 1.5;
      color: #1e1f21;
    }

    ^title {
      left: 45%;
      position: absolute;
    }

    ^selector {
      padding-left: 16px;
    }

    ^nav-container {
      border-radius: 3px;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.08), 0 2px 8px 0 rgba(0, 0, 0, 0.16);
      border: solid 1px #cbcfd4;
      position: fixed;
      top: 50vh;
      right: 45;
      height: 144px;
      width: 56px;
      background-color: white;
      vertical-align: middle;
    }

    ^ .foam-u2-ActionView-secondary {
      font-size: 18px;
      width: 24px;
      height: 24px;
      padding: 0;
    }

    ^ .foam-u2-ActionView + .foam-u2-ActionView {
      margin-left: 0px;
    }

    ^ .foam-u2-ActionView img {
      height: 16px;
      width: 16px;
      margin-right: 0;
    }
  `,

  messages: [
    {
      name: 'VIEW_HEADER',
      message: 'ACCOUNT HIERARCHY VIEW',
    },
  ],

  classes: [
    {
      // TODO: Consider moving this somewhere else.
      name: 'AnimateTo',
      properties: [
        'slot',
        'destValue',
        'ms',
        {
          name: 'startTime_',
          factory: function() { return new Date() }
        }
      ],
      listeners: [
        {
          name: 'doAnimation',
          isFramed: true,
          code: function() {
            var timeRemaining = this.ms - (Date.now() - this.startTime_.getTime());
            if ( timeRemaining < 0 ) {
              this.slot.set(this.destValue);
            } else {
              var delta = this.destValue - this.slot.get();
              this.slot.set(this.slot.get() + delta * 0.5);
              this.doAnimation();
            }
          }
        }
      ]
    }
  ],

  properties: [
    {
      name: 'accounts',
      documentation: 'array for ChoiceView choices',
      factory: function() {
        return [];
      }
    },
    {
      name: 'highlightedAccount',
      documentation: 'account id that has been selected through ChoiceView',
      postSet: function(o, n) {
        if ( ! n ) return;
        this.scrollToAccount(n);
      }
    },
    {
      class: 'Reference',
      name: 'selectedRoot',
      of :'net.nanopay.account.Account',
      view: function(_,x){
        var self = x.data;
        var prop = this;
        var v = foam.u2.view.ReferenceView.create(null, x);
        v.fromProperty(prop);
        v.dao = v.dao.where(
          self.AND(
            self.EQ(
              // TODO: hiding the automatically created default virtual account until later
              net.nanopay.account.Account.IS_DEFAULT, false
            ),
            self.OR(
              foam.mlang.predicate.IsClassOf.create({
                targetClass: self.DigitalAccount
              }),
              foam.mlang.predicate.IsClassOf.create({
                targetClass: self.AggregateAccount
              })
            ),
            self.EQ(
              net.nanopay.account.Account.PARENT,
              0
            )
          )
        );
        return v;
      }
    },
    'cview',
    'canvasContainer',
  ],
  actions: [
    {
      name: 'zoomIn',
      code: function() {
        this.AnimateTo.create({
          slot: this.cview.scale$,
          destValue: this.cview.scale * 1.25,
          ms: 200
        }).doAnimation();
      }
    },
    {
      name: 'zoomOut',
      isEnabled: function(cview$scale) {
        return (cview$scale || 0) > 0 && (cview$scale || 0) > 0;
      },
      code: function() {
        this.AnimateTo.create({
          slot: this.cview.scale$,
          destValue: this.cview.scale / 1.25,
          ms: 200
        }).doAnimation();
      }
    },
    {
      name: 'home',
      isEnabled: function(canvasContainer) {
        return !! canvasContainer;
      },
      code: function() {
        this.scrollToNode(this.cview.view.root);
      }
    }
  ],

  methods: [
    function initE(){
      var self = this;

      // sub to selected root
      this.onDetach(this.selectedRoot$.sub(this.rootChanged));

      this.addClass(this.myClass());
      this
        .start(this.Cols).style({ 'justify-content': 'flex-start', 'align-items': 'center'}).addClass(this.myClass('header'))
          .startContext({data: this})
            .start().addClass(this.myClass('selector'))
              .start({
                class: 'foam.u2.view.ChoiceView',
                choices$: this.accounts$,
                data$: this.highlightedAccount$,
                placeholder: '--'
              }).end()
            .end()
            .start().addClass(this.myClass('selector'))
              .add(this.SELECTED_ROOT)
            .end()
          .endContext()
          .start().addClass(this.myClass('title'))
            .add(this.VIEW_HEADER)
          .end()
        .end()
        .startContext({data: this})
          .start(this.Cols).style({'flex-direction':'column','align-items':'center','justify-content':'space-around'}).addClass(this.myClass('nav-container'))
            .tag(this.HOME, {
              buttonStyle: foam.u2.ButtonStyle.SECONDARY,
              icon: 'images/ic-round-home.svg',
              label: '',
              size: foam.u2.ButtonSize.SMALL
            })
            .tag(this.ZOOM_IN, {
              buttonStyle: foam.u2.ButtonStyle.SECONDARY,
              label: '+',
              size: foam.u2.ButtonSize.SMALL
            })
            .tag(this.ZOOM_OUT, {
              buttonStyle: foam.u2.ButtonStyle.SECONDARY,
              label: '-',
              size: foam.u2.ButtonSize.SMALL
            })
          .end()
        .endContext()
        .start('div', null, this.canvasContainer$).addClass(this.myClass('canvas-container'))
          .add(this.slot((selectedRoot) => this.accountDAO.find(selectedRoot).then((a) => {
            var v = this.AccountTreeGraph.create({
              data: a,
            });

            this.cview = this.ZoomMapView.create({
              view: v,
              height$: v.height$,
              width: this.el().clientWidth,
              viewBorder: '#d9170e',
              navBorder: 'black',
              handleHeight: '10',
              handleColor: '#406dea',
            });
            return this.cview;
          }))
        )

        .end()
    },

    function scrollToAccount(accountId){
      var treeNode = this.cview.view.root.findNode(accountId);

      if ( ! treeNode ) {
        var self = this;
        this.cview.view.onSizeChange.sub(function(sub) {
          sub.detach();
          self.scrollToAccount(accountId);
        })

        this.getAncestry(accountId).then(ancestry => {
          this.expandAncestors(ancestry);
        });
      } else {
        var n = treeNode.parent;
        while ( n.data.id !== this.cview.view.root.data.id && n.expanded ) {
          n = n.parent;
        }
        if ( n.data.id != this.cview.view.root.data.id && ! n.expanded ) {
          var self = this;
          this.cview.view.onSizeChange.sub(function(sub) {
            sub.detach();
            self.scrollToAccount(accountId);
          })
          n.expanded = true;
        } else {
          this.scrollToNode(treeNode);
        }
      }
    },

    function scrollToNode(node) {
      var p = {
        x: 0,
        y: this.cview.view.nodeHeight / 2,
        w: 1
      }
      var newFunctionPoint = this.cview.scaledView_.globalToLocalCoordinates(
        node.localToGlobalCoordinates(p)
      )

      var newViewportPosition = {
        x: this.cview.innerNavView_.scaleX * newFunctionPoint.x  - (this.cview.viewPortView_.width / 2),
        y: this.cview.innerNavView_.scaleY * newFunctionPoint.y  - (this.cview.viewPortView_.height / 2),
      }

      this.cview.view.selectedNode = node;

      this.AnimateTo.create({
        slot: {
          get: () => this.cview.viewPortPosition.x,
          set: x => {
            this.cview.viewPortPosition = {
              x: x,
              y: this.cview.viewPortPosition.y
            }
          }
        },
        destValue: newViewportPosition.x,
        ms: 200
      }).doAnimation();
      this.AnimateTo.create({
        slot: {
          get: () => this.cview.viewPortPosition.y,
          set: y => {
            this.cview.viewPortPosition = {
              x: this.cview.viewPortPosition.x,
              y: y
            }
          }
        },
        destValue: newViewportPosition.y,
        ms: 200
      }).doAnimation();
    },

    async function getAncestry(accountId){
      var ancestry = [];

      var curr = await this.accountDAO.find(accountId);

      while ( curr.id !== this.cview.view.root.data.id ){
        ancestry.push(curr.id);
        curr = await this.accountDAO.find(curr.parent);
      }

      return Promise.resolve(ancestry);
    },

    function expandAncestors(ancestry){
      var curr = this.cview.view.root;

      while ( ancestry.length ){
        if ( ! curr.expanded ) {
          curr.expanded = true;
        }

        currId = ancestry.pop();

        var children = curr.childNodes;

        for ( var i = 0; i < children.length; i++ ){
          if ( children[i].data.id === currId ){
            curr = children[i];
            break;
          }
        }
      }
    }
  ],

  listeners: [
    {
      name: 'rootChanged',
      code: async function() {
        // return if no root selected
        if ( ! this.selectedRoot ) return;

        // get actual root
        var rootAccount = await this.accountDAO.find(this.selectedRoot);

        // return if no account found for id
        if ( ! rootAccount ) return;

        // temp array
        var accounts = [];

        // recursive function that takes an account and context (for getChildren)
        async function getChildData(account, context) {
          // at node, push id and name in format for choice view
          accounts.push([account.id, account.name]);

          // at node, get its children
          var children = await account.getChildren(context).select();

          // return if no children
          if ( ! children.array ) return;

          // for each child, recursively call this function.
          // putting this logic in forEach gives a weird side effect when using
          // await
          for ( var i = 0 ; i < children.array.length ; i++ ) {
            await getChildData(children.array[i], context);
          }
        };

        // get all child data before proceeding
        await getChildData(rootAccount, this.__subContext__);

        this.accounts = accounts;
      }
    }
  ]
});
