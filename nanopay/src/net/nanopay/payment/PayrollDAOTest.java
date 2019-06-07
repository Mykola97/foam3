package net.nanopay.payment;

import foam.core.X;
import foam.dao.DAO;
import foam.nanos.auth.User;
import net.nanopay.account.DigitalAccount;
import net.nanopay.bank.BankAccount;
import net.nanopay.bank.BankAccountStatus;
import net.nanopay.bank.CABankAccount;

import static foam.mlang.MLang.AND;
import static foam.mlang.MLang.EQ;
import static foam.mlang.MLang.INSTANCE_OF;

public class PayrollDAOTest extends foam.nanos.test.Test {
  static final long PAYER_ACCOUNT = 193;
  static final long PAYER_ID = 3333;
  DAO payrollDAO, userDAO, accountDAO;
  Payroll payroll;
  long[] payeeIds = new long[3];
  int payeeIndex = 0;
  PayrollEntry[] entries = new PayrollEntry[3];
  int entryIndex = 0;
  double amount = 100;

  public void runTest(X x) {
    payrollDAO = (DAO) x.get("payrollDAO");
    userDAO = (DAO) x.get("localUserDAO");
    accountDAO = (DAO) x.get("localAccountDAO");
    test(payrollDAO != null, "payrollDAO has been configured.");

    addSourceAccountIfNotFound(x);
    addPayeesIfNotFound(x);
    addPayrollEntries(x);
    payroll = new Payroll();
    payroll.setPayrollEntries(entries);

    Payroll addedPayroll = (Payroll) payrollDAO.put_(x, payroll);
    test( addedPayroll != null && addedPayroll.getId() == payroll.getId() ,"payrollDAO put_ is successful.");
    Payroll foundPayroll = (Payroll) payrollDAO.find_(x, payroll.getId());
    test( foundPayroll != null && foundPayroll.getId() == payroll.getId(), "payrollDAO find_ is successful" );
    Payroll removedPayroll = (Payroll) payrollDAO.remove_(x, payroll);
    test( payrollDAO.find_(x, removedPayroll.getId()) == null, "payrollDAO remove_ is successful.");
  }

  public void addSourceAccountIfNotFound(X x) {
    CABankAccount account = (CABankAccount) accountDAO.find(
      AND(
        EQ(BankAccount.ID, PAYER_ACCOUNT),
        INSTANCE_OF(CABankAccount.class),
        EQ(BankAccount.IS_DEFAULT, true),
        EQ(BankAccount.DENOMINATION, "CAD")
      )
    );
    if ( account == null ) {
      createPayerIfNotFound(x);
      account = new CABankAccount();
      account.setId(PAYER_ACCOUNT);
      account.setBranchId("12345");
      account.setInstitutionNumber("123");
      account.setAccountNumber("1234543");
      account.setStatus(BankAccountStatus.VERIFIED);
      account.setOwner(PAYER_ID);
      account.setDenomination("CAD");
      account.setEnabled(true);
      account.setIsDefault(true);
      accountDAO.put_(x, account);
    }
  }

  public void createPayerIfNotFound(X x) {
    User user = (User) userDAO.find(PAYER_ID);
    if ( user == null ) {
      user = new User();
      user.setId(PAYER_ID);
      user.setFirstName("payroll");
      user.setLastName("payer");
      user.setEmail("payroll@nanopay.net");
      user.setEmailVerified(true);
      userDAO.put_(x, user);
    }
  }

  public void addPayeesIfNotFound(X x) {
    addPayeeIfNotFound(x, "francis1@nanopay.net", "001", "12345", "1234567");
    addPayeeIfNotFound(x, "francis2@nanopay.net", "002", "12346", "1234568");
    addPayeeIfNotFound(x, "francis3@nanopay.net", "003", "12347", "1234569");
  }

  public void addPayeeIfNotFound(X x, String email, String institutionNo, String branchId, String bankAccountNo) {
    User user = (User) userDAO.find(EQ(User.EMAIL, email));
    if ( user == null ) {
      user = new User();
      user.setEmail(email);
      user.setFirstName("Francis");
      user.setLastName("Filth");
      user.setEmailVerified(true);
      user = (User) userDAO.put_(x, user);
    }
    long userId = user.getId();
    payeeIds[payeeIndex] =  userId;
    ++payeeIndex;

    addBankAccountIfNotFound(x, userId, institutionNo, branchId, bankAccountNo);
  }

  public void addBankAccountIfNotFound(X x, long owner, String institutionNo, String branchId, String bankAccountNo) {
    CABankAccount account = (CABankAccount) accountDAO.find(
      AND(
        EQ(BankAccount.OWNER, owner),
        INSTANCE_OF(CABankAccount.class),
        EQ(BankAccount.IS_DEFAULT, true),
        EQ(BankAccount.DENOMINATION, "CAD")
      )
    );
    if ( account == null ) {
      account = new CABankAccount();
      account.setOwner(owner);
      account.setInstitutionNumber(institutionNo);
      account.setBranchId(branchId);
      account.setAccountNumber(bankAccountNo);
      account.setIsDefault(true);
      account.setDenomination("CAD");
      accountDAO.put_(x, account);
    }
  }

  public void addPayrollEntries(X x) {
    for (long payeeId : payeeIds) {
      addPayrollEntry(x, payeeId);
   }
  }

  public void addPayrollEntry(X x, long payeeId) {
    User payee = (User) userDAO.find(payeeId);
    CABankAccount bankAccount = (CABankAccount) BankAccount.findDefault(x, payee, "CAD");
    PayrollEntry entry = new PayrollEntry();
    entry.setOwner(payeeId);
    entry.setEmail(payee.getEmail());
    entry.setFirstName(payee.getFirstName());
    entry.setLastName(payee.getLastName());
    entry.setInstitutionNo(bankAccount.getInstitutionNumber());
    entry.setBranchId(bankAccount.getBranchId());
    entry.setBankAccountNo(bankAccount.getAccountNumber());
    entry.setAmount(amount);
    amount += 100;

    entries[entryIndex] = entry;
    ++entryIndex;
  }


 }
