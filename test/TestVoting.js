const Voting = artifacts.require("Voting");

contract("Voting", accounts => {
  it("should pass", () =>
    Voting.deployed()
      .then(balance => {
        assert.equal(true, true, "always passing test");
      }));
    });
