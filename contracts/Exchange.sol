pragma solidity ^0.7.1;
pragma experimental ABIEncoderV2;

import "./Intex.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";

/// @dev Data Intelligence Exchange
contract Exchange {
    using SafeMath for uint256;

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
    mapping (bytes32 => address) public providerAddressByName;

    /// @dev Data Intelligence
    struct DataIntelligence {
        address provider;
        uint256 timestamp;
        uint256 type_;
        uint256 format;
        bytes data;
    }
    /// @dev Data Intelligence is stored in a data by hash mapping that is unique to each provider.
    mapping (address => mapping (bytes32 => DataIntelligence)) public dataByHash;

    struct DataIntelligenceCheck {
        address checker;
        uint256 timestamp;
        address provider;
        bytes32 dataHash;
    }
    mapping (bytes32 => DataIntelligenceCheck) public checkByHash;

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
        require(providerAddressByName[name] == address(0), "Provider name already registered");

        // Register provider
        providerAddresses.push(msg.sender);
        providerByAddress[msg.sender] = Provider(msg.sender, name);
        providerAddressByName[name] = msg.sender;
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
        dataByHash[msg.sender][_hash] = DataIntelligence(msg.sender, block.timestamp, _type, _format, _data);

        // Payment
        // Tokens do not burn, they are sent to owner!
        token.transferFrom(msg.sender, owner, oneThousand);
    }

    /// @dev Check Data Intelligence
    function checkDataIntelligence(bytes32 checkHash, address provider, bytes32 dataHash) external
    {
        DataIntelligence memory dataIntelligence = dataByHash[provider][dataHash];

        checkByHash[checkHash] = DataIntelligenceCheck(msg.sender, block.timestamp, provider, dataHash);

        // Payment
        uint256 oneHundred = uint256(1 * (10**2) * (10**18));
        token.transferFrom(msg.sender, dataIntelligence.provider, oneHundred);
    }

    /// @dev Reward checker & provider for service
    function reward(bytes32 checkHash, uint256 providerReward, uint256 checkerReward) public
    {
        require(token.balanceOf(msg.sender) >= providerReward.add(checkerReward), "Unsufficient funds");

        // Reward checker
        DataIntelligenceCheck memory dataIntelligenceCheck = checkByHash[checkHash];
        require(dataIntelligenceCheck.checker != address(0), "Cannot find checker");

        token.transferFrom(msg.sender, dataIntelligenceCheck.checker, checkerReward);

        // Reward provider
        DataIntelligence memory dataIntelligence = dataByHash[dataIntelligenceCheck.provider][dataIntelligenceCheck.dataHash];
        require(dataIntelligence.provider != address(0), "Cannot find provider");

        token.transferFrom(msg.sender, dataIntelligence.provider, providerReward);
    }
}
