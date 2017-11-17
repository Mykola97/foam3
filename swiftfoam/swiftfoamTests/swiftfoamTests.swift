import XCTest
@testable import swiftfoam

class swiftfoamTests: XCTestCase {
  var client: MintChipClient = Context.GLOBAL.create(MintChipClient.self)!
  let username = "kenny@nanopay.net"
  let password = "Nanopay123"

  override func setUp() {
    client.httpBoxUrlRoot = .Localhost
    super.setUp()
  }

  override func tearDown() {
    super.tearDown()
  }

  func testLogin() {
    do {
      let user = try client.clientAuthService!.loginByEmail(client.__context__, username, password)
      XCTAssert(user.email == username, "Email must match")
      XCTAssert(user.password != password, "Password MUST NOT match as it should be encrypted")
    } catch let e {
      XCTFail(((e as? FoamError)?.toString()) ?? "Error!")
    }
  }

  func testAutoLogin() {
    // Note: If test is ran before a login has happened it will fail.
    //       Also note that it would fail if called after a logout.
    do {
      guard let prevLoggedInUser = try client.clientAuthService!.getCurrentUser(client.__context__) else {
        XCTFail("User not found. Please log in or make sure a previous test did not log out.")
        return
      }
      XCTAssert(prevLoggedInUser.email == username, "Email must match")
      XCTAssert(prevLoggedInUser.password != password, "Password MUST NOT match as it should be encrypted")
    } catch let e {
      XCTFail(((e as? FoamError)?.toString()) ?? "Error!")
    }
  }

  func testLogoutPart1() {
    do {
      try client.clientAuthService!.logout(client.__context__)
      guard let _ = try client.clientAuthService!.getCurrentUser(client.__context__) else {
        return
      }
      XCTFail("Previous User still exists.")
    } catch let e {
      XCTFail(((e as? FoamError)?.toString()) ?? "Error!")
    }
  }

  func testLogoutPart2() {
    // Note: Should be called separately after a logout has been done to check if data still persists between app lifecycles
    do {
      guard let _ = try client.clientAuthService!.getCurrentUser(client.__context__) else {
        return
      }
      XCTFail("Previous User still exists.")
    } catch let e {
      XCTFail(((e as? FoamError)?.toString()) ?? "Error!")
    }
  }

  func testPullAccount() {
    do {
      var user: User!
      if let prevLoggedInUser = try client.clientAuthService!.getCurrentUser(client.__context__) {
        user = prevLoggedInUser
      } else {
        user = try client.clientAuthService!.loginByEmail(client.__context__, username, password)
      }

      let pred = client.__context__.create(Eq.self, args: [
        "arg1": Account.OWNER(),
        "arg2": user.id,
        ])

      let accounts = try (client.accountDAO!.`where`(pred).select() as! ArraySink).array as! [Account]
      for account in accounts {
        guard let ownerId = account.owner as? Int else {
          XCTFail("Could not convert Account.owner property to Int")
          return
        }
        XCTAssert(ownerId == user.id, "Owner must match User")
      }
    } catch let e {
      XCTFail(((e as? FoamError)?.toString()) ?? "Error!")
    }
  }

  func testPullTransactions() {
    do {
      var user: User!
      if let prevLoggedInUser = try client.clientAuthService!.getCurrentUser(client.__context__) {
        user = prevLoggedInUser
      } else {
        user = try client.clientAuthService!.loginByEmail(client.__context__, username, password)
      }

      let transactions = try (client.transactionDAO!.select() as! ArraySink).array as! [Transaction]
      for transaction in transactions {
        XCTAssert(transaction.payerId == user.id || transaction.payeeId == user.id, "User must have participated in the transaction")
      }
    } catch let e {
      XCTFail(((e as? FoamError)?.toString()) ?? "Error!")
    }
  }

  func testPutTransactions() {
    do {
      var user: User!
      if let prevLoggedInUser = try client.clientAuthService!.getCurrentUser(client.__context__) {
        user = prevLoggedInUser
      } else {
        user = try client.clientAuthService!.loginByEmail(client.__context__, username, password)
      }

      let newTransaction = client.__context__.create(Transaction.self)!
      newTransaction.payerId = user.id
      newTransaction.payeeId = 1
      newTransaction.amount = 1 // cent
      newTransaction.tip = 0 // no tip

      guard let madeTransaction = try client.transactionDAO!.put(newTransaction) as? Transaction else {
        XCTFail("Could not convert returned value from put()")
        return
      }

      XCTAssert(madeTransaction.payerId == newTransaction.payerId, "Created Transaction.payerId must match returned transaction from put()")
      XCTAssert(madeTransaction.payeeId == newTransaction.payeeId, "Created Transaction.payeeId must match returned transaction from put()")
      XCTAssert(madeTransaction.amount == newTransaction.amount, "Created Transaction.amount must match returned transaction from put()")
      XCTAssert(madeTransaction.tip == newTransaction.tip, "Created Transaction.tip must match returned transaction from put()")
    } catch let e {
      XCTFail(((e as? FoamError)?.toString()) ?? "Error!")
    }
  }

  func testTransactionLimits() {
    do {
      var user: User!
      if let prevLoggedInUser = try client.clientAuthService!.getCurrentUser(client.__context__) {
        user = prevLoggedInUser
      } else {
        user = try client.clientAuthService!.loginByEmail(client.__context__, username, password)
      }

      let service = client.userTransactionLimitService!
      let limit = try service.getLimit(user.id, .DAY, .SEND)
      let limitLeft = try service.getRemainingLimit(user.id, .DAY, .SEND)
      print("\(limit.timeFrame) | \(limit.type) Limit found for \(user.firstName): \(limitLeft)")
    } catch let e {
      XCTFail(((e as? FoamError)?.toString()) ?? "Error!")
    }
  }
}
