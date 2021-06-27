const Wrapper = artifacts.require("Wrapper");
const AliceToken = artifacts.require("AliceToken");
const BobToken = artifacts.require("BobToken");
const CharlieToken = artifacts.require("CharlieToken");
const { expect } = require("chai");
const { BN } = require("@openzeppelin/test-helpers");
const { MAX_UINT256 } = require("@openzeppelin/test-helpers/src/constants");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("Wrapper", function ([alice, bob, charlie, wrapperOwner]) {
  let aliceToken, bobToken, charlieToken, wrapper;
  const tenThousand = web3.utils.toWei("10000", "ether");
  const thousand = web3.utils.toWei("1000", "ether");
  const hundred = web3.utils.toWei("100", "ether");

  beforeEach(async function () {
    aliceToken = await AliceToken.new({ from: alice });
    bobToken = await BobToken.new({ from: bob });
    charlieToken = await CharlieToken.new({ from: charlie });
    wrapper = await Wrapper.new(charlieToken.address, { from: wrapperOwner });

    // Set wrapper on CharlieToken
    await charlieToken.setWrapper(wrapper.address, { from: charlie });

    // Transfer initial amount of token
    await aliceToken.transfer(wrapper.address, thousand, { from: alice });
    await bobToken.transfer(wrapper.address, thousand, { from: bob });

    // Approve wrapper to use tokens
    await aliceToken.approve(wrapper.address, MAX_UINT256, { from: alice });
    await bobToken.approve(wrapper.address, MAX_UINT256, { from: bob });
    await charlieToken.approve(wrapper.address, MAX_UINT256, { from: alice });
    await charlieToken.approve(wrapper.address, MAX_UINT256, { from: bob });
  });

  it("should initialize scenario", async function () {
    expect(await aliceToken.balanceOf(wrapper.address)).to.be.bignumber.equal(new BN(thousand));
    expect(await bobToken.balanceOf(wrapper.address)).to.be.bignumber.equal(new BN(thousand));
  });

  context("swap", function () {
    it("should swap token a to token c", async function () {
      expect(await aliceToken.balanceOf(wrapper.address)).to.be.bignumber.equal(new BN(thousand));
      const result = await wrapper.swap(aliceToken.address, hundred, { from: alice });
      expect(result.receipt.status).to.be.equal(true);
      expect(await charlieToken.balanceOf(alice)).to.be.bignumber.equal(new BN(hundred));
      expect(await aliceToken.balanceOf(wrapper.address)).to.be.bignumber.equal(new BN(web3.utils.toWei("1100", "ether")));
      expect(await aliceToken.balanceOf(alice)).to.be.bignumber.equal(new BN(web3.utils.toWei("8900", "ether")));
    });
  });

  context("unswap", function () {
    it("should unswap token c to token b", async function () {
      await wrapper.swap(bobToken.address, hundred, { from: bob });
      expect(await bobToken.balanceOf(wrapper.address)).to.be.bignumber.equal(new BN(web3.utils.toWei("1100", "ether")));
      const result = await wrapper.unswap(bobToken.address, hundred, { from: bob });
      expect(result.receipt.status).to.be.equal(true);
      expect(await charlieToken.balanceOf(bob)).to.be.bignumber.equal(new BN(0));
      expect(await bobToken.balanceOf(wrapper.address)).to.be.bignumber.equal(new BN(thousand));
      expect(await bobToken.balanceOf(bob)).to.be.bignumber.equal(new BN(web3.utils.toWei("9000", "ether")));
    });
  });
});
