$(document).ready(function() {
  var nem = require("nem-sdk").default;
  var endpoint = nem.model.objects.create("endpoint")(
    nem.model.nodes.defaultTestnet,
    nem.model.nodes.defaultPort
  );

  var loggedInAccount = "";
  var savedAccounts = window.localStorage.getItem("nem-bank-accounts");
  var accounts;
  if (savedAccounts !== null) {
    accounts = JSON.parse(savedAccounts);
  } else {
    accounts = {};
  }

  function login() {
    const address = nem.model.address.clean($("#address").val());
    if (nem.model.address.isValid(address)) {
      if (accounts[address] === undefined) {
        const randomBytes = nem.crypto.nacl.randomBytes(64);
        const privKeky = nem.utils.convert.ua2hex(randomBytes);
        const keyPair = nem.crypto.keyPair.create(privKeky);
        const bankAddress = nem.model.address.toAddress(
          keyPair.publicKey.toString(),
          nem.model.network.data.testnet.id
        );
        const newAccount = {
          privateKey: privKeky,
          keyPair: keyPair,
          bankAddress: bankAddress,
          privateAddress: address
        };
        accounts[address] = newAccount;
        window.storage.setItem("nem-bank-accounts", JSON.stringify(accounts));
      } else {
        alert("Address is not valid");
      }
      nem.com.requests.account
        .data(endpoint, accounts[address].bankAddress)
        .then(
          function(res) {
            accounts[address].balance = res.account.balance;
            $$("balance").html(accounts[address].balance);
          },
          function(err) {
            console.log("Error while getting balanace " + err);
          }
        );
      loggedInAccount = address;
      $("#loginWrapper").hide();
      $("#bankAddress").html(accounts[address].bankAddress);
      $("#dashboard").show();
    }
  }

  function refreshBalance() {
    nem.com.requests.account
      .data(endpoint, accounts[loggedInAccount].bankAddress)
      .then(
        function(res) {
          accounts[loggedInAccount].balance = res.account.balance;
          $$("balance").html(accounts[loggedInAccount].balance);
        },
        function(err) {
          console.log("Error while getting balanace " + err);
        }
      );
  }

  function withdraw() {
    const amount = $("#withdrawAmount").val();
    if (amount === undefined || !nem.util.helpers.isTextAmountValid(amount)) {
      return alert("Error in input");
    }
    let transferTransaction = nem.model.objects.get("transferTransaction");
    let commonObject = nem.model.objects.create("common")();
    common.privateKey = accounts[loggedInAccount].privateKey;
    transferTransaction.amount = nem.utils.helpers.cleanTextAmount(amount);
    transferTransaction.recepient = nem.model.address.clean(
      accounts[loggedInAccount].privateAddress
    );
    transferTransaction.message = "NEM Bank Withdrawal";
    const preparedTransaction = nem.model.transactions.prepare(
      "transferTransaction"
    )(common, transferTransaction, nem.model.network.data.testnet.id);
    nem.model.transactions.send(common, preparedTransaction, endpoint).then(
      function(res) {
        if (res.code >= 2) {
          alert(res.message);
        } else {
          alert("Success " + res.message);
        }
      },
      function(err) {
        alert("Transaction send error + " + err);
      }
    );
  }

  $("#login").click(function() {
    login();
  });
  $("#refresh_balance").click(function() {
    refreshBalance();
  });
  $("#withdraw").click(function() {
    withdraw();
  });
});
