package net.nanopay.fx.ascendantfx;

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfWriter;
import foam.blob.Blob;
import foam.blob.BlobService;
import foam.blob.IdentifiedBlob;
import foam.blob.ProxyBlobService;
import foam.core.X;
import foam.dao.DAO;
import foam.dao.ArraySink;
import foam.nanos.auth.User;
import foam.nanos.auth.UserUserJunction;
import foam.nanos.http.WebAgent;
import foam.nanos.logger.Logger;
import net.nanopay.account.Account;
import net.nanopay.bank.BankAccount;
import net.nanopay.bank.BankAccountStatus;
import net.nanopay.bank.CABankAccount;
import net.nanopay.bank.USBankAccount;
import net.nanopay.flinks.model.FlinksAccountsDetailResponse;
import net.nanopay.meter.IpHistory;
import net.nanopay.model.*;
import net.nanopay.payment.Institution;
import org.apache.commons.io.FileUtils;
import org.apache.commons.io.IOUtils;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.text.SimpleDateFormat;
import java.text.DecimalFormat;
import java.util.Date;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import static foam.mlang.MLang.*;

public class AscendantFXReportsWebAgent extends ProxyBlobService implements WebAgent {

  protected String name_;

  public AscendantFXReportsWebAgent(X x, BlobService delegate) {
    this(x, "AscendantFXReports", delegate);
  }

  public AscendantFXReportsWebAgent(X x, String name, BlobService delegate) {
    setX(x);
    setDelegate(delegate);
    name_ = name;
  }

  @Override
  public void execute(X x) {
    DAO    userDAO           = (DAO) x.get("localUserDAO");
    DAO    agentJunctionDAO  = (DAO) x.get("agentJunctionDAO");
    Logger logger            = (Logger) x.get("logger");

    HttpServletRequest req     = x.get(HttpServletRequest.class);

    String id = req.getParameter("userId");
    User user = (User) userDAO.find(id);
    Business business;

    if ( user instanceof Business ) {
      business = (Business) user;
    } else {
      UserUserJunction userUserJunction = (UserUserJunction) agentJunctionDAO.find(EQ(UserUserJunction.SOURCE_ID, user.getId()));
      business = (Business) userDAO.find(userUserJunction.getTargetId());
    }

    try {
      // create a temporary folder to save files before zipping
      FileUtils.forceMkdir(new File("/opt/nanopay/AFXReportsTemp/"));

      File[] signingOfficerReports = generateSigningOfficersReports(x, business);
      File[] signingOfficerIDs = getSigningOfficerIDs(x, business);
      File[] srcFiles = new File[6 + signingOfficerReports.length + signingOfficerIDs.length];
      srcFiles[0] = generateCompanyInfo(x, business);
      srcFiles[1] = generateBeneficialOwners(x, business);
      srcFiles[2] = generateBankInfo(x, business);
      srcFiles[3] = getBusinessDoc(x, business);
      srcFiles[4] = getUSBankAccountProof(x, business);
      srcFiles[5] = getBeneficialOwnersDoc(x, business);
      System.arraycopy(signingOfficerReports, 0, srcFiles, 6, signingOfficerReports.length);
      System.arraycopy(signingOfficerIDs, 0, srcFiles, 6 + signingOfficerReports.length, signingOfficerIDs.length);

      downloadZipFile(x, business, srcFiles);

      // delete the temporary folder. Later if we want to archive those files, we can keep the folder.
      FileUtils.deleteDirectory(new File("/opt/nanopay/AFXReportsTemp/"));
    } catch (IOException e) {
      logger.error(e);
    } catch (Throwable t) {
      logger.error("Error generating compliance report package: ", t);
      throw new RuntimeException(t);
    }
  }


  private File generateCompanyInfo(X x, Business business) {
    DAO    businessTypeDAO   = (DAO) x.get("businessTypeDAO");
    DAO    businessSectorDAO = (DAO) x.get("businessSectorDAO");
    Logger logger            = (Logger) x.get("logger");

    SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
    BusinessType type = (BusinessType) businessTypeDAO.find(business.getBusinessTypeId());
    String businessType = type.getName();
    String businessName = business.getBusinessName();
    String operatingName = business.getOperatingBusinessName();
    String streetAddress = business.getBusinessAddress().getStreetNumber() + " " + business.getBusinessAddress().getStreetName();
    String city = business.getBusinessAddress().getCity();
    String province = business.getBusinessAddress().getRegionId();
    String country = business.getBusinessAddress().getCountryId();
    String postalCode = business.getBusinessAddress().getPostalCode();
    String businessPhoneNumber = business.getBusinessPhone().getNumber();
    BusinessSector businessSector = (BusinessSector) businessSectorDAO.find(business.getBusinessSectorId());
    String industry = businessSector.getName();
    String baseCurrency = business.getSuggestedUserTransactionInfo().getBaseCurrency();
    String isThirdParty = business.getThirdParty() ? "Yes" : "No";
    String targetCustomers = business.getTargetCustomers();
    String sourceOfFunds = business.getSourceOfFunds();
    String isHoldingCompany = business.getHoldingCompany() ? "Yes" : "No";
    String annualRevenue = business.getSuggestedUserTransactionInfo().getAnnualRevenue();
    String internationalTransactions = business.getSuggestedUserTransactionInfo().getInternationalPayments() ? "Yes" : "No";
    String residenceOperated = business.getResidenceOperated() ? "Yes" : "No";

    SimpleDateFormat df = new SimpleDateFormat("yyyy/MM/dd, HH:mm:ss");
    String reportGeneratedDate = df.format(new Date());

    String path = "/opt/nanopay/AFXReportsTemp/[" + businessName + "]CompanyInfo.pdf";

    try {
      Document document = new Document();
      PdfWriter writer = PdfWriter.getInstance(document, new FileOutputStream(path));
      document.open();
      document.add(new Paragraph("Company Information"));

      List list = new List(List.UNORDERED);
      list.add(new ListItem("Type of Business: " + businessType));
      list.add(new ListItem("Legal Name of Business: " + businessName));
      if ( operatingName.length() != 0 ) {
        list.add(new ListItem("Operating Name: " + operatingName));
      }
      list.add(new ListItem("Street Address: " + streetAddress));
      list.add(new ListItem("City: " + city));
      list.add(new ListItem("State/Province: " + province));
      list.add(new ListItem("Country: " + country));
      list.add(new ListItem("ZIP/Postal Code: " + postalCode));
      list.add(new ListItem("Business Phone Number: " + businessPhoneNumber));
      list.add(new ListItem("Industry: " + industry + " (" + businessSector.getId() + ") - NAICS"));
      if ( country.equals("US") ) {
        String taxId = business.getTaxIdentificationNumber();
        list.add(new ListItem("Tax Identification Number: " + taxId));
      }
      list.add(new ListItem("Do you operate this business from your residence? " + residenceOperated));
      list.add(new ListItem("Are you taking instructions from and/or conducting transactions on behalf of a 3rd party? " + isThirdParty));
      list.add(new ListItem("Who do you market your products and services to? " + targetCustomers));
      list.add(new ListItem("Source of Funds (Where did you acquire the funds used to pay us?): " + sourceOfFunds));
      list.add(new ListItem("Is this a holding company? " + isHoldingCompany));
      list.add(new ListItem("Annual gross sales in your base currency: " + annualRevenue));
      list.add(new ListItem("Base currency: " + baseCurrency));
      list.add(new ListItem("Are you sending or receiving international payments? " + internationalTransactions));

      // if user going to do transactions to the USA, we add International transfers report
      if ( !"".equals(business.getSuggestedUserTransactionInfo().getAnnualTransactionAmount()) ) {
        String foreignCurrency = baseCurrency.equals("CAD") ? "USD" : "CAD";
        String purposeOfTransactions = business.getSuggestedUserTransactionInfo().getTransactionPurpose();
        String annualTransactionAmount = business.getSuggestedUserTransactionInfo().getAnnualTransactionAmount();
        String annualVolume = business.getSuggestedUserTransactionInfo().getAnnualVolume();
        String firstTradeDate = null;
        if ( business.getSuggestedUserTransactionInfo().getFirstTradeDate() != null ) {
          firstTradeDate = sdf.format(business.getSuggestedUserTransactionInfo().getFirstTradeDate());
        }

        list.add(new ListItem("International transfers: "));
        List subList = new List(true, false, 20);
        subList.add(new ListItem("Currency Name: " + foreignCurrency));
        subList.add(new ListItem("Purpose of Transactions: " + purposeOfTransactions));
        subList.add(new ListItem("Annual Number of Transactions: " + annualTransactionAmount));
        subList.add(new ListItem("Estimated Annual Volume in " + foreignCurrency + ": " + annualVolume));
        subList.add(new ListItem("Anticipated First Payment Date: " + firstTradeDate));
        subList.add(new ListItem("Industry: " + industry));
        list.add(subList);
      }

      document.add(list);
      document.add(Chunk.NEWLINE);
      document.add(new Paragraph("Business ID: " + business.getId()));
      document.add(new Paragraph("Report Generated Date: " + reportGeneratedDate));

      document.close();
      writer.close();

      return new File(path);
    } catch (DocumentException | FileNotFoundException e) {
      logger.error(e);
    }

    return null;
  }

  /**
   * Generate a report for each signing officer in the given business.
   * @param x A context.
   * @param business A business to generate the reports for.
   * @return An array of PDFs.
   */
  private File[] generateSigningOfficersReports(X x, Business business) {
    java.util.List<User> signingOfficers = getSigningOfficers(x, business);
    File[] reports = new File[signingOfficers.size()];

    for ( int i = 0; i < signingOfficers.size(); i++ ) {
      reports[i] = generateSigningOfficer(x, business, signingOfficers.get(i), i + 1);
    }

    return reports;
  }

  /**
   * Generate a report for the given signing officer.
   * @param x A context.
   * @param business The business the given user is a signing officer for.
   * @param signingOfficer A signing officer.
   * @return A PDF report for the given signing officer.
   */
  private File generateSigningOfficer(X x, Business business, User signingOfficer, long number) {
    DAO  identificationTypeDAO  = (DAO) x.get("identificationTypeDAO");
    DAO  ipHistoryDAO           = (DAO) x.get("ipHistoryDAO");

    Logger logger = (Logger) x.get("logger");

    SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
    String name = signingOfficer.getLegalName();
    String title = signingOfficer.getJobTitle();
    String isPEPHIORelated = signingOfficer.getPEPHIORelated() ? "Yes" : "No";

    String birthday = null;
    if ( signingOfficer.getBirthday() != null ) {
      birthday = sdf.format(signingOfficer.getBirthday());
    }
    String phoneNumber = null;
    if ( signingOfficer.getPhone() != null ) {
      phoneNumber = signingOfficer.getPhone().getNumber();
    }
    String email = signingOfficer.getEmail();
    String streetAddress = signingOfficer.getAddress().getStreetNumber() + " " + signingOfficer.getAddress().getStreetName();
    String city = signingOfficer.getAddress().getCity();
    String province = signingOfficer.getAddress().getRegionId();
    String country = signingOfficer.getAddress().getCountryId();
    String postalCode = signingOfficer.getAddress().getPostalCode();
    IdentificationType idType = (IdentificationType) identificationTypeDAO
      .find(signingOfficer.getIdentification().getIdentificationTypeId());
    String identificationType = idType.getName();
    String provinceOfIssue = signingOfficer.getIdentification().getRegionId();
    String countryOfIssue = signingOfficer.getIdentification().getCountryId();
    String identificationNumber = signingOfficer.getIdentification().getIdentificationNumber();
    String issueDate = sdf.format(signingOfficer.getIdentification().getIssueDate());
    String expirationDate = sdf.format(signingOfficer.getIdentification().getExpirationDate());
    IpHistory ipHistory = (IpHistory) ipHistoryDAO.find(EQ(IpHistory.USER, signingOfficer.getId()));
    String nameOfPerson = ipHistory.findUser(x).getLegalName();
    String timestamp = sdf.format(ipHistory.getCreated());
    String ipAddress = ipHistory.getIpAddress();

    SimpleDateFormat df = new SimpleDateFormat("yyyy/MM/dd, HH:mm:ss");
    String reportGeneratedDate = df.format(new Date());

    String path = "/opt/nanopay/AFXReportsTemp/[" + business.getBusinessName() + "]SigningOfficer" + Long.toString(number) + ".pdf";

    try {
      Document document = new Document();
      PdfWriter writer = PdfWriter.getInstance(document, new FileOutputStream(path));
      document.open();
      document.add(new Paragraph("Signing Officer Information"));

      List list = new List(List.UNORDERED);
      list.add(new ListItem("Are you the primary contact? Yes"));
      list.add(new ListItem("Are you a domestic or foreign Politically Exposed Person (PEP), " +
        "Head of an International Organization (HIO), or a close associate or family member of any such person? " + isPEPHIORelated));
      list.add(new ListItem("Name: " + name));
      list.add(new ListItem("Title: " + title));
      list.add(new ListItem("Date of birth: " + birthday));
      list.add(new ListItem("Phone number: " + phoneNumber));
      list.add(new ListItem("Email address: " + email));
      list.add(new ListItem("Residential street address: " + streetAddress));
      list.add(new ListItem("City: " + city));
      list.add(new ListItem("State/Province: " + province));
      list.add(new ListItem("Country: " + country));
      list.add(new ListItem("ZIP/Postal Code: " + postalCode));
      list.add(new ListItem("Type of identification: " + identificationType));
      list.add(new ListItem("State/Province of issue: " + provinceOfIssue));
      list.add(new ListItem("Country of issue: " + countryOfIssue));
      list.add(new ListItem("Identification number: " + identificationNumber));
      list.add(new ListItem("Issue date: " + issueDate));
      list.add(new ListItem("Expiration date: " + expirationDate));
      list.add(new ListItem("Digital signature_Name of person: " + nameOfPerson));
      list.add(new ListItem("Digital signature_Timestamp: " + timestamp));
      list.add(new ListItem("Digital signature_Ip address: " + ipAddress));

      document.add(list);
      document.add(Chunk.NEWLINE);
      document.add(new Paragraph("Business ID: " + business.getId()));
      document.add(new Paragraph("Report Generated Date: " + reportGeneratedDate));

      document.close();
      writer.close();

      return new File(path);
    } catch (DocumentException | IOException e) {
      logger.error(e);
    }

    return null;
  }

  /** Returns a list of signing officers for a given business. */
  private java.util.List<User> getSigningOfficers(X x, Business business) {
    java.util.List<User> signingOfficers = ((ArraySink) business.getSigningOfficers(x).getDAO().select(new ArraySink())).getArray();

    if ( signingOfficers.size() == 0 ) {
      throw new RuntimeException("All businesses must have at least one signing officer. Business '" + business.getBusinessName() + "' did not have one.");
    }

    return signingOfficers;
  }

  private File generateBeneficialOwners(X x, Business business) {
    Logger logger = (Logger) x.get("logger");

    String businessName = business.getBusinessName();
    String path = "/opt/nanopay/AFXReportsTemp/[" + businessName + "]BeneficialOwners.pdf";

    java.util.List<BeneficialOwner> beneficialOwners = ((ArraySink) business.getBeneficialOwners(x).select(new ArraySink())).getArray();
    try {
      Document document = new Document();

      PdfWriter writer = PdfWriter.getInstance(document, new FileOutputStream(path));

      document.open();
      document.add(new Paragraph("Beneficial Owners Information"));

      SimpleDateFormat df = new SimpleDateFormat("yyyy/MM/dd, HH:mm:ss");
      String reportGeneratedDate = df.format(new Date());

      if ( beneficialOwners.size() == 0 ) {
        List list = new List(List.UNORDERED);
        list.add(new ListItem("No individuals own 25% or more / Owned by a publicly traded entity"));
        list.add(new ListItem("Report Generated Date: " + reportGeneratedDate));
        document.add(list);
      } else {
        for ( int i = 0; i < beneficialOwners.size(); i++ ) {
          BeneficialOwner beneficialOwner = beneficialOwners.get(i);
          String firstName = beneficialOwner.getFirstName();
          String lastName = beneficialOwner.getLastName();
          String jobTitle = beneficialOwner.getJobTitle();
          String percentOwnership = Integer.toString(beneficialOwner.getOwnershipPercent());
          String streetAddress = beneficialOwner.getAddress().getStreetNumber() + " " + beneficialOwner.getAddress().getStreetName();
          String city = beneficialOwner.getAddress().getCity();
          String province = beneficialOwner.getAddress().getRegionId();
          String country = beneficialOwner.getAddress().getCountryId();
          String postalCode = beneficialOwner.getAddress().getPostalCode();
          SimpleDateFormat dateOfBirthFormatter = new SimpleDateFormat("MMM d, yyyy");
          String dateOfBirth = dateOfBirthFormatter.format(beneficialOwner.getBirthday());
          // currently we don't store the info for Ownership (direct/indirect), will add later

          document.add(new Paragraph("Beneficial Owner " + (i + 1) + ":"));
          List list = new List(List.UNORDERED);
          list.add(new ListItem("First name: " + firstName));
          list.add(new ListItem("Last name: " + lastName));
          list.add(new ListItem("Job title: " + jobTitle));
          list.add(new ListItem("Percent ownership: " + percentOwnership + "%"));
          list.add(new ListItem("Residential street address: " + streetAddress));
          list.add(new ListItem("City: " + city));
          list.add(new ListItem("State/Province: " + province));
          list.add(new ListItem("Country: " + country));
          list.add(new ListItem("ZIP/Postal Code: " + postalCode));
          list.add(new ListItem("Date of birth: " + dateOfBirth));
          document.add(list);
          document.add(Chunk.NEWLINE);
        }
      }

      document.add(new Paragraph("Business ID: " + business.getId()));
      document.add(new Paragraph("Report Generated Date: " + reportGeneratedDate));

      document.close();
      writer.close();

      return new File(path);
    } catch (DocumentException | IOException e) {
      logger.error(e);
    }

    return null;
  }

  private File generateBankInfo(X x, Business business) {
    DAO  accountDAO        = (DAO) x.get("accountDAO");
    DAO  branchDAO         = (DAO) x.get("branchDAO");
    DAO  institutionDAO    = (DAO) x.get("institutionDAO");
    DAO  flinksResponseDAO = (DAO) x.get("flinksAccountsDetailResponseDAO");

    Logger logger = (Logger) x.get("logger");

    SimpleDateFormat sdf = new SimpleDateFormat("yyyy/MM/dd, HH:mm:ss");

    String businessName = business.getBusinessName();

    BankAccount bankAccount = (BankAccount) accountDAO
      .find(AND(
        INSTANCE_OF(BankAccount.getOwnClassInfo()),
        EQ(BankAccount.STATUS, BankAccountStatus.VERIFIED),
        EQ(BankAccount.DELETED, false),
        EQ(Account.OWNER, business.getId())));

    if ( bankAccount == null ) {
      return null;
    }

    String path = "/opt/nanopay/AFXReportsTemp/[" + businessName + "]BankInfo.pdf";

    try {
      Document document = new Document();
      PdfWriter writer = PdfWriter.getInstance(document, new FileOutputStream(path));
      document.open();
      document.add(new Paragraph("Bank Information"));

      Branch branch = (Branch) branchDAO.find(bankAccount.getBranch());
      String routingNum = null;
      if ( branch != null ) {
        routingNum = branch.getBranchId();
      }

      Institution institution = (Institution) institutionDAO.find(bankAccount.getInstitution());
      String institutionNum = null;
      if ( institution != null ) {
        institutionNum = institution.getInstitutionNumber();
      }

      String accountNum = bankAccount.getAccountNumber();
      String accountName = bankAccount.getName();
      String accountCurrency = bankAccount.getDenomination();
      String companyName = business.getBusinessName();
      String operatingName = business.getOperatingBusinessName();

      java.util.List<User> signingOfficers = getSigningOfficers(x, business);
      StringBuilder signingOfficerNames = new StringBuilder();
      for ( int i = 0; i < signingOfficers.size(); i++ ) {
        signingOfficerNames.append(signingOfficers.get(i).getLegalName());
        if ( i + 1 < signingOfficers.size() ) {
          signingOfficerNames.append(", ");
        }
      }

      long randomDepositAmount = bankAccount.getRandomDepositAmount();
      Date microVerificationTimestamp = bankAccount.getMicroVerificationTimestamp();
      String reportGeneratedDate = sdf.format(new Date());

      List list = new List(List.UNORDERED);
      list.add(new ListItem("Account name: " + accountName));
      list.add(new ListItem("Routing number: " + routingNum));
      list.add(new ListItem("Institution number: " + institutionNum));
      list.add(new ListItem("Account number: " + accountNum));
      list.add(new ListItem("Account currency: " + accountCurrency));
      list.add(new ListItem("Company name: " + companyName));
      if ( operatingName.length() != 0) {
        list.add(new ListItem("Operating name: " + operatingName));
      }
      list.add(new ListItem("Signing officer names: " + signingOfficerNames));

      if ( bankAccount instanceof CABankAccount ) {
        CABankAccount caBankAccount = (CABankAccount) bankAccount;
        if ( microVerificationTimestamp != null ) { // micro-deposit
          DecimalFormat df = new DecimalFormat("0.00");
          String depositAmount = df.format((double)randomDepositAmount / 100);
          list.add(new ListItem("Amount sent in the micro-deposit: $" + depositAmount));
          Date createDate = caBankAccount.getCreated();
          String verification = sdf.format(microVerificationTimestamp);
          String bankAddedDate = sdf.format(createDate);
          list.add(new ListItem("Micro transaction verification date: " + verification));
          list.add(new ListItem("PAD agreement date: " + bankAddedDate));
        } else { // flinks
          FlinksAccountsDetailResponse flinksAccountInformation = (FlinksAccountsDetailResponse) flinksResponseDAO.find(
            EQ(FlinksAccountsDetailResponse.USER_ID, business.getId())
          );
          Date createDate = caBankAccount.getCreated();
          String dateOfValidation = sdf.format(createDate);
          String flinksRequestId = flinksAccountInformation.getRequestId();
          list.add(new ListItem("Validated by Flinks at: " + dateOfValidation));
          list.add(new ListItem("Flink response ID: " + flinksRequestId));
        }
      } else if ( bankAccount instanceof USBankAccount) {
        USBankAccount usBankAccount = (USBankAccount) bankAccount;
        Date createDate = usBankAccount.getCreated();
        String bankAddedDate = sdf.format(createDate);
        list.add(new ListItem("PAD agreement date: " + bankAddedDate));
      }

      document.add(list);
      document.add(Chunk.NEWLINE);
      document.add(new Paragraph("Business ID: " + business.getId()));
      document.add(new Paragraph("Report Generated Date: " + reportGeneratedDate));

      document.close();
      writer.close();

      return new File(path);
    } catch (DocumentException | FileNotFoundException e) {
      logger.error(e);
    }

    return null;
  }


  private File getBusinessDoc(X x, Business business) {
    Logger logger = (Logger) x.get("logger");

    String businessName = business.getBusinessName();
    String path;
    Blob blob;
    try {
      foam.nanos.fs.File[] businessFiles = business.getAdditionalDocuments();
      if ( businessFiles != null && businessFiles.length > 0 ) {
        foam.nanos.fs.File businessFile = businessFiles[0];

        String blobId = ((IdentifiedBlob) businessFile.getData()).getId();
        blob = getDelegate().find_(x, blobId);

        long size = businessFile.getFilesize();
        String fileName = businessFile.getFilename();
        String fileType = fileName.substring(fileName.lastIndexOf("."));

        path = "/opt/nanopay/AFXReportsTemp/[" + businessName + "]BusinessDoc" + fileType;
        OutputStream os = new FileOutputStream(path);

        blob.read(os, 0, size);

        return new File(path);
      }
    } catch (IOException e) {
      logger.error(e);
    }

    return null;
  }

  /**
   * Returns the identification files uploaded for the signing officers in the
   * given business.
   */
  private File[] getSigningOfficerIDs(X x, Business business) {
    java.util.List<User> signingOfficers = getSigningOfficers(x, business);
    File[] files = new File[signingOfficers.size()];

    for ( int i = 0; i < signingOfficers.size(); i++ ) {
      files[i] = getSigningOfficerID(x, business, signingOfficers.get(i), i + 1);
    }

    return files;
  }

  private File getSigningOfficerID(X x, Business business, User so, int number) {
    Logger logger  = (Logger) x.get("logger");
    String businessName = business.getBusinessName();
    String path;
    Blob blob;

    try {
      foam.nanos.fs.File[] signingOfficerFiles = so.getAdditionalDocuments();
      if ( signingOfficerFiles != null && signingOfficerFiles.length > 0 ) {
        foam.nanos.fs.File signingOfficerFile = signingOfficerFiles[0];

        String blobId = ((IdentifiedBlob) signingOfficerFile.getData()).getId();
        blob = getDelegate().find_(x, blobId);

        long size = signingOfficerFile.getFilesize();
        String fileName = signingOfficerFile.getFilename();
        String fileType = fileName.substring(fileName.lastIndexOf("."));

        path = "/opt/nanopay/AFXReportsTemp/[" + businessName + "]SigningOfficer" + Long.toString(number) + "ID" + fileType;
        OutputStream os = new FileOutputStream(path);

        blob.read(os, 0, size);

        return new File(path);
      }
    } catch (IOException e) {
      logger.error(e);
    }

    return null;
  }


  private File getBeneficialOwnersDoc(X x, Business business) {
    Logger logger = (Logger) x.get("logger");

    String businessName = business.getBusinessName();

    String path;
    Blob blob;
    try {
      foam.nanos.fs.File[] beneficialOwnerFiles = business.getBeneficialOwnerDocuments();

      if ( beneficialOwnerFiles != null && beneficialOwnerFiles.length > 0 ) {
        foam.nanos.fs.File beneficialOwnerFile = beneficialOwnerFiles[0];

        String blobId = ((IdentifiedBlob) beneficialOwnerFile.getData()).getId();
        blob = getDelegate().find_(x, blobId);

        long size = beneficialOwnerFile.getFilesize();
        String fileName = beneficialOwnerFile.getFilename();
        String fileType = fileName.substring(fileName.lastIndexOf("."));

        path = "/opt/nanopay/AFXReportsTemp/[" + businessName + "]BeneficialOwnersDoc" + fileType;
        OutputStream os = new FileOutputStream(path);

        blob.read(os, 0, size);

        return new File(path);
      }
    } catch (IOException e) {
      logger.error(e);
    }

    return null;
  }


  private File getUSBankAccountProof(X x, Business business) {
    DAO    accountDAO  = (DAO) x.get("accountDAO");
    Logger logger      = (Logger) x.get("logger");

    BankAccount bankAccount = (BankAccount) accountDAO
      .find(AND(
        INSTANCE_OF(BankAccount.getOwnClassInfo()),
        EQ(BankAccount.STATUS, BankAccountStatus.VERIFIED),
        EQ(Account.OWNER, business.getId())));

    String businessName = business.getBusinessName();
    String path;
    Blob blob;
    try {
      if ( bankAccount instanceof USBankAccount) {
        USBankAccount usBankAccount = (USBankAccount) bankAccount;
        foam.nanos.fs.File voidCheckImage = usBankAccount.getVoidCheckImage();
        String blobId = ((IdentifiedBlob) voidCheckImage.getData()).getId();
        blob = getDelegate().find_(x, blobId);

        long size = voidCheckImage.getFilesize();
        String fileName = voidCheckImage.getFilename();
        String fileType = fileName.substring(fileName.lastIndexOf("."));

        path = "/opt/nanopay/AFXReportsTemp/[" + businessName + "]BankAccountProof" + fileType;
        OutputStream os = new FileOutputStream(path);

        blob.read(os, 0, size);

        return new File(path);
      }
    } catch (IOException e) {
      logger.error(e);
    }

    return null;
  }


  private void downloadZipFile(X x, Business business, File[] srcFiles) {
    HttpServletResponse response = x.get(HttpServletResponse.class);
    Logger              logger   = (Logger) x.get("logger");

    response.setContentType("multipart/form-data");

    String businessName = business.getBusinessName();
    String downloadName = "[" + businessName + "]ComplianceDocs.zip";

    response.setHeader("Content-Disposition", "attachment;fileName=\"" + downloadName + "\"");

    DataOutputStream os = null;
    ZipOutputStream zipos = null;
    try {
      zipos = new ZipOutputStream(new BufferedOutputStream(response.getOutputStream()));
      zipos.setMethod(ZipOutputStream.DEFLATED);

      for (File file : srcFiles) {
        if ( file == null ) {
          continue;
        }

        zipos.putNextEntry(new ZipEntry(file.getName()));
        os = new DataOutputStream(zipos);
        InputStream is = new FileInputStream(file);
        byte[] b = new byte[100];
        int length;
        while((length = is.read(b))!= -1){
          os.write(b, 0, length);
        }
        is.close();
        zipos.closeEntry();
        os.flush();
      }
    } catch (Exception e) {
      logger.error(e);
    } finally {
      IOUtils.closeQuietly(os);
      IOUtils.closeQuietly(zipos);
    }
  }
}
