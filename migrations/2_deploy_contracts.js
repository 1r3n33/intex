const Voting = artifacts.require("Voting");

module.exports = function(deployer) {
  deployer.deploy(
    Voting,
    1000,
    web3.utils.toWei('0.1', 'ether'),
    ['Rama', 'Nick', 'Jose'].map(name => web3.utils.asciiToHex(name)));
};
