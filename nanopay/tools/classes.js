global.FOAM_FLAGS.src = __dirname + '/../src/';
require('../src/net/nanopay/files.js');

var classes = [
  'net.nanopay.tx.PayerTransactionDAO',
  'net.nanopay.tx.PayeeTransactionDAO',
  'net.nanopay.auth.sms.PhoneVerificationTokenService',
  'net.nanopay.tx.TransactionType',
  'net.nanopay.cico.model.EFTReturnRecord',
  'net.nanopay.cico.model.EFTConfirmationFileRecord',
  'net.nanopay.cico.model.EFTReturnFileCredentials',
  'net.nanopay.tx.TxnProcessor',
  'net.nanopay.tx.TxnProcessorData',
  'net.nanopay.tx.TxnProcessorUserReference',
  'net.nanopay.tx.alterna.AlternaFormat',
  'net.nanopay.tx.alterna.SFTPService',
  'net.nanopay.tx.alterna.AlternaSFTPService',
  'net.nanopay.tx.alterna.client.ClientAlternaSFTPService',
  'net.nanopay.tx.alterna.AlternaTransaction',
  'net.nanopay.tx.cico.CITransaction',
  'net.nanopay.tx.cico.COTransaction',
  'net.nanopay.tx.alterna.AlternaTransaction',
  'net.nanopay.tx.alterna.AlternaCITransaction',
  'net.nanopay.tx.alterna.AlternaCOTransaction',
  'net.nanopay.tx.stripe.StripeTransaction',
  'net.nanopay.tx.stripe.StripeCustomer',
  'net.nanopay.tx.realex.RealexTransaction',
  'net.nanopay.cico.service.BankAccountVerifier',
  'net.nanopay.cico.service.ClientBankAccountVerifierService',
  'net.nanopay.cico.paymentCard.model.PaymentCard',
  'net.nanopay.cico.paymentCard.model.StripePaymentCard',
  'net.nanopay.cico.paymentCard.model.RealexPaymentCard',
  'net.nanopay.cico.paymentCard.model.PaymentCardType',
  'net.nanopay.cico.paymentCard.model.PaymentCardNetwork',
  'net.nanopay.payment.Institution',
  'net.nanopay.payment.InstitutionPurposeCode',
  'net.nanopay.account.Balance',
  'net.nanopay.model.Branch',
  'net.nanopay.account.Account',
  'net.nanopay.account.DigitalAccount',
  'net.nanopay.account.DigitalAccountInfo',
  'net.nanopay.account.DigitalAccountServiceInterface',
  'net.nanopay.account.ClientDigitalAccountService',
  'net.nanopay.account.HoldingAccount',
  'net.nanopay.bank.BankAccount',
  'net.nanopay.bank.CABankAccount',
  'net.nanopay.bank.BankAccountStatus',
  'net.nanopay.model.Broker',
  'net.nanopay.model.BusinessSector',
  'net.nanopay.model.BusinessType',
  'net.nanopay.model.Currency',
  'net.nanopay.model.PadAccount',
  'net.nanopay.model.PadCapture',
  'net.nanopay.model.Identification',
  'net.nanopay.model.DateAndPlaceOfBirth',
  'net.nanopay.model.Invitation',
  'net.nanopay.model.InvitationStatus',
  'net.nanopay.bank.BankHoliday',

  // sps
  'net.nanopay.sps.GeneralRequestPacket',
  'net.nanopay.sps.GeneralRequestResponse',
  'net.nanopay.sps.BatchDetailRequestPacket',
  'net.nanopay.sps.BatchDetailGeneralResponse',
  'net.nanopay.sps.DetailResponse',
  'net.nanopay.sps.RequestMessageAndErrors',
  'net.nanopay.sps.HostError',
  'net.nanopay.sps.UserInfo',
  'net.nanopay.sps.DetailResponseItemContent',
  'net.nanopay.sps.RequestPacket',
  'net.nanopay.sps.ResponsePacket',
  'net.nanopay.sps.SPSConfig',
  'net.nanopay.sps.SPSTransaction',
  'net.nanopay.sps.SPSRejectFileRecord',

  // Partners
  'net.nanopay.partners.ui.PartnerInvitationNotification',
  'net.nanopay.auth.PublicUserInfo',

  // Contacts
  'net.nanopay.contacts.Contact',
  'net.nanopay.contacts.ContactAuthService',

  // invite
  'net.nanopay.admin.model.ComplianceStatus',
  'net.nanopay.admin.model.AccountStatus',
  'net.nanopay.onboarding.model.Question',
  'net.nanopay.onboarding.model.Questionnaire',
  'net.nanopay.onboarding.InvitationTokenService',
  'net.nanopay.onboarding.FirebaseInvitationTokenService',

  // invoice
  'net.nanopay.invoice.model.PaymentStatus',
  'net.nanopay.invoice.model.InvoiceStatus',
  'net.nanopay.invoice.model.RecurringInvoice',
  'net.nanopay.invoice.model.Invoice',
  'net.nanopay.invoice.notification.NewInvoiceNotification',
  'net.nanopay.invoice.notification.InvoicePaymentNotification',
  'net.nanopay.invoice.xero.TokenStorage',

  // fx
  'net.nanopay.fx.ExchangeRateInterface',
  'net.nanopay.fx.client.ClientExchangeRateService',
  'net.nanopay.fx.interac.model.PayoutOptions',
  'net.nanopay.fx.interac.model.Corridor',
  'net.nanopay.fx.interac.model.RequiredUserFields',
  'net.nanopay.fx.interac.model.RequiredAddressFields',
  'net.nanopay.fx.interac.model.RequiredIdentificationFields',
  'net.nanopay.fx.interac.model.RequiredAccountFields',
  'net.nanopay.fx.interac.model.RequiredAgentFields',
  'net.nanopay.fx.interac.model.RequiredDocumentFields',
  'net.nanopay.fx.ExchangeRateStatus',
  'net.nanopay.fx.ExchangeRate',
  'net.nanopay.fx.ExchangeRateQuote',
  'net.nanopay.fx.FixerIOExchangeRate',
  'net.nanopay.tx.UserTransactionLimit',
  'net.nanopay.tx.client.ClientUserTransactionLimitService',
  'net.nanopay.retail.model.DeviceType',
  'net.nanopay.tx.model.CashOutFrequency',
  'net.nanopay.tx.model.Fee',
  'net.nanopay.tx.model.FeeInterface',
  'net.nanopay.tx.model.FeeType',
  'net.nanopay.tx.model.FixedFee',
  'net.nanopay.tx.model.InformationalFee',
  'net.nanopay.tx.model.LiquiditySettings',
  'net.nanopay.tx.model.LiquidityAuth',
  'net.nanopay.tx.model.PercentageFee',
  'net.nanopay.tx.model.TransactionStatus',
  'net.nanopay.tx.model.TransactionEntity',
  'net.nanopay.tx.model.Transaction',
  'net.nanopay.tx.model.TopUpTransaction',
  'net.nanopay.tx.CompositeTransaction',
  'net.nanopay.tx.CompositeTransactionDAO',
  'net.nanopay.tx.RefundTransaction',
  'net.nanopay.tx.RetailTransaction',
  'net.nanopay.tx.model.TransactionLimit',
  'net.nanopay.tx.model.TransactionLimitTimeFrame',
  'net.nanopay.tx.model.TransactionLimitType',
  'net.nanopay.tx.TransactionPurpose',
  'net.nanopay.retail.model.DeviceStatus',
  'net.nanopay.retail.model.Device',
  'net.nanopay.retail.model.P2PTxnRequestStatus',
  'net.nanopay.retail.model.P2PTxnRequest',
  'net.nanopay.fx.ascendantfx.AscendantFX',
  'net.nanopay.fx.lianlianpay.LianLianPay',
  'net.nanopay.fx.lianlianpay.model.ResultCode',
  'net.nanopay.fx.lianlianpay.model.DistributionMode',
  'net.nanopay.fx.lianlianpay.model.InstructionType',
  'net.nanopay.fx.lianlianpay.model.CurrencyBalanceRecord',
  'net.nanopay.fx.lianlianpay.model.InstructionCombined',
  'net.nanopay.fx.lianlianpay.model.InstructionCombinedRequest',
  'net.nanopay.fx.lianlianpay.model.InstructionCombinedSummary',
  'net.nanopay.fx.lianlianpay.model.PreProcessResult',
  'net.nanopay.fx.lianlianpay.model.PreProcessResultResponse',
  'net.nanopay.fx.lianlianpay.model.PreProcessResultSummary',
  'net.nanopay.fx.lianlianpay.model.Reconciliation',
  'net.nanopay.fx.lianlianpay.model.ReconciliationRecord',
  'net.nanopay.fx.lianlianpay.model.Statement',
  'net.nanopay.fx.lianlianpay.model.StatementRecord',
  'foam.nanos.auth.UserUserJunction',
  'net.nanopay.fx.interac.model.ExchangerateApiModel',
  'net.nanopay.fx.interac.model.AcceptRateApiModel',
  'net.nanopay.fx.interac.model.AcceptExchangeRateFields',

  'net.nanopay.fx.FXServiceInterface',
  'net.nanopay.fx.client.ClientFXService',
  'net.nanopay.fx.FXAccepted',
  'net.nanopay.fx.FXDeal',
  'net.nanopay.fx.FXHoldingAccount',
  'net.nanopay.fx.FXHoldingAccountBalance',
  'net.nanopay.fx.FXPayee',
  'net.nanopay.fx.FXDirection',

  'net.nanopay.fx.GetFXQuote',
  'net.nanopay.fx.AcceptFXRate',
  'net.nanopay.fx.ConfirmFXDeal',
  'net.nanopay.fx.SubmitFXDeal',
  'net.nanopay.fx.GetIncomingFundStatus',
  'net.nanopay.fx.FXQuote',

  // tx tests
  'net.nanopay.tx.model.TransactionParseTest',

  // PaymentAccountInfo
  'net.nanopay.cico.CICOPaymentType',
  'net.nanopay.cico.model.PaymentAccountInfo',
  'net.nanopay.cico.model.RealexPaymentAccountInfo',
  'net.nanopay.cico.model.MobileWallet',

  // security
  'net.nanopay.security.EncryptedObject',
  'net.nanopay.security.KeyStoreManager',
  'net.nanopay.security.AbstractKeyStoreManager',
  'net.nanopay.security.AbstractFileKeyStoreManager',
  'net.nanopay.security.BKSKeyStoreManager',
  'net.nanopay.security.JCEKSKeyStoreManager',
  'net.nanopay.security.JKSKeyStoreManager',
  'net.nanopay.security.PKCS11KeyStoreManager',
  'net.nanopay.security.PKCS12KeyStoreManager',
  'net.nanopay.security.HashingJournal',
  'net.nanopay.security.csp.CSPViolation',
  'net.nanopay.security.csp.CSPReportWebAgent',

  'net.nanopay.security.KeyPairEntry',
  'net.nanopay.security.PrivateKeyEntry',
  'net.nanopay.security.PublicKeyEntry',
  'net.nanopay.security.KeyPairDAO',
  'net.nanopay.security.PublicKeyDAO',
  'net.nanopay.security.PrivateKeyDAO',
  'net.nanopay.security.UserKeyPairGenerationDAO',
  'net.nanopay.security.MessageDigest',
  'net.nanopay.security.RandomNonceDAO',
  'net.nanopay.security.KeyRight',
  'net.nanopay.security.RightCondition',
  'net.nanopay.security.Signature',
  'net.nanopay.security.PayerAssentTransactionDAO',

  // security tests
  'net.nanopay.security.HashedJSONParserTest',
  'net.nanopay.security.HashingJournalTest',
  'net.nanopay.security.HashingOutputterTest',
  'net.nanopay.security.HashingWriterTest',
  'net.nanopay.security.PayerAssentTransactionDAOTest',
  'net.nanopay.security.PKCS11KeyStoreManagerTest',
  'net.nanopay.security.PKCS12KeyStoreManagerTest',
  'net.nanopay.security.UserKeyPairGenerationDAOTest',
  'net.nanopay.security.MerkleTreeTest',
  'net.nanopay.security.MerkleTreeHelperTest',

  // receipt
  'net.nanopay.security.receipt.Receipt',

  // receipt tests
  'net.nanopay.security.receipt.ReceiptTest',

  // tests
  'net.nanopay.test.ModelledTest',
  'net.nanopay.auth.PublicUserInfoDAOTest',
  'net.nanopay.auth.TestWidget',
  'net.nanopay.invoice.AuthenticatedInvoiceDAOTest',
  'net.nanopay.test.TestsReporter',
  'net.nanopay.test.TestReport',
  'net.nanopay.tx.alterna.test.EFTTest',
  'net.nanopay.invoice.model.InvoiceTest',

  // iso20022 tests
  'net.nanopay.iso20022.ISODateTest',
  'net.nanopay.iso20022.ISODateTimeTest',
  'net.nanopay.iso20022.ISOTimeTest',
];

var abstractClasses = [
  'net.nanopay.invoice.xero.AbstractXeroService'
];

var skeletons = [
  'net.nanopay.account.DigitalAccountServiceInterface',
  'net.nanopay.cico.service.BankAccountVerifier',
  'net.nanopay.tx.alterna.SFTPService',
  'net.nanopay.fx.ExchangeRateInterface',
  'net.nanopay.tx.UserTransactionLimit',
  'net.nanopay.tx.model.LiquidityAuth'
];

var proxies = [
  'net.nanopay.cico.service.BankAccountVerifier'
];

module.exports = {
    classes: classes,
    abstractClasses: abstractClasses,
    skeletons: skeletons,
    proxies: proxies
};
