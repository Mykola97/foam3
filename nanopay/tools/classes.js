global.FOAM_FLAGS.src = __dirname + '/../src/';
require('../src/net/nanopay/files.js');

var classes = [
  'net.nanopay.tx.PayerTransactionDAO',
  'net.nanopay.tx.PayeeTransactionDAO',
  'net.nanopay.auth.sms.PhoneVerificationTokenService',
  'net.nanopay.auth.ExternalInvoiceTokenService',
  'net.nanopay.cico.model.EFTReturnRecord',
  'net.nanopay.cico.model.EFTConfirmationFileRecord',
  'net.nanopay.cico.model.EFTReturnFileCredentials',
  'net.nanopay.tx.TxnProcessor',
  'net.nanopay.plaid.config.PlaidCredential',
  'net.nanopay.tx.Transfer',
  'net.nanopay.tx.BalanceHistory',
  'net.nanopay.tx.CompletedTransactionDAO',
  'net.nanopay.tx.TxnProcessorUserReference',
  'net.nanopay.tx.cico.CITransaction',
  'net.nanopay.tx.RetailTransactionPlanDAO',
  'net.nanopay.tx.cico.VerificationTransaction',
  'net.nanopay.tx.cico.COTransaction',
  'net.nanopay.tx.alterna.AlternaFormat',
  'net.nanopay.tx.alterna.SFTPService',
  'net.nanopay.tx.alterna.AlternaSFTPService',
  'net.nanopay.tx.alterna.client.ClientAlternaSFTPService',
  'net.nanopay.tx.alterna.AlternaCOTransaction',
  'net.nanopay.tx.alterna.AlternaCITransaction',
  'net.nanopay.tx.alterna.AlternaVerificationTransaction',
  'net.nanopay.tx.alterna.AlternaTransactionPlanDAO',
  'net.nanopay.tx.ExecuteMethodsTransactionDAO',
  'net.nanopay.tx.stripe.StripeTransaction',
  'net.nanopay.tx.stripe.StripeCustomer',
  'net.nanopay.tx.realex.RealexTransaction',
  'net.nanopay.tx.ruler.TransactionLimitState',
  'net.nanopay.tx.ruler.UserTransactionLimitRule',
  'net.nanopay.tx.ruler.BusinessTransactionLimitRule',
  'net.nanopay.cico.service.BankAccountVerifier',
  'net.nanopay.cico.service.ClientBankAccountVerifierService',
  'net.nanopay.cico.paymentCard.model.PaymentCard',
  'net.nanopay.cico.paymentCard.model.StripePaymentCard',
  'net.nanopay.cico.paymentCard.model.RealexPaymentCard',
  'net.nanopay.cico.paymentCard.model.PaymentCardType',
  'net.nanopay.cico.paymentCard.model.PaymentCardNetwork',
  'net.nanopay.payment.Institution',
  'net.nanopay.payment.InstitutionPurposeCode',
  'net.nanopay.payment.PaymentService',
  'net.nanopay.payment.client.ClientPaymentService',
  'net.nanopay.payment.PaymentProvider',
  'net.nanopay.account.Balance',
  'net.nanopay.account.EnforceOneDefaultDigitalAccountPerCurrencyDAO',
  'net.nanopay.bank.EnforceOneDefaultBankAccountPerCurrencyDAO',
  'net.nanopay.model.Branch',
  'net.nanopay.account.Account',
  'net.nanopay.account.DigitalAccount',
  'net.nanopay.account.DigitalAccountInfo',
  'net.nanopay.account.DigitalAccountServiceInterface',
  'net.nanopay.account.ClientDigitalAccountService',
  'net.nanopay.account.AggregateAccount',
  'net.nanopay.account.ZeroAccount',
  'net.nanopay.account.ZeroAccountUserAssociation',
  'net.nanopay.account.TrustAccount',
  'net.nanopay.account.LossesAccount',
  'net.nanopay.account.LoanAccount',
  'net.nanopay.account.LoanedTotalAccount',
  'net.nanopay.account.HoldingAccount',
  'net.nanopay.account.AuthenticatedAccountDAOTest',
  'net.nanopay.bank.BankAccount',
  'net.nanopay.bank.CABankAccount',
  'net.nanopay.bank.USBankAccount',
  'net.nanopay.bank.INBankAccount',
  'net.nanopay.bank.PKBankAccount',
  'net.nanopay.bank.BankAccountStatus',
  'net.nanopay.bank.CanReceiveCurrency',
  'net.nanopay.model.Broker',
  'net.nanopay.model.Business',
  'net.nanopay.model.BusinessSector',
  'net.nanopay.model.BusinessType',
  'net.nanopay.model.Currency',
  'net.nanopay.model.PadAccount',
  'net.nanopay.model.PadCapture',
  'net.nanopay.model.Identification',
  'net.nanopay.model.DateAndPlaceOfBirth',
  'net.nanopay.model.Invitation',
  'net.nanopay.model.InvitationStatus',
  'net.nanopay.model.IdentificationType',
  'net.nanopay.model.PersonalIdentification',
  'net.nanopay.bank.BankHoliday',

  // sps
  'net.nanopay.sps.GeneralRequestPacket',
  'net.nanopay.sps.GeneralRequestResponse',
  'net.nanopay.sps.BatchDetailRequestPacket',
  'net.nanopay.sps.BatchDetailGeneralResponse',
  'net.nanopay.sps.DetailResponse',
  'net.nanopay.sps.RequestMessageAndErrors',
  'net.nanopay.sps.HostError',
  'net.nanopay.sps.TxnDetail',
  'net.nanopay.sps.PayerInfo',
  'net.nanopay.sps.DetailResponseItemContent',
  'net.nanopay.sps.RequestPacket',
  'net.nanopay.sps.ResponsePacket',
  'net.nanopay.sps.SPSConfig',
  'net.nanopay.sps.SPSTransaction',
  'net.nanopay.sps.SPSRejectFileRecord',

  // kotak
  'net.nanopay.kotak.Kotak',

  // Partners
  'net.nanopay.partners.ui.PartnerInvitationNotification',
  'net.nanopay.auth.PublicUserInfo',

  // Contacts
  'net.nanopay.contacts.Contact',
  'net.nanopay.contacts.ContactStatus',

  // invite
  'net.nanopay.admin.model.ComplianceStatus',
  'net.nanopay.admin.model.AccountStatus',
  'net.nanopay.onboarding.model.Question',
  'net.nanopay.onboarding.model.Questionnaire',
  'net.nanopay.onboarding.InvitationTokenService',
  'net.nanopay.onboarding.FirebaseInvitationTokenService',

  // compliance Email notification
  'net.nanopay.onboarding.email.UserCompliancePassEmailDAO',

  // sme onboarding
  'net.nanopay.sme.onboarding.model.SuggestedUserTransactionInfo',
  'net.nanopay.onboarding.email.NewBankAccountAddedEmailDAO',
  'net.nanopay.onboarding.email.NewUserOnboardedEmailDAO',

  // sme compliance banner
  'net.nanopay.sme.ui.banner.ComplianceBannerData',
  'net.nanopay.sme.ui.banner.ComplianceBannerMode',

  // invoice
  'net.nanopay.invoice.model.PaymentStatus',
  'net.nanopay.invoice.model.InvoiceStatus',
  'net.nanopay.invoice.model.RecurringInvoice',
  'net.nanopay.invoice.model.Invoice',
  'net.nanopay.invoice.notification.NewInvoiceNotification',
  'net.nanopay.invoice.notification.InvoicePaymentNotification',
  'net.nanopay.invoice.service.InvoicePaymentService',
  'net.nanopay.invoice.service.ClientInvoicePaymentService',

   // integration
   'net.nanopay.integration.ClientIntegrationService',
   'net.nanopay.integration.IntegrationCode',
   'net.nanopay.integration.IntegrationService',
  'net.nanopay.integration.ResultResponse',
  'net.nanopay.integration.AccountingBankAccount',
  'net.nanopay.integration.AccountingContactEmailCache',

  // xero
  'net.nanopay.integration.xero.XeroTokenStorage',
  'net.nanopay.integration.xero.XeroConfig',
  'net.nanopay.integration.xero.XeroIntegrationService',
  'net.nanopay.integration.xero.model.XeroContact',
  'net.nanopay.integration.xero.model.XeroInvoice',

  // liquidity
   'net.nanopay.liquidity.LiquiditySettings',
   'net.nanopay.liquidity.Liquidity',
   'net.nanopay.liquidity.LiquidityAuth',
   'net.nanopay.model.Frequency',

  // quick
  'net.nanopay.integration.quick.QuickConfig',
  'net.nanopay.integration.quick.QuickIntegrationService',
  'net.nanopay.integration.quick.QuickOauth',
  'net.nanopay.integration.quick.QuickTokenStorage',
  'net.nanopay.integration.quick.model.QuickBank',
  'net.nanopay.integration.quick.model.QuickContact',
  'net.nanopay.integration.quick.model.QuickInvoice',
  'net.nanopay.integration.quick.model.QuickLineItem',
  'net.nanopay.integration.quick.model.QuickLinkTxn',
  'net.nanopay.integration.quick.model.QuickPostPayment',
  'net.nanopay.integration.quick.model.QuickPostBillPayment',
  'net.nanopay.integration.quick.model.QuickPayment',
  'net.nanopay.integration.quick.model.QuickPutBank',
  'net.nanopay.integration.quick.model.QuickQueryAddress',
  'net.nanopay.integration.quick.model.QuickQueryAttachable',
  'net.nanopay.integration.quick.model.QuickQueryAttachableEntityReference',
  'net.nanopay.integration.quick.model.QuickQueryAttachableReference',
  'net.nanopay.integration.quick.model.QuickQueryAttachableResponse',
  'net.nanopay.integration.quick.model.QuickQueryAttachables',
  'net.nanopay.integration.quick.model.QuickQueryBankResponse',
  'net.nanopay.integration.quick.model.QuickQueryBill',
  'net.nanopay.integration.quick.model.QuickQueryBillResponse',
  'net.nanopay.integration.quick.model.QuickQueryBills',
  'net.nanopay.integration.quick.model.QuickQueryContact',
  'net.nanopay.integration.quick.model.QuickQueryCurrencyReference',
  'net.nanopay.integration.quick.model.QuickQueryCustomerResponse',
  'net.nanopay.integration.quick.model.QuickQueryCustomers',
  'net.nanopay.integration.quick.model.QuickQueryEMail',
  'net.nanopay.integration.quick.model.QuickQueryInvoice',
  'net.nanopay.integration.quick.model.QuickQueryInvoiceResponse',
  'net.nanopay.integration.quick.model.QuickQueryInvoices',
  'net.nanopay.integration.quick.model.QuickQueryMetaData',
  'net.nanopay.integration.quick.model.QuickQueryNameValue',
  'net.nanopay.integration.quick.model.QuickQueryPhoneNumber',
  'net.nanopay.integration.quick.model.QuickQueryVendorResponse',
  'net.nanopay.integration.quick.model.QuickQueryVendors',

  // fx
  'net.nanopay.fx.ExchangeRateInterface',
  'net.nanopay.fx.Corridor',
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
  'net.nanopay.fx.FXTransaction',
  'net.nanopay.fx.FXTransfer',
  'net.nanopay.fx.CurrencyFXService',
  'net.nanopay.fx.FXUserStatus',
  'net.nanopay.tx.UserTransactionLimit',
  'net.nanopay.tx.client.ClientUserTransactionLimitService',
  'net.nanopay.retail.model.DeviceType',
  'net.nanopay.tx.AcceptAware',
  'net.nanopay.tx.ETALineItem',
  'net.nanopay.tx.ExpiryLineItem',
  'net.nanopay.model.Frequency',
  'net.nanopay.tx.model.Fee',
  'net.nanopay.tx.model.FeeInterface',
  'net.nanopay.tx.model.FeeType',
  'net.nanopay.tx.model.FixedFee',
  'net.nanopay.tx.model.InformationalFee',
  'net.nanopay.tx.model.PercentageFee',
  'net.nanopay.tx.model.TransactionFee',
  'net.nanopay.tx.FeeLineItem',
  'net.nanopay.tx.ExpenseLineItem',
  'net.nanopay.tx.ServiceLineItem',
  'net.nanopay.tx.FeeTransfer',
  'net.nanopay.tx.InfoLineItem',
  'net.nanopay.tx.TaxLineItem',
  'net.nanopay.tx.LineItemType',
  'net.nanopay.tx.LineItemTypeAccount',
  'net.nanopay.tx.LineItemAmountType',
  'net.nanopay.tx.LineItemAmount',
  'net.nanopay.tx.LineItemFee',
  'net.nanopay.tx.model.TransactionStatus',
  'net.nanopay.tx.model.TransactionEntity',
  'net.nanopay.tx.TransactionLineItem',
  'net.nanopay.tx.model.Transaction',
  'net.nanopay.tx.GreenfenceTransaction',
  'net.nanopay.tx.InvoiceTransaction',
  'net.nanopay.tx.DigitalTransaction',
  'net.nanopay.tx.SaveChainedTransactionDAO',
  'net.nanopay.tx.SummaryTransaction',
  'net.nanopay.tx.TransactionLineItem',
  'net.nanopay.tx.DisclosureLineItem',
  'net.nanopay.tx.NanopayLineItemFeeDAO',
  'net.nanopay.tx.NanopayLineItemTaxDAO',
  'net.nanopay.tx.TransactionQuote',
  'net.nanopay.tx.TransactionQuotes',
  'net.nanopay.tx.TransactionQuoteDAO',
  'net.nanopay.tx.RefundTransaction',
  'net.nanopay.tx.RetailTransaction',
  'net.nanopay.tx.model.TransactionLimit',
  'net.nanopay.tx.ruler.AbstractTransactionLimitRule',
  'net.nanopay.tx.ruler.TransactionLimitRuleAction',
  'net.nanopay.tx.ruler.AccountTransactionLimitRule',
  'net.nanopay.tx.model.TransactionLimitTimeFrame',
  'net.nanopay.tx.model.TransactionLimitType',
  'net.nanopay.tx.TransactionPurpose',
  'net.nanopay.tx.PlanTransactionComparator',
  'net.nanopay.tx.PlanCostComparator',
  'net.nanopay.tx.PlanETAComparator',
  'net.nanopay.tx.PlanComparator',
  'net.nanopay.tx.SplitTransactionPlanDAO',
  'net.nanopay.tx.KotakCOTransaction',
  'net.nanopay.tx.KotakTransactionPlanDAO',
  'net.nanopay.tx.NanopayFXTransactionPlanDAO',
  'net.nanopay.tx.AbliiTransactionDAO',
  'net.nanopay.tx.NanopayTransactionFeeDAO',
  'net.nanopay.tx.TestTransaction',
  'net.nanopay.tx.AbliiTransaction',
  'net.nanopay.tx.InterestTransaction',
  'net.nanopay.retail.model.DeviceStatus',
  'net.nanopay.retail.model.Device',
  'net.nanopay.retail.model.P2PTxnRequestStatus',
  'net.nanopay.retail.model.P2PTxnRequest',
  'net.nanopay.fx.FXLineItem',
  'net.nanopay.fx.ascendantfx.AscendantFX',
  'net.nanopay.fx.ascendantfx.AscendantFXTransaction',
  'net.nanopay.fx.ascendantfx.AscendantFXTransactionPlanDAO',
  'net.nanopay.fx.ascendantfx.AscendantFXCOTransaction',
  'net.nanopay.fx.ascendantfx.AscendantFXUser',
  'net.nanopay.fx.ascendantfx.AscendantFXFeeLineItem',
  'net.nanopay.fx.ascendantfx.AscendantUserPayeeJunction',
  'net.nanopay.fx.ascendantfx.AscendantFXHoldingAccount',
  'net.nanopay.fx.ascendantfx.AscendantFXPaymentMethodType',
  'net.nanopay.fx.ascendantfx.AscendantFXCredientials',
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
  'net.nanopay.auth.LoginAttempt',
  'net.nanopay.fx.interac.model.ExchangerateApiModel',
  'net.nanopay.fx.interac.model.AcceptRateApiModel',
  'net.nanopay.fx.interac.model.AcceptExchangeRateFields',

  'net.nanopay.fx.FXService',
  'net.nanopay.fx.client.ClientFXService',
  'net.nanopay.fx.FXAccepted',
  'net.nanopay.fx.FXDirection',
  'net.nanopay.fx.FXProvider',
  'net.nanopay.fx.KotakFXProvider',

  'net.nanopay.fx.GetFXQuote',
  'net.nanopay.fx.AcceptFXRate',
  'net.nanopay.fx.FXQuote',

  // documents
  'net.nanopay.documents.AcceptanceDocument',
  'net.nanopay.documents.UserAcceptanceDocument',
  'net.nanopay.documents.AcceptanceDocumentService',
  'net.nanopay.documents.ClientAcceptanceDocumentService',
  'net.nanopay.documents.AcceptanceDocumentType',

  // tx tests
  'net.nanopay.tx.model.TransactionParseTest',

  // tax
  'net.nanopay.tax.TaxQuote',
  'net.nanopay.tax.TaxQuoteRequest',
  'net.nanopay.tax.TaxService',
  'net.nanopay.tax.TaxItem',
  'net.nanopay.tax.TaxSummary',
  'net.nanopay.tax.LineItemTax',


  // PaymentAccountInfo
  'net.nanopay.cico.CICOPaymentType',
  'net.nanopay.cico.model.PaymentAccountInfo',
  'net.nanopay.cico.model.RealexPaymentAccountInfo',
  'net.nanopay.cico.model.MobileWallet',

  // auth
  'net.nanopay.security.auth.LoginAttemptAuthService',
  'net.nanopay.security.auth.IPLoggingAuthService',

  // PII
  'net.nanopay.security.pii.PII',
  'net.nanopay.security.pii.PIIReportGenerator',
  'net.nanopay.security.pii.ViewPIIRequest',
  'net.nanopay.security.pii.PIIRequestStatus',
  'net.nanopay.security.pii.PIIDisplayStatus',
  'net.nanopay.security.pii.PIIReportDownload',
  'net.nanopay.security.pii.ApprovedPIIRequestDAO',
  'net.nanopay.security.pii.PreventDuplicatePIIRequestsDAO',
  'net.nanopay.security.pii.FreezeApprovedPIIRequestsDAO',

  // security
  'net.nanopay.security.EncryptedObject',
  'net.nanopay.security.EncryptingDAO',
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
  'net.nanopay.security.test.EncryptingDAOTest',
  'net.nanopay.security.test.HashedJSONParserTest',
  'net.nanopay.security.test.HashingJournalTest',
  'net.nanopay.security.test.HashingOutputterTest',
  'net.nanopay.security.test.HashingWriterTest',
  'net.nanopay.security.test.LoginAttemptAuthServiceTest',
  'net.nanopay.security.test.MerkleTreeHelperTest',
  'net.nanopay.security.test.MerkleTreeTest',
  'net.nanopay.security.test.PayerAssentTransactionDAOTest',
  'net.nanopay.security.test.PKCS11KeyStoreManagerTest',
  'net.nanopay.security.test.PKCS12KeyStoreManagerTest',
  'net.nanopay.security.test.ReceiptGeneratingDAOTest',
  'net.nanopay.security.test.ReceiptSerializationTest',
  'net.nanopay.security.test.UserKeyPairGenerationDAOTest',
  'net.nanopay.security.test.ViewPIIRequestDAOTest',
  'net.nanopay.security.test.RollingJournalTest',

  // receipt
  'net.nanopay.security.receipt.Receipt',
  'net.nanopay.security.receipt.ReceiptGenerator',
  'net.nanopay.security.receipt.TimedBasedReceiptGenerator',
  'net.nanopay.security.receipt.ReceiptGeneratingDAO',

  // password entropy
  'net.nanopay.auth.passwordutil.ClientPasswordEntropy',
  'net.nanopay.auth.passwordutil.PasswordEntropy',
  'net.nanopay.auth.passwordutil.PasswordStrengthCalculator',

  // snapshot
  'net.nanopay.security.snapshooter.RollingJournal',
  'net.nanopay.security.snapshooter.RollingJDAO',

  // tests
  'net.nanopay.test.DateAndPlaceOfBirthDAOTest',
  'net.nanopay.test.BranchDAOTest',
  'net.nanopay.test.BusinessSectorDAOTest',

  'net.nanopay.test.ModelledTest',
  'net.nanopay.auth.PublicUserInfoDAOTest',
  'net.nanopay.auth.TestWidget',
  'net.nanopay.auth.ExternalInvoiceTokenTest',
  'net.nanopay.invoice.AuthenticatedInvoiceDAOTest',
  'net.nanopay.test.TestsReporter',
  'net.nanopay.test.TestReport',
  'net.nanopay.tx.alterna.test.EFTTest',
  'net.nanopay.invoice.model.InvoiceTest',
  'net.nanopay.auth.BusinessAgentAuthService',
  'net.nanopay.auth.BusinessAuthService',
  'net.nanopay.auth.AgentJunctionStatus',
  'net.nanopay.auth.email.DoNotSolicit',
  'net.nanopay.auth.email.PreventDuplicateEmailDAO',
  'net.nanopay.auth.email.EmailWhitelistEntry',

  // iso20022 tests
  'net.nanopay.iso20022.ISODateTest',
  'net.nanopay.iso20022.ISODateTimeTest',
  'net.nanopay.iso20022.ISOTimeTest',

  // meter
  'net.nanopay.meter.Blacklist',
  'net.nanopay.meter.BlacklistEntityType',
  'net.nanopay.meter.IpHistory',
  'net.nanopay.meter.AdditionalDocumentsUpdatedIpHistoryDAO',
  'net.nanopay.meter.SigningOfficerAssignedIpHistoryDAO',
  'net.nanopay.meter.Report',
  'net.nanopay.meter.SkipNullReferencedPropertyDAO',
  'net.nanopay.meter.BusinessStatusContactDAO',
  'net.nanopay.meter.compliance.ComplianceAuthService',
  'net.nanopay.meter.compliance.ComplianceAware',
  'net.nanopay.meter.compliance.ComplianceValidationStatus',
  'net.nanopay.meter.compliance.ComplianceService',
  'net.nanopay.meter.compliance.NanopayComplianceService',
  'net.nanopay.meter.compliance.canadianSanction.Record',
  'net.nanopay.meter.compliance.CanadianSanctionValidator',
  'net.nanopay.meter.compliance.secureFact.CanadianUserOnboarding',
  'net.nanopay.meter.compliance.secureFact.CanadianBusinessOnboarding',
  'net.nanopay.meter.compliance.secureFact.ResponseError',
  'net.nanopay.meter.compliance.secureFact.SecurefactRequest',
  'net.nanopay.meter.compliance.secureFact.SecurefactResponse',
  'net.nanopay.meter.compliance.secureFact.SecurefactService',
  'net.nanopay.meter.compliance.secureFact.sidni.SIDniValidator',
  'net.nanopay.meter.compliance.secureFact.sidni.model.SIDniRequest',
  'net.nanopay.meter.compliance.secureFact.sidni.model.SIDniCustomer',
  'net.nanopay.meter.compliance.secureFact.sidni.model.SIDniName',
  'net.nanopay.meter.compliance.secureFact.sidni.model.SIDniAddress',
  'net.nanopay.meter.compliance.secureFact.sidni.model.SIDniPhone',
  'net.nanopay.meter.compliance.secureFact.sidni.model.SIDniErrorComponent',
  'net.nanopay.meter.compliance.secureFact.sidni.model.SIDniResponse',
  'net.nanopay.meter.compliance.secureFact.sidni.model.SIDniAdditionalMatchInfo',
  'net.nanopay.meter.compliance.secureFact.sidni.model.SIDniDataSources',
  'net.nanopay.meter.compliance.secureFact.lev.LEVValidator',
  'net.nanopay.meter.compliance.secureFact.lev.model.LEVApplicant',
  'net.nanopay.meter.compliance.secureFact.lev.model.LEVChange',
  'net.nanopay.meter.compliance.secureFact.lev.model.LEVError',
  'net.nanopay.meter.compliance.secureFact.lev.model.LEVIndividualScores',
  'net.nanopay.meter.compliance.secureFact.lev.model.LEVRequest',
  'net.nanopay.meter.compliance.secureFact.lev.model.LEVResponse',
  'net.nanopay.meter.compliance.secureFact.lev.model.LEVResult',


  // meter tests
  'net.nanopay.meter.test.BlockDisabledUserTransactionTest',
  'net.nanopay.meter.test.BlockDisabledUserInvoiceTest',
  'net.nanopay.meter.test.ComplianceAwareDummy',

  'net.nanopay.security.auth.LogoutDisabledUserDAO',
];

var abstractClasses = [
];

var skeletons = [
  'net.nanopay.account.DigitalAccountServiceInterface',
  'net.nanopay.documents.AcceptanceDocumentService',
  'net.nanopay.integration.IntegrationService',
  'net.nanopay.cico.service.BankAccountVerifier',
  'net.nanopay.tx.alterna.SFTPService',
  'net.nanopay.fx.ExchangeRateInterface',
  'net.nanopay.fx.FXService',
  'net.nanopay.tx.UserTransactionLimit',
  'net.nanopay.liquidity.LiquidityAuth',
  'net.nanopay.auth.passwordutil.PasswordEntropy',
  'net.nanopay.payment.PaymentService',
  'net.nanopay.invoice.service.InvoicePaymentService',
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
