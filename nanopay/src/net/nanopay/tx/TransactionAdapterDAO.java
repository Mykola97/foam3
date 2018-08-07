/**
 * @license
 * Copyright 2018 The FOAM Authors. All Rights Reserved.
 * http://www.apache.org/licenses/LICENSE-2.0
 */

package net.nanopay.tx;

import foam.core.FObject;
import foam.core.X;
import foam.dao.DAO;
import foam.dao.ProxyDAO;
import foam.nanos.auth.User;
import foam.nanos.logger.Logger;
import foam.util.SafetyUtil;

import net.nanopay.account.Account;
import net.nanopay.account.DigitalAccount;
import net.nanopay.bank.BankAccount;
import net.nanopay.bank.CABankAccount;
import net.nanopay.tx.CompositeTransaction;
import net.nanopay.tx.model.Transaction;
import net.nanopay.tx.tp.alterna.AlternaTransaction;

/**
 * Transform a base Transaction to into more specific type based on Accounts.
 * This decorator should follow Payer/PayeeTransactionDAO.
 */
public class TransactionAdapterDAO
  extends ProxyDAO
{
  public TransactionAdapterDAO(X x, DAO delegate) {
    setDelegate(delegate);
    setX(x);
  }

  public FObject put_(X x, FObject obj)
    throws RuntimeException {

    // Only concerned with Transactions which are not already a
    // specialized child class.
    if ( ! obj.getClass().equals(Transaction.class) ) {
      return super.put_(x, obj);
    }

    Transaction txn = (Transaction) obj;
    //if ( ! SafetyUtil.isEmpty(txn.getId()) ) {
    if ( txn.getId() > 0 ) {
      return super.put_(x, obj);
    }

    Logger logger = (Logger) x.get("logger");

    Account sourceAccount = txn.findSourceAccount(x);
    Account destinationAccount = txn.findDestinationAccount(x);
    if ( sourceAccount == null ||
         destinationAccount == null ) {
      logger.error(this.getClass().getSimpleName(), "source or destination not defined");
      // REVIEW: perhaps notification or just generate error
      return super.put_(x, obj);
    }

    // FIXME: hard-coded for now
    // Future: provide account -> account -> transaction type mapping

    // Cananadian CICO
    if ( ( sourceAccount instanceof CABankAccount &&
           destinationAccount instanceof DigitalAccount ) ||
         ( destinationAccount instanceof CABankAccount &&
           sourceAccount instanceof DigitalAccount ) ) {
      AlternaTransaction t = new AlternaTransaction.Builder(x).build();
      t.copyFrom(txn);
      if ( sourceAccount instanceof CABankAccount ) {
        t.setType(TransactionType.CASHIN);
      } else {
        t.setType(TransactionType.CASHOUT);
      }
      return super.put_(x, t);
    }

    // Canadian Bank to Bank
    if ( sourceAccount instanceof CABankAccount &&
         destinationAccount instanceof CABankAccount ) {
      CompositeTransaction composite = new CompositeTransaction.Builder(x).build();
      composite.copyFrom(txn);

      User sourceUser = sourceAccount.findOwner(x);
      User destinationUser = destinationAccount.findOwner(x);
      DigitalAccount destinationDigital = DigitalAccount.findDefault(x, destinationUser, "CAD");

      AlternaTransaction ci = new AlternaTransaction.Builder(x).build();
      ci.copyFrom(txn);
      ci.setDestinationAccount(destinationDigital.getId());
      ci.setPayeeId(destinationUser.getId());
      ci.setType(TransactionType.CASHIN);
      composite.add(x, ci);

      AlternaTransaction co = new AlternaTransaction.Builder(x).build();
      co.copyFrom(txn);
      co.setSourceAccount(destinationDigital.getId());
      co.setPayerId(destinationUser.getId());
      co.setType(TransactionType.CASHOUT);
      composite.add(x,co);
 
      composite = (CompositeTransaction) super.put_(x, composite);
      composite.next(x);
      return composite;
    }

    // Unsupported - Future DWolla, NAPCO, Indusynd
    if ( sourceAccount instanceof BankAccount &&
         destinationAccount instanceof BankAccount ) {
      throw new RuntimeException("Transaction not supported. non-CABankAccount -> non-CABankAccount");
    }

    // default Digital -> Digital
    return super.put_(x, obj);
  }
}

