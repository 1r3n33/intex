const Voting = artifacts.require('Voting');

contract('Voting', accounts => {

    it('should pass', async () => {
        assert.equal(true, true, 'always passing test');
    });

    it('should add a single vendor', async () => {
        let instance = await Voting.deployed();

        await instance.addVendor(accounts[0], web3.utils.asciiToHex('vendor'));
        let vendors = await instance.vendors();

        assert.equal(vendors.length, 1, 'invalid length');
        assert.equal(vendors[0].addr, accounts[0], 'invalid address');
        assert.equal(vendors[0].name, web3.utils.padRight(web3.utils.asciiToHex('vendor'), 64), 'invalid name');
        assert.equal(vendors[0].tokenCount, 1000, 'invalid token count');
    });

    it('should add multiple vendors', async () => {
        let instance = await Voting.deployed();

        for (i = 1; i < 5; i++) {
            await instance.addVendor(accounts[i], web3.utils.asciiToHex('vendor'+i));
        }

        let vendors = await instance.vendors();

        assert.equal(vendors.length, 5, 'invalid length');

        for (i = 1; i < 5; i++) {
            assert.equal(vendors[i].addr, accounts[i], 'invalid address');
            assert.equal(vendors[i].name, web3.utils.padRight(web3.utils.asciiToHex('vendor'+i), 64), 'invalid name');
            assert.equal(vendors[i].tokenCount, 1000, 'invalid token count');
        }
    });

    it('should not add the same vendor twice', async () => {
        let instance = await Voting.deployed();

        let hasRaisedException = false;
        try {
            await instance.addVendor(accounts[0], web3.utils.asciiToHex('vendor'));
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
});
