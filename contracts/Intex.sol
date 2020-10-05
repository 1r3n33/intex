pragma solidity ^0.7.1;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

import "./iab/IAB.sol";

contract Intex is ERC20 {

  struct Vendor {
    address addr;
    bytes32 name;
  }

  struct ContentAnalysis {
    address vendor;
    uint256 timestamp;
    IAB.UnsafeDigitalEnvironment iabUnsafeDigitalEnvironment;
    IAB.CategoryTop iabCategory;
    IAB.ContentTaxonomyTier1 iabContentTaxonomy;
  }

  struct ContentVerification {
    address verifier;
    bytes32 urlVendorHash;
  }

  address public owner;

  address[] public vendorAddresses;
  mapping (address => Vendor) public vendorByAddress;

  mapping (bytes32 => ContentAnalysis) public contentAnalysisByHash;

  mapping (bytes32 => ContentVerification) public contentVerificationByHash;

  constructor(uint256 initialSupply) ERC20("IntelligenceExchange", "INTX")
  {
    owner = msg.sender;
    _mint(msg.sender, initialSupply); // By default, ERC20 uses a value of 18 for decimals. Unit is 1 * 10**18.
  }

  // Get INTX tokens in exchange of ETH
  function getTokens() public payable
  {
    uint256 exchangeRate = uint256(10**6); // 1 ETH -> 1M INTEX tokens
    uint256 tokens = msg.value * exchangeRate;
    _mint(msg.sender, tokens);
  }

  // Owner can widraw ETH and transfer to beneficiary
  function withdraw(address payable beneficiary, uint256 amount) public
  {
    require(msg.sender == owner);
    beneficiary.transfer(amount);
  }

  // Add vendor.
  // Vendors are capable to call addContentAnalysis.
  // TODO: Only contract owner can add vendor.
  function addVendor(address addr, bytes32 name) public
  {
    require(vendorByAddress[addr].addr == address(0), "Vendor address already exists");

    // Register vendor.
    vendorAddresses.push(addr);
    vendorByAddress[addr] = Vendor(addr, name);

    // Transfer One million to vendor.
    // TODO: Should be a separate payable method in the future.
    uint256 oneMillion = uint256(1 * (10**6) * (10**18));
    transfer(addr, oneMillion);
  }

  function vendors() view public returns (Vendor[] memory)
  {
    Vendor[] memory _vendors = new Vendor[](vendorAddresses.length);
    for (uint i=0; i<vendorAddresses.length; i++)
    {
      _vendors[i] = vendorByAddress[vendorAddresses[i]];
    }
    return _vendors;
  }

  // Add ContentAnalysis.
  function addContentAnalysis(bytes32 urlVendorHash, IAB.UnsafeDigitalEnvironment unsafeDigitalEnvironment) public
  {
    uint256 oneThousand = uint256(1 * (10**3) * (10**18));

    Vendor storage vendor = vendorByAddress[msg.sender];

    require(vendor.addr == msg.sender, "Sender must be vendor");
    require(balanceOf(msg.sender) >= oneThousand, "Unsufficient funds");

    // Store ContentAnalysis
    contentAnalysisByHash[urlVendorHash] = ContentAnalysis(
      vendor.addr,
      block.timestamp,
      unsafeDigitalEnvironment,
      IAB.CategoryTop.Uncategorized,
      IAB.ContentTaxonomyTier1.Unknown);

    // Payment
    transfer(owner, oneThousand);
  }

  // Content check
  function checkContentAnalysis(bytes32 verificationHash, bytes32 urlVendorHash) public returns (bytes32)
  {
    ContentAnalysis memory contentAnalysis = contentAnalysisByHash[urlVendorHash];
    Vendor storage vendor = vendorByAddress[contentAnalysis.vendor];
    
    contentVerificationByHash[verificationHash] = ContentVerification(
      msg.sender,
      urlVendorHash);

    // Payment
    uint256 oneHundred = uint256(1 * (10**2) * (10**18));
    transfer(vendor.addr, oneHundred);
  }

  // Reward verifier & vendor for provided service.
  function reward(bytes32 verificationHash, uint256 rewardForVerifier, uint256 rewardForVendor) public
  {
    require(balanceOf(msg.sender) >= rewardForVerifier+rewardForVendor, "Unsufficient funds");

    // Reward verifier
    ContentVerification memory contentVerification = contentVerificationByHash[verificationHash];
    require(contentVerification.verifier != address(0), "Cannot find verifier");

    transfer(contentVerification.verifier, rewardForVerifier);

    // Reward vendor
    ContentAnalysis memory contentAnalysis = contentAnalysisByHash[contentVerification.urlVendorHash];
    require(contentAnalysis.vendor != address(0), "Cannot find vendor");

    transfer(contentAnalysis.vendor, rewardForVendor);
  }
}
