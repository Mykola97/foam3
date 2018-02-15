foam.CLASS({
  name: 'TransactionRow',
  imports: [
    {
      name: 'currentUser',
      key: 'currentUser',
      swiftType: 'User',
    },
    {
      name: 'userDAO',
      key: 'userDAO',
      swiftType: 'DAO',
    },
  ],
  properties: [
    {
      class: 'FObjectProperty',
      of: 'net.nanopay.tx.model.Transaction',
      required: true,
      name: 'transaction',
    },
    {
      class: 'FObjectProperty',
      of: 'foam.nanos.auth.User',
      name: 'user',
      swiftExpressionArgs: ['transaction'],
      swiftExpression: `
let otherUserId = transaction.payerId == self.currentUser.id ?
    transaction.payeeId :
    transaction.payerId
return (try? self.userDAO.find(otherUserId) as? User) ?? nil
      `,
    },
    {
      class: 'String',
      name: 'fullName',
      swiftView: 'foam.swift.ui.FOAMUILabel',
      swiftExpressionArgs: ['user$firstName', 'user$lastName'],
      swiftExpression: `
let f = (user$firstName as? String) ?? ""
let l = (user$lastName as? String) ?? ""
return f + " " + l
      `,
    },
    {
      class: 'String',
      name: 'date',
      swiftView: 'foam.swift.ui.FOAMUILabel',
      swiftExpressionArgs: ['transaction$date'],
      swiftExpression: `
var d: String!

guard let rawD = (transaction$date as? Date) else {
  return "Date failed to convert"
}

let convFormatter = DateFormatter()
convFormatter.dateFormat = "dd MMM yyyy, hh:mma"

let seconds = TimeZone.autoupdatingCurrent.secondsFromGMT(for: rawD);
let localTime = Date(timeInterval: TimeInterval(seconds), since: rawD);

d = convFormatter.string(from: localTime)

return d
      `,
    },
    {
      class: 'String',
      name: 'amount',
      swiftView: 'foam.swift.ui.FOAMUILabel',
      swiftExpressionArgs: ['transaction$amount', 'transaction$tip', 'transaction$payerId', 'user$id'],
      swiftExpression: `
guard let amount = transaction$amount as? Int else {
  return "ERROR " + String(describing: transaction$amount)
}

guard let userId = user$id as? Int else {
  return String(describing: amount)
}

guard let payerId = transaction$payerId as? Int else {
  return String(describing: amount)
}

var tip = 0
if let tipAmount = transaction$tip as? Int {
  tip = tipAmount
}

var sign: String = ""
if ( payerId == userId ) {
  sign = "+ "
} else {
  sign = "- "
}
return sign + "$" + String(format: "%.2f", Float(amount + tip)/100)
      `,
    },
    {
      class: 'String',
      name: 'initials',
      swiftView: 'foam.swift.ui.FOAMUILabel',
      swiftExpressionArgs: ['user$firstName', 'user$lastName'],
      swiftExpression: `
let f = (user$firstName as? String) ?? ""
let l = (user$lastName as? String) ?? ""
let fc = f.count > 0 ? String(f.char(at: 0)) : ""
let lc = l.count > 0 ? String(l.char(at: 0)) : ""
return "\\(fc)\\(lc)"
      `,
    },
    {
      swiftType: 'UIColor',
      name: 'amountColor',
      swiftExpressionArgs: ['transaction$amount', 'transaction$payerId', 'user$id'],
      swiftExpression: `
guard let amount = transaction$amount as? Int else {
  return UIColor.red
}

guard let userId = user$id as? Int else {
  return UIColor.red
}

guard let payerId = transaction$payerId as? Int else {
  return UIColor.red
}

if ( payerId == userId ) {
  return UIColor.green
} else {
  return UIColor.red
}
      `,
    },
  ]
});
