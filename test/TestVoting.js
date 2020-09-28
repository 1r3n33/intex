const Voting = artifacts.require('Voting');

contract('Voting', accounts => {

    it('should pass', async () => {
        assert.equal(true, true, 'always passing test');
    });

    it('should add a single vendor', async () => {
        let instance = await Voting.deployed();

        await instance.addVendor(accounts[1], web3.utils.asciiToHex('vendor1'));
        let vendors = await instance.vendors();

        assert.equal(vendors.length, 1, 'invalid length');
        assert.equal(vendors[0].addr, accounts[1], 'invalid address');
        assert.equal(vendors[0].name, web3.utils.padRight(web3.utils.asciiToHex('vendor1'), 64), 'invalid name');

        let balance = await instance.balanceOf(accounts[1]);
        assert.equal(balance, web3.utils.toWei('1000000'), 'invalid token count: ' + balance);
    });

    it('should add multiple vendors', async () => {
        let instance = await Voting.deployed();

        for (i = 2; i <= 5; i++) {
            await instance.addVendor(accounts[i], web3.utils.asciiToHex('vendor'+i));
        }

        let vendors = await instance.vendors();

        assert.equal(vendors.length, 5, 'invalid length');

        for (i = 0; i < 5; i++) {
            assert.equal(vendors[i].addr, accounts[i+1], 'invalid address');
            assert.equal(vendors[i].name, web3.utils.padRight(web3.utils.asciiToHex('vendor'+(i+1)), 64), 'invalid name');

            let balance = await instance.balanceOf(accounts[i+1]);
            assert.equal(balance, web3.utils.toWei('1000000'), 'invalid token count: ' + balance);
        }
    });

    it('should not add the same vendor twice', async () => {
        let instance = await Voting.deployed();

        let hasRaisedException = false;
        try {
            await instance.addVendor(accounts[1], web3.utils.asciiToHex('vendor'));
        } catch (exception) {
            assert(
                exception.message.startsWith('Returned error: VM Exception while processing transaction: revert Vendor address already exists'),
                'invalid exception: ' + exception.message
            );
            hasRaisedException = true;
        }

        assert(hasRaisedException, 'should have raised exception');
    });

    it('should add content analysis', async () => {
        let instance = await Voting.deployed();

        let urlVendorHash = '0x123456789';
        await instance.addContentAnalysis(urlVendorHash, 1, { from: accounts[1] });

        let contentAnalysis = await instance.contentAnalysisByHash(urlVendorHash);

        assert.equal(contentAnalysis.vendor, accounts[1], 'Invalid vendor');
        assert.equal(contentAnalysis.iabUnsafeDigitalEnvironment, 1, 'Invalid IAB unsafe digital environment');
    });

    it('should not add content analysis', async () => {
        let instance = await Voting.deployed();

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
        let instance = await Voting.deployed();

        let balance = await instance.balanceOf(accounts[2]);
        assert.equal(balance, web3.utils.toWei('1000000'), 'Invalid token count: ' + balance);

        await instance.addContentAnalysis('0x123', 4, { from: accounts[2] });
        balance = await instance.balanceOf(accounts[2]);
        assert.equal(balance, web3.utils.toWei('999000'), 'Invalid token count: ' + balance);

        await instance.checkContentAnalysis('0x456', '0x123');
        balance = await instance.balanceOf(accounts[2]);
        assert.equal(balance, web3.utils.toWei('999100'), 'Invalid token count: ' + balance);
    });
});
