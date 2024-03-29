const Intex = artifacts.require("Intex");
const Exchange = artifacts.require('Exchange');

contract('Exchange', accounts => {

    it('should deploy with expected state', async () => {
        const exchange = await Exchange.deployed();

        const owner = await exchange.owner();
        assert.strictEqual(owner, accounts[0], 'Invalid owner');

        const addDataIntelligencePrice = await exchange.addDataIntelligencePrice();
        assert.strictEqual(
            addDataIntelligencePrice.toString(),
            web3.utils.toBN(web3.utils.toWei('1000')).toString(),
            'Invalid addDataIntelligencePrice');

        const checkDataIntelligencePrice = await exchange.checkDataIntelligencePrice();
        assert.strictEqual(
            checkDataIntelligencePrice.toString(),
            web3.utils.toBN(web3.utils.toWei('100')).toString(),
            'Invalid checkDataIntelligencePrice');
    });

    it('should register a single provider', async () => {
        const instance = await Exchange.deployed();

        await instance.registerAsProvider(web3.utils.asciiToHex('provider1'), { from: accounts[1] } );

        const providers = await instance.getAllProviders();
        assert.deepEqual(providers.length, 1, 'invalid number of providers');
        assert.deepEqual(providers[0].addr, accounts[1], 'invalid provider address');
        assert.deepEqual(providers[0].name, web3.utils.padRight(web3.utils.asciiToHex('provider1'), 64), 'invalid provider name');

        const addressByIndex = await instance.providerAddresses(0);
        assert.deepEqual(addressByIndex, accounts[1], 'invalid address registration');

        const providerByAddress = await instance.providerByAddress(accounts[1]);
        assert.deepEqual(Object.entries(providerByAddress), Object.entries(providers[0]), 'invalid provider registration');

        const addressByName = await instance.providerAddressByName(web3.utils.asciiToHex('provider1'))
        assert.deepEqual(addressByName, accounts[1], 'invalid name registration');
    });

    it('should register multiple providers', async () => {
        const instance = await Exchange.deployed();

        for (i = 2; i <= 5; i++) {
            await instance.registerAsProvider(web3.utils.asciiToHex('provider'+i), { from: accounts[i] } );
        }

        const providers = await instance.getAllProviders();
        assert.deepEqual(providers.length, 5, 'invalid number of providers');
        for (i = 0; i < 5; i++) {
            assert.deepEqual(providers[i].addr, accounts[i+1], 'invalid provider address');
            assert.deepEqual(providers[i].name, web3.utils.padRight(web3.utils.asciiToHex('provider'+(i+1)), 64), 'invalid provider name');

            const addressByIndex = await instance.providerAddresses(i);
            assert.deepEqual(addressByIndex, accounts[i+1], 'invalid address registration');

            const providerByAddress = await instance.providerByAddress(accounts[i+1]);
            assert.deepEqual(Object.entries(providerByAddress), Object.entries(providers[i]), 'invalid provider registration');

            const addressByName = await instance.providerAddressByName(web3.utils.asciiToHex('provider'+(i+1)))
            assert.deepEqual(addressByName, accounts[i+1], 'invalid name registration');
        }
    });

    it('should not register the same provider twice', async () => {
        const instance = await Exchange.deployed();

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

    it('should not register a provider with a name already in use', async () => {
        const instance = await Exchange.deployed();

        let hasRaisedException = false;
        try {
            await instance.registerAsProvider(web3.utils.asciiToHex('provider1'), { from: accounts[6] } );
        } catch (exception) {
            assert(
                exception.message.startsWith('Returned error: VM Exception while processing transaction: revert Provider name already registered'),
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

        const url = web3.utils.asciiToHex('url');
        const hash = web3.utils.keccak256(url);
        const type = 0;
        const data = web3.utils.asciiToHex('data');

        await exchange.addDataIntelligence(url, type, data, { from: accounts[1] });

        const dataIntelligenceHash = await exchange.dataIntelligenceHashes(accounts[1], 0);
        assert.equal(dataIntelligenceHash, hash, 'Invalid hash');

        const dataIntelligence = await exchange.dataIntelligenceByHash(accounts[1], hash);
        assert.equal(dataIntelligence.source, url, 'Invalid source');
        assert.equal(dataIntelligence.type_, type, 'Invalid type');
        assert.equal(dataIntelligence.data, data, 'Invalid data');
    });

    it('should get data intelligences', async () => {
        const exchange = await Exchange.deployed();

        const url = web3.utils.asciiToHex('url');
        const type = 0;
        const data = web3.utils.asciiToHex('data');

        const dataIntelligences = await exchange.getDataIntelligences(accounts[1]);
        assert.deepEqual(dataIntelligences.length, 1, 'invalid number of data intelligences');
        for (i = 0; i < 1; i++) {
            assert.equal(dataIntelligences[i].source, url, 'Invalid source');
            assert.equal(dataIntelligences[i].type_, type, 'Invalid type');
            assert.equal(dataIntelligences[i].data, data, 'Invalid data');
        }
    });

    it('should not add data intelligence', async () => {
        const exchange = await Exchange.deployed();

        let hasRaisedException = false;
        try {
            const url = web3.utils.asciiToHex('url');
            const type = 0;
            const data = web3.utils.asciiToHex('data');

            await exchange.addDataIntelligence(url, type, data, { from: accounts[9] });
        } catch (exception) {
            assert(
                exception.message.startsWith('Returned error: VM Exception while processing transaction: revert Sender must be provider'),
                'invalid exception: ' + exception.message
            );
            hasRaisedException = true;
        }

        assert(hasRaisedException, 'should have raised exception');
    });

    it('should check data intelligence', async () => {
        const intex = await Intex.deployed();
        const exchange = await Exchange.deployed();

        // Buy 1M Intex tokens
        await intex.getTokens({ from: accounts[2], value: web3.utils.toWei('1') });
        // Allow Exchange to use 1K INTX tokens
        await intex.increaseAllowance(exchange.address, web3.utils.toWei('1000'), { from: accounts[2] });

        const url = web3.utils.asciiToHex('url');
        const dataHash = web3.utils.keccak256(url);
        const type = 0;
        const data = web3.utils.asciiToHex('data');
        await exchange.addDataIntelligence(url, type, data, { from: accounts[2] });

        // Buy 100 Intex tokens
        await intex.getTokens({ from: accounts[3], value: '100000000000000' });
        // Allow Exchange to use 100 INTX tokens
        await intex.increaseAllowance(exchange.address, web3.utils.toWei('100'), { from: accounts[3] });

        const checkHash = '0x9876543210';
        await exchange.checkDataIntelligence(checkHash, accounts[2], dataHash, { from: accounts[3] });

        const dataIntelligenceCheck = await exchange.checkByHash(checkHash);

        assert.equal(dataIntelligenceCheck.checker, accounts[3], 'Invalid checker');
        assert.equal(dataIntelligenceCheck.provider, accounts[2], 'Invalid provider');
        assert.equal(dataIntelligenceCheck.dataHash, dataHash, 'Invalid data hash');
    });

    it ('should not check data intelligence with unsufficient funds', async () => {
        const exchange = await Exchange.deployed();

        let hasRaisedException = false;
        try {
            const checkHash = '0x9876543210';
            const dataHash = '0x0123456789';
            await exchange.checkDataIntelligence(checkHash, accounts[2], dataHash, { from: accounts[3] });
        } catch (exception) {
            assert(
                exception.message.startsWith('Returned error: VM Exception while processing transaction: revert Unsufficient funds'),
                'invalid exception: ' + exception.message
            );
            hasRaisedException = true;
        }

        assert(hasRaisedException, 'should have raised exception');
    });

    it('should reward checker and provider', async () => {
        const intex = await Intex.deployed();
        const exchange = await Exchange.deployed();

        const providerReward = web3.utils.toWei('50');
        const checkerReward = web3.utils.toWei('10');
        const totalReward = web3.utils.toWei('60');

        // Buy 1M Intex tokens
        await intex.getTokens({ from: accounts[4], value: web3.utils.toWei('1') });
        // Allow Exchange to use 60 INTX tokens
        await intex.increaseAllowance(exchange.address, totalReward, { from: accounts[4] });

        // reusing the previous 'should check data intelligence' test
        const providerPrev = await intex.balanceOf(accounts[2]);
        const checkerPrev = await intex.balanceOf(accounts[3]);
        const rewarderPrev = await intex.balanceOf(accounts[4]);

        await exchange.reward('0x9876543210', providerReward, checkerReward, { from: accounts[4] });

        const providerCur = await intex.balanceOf(accounts[2]);
        const checkerCur = await intex.balanceOf(accounts[3]);
        const rewarderCur = await intex.balanceOf(accounts[4]);

        assert.equal(
            providerPrev.add(web3.utils.toBN(providerReward)).toString(),
            providerCur.toString(),
            'Invalid provider balance');

        assert.equal(
            checkerPrev.add(web3.utils.toBN(checkerReward)).toString(),
            checkerCur.toString(),
            'Invalid checker balance');

        assert.equal(
            rewarderPrev.sub(web3.utils.toBN(totalReward)).toString(),
            rewarderCur.toString(),
            'Invalid rewarder balance');
    });
});
