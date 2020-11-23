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
        uint256 timestamp;
        bytes source;
        uint256 type_;
        bytes data;
    }
    /// @dev Each provider has mapping to access Data Intelligence
    mapping (address => bytes32[]) public dataIntelligenceHashes;
    mapping (address => mapping (bytes32 => DataIntelligence)) public dataIntelligenceByHash;

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
    /// TODO: Add a second method that takes hash as a parameter
    function addDataIntelligence(bytes calldata dataSource, uint256 dataType, bytes calldata dataIntelligence) external
    {
        require(dataSource.length < 256, "Data source length must be less than 256");
        bytes32 hash = keccak256(dataSource);

        Provider memory provider = providerByAddress[msg.sender];
        require(provider.addr == msg.sender, "Sender must be provider");

        uint256 oneThousand = uint256(1 * (10**3) * (10**18));
        require(token.balanceOf(msg.sender) >= oneThousand, "Unsufficient funds");

        // Store Data Intelligence
        dataIntelligenceHashes[msg.sender].push(hash);
        dataIntelligenceByHash[msg.sender][hash] = DataIntelligence(block.timestamp, dataSource, dataType, dataIntelligence);

        // Payment
        // Tokens do not burn, they are sent to owner!
        token.transferFrom(msg.sender, owner, oneThousand);
    }

    /// @dev Get Data Intelligences of provider
    function getDataIntelligences(address provider) view external returns (DataIntelligence[] memory)
    {
        uint count = dataIntelligenceHashes[provider].length;
        DataIntelligence[] memory dataIntelligences = new DataIntelligence[](count);
        for (uint i=0; i<count; i++)
        {
            dataIntelligences[i] = dataIntelligenceByHash[provider][dataIntelligenceHashes[provider][i]];
        }
        return dataIntelligences;
    }

    /// @dev Check Data Intelligence
    function checkDataIntelligence(bytes32 checkHash, address provider, bytes32 dataHash) external
    {
        checkByHash[checkHash] = DataIntelligenceCheck(msg.sender, block.timestamp, provider, dataHash);

        // Payment
        uint256 oneHundred = uint256(1 * (10**2) * (10**18));
        token.transferFrom(msg.sender, provider, oneHundred);
    }

    /// @dev Reward checker & provider for service
    function reward(bytes32 checkHash, uint256 providerReward, uint256 checkerReward) public
    {
        require(token.balanceOf(msg.sender) >= providerReward.add(checkerReward), "Unsufficient funds");

        DataIntelligenceCheck memory dataIntelligenceCheck = checkByHash[checkHash];
        require(dataIntelligenceCheck.checker != address(0), "Cannot find checker");
        require(dataIntelligenceCheck.provider != address(0), "Cannot find provider");

        // Reward checker
        token.transferFrom(msg.sender, dataIntelligenceCheck.checker, checkerReward);

        // Reward provider
        token.transferFrom(msg.sender, dataIntelligenceCheck.provider, providerReward);
    }
}
