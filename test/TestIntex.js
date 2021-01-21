const Intex = artifacts.require("Intex");

contract("Intex", (accounts) => {
  it("should deploy with expected balance", async () => {
    const intex = await Intex.deployed();

    const balance = await intex.balanceOf(accounts[0]);
    assert.equal(
      balance,
      web3.utils.toWei("1000000000"),
      "invalid balance: " + balance
    );
  });

  it("should deploy with expected exchange rate", async () => {
    const intex = await Intex.deployed();

    const exchangeRate = await intex.ethExchangeRate();
    assert.equal(
      exchangeRate,
      1000000,
      "invalid exchange rate: " + exchangeRate
    );
  });

  it("should mint token on demand", async () => {
    let instance = await Intex.deployed();

    let previousEthBalance = await web3.eth.getBalance(accounts[0]);
    let result = await instance.getTokens({
      from: accounts[0],
      value: web3.utils.toWei("1"),
    });
    let newEthBalance = await web3.eth.getBalance(accounts[0]);

    let before = web3.utils.toBN(previousEthBalance);
    let after = web3.utils.toBN(newEthBalance);
    let diff = before.sub(after);

    let tx = await web3.eth.getTransaction(result.tx);
    let gasPrice = web3.utils.toBN(tx.gasPrice);
    let gas = web3.utils.toBN(result.receipt.gasUsed).mul(gasPrice);
    let one = web3.utils.toBN(web3.utils.toWei("1"));
    let expected = one.add(gas);

    assert.deepStrictEqual(
      diff.toString(),
      expected.toString(),
      "Invalid ETH balance"
    );

    let balance = await instance.balanceOf(accounts[0]);
    assert.equal(
      balance,
      web3.utils.toWei("1001000000"),
      "invalid balance: " + balance
    );
  });

  it("should withdraw", async () => {
    let instance = await Intex.deployed();

    let previousEthBalance = await web3.eth.getBalance(accounts[1]);
    await instance.withdraw(accounts[1], web3.utils.toWei("0.5"), {
      from: accounts[0],
    });
    let newEthBalance = await web3.eth.getBalance(accounts[1]);

    let before = web3.utils.toBN(previousEthBalance);
    let after = web3.utils.toBN(newEthBalance);
    let diff = after.sub(before);

    let expected = web3.utils.toBN(web3.utils.toWei("0.5"));

    assert.deepStrictEqual(
      diff.toString(),
      expected.toString(),
      "Invalid ETH balance"
    );
  });

  it("should set exchange rate", async () => {
    const intex = await Intex.deployed();
    await intex.setEthExchangeRate(123, { from: accounts[0] });

    const exchangeRate = await intex.ethExchangeRate();
    assert.equal(exchangeRate, 123, "invalid exchange rate: " + exchangeRate);
  });

  it("should not set exchange rate to zero", async () => {
    let hasRaisedException = false;
    try {
      const intex = await Intex.deployed();
      await intex.setEthExchangeRate(0, { from: accounts[0] });
    } catch (exception) {
      assert(
        exception.message.startsWith(
          "Returned error: VM Exception while processing transaction: revert Rate must be greater than zero"
        ),
        "invalid exception: " + exception.message
      );
      hasRaisedException = true;
    }
    assert(hasRaisedException, "should have raised exception");
  });

  it("should not set exchange rate if not owner", async () => {
    let hasRaisedException = false;
    try {
      const intex = await Intex.deployed();
      await intex.setEthExchangeRate(456, { from: accounts[1] });
    } catch (exception) {
      assert(
        exception.message.startsWith(
          "Returned error: VM Exception while processing transaction: revert Sender must be owner"
        ),
        "invalid exception: " + exception.message
      );
      hasRaisedException = true;
    }
    assert(hasRaisedException, "should have raised exception");
  });
});
