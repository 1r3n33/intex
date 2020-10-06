pragma solidity ^0.7.1;
pragma experimental ABIEncoderV2;

import "./Intex.sol";

/// @dev Data Intelligence Exchange
contract Exchange {

    /// @dev Owner of the contract
    address public owner;

    /// @dev Intex Token
    Intex private _token;

    /// @dev Provider of data intelligence
    struct Provider {
        address addr;
        bytes32 name;
    }
    address[] public providerAddresses;
    mapping (address => Provider) public providerByAddress;

    /// @dev Pass the Intex Token contract address
    constructor(Intex token)
    {
        owner = msg.sender;
        _token = token;
    }

    /// @dev Register as provider
    function registerAsProvider(bytes32 name) public
    {
        require(providerByAddress[msg.sender].addr == address(0), "Provider already exists");

        // Register provider
        providerAddresses.push(msg.sender);
        providerByAddress[msg.sender] = Provider(msg.sender, name);
    }

    /// @dev Get all providers
    function getAllProviders() view public returns (Provider[] memory)
    {
        uint count = providerAddresses.length;
        Provider[] memory _providers = new Provider[](count);
        for (uint i=0; i<count; i++)
        {
            _providers[i] = providerByAddress[providerAddresses[i]];
        }
        return _providers;
    }
}
