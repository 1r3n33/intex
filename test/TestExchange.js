const Intex = artifacts.require("Intex");
const Exchange = artifacts.require('Exchange');

contract('Exchange', accounts => {

    it('should register a single provider', async () => {
        let instance = await Exchange.deployed();

        await instance.registerAsProvider(web3.utils.asciiToHex('provider1'), { from: accounts[1] } );
        let providers = await instance.getAllProviders();

        assert.equal(providers.length, 1, 'invalid length');
        assert.equal(providers[0].addr, accounts[1], 'invalid address');
        assert.equal(providers[0].name, web3.utils.padRight(web3.utils.asciiToHex('provider1'), 64), 'invalid name');
    });

    it('should register multiple providers', async () => {
        let instance = await Exchange.deployed();

        for (i = 2; i <= 5; i++) {
            await instance.registerAsProvider(web3.utils.asciiToHex('provider'+i), { from: accounts[i] } );
        }

        let providers = await instance.getAllProviders();

        assert.equal(providers.length, 5, 'invalid length');

        for (i = 0; i < 5; i++) {
            assert.equal(providers[i].addr, accounts[i+1], 'invalid address');
            assert.equal(providers[i].name, web3.utils.padRight(web3.utils.asciiToHex('provider'+(i+1)), 64), 'invalid name');
        }
    });

    it('should not register the same provider twice', async () => {
        let instance = await Exchange.deployed();

        let hasRaisedException = false;
        try {
            await instance.registerAsProvider(web3.utils.asciiToHex('provider'), { from: accounts[1] } );
        } catch (exception) {
            assert(
                exception.message.startsWith('Returned error: VM Exception while processing transaction: revert Provider address already registered'),
                'invalid exception: ' + exception.message
            );
            hasRaisedException = true;
        }

        assert(hasRaisedException, 'should have raised exception');
    });

    it('should add data intelligence', async () => {
        const intex = await Intex.deployed();
        const exchange = await Exchange.deployed();

        // Buy 1M Intex tokens
        await intex.getTokens({ from: accounts[1], value: web3.utils.toWei('1') });
        // Allow Exchange to use 1K INTX tokens
        await intex.increaseAllowance(exchange.address, web3.utils.toWei('1000'), { from: accounts[1] });

        const hash = '0x123456789';
        const type = 0;
        const format = 1;
        const bytes = web3.utils.asciiToHex('bytes');

        await exchange.addDataIntelligence(hash, type, format, bytes, { from: accounts[1] });

        const dataIntelligence = await exchange.dataByHash(hash);

        assert.equal(dataIntelligence.provider, accounts[1], 'Invalid provider');
        assert.equal(dataIntelligence.type_, 0, 'Invalid type');
        assert.equal(dataIntelligence.format, 1, 'Invalid format');
        assert.equal(dataIntelligence.data, web3.utils.asciiToHex('bytes'), 'Invalid data');
    });
});
