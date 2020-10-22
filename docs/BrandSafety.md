# Intex for Brand Safety

## Principles

- Brand Safety providers offer Data Intelligence on Intex Marketplace.

- Ad Tech companies benefit from Data Intelligence on Intex Marketplace to create secure environments for Publishers & Advertisers.

- Publisher & Advertisers leverage Intex Marketplace to audit Brand Safety controls provided by Ad Tech companies.

## Implementation

### For Brand Safety Providers

1. Registering self as Brand Safety Provider

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

2. Acquiring Intex tokens (INTX)

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

    Before storing Brand Safety Intelligence on Intex exchange, you must allow the Exchange smart contract to use Intex tokens (INTX) you acquired.

    ```javascript
    await intex.increaseAllowance(
        exchange.address, // Intex Exchange smart contract address
        web3.utils.toWei('1000'), // Amount of Intex tokens (INTX) the Exchange smart contract is allowed to spend on your behalf
        {
            from: provider_account // Provider Ethereum Account address
        });
    ```

    The `increaseAllowance` method does not decrease your Intex tokens (INTX) balance.

3. Storing Brand Safety Intelligence

    Let's consider, as a Brand Safety Provider, you would like to store a list of [IAB Brand Safety Unsafe Categories](#iab) ids corresponding to unsafe content of a given website.
    You should follow the following steps:

    1. Encoding the list of `type` [IAB Brand Safety Unsafe Categories](#iab) ids into `bytes` using a specific `format`
    2. Computing the `hash` of the website URL as a key to the `bytes`
    3. Calling an Intex Exchange smart contract method to write all these information on the blockchain

    The most simple format you can use to encode a type of list of ids into bytes is the following:

    |Number of ids|Id 0     |Id 1     |Id 2     |...|Id *n*   |
    |:-----------:|:-------:|:-------:|:-------:|:-:|:-------:|
    |*4 bytes*    |*4 bytes*|*4 bytes*|*4 bytes*|...|*4 bytes*|

    ```javascript
    // Javascript code that encodes into an array of integers
    ```

    In the Intex Exchange smart contract, this format is named `Array of integers` and has `format id`: *TBD*.

    To compute the hash of the website URL, you must first make sure the URL is properly [normalized](#url).
    Then you can compute hash with the `web3.utils.keccak256` method.

    ```javascript
    import { default as Web3} from 'web3';
    import { default as normalizeUrl } from 'normalize-url'; // https://github.com/sindresorhus/normalize-url

    const normalizedUrl = normalizeUrl(url, {stripProtocol: true, stripHash: true});
    const hash = web3.utils.keccak256(normalizedUrl);
    ```

4. Receiving INTX tokens

### For Ad Tech Companies

1. Acquiring INTEX tokens

2. Checking Brand Safety Intelligence

## Appendix

<a name="iab"></a>
### IAB Brand Safety Unsafe Categories

The Interactive Advertising Bureau Brand Safety Unsafe Categories refers 13 categories to avoid:
1. Military conflict
2. Obscenity
3. Drugs
4. Tobacco
5. Adult
6. Arms
7. Crime
8. Death/injury
9. Online piracy
10. Hate speech
11. Terrorism
12. Spam/harmful sites
13. Fake news

<a name="url"></a>
### URL Normalization

All participants in Intex Exchange must hash URL the exact same way in order to interact with each others.

The Intex Exchange recommend the following URL normalization scheme:
- Remove authentication
- Remove hash
- Remove protocol and leading slashes
- Remove port
- Remove `www.`
- Remove `utm_` query parameters
- Remove trailing slashes
- Sort query parameters alphabetically

```javascript
normalizeUrl('http://www.intex.com:80/../baz?b=bar&a=foo#hello');
//=> 'intex.com/baz?a=foo&b=bar'
```

### Real-time application

### Withdraw INTX for ETH
