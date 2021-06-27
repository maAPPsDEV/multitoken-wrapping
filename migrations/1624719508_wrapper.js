const { MAX_UINT256 } = require("@openzeppelin/test-helpers/src/constants");

const AliceToken = artifacts.require("AliceToken");
const BobToken = artifacts.require("BobToken");
const CharlieToken = artifacts.require("CharlieToken");
const Wrapper = artifacts.require("Wrapper");

module.exports = async function (_deployer, _network, _accounts) {
  // Deploy contracts
  await _deployer.deploy(AliceToken);
  const aliceToken = await AliceToken.deployed();
  await _deployer.deploy(BobToken);
  const bobToken = await BobToken.deployed();
  await _deployer.deploy(CharlieToken);
  const charlieToken = await CharlieToken.deployed();
  await _deployer.deploy(Wrapper, charlieToken.address);
  const wrapper = await Wrapper.deployed();

  // Set wrapper on CharlieToken
  await charlieToken.setWrapper(wrapper.address);

  // Transfer initial amount of token
  await aliceToken.transfer(wrapper.address, web3.utils.toWei("1000", "ether"));
  await bobToken.transfer(wrapper.address, web3.utils.toWei("1000", "ether"));

  // Approve wrapper to use tokens
  await aliceToken.approve(wrapper.address, MAX_UINT256);
  await bobToken.approve(wrapper.address, MAX_UINT256);
  await charlieToken.approve(wrapper.address, MAX_UINT256);

  // Print result
  console.log("AliceToken: ", aliceToken.address);
  console.log("BobToken: ", bobToken.address);
  console.log("CharlieToken: ", charlieToken.address);
  console.log("Wrapper: ", wrapper.address);
  console.log("Owner: ", _accounts[0]);
};
