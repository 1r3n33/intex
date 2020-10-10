pragma solidity ^0.7.1;
pragma experimental ABIEncoderV2;

import "./Intex.sol";

/// @dev Data Intelligence Exchange
contract Exchange {

    /// @dev Owner of the contract
    address public owner;

    /// @dev Intex Token
    Intex private token;

    /// @dev Provider of data intelligence
    struct Provider {
        address addr;
        bytes32 name;
    }
    address[] public providerAddresses;
    mapping (address => Provider) public providerByAddress;

    /// @dev Data Intelligence
    struct DataIntelligence {
        address provider;
        uint256 timestamp;
        uint256 type_;
        uint256 format;
        bytes data;
    }
    mapping (bytes32 => DataIntelligence) public dataByHash;

    /// @dev Pass the Intex Token contract address
    constructor(Intex _token)
    {
        owner = msg.sender;
        token = _token;
    }

    /// @dev Register sender as provider
    function registerAsProvider(bytes32 name) external
    {
        require(providerByAddress[msg.sender].addr == address(0), "Provider address already registered");

        // Register provider
        providerAddresses.push(msg.sender);
        providerByAddress[msg.sender] = Provider(msg.sender, name);
    }

    /// @dev Get all providers
    function getAllProviders() view external returns (Provider[] memory)
    {
        uint count = providerAddresses.length;
        Provider[] memory _providers = new Provider[](count);
        for (uint i=0; i<count; i++)
        {
            _providers[i] = providerByAddress[providerAddresses[i]];
        }
        return _providers;
    }

    /// @dev Providers can add (or update) Data Intelligence
    function addDataIntelligence(bytes32 _hash, uint256 _type, uint256 _format, bytes calldata _data) external
    {
        uint256 oneThousand = uint256(1 * (10**3) * (10**18));

        Provider memory provider = providerByAddress[msg.sender];

        require(provider.addr == msg.sender, "Sender must be provider");
        require(token.balanceOf(msg.sender) >= oneThousand, "Unsufficient funds");

        // Store Data Intelligence
        // TODO: Do no let providers override each other!
        dataByHash[_hash] = DataIntelligence(msg.sender, block.timestamp, _type, _format, _data);

        // Payment
        // Tokens do not burn, they are sent to owner!
        token.transferFrom(msg.sender, owner, oneThousand);
    }
}
