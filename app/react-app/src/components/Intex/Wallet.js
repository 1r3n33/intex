class Wallet {
  constructor(web3, intex, address) {
    this.web3 = web3;
    this.intex = intex;
    this.address = address;
  }

  async getBalance() {
    return await this.intex.balanceOf(this.address);
  }

  async buy(ethAmount) {
    await this.intex.getTokens({
      from: this.address,
      value: this.web3.utils.toWei(String(ethAmount)),
    });
  }

  async convert(ethAmount) {
    const exchangeRate = await this.intex.ethExchangeRate();
    return ethAmount * exchangeRate;
  }
}

export default Wallet;
