# Intex for Brand Safety

## Principles

- Brand Safety providers offer Data Intelligence on Intex Marketplace.

- Ad Tech companies benefit from Data Intelligence on Intex Marketplace to create secure environments for Publishers & Advertisers.

- Publisher & Advertisers leverage Intex Marketplace to audit Brand Safety controls provided by Ad Tech companies.

## Implementation

### For Brand Safety Providers

1. Register self as Brand Safety Provider

    In order to offer Brand Safety Intelligence on Intex Exchange, you must first be registered as Brand Safety Provider by using the Intex Exchange smart contract.

    ```javascript
    const Exchange = artifacts.require('Exchange');
    const exchange = await Exchange.deployed();
    
    await exchange.registerAsProvider(
        web3.utils.asciiToHex('provider_name'), // Provider Name must be less than 32 characters long
        {
            from: provider_account // Provider Ethereum Account address
        }); 
    ```

2. Acquiring INTX tokens

    Once you are registered as Brand Safety, you need to acquire Intex tokens (INTX) to use the exchange. Operations, such as adding Brand Safety Intelligence, require spending Intex tokens.
    
    The Exchange smart contract pays Brand Safety Providers back every time Ad Tech companies consumes Brand Safety Intelligence to validate their operations (such as bid request).

    Intex tokens (INTX) are acquired by paying ETH to the Intex smart contract. The amount of Intex tokens (INTX) you get is proportional to the amount of ETH you pay.

    ```javascript
    const Intex = artifacts.require('Intex');
    const intex = await Intex.deployed();
    
    await intex.getTokens(
        { 
            from: provider_account, // Provider Ethereum Account address
            value: web3.utils.toWei('1') // Amount of ETH to spend
        });
    ```

3. Storing Brand Safety Intelligence

4. Receiving INTX tokens

### For Ad Tech Companies

1. Acquiring INTEX tokens

2. Checking Brand Safety Intelligence

## Appendix

### IAB Brand Safety Categories & Taxonomy

### URL Normalization

### Real-time application

### Withdraw INTX for ETH
