$(document).ready(function() {
  // Load nem-browser library
  const nem = require("nem-sdk").default;

  // Create an NIS endpoint object
  const endpoint = nem.model.objects.create("endpoint")(
    nem.model.nodes.defaultTestnet,
    nem.model.nodes.defaultPort
  );
  const common = nem.model.objects.create("common")(
    "password",
    "32f20cf1363367ff50038e1841880d18cff9585929df7b728ec2948786d20885"
  );
  const mosaicDefinitions = nem.model.objects.get(
    "mosaicDefinitionMetaDataPair"
  );
  let scores;
  const savedScores = JSON.parse(
    window.localStorage.getItem("random-game-score")
  );

  if (savedScores !== null) {
    scores = savedScores;
  } else {
    scores = {};
  }

  function roll() {
    const number = Math.floor(Math.random() * 1000001);
    $("#result").html(number);
  }

  //check whether player already played to prevnt multiple transaction to same address
  function save() {
    const address = nem.model.address.clean($("#address").val());
    const result = $("#result").html();

    if (result > 0) {
      var transferTransaction = nem.model.objects.get("transferTransaction");
      transferTransaction.amount = 0;
      transferTransaction.recipient = address;
      transferTransaction.message = "NEM Random game Transaction";

      const mosaicAttachment = nem.model.objects.create("mosaicAttachment")(
        "bidlo",
        "score",
        result
      );
      transferTransaction.mosaics.push(mosaicAttachment);

      nem.com.requests.namespace
        .mosaicDefinitions(endpoint, mosaicAttachment.mosaicId.namespaceId)
        .then(function(res) {
          const definition = nem.utils.helpers.searchMosaicDefinitionArray(
            res.data,
            ["score"]
          );
          const fullName = nem.utils.format.mosaicIdToName(
            mosaicAttachment.mosaicId
          );

          mosaicDefinitions[fullName] = {
            mosaicDefinition: definition[fullName]
          };

          const preparedTransaction = nem.model.transactions.prepare(
            "mosaicTransferTransaction"
          )(
            common,
            transferTransaction,
            mosaicDefinitions,
            nem.model.network.data.testnet.id
          );
          preparedTransaction.fee = 500000;
          nem.model.transactions
            .send(common, preparedTransaction, endpoint)
            .then(
              function(res) {
                if (res.code > 2) {
                  alert(res.message);
                } else {
                  scores[address] = result;
                  window.localStorage.setItem(
                    "random-game-score",
                    JSON.stringify(scores)
                  );
                  updateScoringTable();
                }
              },
              function(err) {
                console.log("Error sending the transaction " + err);
              }
            ),
            function(err) {
              console.log("Error getting mosaic definition " + error);
            };
        });
    } else {
      alert("You need to roll the dice first");
    }
  }

  function updateScoringTable() {
    const list = [];
    for (const key in scores) {
      if (scores.hasOwnProperty(key)) {
        list.push(key + ": " + scores[key]);
      }
    }
    const highScoreTable = $("#highscoreTable");
    highScoreTable.html("");
    $.each(list, function(i) {
      const row = $('<li/>"').appendTo(highScoreTable);
      const text = $("<span/>")
        .text(list[i])
        .appendTo(row);
    });
  }

  updateScoringTable();

  $("#roll").click(function() {
    roll();
  });
  $("#save").click(function() {
    save();
  });
});
