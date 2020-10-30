// Import the page's CSS. Webpack will know what to do with it.
import "./app.css";

// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from '@truffle/contract'
import { default as normalizeUrl } from 'normalize-url'

/*
 * When you compile and deploy your Intex contract,
 * truffle stores the abi and deployed address in a json
 * file in the build directory. We will use this information
 * to setup a Intex abstraction. We will use this abstraction
 * later to create an instance of the Intex contract.
 */

import intex_artifacts from '../../build/contracts/Intex.json'

var Intex = contract(intex_artifacts);

let vendors = {}

window.addVendor = function(vendor) {
  let vendorAddress = $("#vendor-addr").val();
  let vendorName = $("#vendor-name").val();
  $("#msg-vendor").html("Adding vendor request has been submitted. The vendor will be added as soon as the operation is recorded on the blockchain. Please wait.")

  Intex.deployed().then(function(contractInstance) {
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

window.getHash = function(hash) {
  let vendorAddress = $("#gethash-addr").val();
  let uri = $("#gethash-uri").val();

  let normalizedUri = normalizeUrl(uri, {stripProtocol: true, stripHash: true})

  hash = web3.utils.keccak256(vendorAddress+normalizedUri)

  $("#gethash-normalized-uri").html(normalizedUri);
  $("#gethash-hash").html(hash);
}

function populateVendors() {
  Intex.deployed().then(function(contractInstance) {
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

  Intex.setProvider(web3.currentProvider);
  populateVendors();
});
