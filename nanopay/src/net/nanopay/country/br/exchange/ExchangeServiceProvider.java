/**
 * NANOPAY CONFIDENTIAL
 *
 * [2020] nanopay Corporation
 * All Rights Reserved.
 *
 * NOTICE:  All information contained herein is, and remains
 * the property of nanopay Corporation.
 * The intellectual and technical concepts contained
 * herein are proprietary to nanopay Corporation
 * and may be covered by Canadian and Foreign Patents, patents
 * in process, and are protected by trade secret or copyright law.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from nanopay Corporation.
 */
package net.nanopay.country.br.exchange;

import org.apache.commons.lang3.StringUtils;
import foam.core.X;
import foam.dao.ArraySink;
import foam.dao.DAO;
import foam.nanos.auth.Address;
import foam.nanos.auth.Country;
import foam.nanos.auth.User;
import foam.nanos.crunch.CapabilityJunctionPayload;
import foam.nanos.crunch.Capability;
import foam.nanos.crunch.UserCapabilityJunction;
import foam.nanos.logger.Logger;
import foam.util.SafetyUtil;

import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.util.*;

import net.nanopay.bank.BankAccount;
import net.nanopay.contacts.Contact;
import net.nanopay.country.br.BrazilBusinessInfoData;
import net.nanopay.country.br.CPF;
import net.nanopay.country.br.exchange.Pais;
import net.nanopay.country.br.NatureCode;
import net.nanopay.country.br.tx.NatureCodeLineItem;
import net.nanopay.invoice.model.Invoice;
import net.nanopay.meter.clearing.ClearingTimeService;
import net.nanopay.model.Business;
import net.nanopay.payment.Institution;
import net.nanopay.tx.FeeLineItem;
import net.nanopay.tx.FeeSummaryTransactionLineItem;
import net.nanopay.tx.fee.Rate;
import net.nanopay.tx.model.Transaction;
import net.nanopay.tx.model.TransactionStatus;
import net.nanopay.tx.TransactionLineItem;

import static foam.mlang.MLang.AND;
import static foam.mlang.MLang.EQ;

public class ExchangeServiceProvider implements ExchangeService {

  private Exchange exchangeClient;
  private final Logger logger_;
  private  X x;

  public ExchangeServiceProvider(X x, final Exchange exchangeClient) {
    this.exchangeClient = exchangeClient;
    this.logger_ = (Logger) x.get("logger");
    this.x = x;
  }

  protected String getName(User user) {
    if ( user instanceof Business ) return ((Business) user).getBusinessName();
    return user.getLegalName();
  }

  protected String findCpfCnpj(long userId) {
    User user = (User) ((DAO) this.x.get("localUserDAO")).find(userId);
    if ( user instanceof Business ) return findCNPJ(userId);

    return findCPF(userId);
  }

  protected String findCNPJ(long userId) {
    UserCapabilityJunction ucj = (UserCapabilityJunction) ((DAO) this.x.get("bareUserCapabilityJunctionDAO")).find(AND(
      EQ(UserCapabilityJunction.TARGET_ID, "688cb7c6-7316-4bbf-8483-fb79f8fdeaaf"),
      EQ(UserCapabilityJunction.SOURCE_ID, userId)
    ));

    return ucj != null && ucj.getData() != null ?  ((BrazilBusinessInfoData)ucj.getData()).getCnpj() : "";
  }

  protected String findCPF(long userId) {
    UserCapabilityJunction ucj = (UserCapabilityJunction) ((DAO) this.x.get("bareUserCapabilityJunctionDAO")).find(AND(
      EQ(UserCapabilityJunction.TARGET_ID, "fb7d3ca2-62f2-4caf-a84c-860392e4676b"),
      EQ(UserCapabilityJunction.SOURCE_ID, userId)
    ));

    return  ( ucj != null && ucj.getData() != null ) ? ((CPF) ucj.getData()).getData() : "";
  }

  public ExchangeCustomer createExchangeCustomerDefault(long userId) throws RuntimeException {
    ExchangeCredential credential = (ExchangeCredential) x.get("exchangeCredential");
    return createExchangeCustomer(userId, credential.getDefaultLimit());
  }

  public ExchangeCustomer createExchangeCustomer(long userId, long amount) throws RuntimeException {
    User user = (User) ((DAO) this.x.get("localUserDAO")).find(userId);
    if ( user == null ) throw new RuntimeException("User not found: " + userId);

    try {
      ExchangeCustomer existingExchangeCustomer = findExchangeCustomer(user);
      if ( existingExchangeCustomer != null ) return existingExchangeCustomer;
    } catch(Throwable t) {
      logger_.error("Error thrown while checking if Exchange user exists already. Would proceed to create anyways." , t);
    }

    InsertTitular request = new InsertTitular();
    request.setDadosTitular(getTitularRequest(user, amount));
    try {
      InsertTitularResponse response = exchangeClient.insertTitular(request);
      if ( response == null || response.getInsertTitularResult() == null )
        throw new RuntimeException("Unable to get a valid response from Exchange while calling insertTitular");

      if ( response.getInsertTitularResult().getCODRETORNO() != 0 )
        throw new RuntimeException("Error while calling insertTitular: " + response.getInsertTitularResult().getMENSAGEM());

      return saveExchangeCustomer(user, "Active", user.getSpid());
    } catch(Throwable t) {
      logger_.error("Error updating Titular" , t);
      throw new RuntimeException(t);
    }
  }

  public ExchangeCustomer findExchangeCustomer(User user) {
    ExchangeCustomer exchangeCustomer =  (ExchangeCustomer) ((DAO)
      this.x.get("brazilExchangeCustomerDAO")).find(EQ(ExchangeCustomer.USER, user.getId()));

    if ( exchangeCustomer !=  null ) return exchangeCustomer;

    if ( getExchangeCustomer(user.getId()) != null )
      return saveExchangeCustomer(user, "Active", user.getSpid());

    return null;
  }

  protected ExchangeCustomer saveExchangeCustomer(User user , String status, String spid) {
    DAO exchangeCustomerDAO = (DAO) this.x.get("brazilExchangeCustomerDAO");
    ExchangeCustomer client  = (ExchangeCustomer) ((DAO)
      this.x.get("brazilExchangeCustomerDAO")).find(EQ(ExchangeCustomer.USER, user.getId()));
    if ( client == null ) {
      client = (ExchangeCustomer) exchangeCustomerDAO.put(new ExchangeCustomer.Builder(this.x)
        .setUser(user.getId())
        .setStatus(status)
        .setSpid(spid)
        .build());
    }
    return client;
  }

  public Titular getExchangeCustomer(long userId) throws RuntimeException {
    SearchTitular request = new SearchTitular();
    String formattedcpfCnpj = findCpfCnpj(userId).replaceAll("[^0-9]", "");
    request.setCODIGO(formattedcpfCnpj);
    SearchTitularResponse response = exchangeClient.searchTitular(request);
    if ( response == null || response.getSearchTitularResult() == null )
      throw new RuntimeException("Unable to get a valid response from Exchange while calling SearchTitular");

    ServiceStatus status = response.getSearchTitularResult().getServiceStatus();
    if ( status == null )
      throw new RuntimeException("Unable to get a valid response from Exchange while calling SearchTitular");

    if ( status.getCODRETORNO() != 0 || response.getSearchTitularResult().getTitular() == null )
      throw new RuntimeException("Error while calling SearchTitular: " + status.getMENSAGEM());

    return response.getSearchTitularResult().getTitular();
  }

  public Titular getExchangeCustomerLimit(long userId) throws RuntimeException {
    SearchTitularCapFin request = new SearchTitularCapFin();
    String formattedcpfCnpj = findCpfCnpj(userId).replaceAll("[^0-9]", "");
    request.setCODIGO(formattedcpfCnpj);
    SearchTitularCapFinResponse response = exchangeClient.searchTitularCapFin(request);
    if ( response == null || response.getSearchTitularCapFinResult() == null )
      throw new RuntimeException("Unable to get a valid response from Exchange while calling SearchTitularCapFin");

    ServiceStatus status = response.getSearchTitularCapFinResult().getServiceStatus();
    if ( status == null )
      throw new RuntimeException("Unable to get a valid response from Exchange while calling SearchTitularCapFin");

    if ( status.getCODRETORNO() != 0 || response.getSearchTitularCapFinResult().getTitular() == null )
      throw new RuntimeException("Error while calling SearchTitularCapFin: " + status.getMENSAGEM());

    return response.getSearchTitularCapFinResult().getTitular();
  }

  public long getTransactionLimit(long userId) throws RuntimeException {
    Titular titular = getExchangeCustomerLimit(userId);
    return Double.valueOf(titular.getLIMITEOP() - titular.getUTILIZADO()).longValue();
  }

  public void updateTransactionLimit(long userId, long amount) throws RuntimeException {
    User user = (User) ((DAO) this.x.get("localUserDAO")).find(userId);
    if ( user == null ) throw new RuntimeException("User not found: " + userId);
    UpdateTitular request = new UpdateTitular();
    Titular titular = getTitularRequest(user, amount);
    request.setDadosTitular(titular);
    try {
      UpdateTitularResponse response = exchangeClient.updateTitular(request);
      if ( response == null || response.getUpdateTitularResult() == null )
        throw new RuntimeException("Unable to get a valid response from Exchange while calling updateTitular");

      if ( response.getUpdateTitularResult().getCODRETORNO() != 0 )
        throw new RuntimeException("Error while calling updateTitular: " + response.getUpdateTitularResult().getMENSAGEM());
    } catch(Throwable t) {
      logger_.error("Error updating Titular" , t);
      throw new RuntimeException(t);
    }
  }

  protected Titular getTitularRequest(User user, long amount) {
    if ( user == null ) throw new RuntimeException("User cannot be null");
    if ( user.getAddress() == null ) throw new RuntimeException("User address cannot be null: " + user.getId());
    ExchangeClientValues exchangeClientValues = getExchangeClientValues(user.getSpid());
    if ( exchangeClientValues == null )
      throw new RuntimeException("Exchange is not properly configured. Missing exchange client values.");

    Titular titular = new Titular();
    titular.setAGENCIA(exchangeClientValues.getAgencia());
    titular.setDTINICIO(user.getCreated());
    String formattedCpfCnpj = findCpfCnpj(user.getId()).replaceAll("[^0-9]", "");
    if ( SafetyUtil.isEmpty(formattedCpfCnpj) ) throw new RuntimeException("Invalid CNPJ");
    titular.setCODIGO(formattedCpfCnpj); // e.g 10786348070
    titular.setTIPO(1);
    titular.setSUBTIPO("J"); // F = Physical, J = Legal, S = Symbolic
    titular.setNOMEAB(StringUtils.abbreviate(getName(user), 15));
    titular.setNOME(getName(user));
    titular.setENDERECO(user.getAddress().getAddress());
    titular.setCIDADE(user.getAddress().getCity());
    titular.setESTADO(user.getAddress().getRegionId().substring(3,5));
    titular.setCEP(user.getAddress().getPostalCode());
    Pais pais = (Pais) ((DAO) this.x.get("paisDAO")).find(EQ(Pais.SWIFT, user.getAddress().getCountryId()));
    if ( pais != null ) {
      titular.setPAIS(pais.getPais());
      titular.setPAISMT(pais.getPais());
    }
    titular.setLIMITEOP(new Long(amount).doubleValue());

    return titular;
  }

  public Transaction createTransaction(Transaction transaction) throws RuntimeException {
    Transaction summaryTransaction = transaction.findRoot(this.x);
    BankAccount bankAccount = (BankAccount)summaryTransaction.findDestinationAccount(this.x);
    if ( null == bankAccount ) throw new RuntimeException("Invalid destination bank account " + summaryTransaction.getId());
    User receiver = bankAccount.findOwner(this.x);
    if ( receiver == null ) throw new RuntimeException("Destination User not found: " + bankAccount.getOwner());

    BankAccount srcBankAccount = (BankAccount)summaryTransaction.findSourceAccount(this.x);
    if ( null == srcBankAccount ) throw new RuntimeException("Invalid source bank account " + summaryTransaction.getId());
    User payer = srcBankAccount.findOwner(x);
    if ( payer == null ) throw new RuntimeException("Source user not found: " + srcBankAccount.getOwner());

    ExchangeClientValues exchangeClientValues = getExchangeClientValues(payer.getSpid());
    if ( exchangeClientValues == null )
      throw new RuntimeException("Exchange is not properly configured. Missing exchange client values.");

    InsertBoleto request = new InsertBoleto();
    Boleto dadosBoleto = new Boleto();
    dadosBoleto.setAGENCIA(exchangeClientValues.getAgencia());
    dadosBoleto.setBANCO(exchangeClientValues.getBANCO());
    dadosBoleto.setBANCOBEN0(exchangeClientValues.getBeneficiaryType());

    Institution institution = (Institution) ((DAO) this.x.get("institutionDAO")).find(bankAccount.getInstitution());
    if ( institution != null ) {
      dadosBoleto.setBANCOBEN1(institution.getSwiftCode());
      dadosBoleto.setPAGADORS(institution.getSwiftCode());
      dadosBoleto.setESP5(getESP("SWIFT CODE: ", institution.getSwiftCode(),
        " - IBAN:  ", bankAccount.getIban(), " - DETAILS OF CHARGE: "));
    }
    Address bankAddress = bankAccount.getAddress() == null ? bankAccount.getBankAddress() : bankAccount.getAddress();
    if ( bankAddress != null ) dadosBoleto.setBANCOBEN3(bankAddress.getCity());

    dadosBoleto.setCLAUSULAXX(false);
    String formattedCpfCnpj = findCpfCnpj(payer.getId()).replaceAll("[^0-9]", "");
    dadosBoleto.setCNPJPCPFCLIENTE(formattedCpfCnpj); // eg 10786348070

    SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy");
    sdf.setTimeZone(TimeZone.getTimeZone("UTC"));
    String today = sdf.format(new Date());
    Date completionDate = transaction.getCompletionDate();
    if ( completionDate == null ) {
      completionDate = ((ClearingTimeService) this.x.get("clearingTimeService")).estimateCompletionDateSimple(this.x, transaction);
      transaction.setCompletionDate(completionDate);
    }

    try {
      String completionDateString = sdf.format(completionDate);
      dadosBoleto.setDATALQ(completionDateString);
      dadosBoleto.setDATAME(completionDateString); // TODO Foreign currency delivery date ( DD / MM / YYYY)
      dadosBoleto.setDATAMN(today);
      dadosBoleto.setDATAOP(today);
      dadosBoleto.setDATAEN(today);
    } catch(Throwable t) {
      logger_.error("Unable to parse completion date", t);
      throw new RuntimeException("Error inserting boleto. Cound not parse completion date.");
    }

    dadosBoleto.setFORMAME(exchangeClientValues.getFORMAME());
    dadosBoleto.setFORMAMN(exchangeClientValues.getFORMAEN());
    dadosBoleto.setFORMAEN(exchangeClientValues.getFORMAEN());
    dadosBoleto.setFLUXOME(dadosBoleto.getFLUXOME());
    dadosBoleto.setGIRO(exchangeClientValues.getGIRO());
    dadosBoleto.setIMPRESSO(exchangeClientValues.getIMPRESSO());
    dadosBoleto.setOPLINHA(exchangeClientValues.getOPLINHA());
    dadosBoleto.setPLATBMF(exchangeClientValues.getPLATBMF());
    dadosBoleto.setRSISB(exchangeClientValues.getRSISB());
    dadosBoleto.setSEGMENTO(dadosBoleto.getSEGMENTO());
    dadosBoleto.setTIPO(exchangeClientValues.getTIPO());
    dadosBoleto.setTIPOCT("");
    dadosBoleto.setTPADTO("%");

    Moeda moeda = (Moeda) ((DAO) this.x.get("moedaDAO")).find(EQ(Moeda.SIMBOLO, bankAccount.getDenomination()));
    if ( moeda != null ) dadosBoleto.setMOEDA(moeda.getMoeda());
    dadosBoleto.setLEILAO(exchangeClientValues.getLEILAO());
    dadosBoleto.setAVISO2(exchangeClientValues.getAVISO2());
    dadosBoleto.setSTATUS(exchangeClientValues.getInitialStatus());
    String  natureCode = extractNatureCode(summaryTransaction);
    dadosBoleto.setNATUREZA(natureCode);
    List<Natureza> natureza = searchNatureCode(natureCode);
    if ( natureza != null && natureza.size() > 0 ) {
      dadosBoleto.setCLAUSULA01(natureza.get(0).getCpClausula1());
    }
    dadosBoleto.setOBSERVACAO("");
    dadosBoleto.setPAGADOR(getName(receiver));
    dadosBoleto.setPAGADORC(bankAccount.getIban());
    dadosBoleto.setGERENTE(exchangeClientValues.getGERENTE());
    dadosBoleto.setESP1(getESP("FORMA DE PAGAMENTO: ", dadosBoleto.getFORMAEN(),
      " - DATA: ", today));
    dadosBoleto.setESP6(getESP("OUR - INST.FINANC .: ", exchangeClientValues.getProcessorName()));

    Country userCountry = null;
    Address receiverAddress = receiver instanceof Contact ? ((Contact)receiver).getBusinessAddress() : receiver.getAddress();
    if ( receiverAddress != null ) {
      userCountry = receiverAddress.findCountryId(this.x);
      dadosBoleto.setPAGADORCD(receiverAddress.getCity());
      dadosBoleto.setPAGADORE(receiverAddress.getAddress());
      Pais sourcePais = (Pais) ((DAO) this.x.get("paisDAO")).find(EQ(Pais.SWIFT, userCountry.getCode()));
      if ( sourcePais != null ) dadosBoleto.setPAIS(sourcePais.getPais());
    }

    double sourceAmount = toDecimal(summaryTransaction.getAmount());
    double destinationAmount = toDecimal(summaryTransaction.getDestinationAmount());
    Double ftt = extractRate(summaryTransaction, "FTT Rate");
    if ( ftt != null ) {
      double rate = ftt.doubleValue() * 100;
      dadosBoleto.setIOFTAXA(rate);
      dadosBoleto.setIOFVALOR((destinationAmount * rate)/100);
      dadosBoleto.setIOFBASE(destinationAmount);
      dadosBoleto.setESP2(getESP("IOF: ", String.valueOf(rate), " RS ", String.valueOf(dadosBoleto.getIOFVALOR())));
    }

    dadosBoleto.setESP3(getESP("PAG./REC. NO EXT.: ", getName(receiver),
      " - PAIS: ", userCountry == null  ? " " : userCountry.getName(), " - RELACAO"));
    Double taxaop = extractRate(summaryTransaction, "Total Rate");
    if ( taxaop != null ) dadosBoleto.setTAXAOP(taxaop);
    Double taxanv = extractRate(summaryTransaction, "Currency Value Rate");
    if ( taxaop != null ) dadosBoleto.setTAXANV(taxanv);
    Double totalFeeRate = extractRate(summaryTransaction, "Treviso Fee");
    if ( totalFeeRate != null ) dadosBoleto.setVALORR((totalFeeRate.longValue())/100);
    Double spotRate = extractRate(summaryTransaction, "Spot Rate");
    if ( spotRate != null ) dadosBoleto.setPARIDADE(spotRate);

    dadosBoleto.setVINCULO(getContactRelationship(payer, receiver));
    dadosBoleto.setYIELD(sourceAmount/destinationAmount);
    dadosBoleto.setVALORME(destinationAmount);
    dadosBoleto.setVALORMN(sourceAmount);
    request.setDadosBoleto(dadosBoleto);
    InsertBoletoResponse response = exchangeClient.insertBoleto(request);
    if ( response == null || response.getInsertBoletoResult() == null )
      throw new RuntimeException("Unable to get a valid response from Exchange while calling insertBoleto");

    if ( response.getInsertBoletoResult().getCODRETORNO() != 0 )
      throw new RuntimeException("Error while calling insertBoleto: " + response.getInsertBoletoResult().getMENSAGEM());

    transaction.setExternalInvoiceId(response.getInsertBoletoResult().getNRREFERENCE());
    transaction.setStatus(TransactionStatus.SENT);
    transaction.setCompletionDate(completionDate);
    return transaction;
  }

  protected ExchangeClientValues getExchangeClientValues(String spid) {
    return (ExchangeClientValues) ((DAO) this.x.get("exchangeClientValueDAO"))
      .find(EQ(ExchangeClientValues.SPID, spid));
  }

  protected String getESP(String... str) {
    StringBuilder esp = new StringBuilder();
    for ( String s : str ) esp.append(s);

    return esp.toString();
  }

  protected Double extractRate(Transaction txn, String rateName) {
    if ( txn == null || rateName == null ) return null;
    for (TransactionLineItem lineItem : txn.getLineItems() ) {
      if ( lineItem instanceof FeeSummaryTransactionLineItem ) {
        for (TransactionLineItem feeLineItem : ((FeeSummaryTransactionLineItem) lineItem).getLineItems() ) {
          if ( feeLineItem instanceof FeeLineItem ) {
            for ( Rate rate: ((FeeLineItem) feeLineItem).getRates() ) {
              if ( rateName.equals(rate.getName()) ) return rate.getValue(txn);
            }
          }
        }
      }
    }
    return null;
  }

  protected String extractNatureCode(Transaction txn) {
    return getNatureCodeFromInvoice(txn);
//    if ( txn == null ) return "";
//    for (TransactionLineItem lineItem : txn.getLineItems() ) {
//      if ( lineItem instanceof NatureCodeLineItem )
//        return ((NatureCodeLineItem)lineItem).getCode();
//    }
//    return "";
  }

  protected int getContactRelationship(User payer, User payee) {
    if ( ! (payee instanceof Business) ) return 30; // Contact is not a business

    Contact contact = findContact(payer, payee);
    if ( contact != null && contact.getConfirm() ) return 12; // has relationship with contact

    return 20;
  }

  protected Contact findContact(User payer, User payee) {
    if ( payee instanceof Contact ) return (Contact) payee;

    return (Contact) payer.getContacts(this.x).find(EQ(Contact.BUSINESS_ID, payee.getId()));
  }

  protected String getNatureCodeFromInvoice(Transaction txn) {
    StringBuilder str =  new StringBuilder();
    Invoice invoice = txn.findInvoiceId(x);
    if ( invoice == null ) return str.toString();

    DAO capablePayloadDAO = (DAO) invoice.getCapablePayloadDAO(x);
    List<CapabilityJunctionPayload> capablePayloadLst = (List<CapabilityJunctionPayload>) ((ArraySink) capablePayloadDAO.select(new ArraySink())).getArray();

    for ( CapabilityJunctionPayload capablePayload : capablePayloadLst ) {
      DAO capabilityDAO = (DAO) x.get("capabilityDAO");
      Capability cap = (Capability) capabilityDAO.find(capablePayload.getCapability());
      if ( cap instanceof NatureCode ) {
        NatureCode natureCode = (NatureCode) cap;
        str.append(natureCode.getOperationType());
        str.append(capablePayload.getData().toString());
        break;
      }
    }
    return str.toString();
  }

  public Transaction updateTransactionStatus(Transaction transaction) throws RuntimeException {
    if ( SafetyUtil.isEmpty(transaction.getExternalInvoiceId()) ) return transaction;

    GetBoletoStatus request = new GetBoletoStatus();
    request.setNrBoleto(transaction.getExternalInvoiceId());
    try {
      BoletoStatusResponse response = exchangeClient.getBoletoStatus(request);
      if ( response == null || response.getBoletoStatusResult() == null )
        throw new RuntimeException("Unable to get a valid response from Exchange while calling GetBoletoStatus");

      if ( response.getBoletoStatusResult().getBoleto() == null ||
        response.getBoletoStatusResult().getBoleto().length < 1 )
        throw new RuntimeException("GetBoletoStatus failed, transaction not found in exchange");

      transaction = (Transaction) transaction.fclone();
      Boleto boleto = (Boleto) response.getBoletoStatusResult().getBoleto()[0];
      transaction.setStatus(mapExchangeTransactionStatus(boleto.getSTATUS(), transaction));
      return transaction;
    } catch(Throwable t) {
      logger_.error("Error getting status of transaction from Exchange" , t);
      throw new RuntimeException(t);
    }
  }

  protected TransactionStatus mapExchangeTransactionStatus(String status, Transaction transaction) {
    switch (status) {
      case "E":
        return TransactionStatus.COMPLETED;
      case "M":
        return TransactionStatus.SENT;
      case "R":
        return TransactionStatus.SENT;
      case "F":
        return TransactionStatus.DECLINED;
      default:
        return transaction.getStatus();
    }
  }

  public List searchNatureCode(String natureCode) throws RuntimeException {
    List<Natureza> natureCodes = new ArrayList<>();
    SearchNatureza request  = new SearchNatureza();
    request.setCD_NATUREZA(natureCode);
    try {
      SearchNaturezaResponse response = exchangeClient.searchNatureza(request);
      if ( response == null || response.getSearchNaturezaResult() == null )
        throw new RuntimeException("Unable to get a valid response from Exchange while calling searchNatureza");

      ServiceStatus status = response.getSearchNaturezaResult().getServiceStatus();
      if ( status == null )
        throw new RuntimeException("Unable to get a valid response from Exchange while calling SearchTitular");

      if ( status.getCODRETORNO() != 0 )
        throw new RuntimeException("Error while calling searchNatureza: " + status.getMENSAGEM());

      if ( response.getSearchNaturezaResult().getNatureza() != null ) {
        for ( Natureza nCode : response.getSearchNaturezaResult().getNatureza() ) {
          natureCodes.add(nCode);
        }
      }

      return natureCodes;

    } catch(Throwable t) {
      logger_.error("Error searching nature code" , t);
      throw new RuntimeException(t);
    }
  }

  private Double toDecimal(long value) {
    return (value / 100) + (value % 100) / 100.0;
  }
}
