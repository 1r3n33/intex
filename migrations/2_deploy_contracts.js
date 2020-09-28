const Voting = artifacts.require("Voting");

module.exports = function(deployer) {
  deployer.deploy(Voting, web3.utils.toWei('1000000000')); // One billion tokens with 18 decimals
};
