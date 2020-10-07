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

    it('should add content analysis', async () => {
        let instance = await Intex.deployed();

        await instance.addVendor(accounts[1], web3.utils.asciiToHex('vendor1'));

        let urlVendorHash = '0x123456789';
        await instance.addContentAnalysis(urlVendorHash, 1, { from: accounts[1] });

        let contentAnalysis = await instance.contentAnalysisByHash(urlVendorHash);

        assert.equal(contentAnalysis.vendor, accounts[1], 'Invalid vendor');
        assert.equal(contentAnalysis.iabUnsafeDigitalEnvironment, 1, 'Invalid IAB unsafe digital environment');
    });

    it('should not add content analysis', async () => {
        let instance = await Intex.deployed();

        let hasRaisedException = false;
        try {
            let urlVendorHash = '0x123456789';
            await instance.addContentAnalysis(urlVendorHash, 2, { from: accounts[6] });
        } catch (exception) {
            assert(
                exception.message.startsWith('Returned error: VM Exception while processing transaction: revert Sender must be vendor'),
                'invalid exception: ' + exception.message
            );
            hasRaisedException = true;
        }

        assert(hasRaisedException, 'should have raised exception');
    });

    it('should check content analysis', async () => {
        let instance = await Intex.deployed();

        await instance.addVendor(accounts[2], web3.utils.asciiToHex('vendor2'));

        let balance = await instance.balanceOf(accounts[2]);
        assert.equal(balance, web3.utils.toWei('1000000'), 'Invalid balance: ' + balance);

        await instance.addContentAnalysis('0x123', 4, { from: accounts[2] });
        balance = await instance.balanceOf(accounts[2]);
        assert.equal(balance, web3.utils.toWei('999000'), 'Invalid balance: ' + balance);

        await instance.checkContentAnalysis('0x456', '0x123');
        balance = await instance.balanceOf(accounts[2]);
        assert.equal(balance, web3.utils.toWei('999100'), 'Invalid balance: ' + balance);
    });

    it('should reward good players', async () => {
        let instance = await Intex.deployed();

        let rewarderPreviousBalance = await instance.balanceOf(accounts[1]);
        let verifierPreviousBalance = await instance.balanceOf(accounts[0]);
        let vendorPreviousBalance = await instance.balanceOf(accounts[2]);

        await instance.reward('0x456', web3.utils.toWei('50'), web3.utils.toWei('10'), { from: accounts[1] });

        let rewarderNewBalance = await instance.balanceOf(accounts[1]);
        let verifierNewBalance = await instance.balanceOf(accounts[0]);
        let vendorNewBalance = await instance.balanceOf(accounts[2]);

        assert.equal(
            rewarderPreviousBalance.sub(new web3.utils.BN(web3.utils.toWei('60'))).toString(),
            rewarderNewBalance.toString(),
            'Invalid rewarder balance');

        assert.equal(
            verifierPreviousBalance.add(new web3.utils.BN(web3.utils.toWei('50'))).toString(),
            verifierNewBalance.toString(),
            'Invalid verifier balance');

        assert.equal(
            vendorPreviousBalance.add(new web3.utils.BN(web3.utils.toWei('10'))).toString(),
            vendorNewBalance.toString(),
            'Invalid vendor balance');
    });
});
