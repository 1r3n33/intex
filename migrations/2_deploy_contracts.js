const Intex = artifacts.require("Intex");

module.exports = function(deployer) {
  deployer.deploy(Intex, web3.utils.toWei('1000000000')); // One billion tokens with 18 decimals
};
