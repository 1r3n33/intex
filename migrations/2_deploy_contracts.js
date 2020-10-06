const Intex = artifacts.require("Intex");
const Exchange = artifacts.require("Exchange")

module.exports = async function(deployer) {
  await deployer.deploy(Intex, web3.utils.toWei('1000000000')); // One billion tokens with 18 decimals

  const token = await Intex.deployed()
  await deployer.deploy(Exchange, token.address);
};
