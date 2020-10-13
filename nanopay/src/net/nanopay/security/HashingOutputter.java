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
package net.nanopay.security;

import foam.core.ClassInfo;
import foam.core.FObject;
import foam.core.X;
import foam.lib.StoragePropertyPredicate;
import foam.lib.formatter.JSONFObjectFormatter;
import foam.util.SafetyUtil;

/**
 * HashingOutputter hashes all data that goes through it and appends the digest
 * to the end of the output
 */
public class HashingOutputter
  extends JSONFObjectFormatter
{
  protected MessageDigest messageDigest_ = null;
  // Formatter for MessageDigest itself.
  protected JSONFObjectFormatter formatter_ = null;

  protected HashingOutputter() {
    setPropertyPredicate(new StoragePropertyPredicate());
  }

  public HashingOutputter(X x, MessageDigest md) {
    this(x, false, md);
  }

  public HashingOutputter(X x, Boolean quoteKeys, MessageDigest md) {
    super(x);
    setQuoteKeys(quoteKeys);
    setPropertyPredicate(new StoragePropertyPredicate());
    this.messageDigest_ = md;
  }

  public void setMessageDigest(MessageDigest md) {
    messageDigest_ = md;
  }

  // intercept append to update MessageDigest
  public StringBuilder append(Object o) {
    messageDigest_.update(o.toString());
    return super.append(o);
  }

  @Override
  public void outputDelta(FObject old, FObject obj, ClassInfo of) {
    super.outputDelta(old, obj, of);
    outputDigest();
  }

  @Override
  public void output(FObject obj, ClassInfo of) {
    super.output(obj, of);
    outputDigest();
  }

  /**
   * Appends the output of the hash function
   */
  protected void outputDigest() {
    // don't output digest if empty, reset digest
    if ( builder().length() == 0 ) {
      messageDigest_.reset();
      return;
    }
    builder().append(',');
    if ( formatter_ == null ) {
      formatter_ = new JSONFObjectFormatter();
      formatter_.setOutputDefaultValues(true);
      formatter_.setOutputShortNames(true);
      formatter_.setOutputClassNames(false);
      formatter_.setOutputDefaultClassNames(false);
      formatter_.setPropertyPredicate(new StoragePropertyPredicate());
    }
    formatter_.reset();
    formatter_.output(messageDigest_.get(), MessageDigest.getOwnClassInfo());
    builder().append(formatter_.builder().toString());
  }
}
