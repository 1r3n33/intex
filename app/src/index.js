// Import the page's CSS. Webpack will know what to do with it.
import "./app.css";

// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from '@truffle/contract'

/*
 * When you compile and deploy your Voting contract,
 * truffle stores the abi and deployed address in a json
 * file in the build directory. We will use this information
 * to setup a Voting abstraction. We will use this abstraction
 * later to create an instance of the Voting contract.
 * Compare this against the index.js from our previous tutorial to see the difference
 * https://gist.github.com/maheshmurthy/f6e96d6b3fff4cd4fa7f892de8a1a1b4#file-index-js
 */

import voting_artifacts from '../../build/contracts/Voting.json'

var Voting = contract(voting_artifacts);

let candidates = {}
let vendors = {}

let tokenPrice = null;

window.addVendor = function(vendor) {
  let vendorAddress = $("#vendor-addr").val();
  let vendorName = $("#vendor-name").val();
  $("#msg-vendor").html("Adding vendor request has been submitted. The vendor will be added as soon as the operation is recorded on the blockchain. Please wait.")

  Voting.deployed().then(function(contractInstance) {
    web3.eth.getAccounts().then(function(accounts) {
      contractInstance.addVendor(vendorAddress, web3.utils.asciiToHex(vendorName), {from: accounts[0]}).then(function() {
        $("#msg-vendor").html("");
        $("#vendor-addr").val("");
        $("#vendor-name").val("");
        appendVendorRow(vendorName, vendorAddress, 1000);
      });
    })
  });
}

/* The user enters the total no. of tokens to buy. We calculate the total cost and send it in
 * the request. We have to send the value in Wei. So, we use the toWei helper method to convert
 * from Ether to Wei.
 */
window.buyTokens = function() {
  let tokensToBuy = $("#buy").val();
  let price = tokensToBuy * tokenPrice;
  $("#buy-msg").html("Purchase order has been submitted. Please wait.");
  Voting.deployed().then(function(contractInstance) {
    web3.eth.getAccounts().then(function(accounts) {
      contractInstance.buy({value: web3.utils.toWei(price.toString(), 'ether'), from: accounts[0]}).then(function(v) {
        $("#buy-msg").html("");
        web3.eth.getBalance(contractInstance.address, function(error, result) {
          $("#contract-balance").html(web3.utils.fromWei(result.toString()) + " Ether");
        });
      })
    })
  });
  populateTokenData();
}

window.lookupVoterInfo = function() {
  let address = $("#voter-info").val();
  Voting.deployed().then(function(contractInstance) {
    contractInstance.voterDetails.call(address).then(function(v) {
      $("#tokens-bought").html("Total Tokens bought: " + v[0].toString());
      let votesPerCandidate = v[1];
      $("#votes-cast").empty();
      $("#votes-cast").append("Votes cast per candidate: <br>");
      let allCandidates = Object.keys(candidates);
      for(let i=0; i < allCandidates.length; i++) {
        $("#votes-cast").append(allCandidates[i] + ": " + votesPerCandidate[i] + "<br>");
      }
    });
  });
}

function populateVendors() {
  Voting.deployed().then(function(contractInstance) {
    contractInstance.vendors().then(function(_vendors) {
      for(let i=0; i < _vendors.length; i++) {
        let name = web3.utils.toUtf8(_vendors[i]['name'])
        vendors[name] = _vendors[i];
      }
      setupVendorRows();
    });
  });
}

function setupVendorRows() {
  Object.keys(vendors).forEach(function (vendor) {
    appendVendorRow(web3.utils.toUtf8(vendors[vendor]['name']), vendors[vendor]['addr'], vendors[vendor]['tokenCount'])
  });
}

function appendVendorRow(vendorName, vendorAddress, vendorTokenCount) {
  $("#vendor-rows").append("<tr><td>" + vendorName + "</td><td>" + vendorAddress + "</td><td>" + vendorTokenCount + "</td></tr>");
}

/* Fetch the total tokens, tokens available for sale and the price of
 * each token and display in the UI
 */
function populateTokenData() {
  Voting.deployed().then(function(contractInstance) {
    contractInstance.totalTokens().then(function(v) {
      $("#tokens-total").html(v.toString());
    });
    contractInstance.tokensSold.call().then(function(v) {
      $("#tokens-sold").html(v.toString());
    });
    contractInstance.tokenPrice().then(function(v) {
      tokenPrice = parseFloat(web3.utils.fromWei(v.toString()));
      $("#token-cost").html(tokenPrice + " Ether");
    });
    web3.eth.getBalance(contractInstance.address, function(error, result) {
      $("#contract-balance").html(web3.utils.fromWei(result.toString()) + " Ether");
    });
  });
}

$( document ).ready(function() {
  if (typeof web3 !== 'undefined') {
    console.warn("Using web3 detected from external source like Metamask")
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);
  } else {
    console.warn("No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
  }

  Voting.setProvider(web3.currentProvider);
  populateVendors();
});
