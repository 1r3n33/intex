const Voting = artifacts.require('Voting');

contract('Voting', accounts => {

    it('should pass', async () => {
        assert.equal(true, true, 'always passing test');
    });

    it('should add vendor', async () => {
        let instance = await Voting.deployed();

        await instance.addVendor(accounts[0], web3.utils.asciiToHex('vendor'));
        let vendors = await instance.vendors();

        assert.equal(vendors.length, 1, 'invalid length');
        assert.equal(vendors[0].addr, accounts[0], 'invalid address');
        assert.equal(vendors[0].name, web3.utils.padRight(web3.utils.asciiToHex('vendor'), 64), 'invalid name');
        assert.equal(vendors[0].tokenCount, 1000, 'invalid token count');
    });

});
