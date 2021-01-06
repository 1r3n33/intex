class Wallet {
  constructor(intex, address) {
    this.intex = intex;
    this.address = address;
  }

  async getBalance() {
    return await this.intex.balanceOf(this.address);
  }
}

export default Wallet;
