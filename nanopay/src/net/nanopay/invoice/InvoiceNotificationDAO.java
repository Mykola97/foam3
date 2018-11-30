package net.nanopay.invoice;

import foam.core.FObject;
import foam.core.X;
import foam.dao.DAO;
import foam.dao.ProxyDAO;
import foam.nanos.app.AppConfig;
import foam.nanos.auth.User;
import foam.nanos.auth.token.TokenService;
import java.text.NumberFormat;
import java.text.SimpleDateFormat;
import java.util.*;
import net.nanopay.auth.PublicUserInfo;
import net.nanopay.invoice.model.Invoice;
import net.nanopay.invoice.model.InvoiceStatus;
import net.nanopay.invoice.notification.NewInvoiceNotification;

/**
 * Invoice decorator for dictating and setting up new invoice notifications and emails.
 * Responsible for sending notifications to both internal and external users on invoice create.
 */
public class InvoiceNotificationDAO extends ProxyDAO {

  protected DAO bareUserDAO_;
  protected DAO notificationDAO_;
  protected AppConfig config;
  protected TokenService externalToken;

  public InvoiceNotificationDAO(X x, DAO delegate) {
    super(x, delegate);
    bareUserDAO_ = (DAO) x.get("bareUserDAO");
    notificationDAO_ = (DAO) x.get("notificationDAO");
    config = (AppConfig) x.get("appConfig");
    externalToken = (TokenService) x.get("externalInvoiceToken");
  }

  @Override
  public FObject put_(X x, FObject obj) {
    Invoice invoice = (Invoice) obj;
    Invoice existing = (Invoice) super.find(invoice.getId());

    // Only send invoice notification if invoice does not have a status of draft
    if ( ! InvoiceStatus.DRAFT.equals(invoice.getStatus()) ) {
      // if no existing invoice has been sent OR the existing invoice was a draft, send an email
      if ( existing == null || InvoiceStatus.DRAFT.equals(existing.getStatus()) ) {
        sendInvoiceNotification(x, invoice);
      }
    }

    return super.put_(x, invoice);
  }

  private void sendInvoiceNotification(X x, Invoice invoice) {
    long payeeId = invoice.getPayeeId();
    long payerId = invoice.getPayerId();

    NewInvoiceNotification notification = new NewInvoiceNotification();

    /*
     * If invoice is external, calls the external token service and avoids internal notifications,
     * otherwise sets email args for internal user email and creates notification.
     */
    if ( invoice.getExternal() ) {
      // Sets up required token parameters.
      long externalUserId = ( payeeId == invoice.getCreatedBy() ) ? payerId : payeeId;
      User externalUser = (User) bareUserDAO_.find(externalUserId);
      Map tokenParams = new HashMap();
      tokenParams.put("invoice", invoice);

      externalToken.generateTokenWithParameters(x, externalUser, tokenParams);
      return;
    } else {
      User user = (User) x.get("user");

      /*
       * For original nanopay app, if current user is equal to payer, it will load 
       * the 'payable' email template with `"group":"*"`.
       * For SME/Ablii, if current user is equal to payer, it will load the 'receivable'
       * email template with `"group":"sme"`.
       */
      String template = user.getId() == payerId ? "payable" : "receivable";

      // Set email values on notification.
      notification = setEmailArgs(x, invoice, notification);
      notification.setEmailName(template);
      notification.setEmailIsEnabled(true);
    }

    notification.setUserId(payeeId == ((Long)invoice.getCreatedBy()) ? payerId : payeeId);
    notification.setInvoiceId(invoice.getId());
    notification.setNotificationType("Invoice received");
    notificationDAO_.put(notification);
  }

  private NewInvoiceNotification setEmailArgs(X x, Invoice invoice, NewInvoiceNotification notification) {
    NumberFormat formatter = NumberFormat.getCurrencyInstance();
    SimpleDateFormat dateFormat = new SimpleDateFormat("dd-MMM-YYYY");

    PublicUserInfo payee = invoice.getPayee();
    PublicUserInfo payer = invoice.getPayer();

    // If invType is true, then payee sends payer the email and notification.
    boolean invType = invoice.getPayeeId() == invoice.getCreatedBy();

    // Add the currency symbol and currency (CAD/USD, or other valid currency)
    String amount = invoice.findDestinationCurrency(x)
        .format(invoice.getAmount()) + " " + invoice.getDestinationCurrency();

    notification.getEmailArgs().put("amount", amount);
    notification.getEmailArgs().put("account", invoice.getId());
    notification.getEmailArgs().put("name", invType ? payer.getFirstName() : payee.getFirstName());
    notification.getEmailArgs().put("fromEmail", invType ? payee.getEmail() : payer.getEmail());
    notification.getEmailArgs().put("fromName", invType ? payee.label() : payer.label());

    if ( invoice.getDueDate() != null ) {
      notification.getEmailArgs().put("date", dateFormat.format(invoice.getDueDate()));
    }

    notification.getEmailArgs().put("link", config.getUrl());
    return notification;
  }
}
