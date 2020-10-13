const Intex = artifacts.require('Intex');

contract('Intex', accounts => {

    it('should deploy with expected balance', async () => {
        let instance = await Intex.deployed();

        let balance = await instance.balanceOf(accounts[0]);
        assert.equal(balance, web3.utils.toWei('1000000000'), 'invalid balance: ' + balance);
    });

    it('should mint token on demand', async () => {
        let instance = await Intex.deployed();

        let previousEthBalance = await web3.eth.getBalance(accounts[0]);
        let result = await instance.getTokens({ from: accounts[0], value: web3.utils.toWei('1') });
        let newEthBalance = await web3.eth.getBalance(accounts[0]);

        let before = web3.utils.toBN(previousEthBalance);
        let after = web3.utils.toBN(newEthBalance);
        let diff = before.sub(after);

        let tx = await web3.eth.getTransaction(result.tx);
        let gasPrice = web3.utils.toBN(tx.gasPrice);
        let gas = web3.utils.toBN(result.receipt.gasUsed).mul(gasPrice);
        let one = web3.utils.toBN(web3.utils.toWei('1'));
        let expected = one.add(gas);

        assert.deepStrictEqual(diff.toString(), expected.toString(), 'Invalid ETH balance');

        let balance = await instance.balanceOf(accounts[0]);
        assert.equal(balance, web3.utils.toWei('1001000000'), 'invalid balance: ' + balance);
    });

    it('should withdraw', async () => {
        let instance = await Intex.deployed();

        let previousEthBalance = await web3.eth.getBalance(accounts[1]);
        await instance.withdraw(accounts[1], web3.utils.toWei('0.5'), { from: accounts[0] });
        let newEthBalance = await web3.eth.getBalance(accounts[1]);

        let before = web3.utils.toBN(previousEthBalance);
        let after = web3.utils.toBN(newEthBalance);
        let diff = after.sub(before);

        let expected = web3.utils.toBN(web3.utils.toWei('0.5'));

        assert.deepStrictEqual(diff.toString(), expected.toString(), 'Invalid ETH balance');
    });
});
