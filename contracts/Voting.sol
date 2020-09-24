pragma solidity ^0.7.1;
pragma experimental ABIEncoderV2;
// We have to specify what version of compiler this code will compile with

import "./iab/IAB.sol";

contract Voting {

  struct Vendor {
    address addr;
    bytes32 name;
    uint256 tokenCount;
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

  address[] public vendorAddresses;
  mapping (address => Vendor) public vendorByAddress;

  mapping (bytes32 => ContentAnalysis) public contentAnalysisByHash;

  mapping (bytes32 => ContentVerification) public contentVerificationByHash;

  // Add vendor.
  // Vendors are capable to call addContentAnalysis.
  function addVendor(address addr, bytes32 name) public
  {
    require(vendorByAddress[addr].addr == address(0), "Vendor address already exists");
    vendorAddresses.push(addr);
    vendorByAddress[addr] = Vendor(addr, name, 1000);
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
    Vendor storage vendor = vendorByAddress[msg.sender];

    require(vendor.addr == msg.sender, "Sender must be vendor");
    require(vendor.tokenCount >= 1, "Unsufficient funds");

    // Store ContentAnalysis
    contentAnalysisByHash[urlVendorHash] = ContentAnalysis(
      vendor.addr,
      block.timestamp,
      unsafeDigitalEnvironment,
      IAB.CategoryTop.Uncategorized,
      IAB.ContentTaxonomyTier1.Unknown);

    // Payment
    vendor.tokenCount = vendor.tokenCount-1;
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
    vendor.tokenCount = vendor.tokenCount+1;
  }

  constructor()
  {
  }
}
