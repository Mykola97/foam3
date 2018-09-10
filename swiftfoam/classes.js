global.FOAM_FLAGS.src = __dirname + '/../nanopay/src/';
require(__dirname + '/../nanopay/src/net/nanopay/files.js');

var classes = [
  'MintChipClient',
  'TransactionRow',
  'TransactionRowIBView',
  'foam.swift.ui.FOAMUILabel',
  'foam.swift.ui.DAOTableViewSource',

  'foam.blob.Blob',
  'foam.blob.IdentifiedBlob',
  'foam.box.Box',
  'foam.box.LogBox',
  'foam.box.BoxRegistry',
  'foam.box.BoxService',
  'foam.box.ClientBoxRegistry',
  'foam.box.Context',
  'foam.box.HTTPBox',
  'foam.box.Message',
  'foam.box.ProxyBox',
  'foam.box.RPCMessage',
  'foam.box.RemoteException',
  'foam.box.ReplyBox',
  'foam.box.SessionClientBox',
  'foam.box.swift.FileBox',
  'foam.core.Identifiable',
  'foam.dao.ArraySink',
  'foam.dao.ClientDAO',
  'foam.dao.RelationshipDAO',
  'foam.dao.ManyToManyRelationship',
  'foam.dao.ManyToManyRelationshipDAO',
  'foam.dao.ManyToManyRelationshipImpl',
  'foam.dao.ReadOnlyDAO',
  'foam.json2.Outputter',
  'foam.json2.PrettyOutputterOutput',
  'foam.log.LogLevel',
  'foam.mlang.Expr',
  'foam.mlang.Constant',
  'foam.mlang.ArrayConstant',
  'foam.mlang.predicate.Eq',
  'foam.mlang.sink.Count',
  'foam.nanos.auth.Address',
  'foam.nanos.auth.Hours',
  'foam.nanos.auth.DayOfWeek',
  'foam.nanos.auth.AuthService',
  'foam.nanos.auth.ClientAuthService',
  'foam.nanos.auth.Country',
  'foam.nanos.auth.EnabledAware',
  'foam.nanos.auth.Language',
  'foam.nanos.auth.LastModifiedAware',
  'foam.nanos.auth.LastModifiedByAware',
  'foam.nanos.auth.Phone',
  'foam.nanos.auth.Region',
  'foam.nanos.auth.ServiceProvider',
  'foam.nanos.auth.User',
  'foam.nanos.auth.UserUserJunction',
  'foam.nanos.auth.token.ClientTokenService',
  'foam.nanos.auth.token.Token',
  'foam.nanos.auth.token.TokenService',
  'foam.nanos.auth.resetPassword.ResetPasswordTokenService',
  'foam.nanos.fs.File',
  'foam.swift.parse.StringPStream',
  'foam.swift.parse.json.output.Outputter',
  'foam.swift.ui.DAOTableViewSource',
  'foam.swift.ui.DetailView',
  'foam.swift.type.Util',
  'foam.u2.Visibility',
  'foam.nanos.auth.email.EmailTokenService',
  'net.nanopay.auth.sms.PhoneVerificationTokenService',
  'net.nanopay.auth.PublicUserInfo',
  'net.nanopay.admin.model.AccountStatus',
  'net.nanopay.admin.model.ComplianceStatus',
  'net.nanopay.model.Currency',
  'net.nanopay.model.Branch',
  'net.nanopay.bank.BankAccount',
  'net.nanopay.bank.CABankAccount',
  'net.nanopay.bank.BankAccountStatus',
  'net.nanopay.model.PadCapture',
  'net.nanopay.onboarding.model.Questionnaire',
  'net.nanopay.onboarding.model.Question',
  'net.nanopay.tx.UserTransactionLimit',
  'net.nanopay.tx.client.ClientUserTransactionLimitService',
  'net.nanopay.tx.model.Fee',
  'net.nanopay.tx.alterna.AlternaCITransaction',
  'net.nanopay.tx.cico.CITransaction',
  'net.nanopay.tx.alterna.AlternaCOTransaction',
  'net.nanopay.tx.cico.COTransaction',
  'net.nanopay.tx.model.FeeInterface',
  'net.nanopay.tx.model.FeeType',
  'net.nanopay.tx.model.FixedFee',
  'net.nanopay.tx.model.InformationalFee',
  'net.nanopay.tx.model.PercentageFee',
  'net.nanopay.tx.model.Transaction',
  'net.nanopay.tx.model.TransactionEntity',
  'net.nanopay.tx.model.TransactionLimit',
  'net.nanopay.tx.model.TransactionLimitTimeFrame',
  'net.nanopay.tx.model.TransactionLimitType',
  'net.nanopay.tx.TransactionPurpose',
  'net.nanopay.tx.realex.RealexTransaction',
  'net.nanopay.tx.stripe.StripeTransaction',
  'net.nanopay.tx.RetailTransaction',
  'net.nanopay.tx.model.TransactionStatus',
  'net.nanopay.cico.model.MobileWallet',
  'net.nanopay.tx.TransactionType',
  'net.nanopay.cico.CICOPaymentType',
  'net.nanopay.cico.model.PaymentAccountInfo',
  'net.nanopay.invoice.model.PaymentStatus',
  'net.nanopay.model.PadCapture',
  'net.nanopay.cico.service.BankAccountVerifier',
  'net.nanopay.cico.service.ClientBankAccountVerifierService',
  'net.nanopay.cico.paymentCard.model.PaymentCard',
  'net.nanopay.cico.paymentCard.model.PaymentCardType',
  'net.nanopay.cico.paymentCard.model.PaymentCardNetwork',
  'net.nanopay.cico.model.RealexPaymentAccountInfo',
  'net.nanopay.tx.TxnProcessorData',
  'net.nanopay.tx.TxnProcessor',
  'net.nanopay.auth.PublicUserInfo',
  'net.nanopay.account.Account',
  'net.nanopay.account.Balance',
  'net.nanopay.account.DigitalAccount',
  'net.nanopay.payment.Institution',
  'net.nanopay.payment.InstitutionPurposeCode',
  'net.nanopay.retail.model.DeviceType',
  'net.nanopay.retail.model.DeviceStatus',
  'net.nanopay.retail.model.Device',
  'net.nanopay.cico.paymentCard.model.StripePaymentCard',
  'net.nanopay.cico.paymentCard.model.RealexPaymentCard',
  'net.nanopay.retail.model.P2PTxnRequestStatus',
  'net.nanopay.retail.model.P2PTxnRequest',
];

module.exports = {
  classes: classes,
};
