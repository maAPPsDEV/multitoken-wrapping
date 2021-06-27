// SPDX-License-Identifier: MIT
pragma solidity >=0.8.5 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CharlieToken is ERC20("CharlieToken", "CTC"), Ownable {
  /// @notice The address of wrapper contract
  address private wrapper;

  /// @notice The modifier for the functions only wrapper can access
  modifier onlyWrapper() {
    require(wrapper != address(0), "CharlieToken: Invalid wrapper address.");
    require(msg.sender == wrapper, "CharlieToken: Only wrapper is allowed.");
    _;
  }

  /// @notice The constructor
  constructor() {
    _mint(msg.sender, 10000 ether);
  }

  /// @notice Sets the wrapper
  /// @notice Only owner can set wrapper
  function setWrapper(address wrapperAddress) external onlyOwner {
    require(wrapperAddress != address(0), "CharlieToken: Invalid wrapper address.");
    wrapper = wrapperAddress;
  }

  /// @notice mint the given amount of token to wrapper
  function mintForWrapper(uint256 amount) external onlyWrapper {
    _mint(wrapper, amount);
  }

  /// @notice burn the given amount of token from wrapper
  function burnForWrapper(uint256 amount) external onlyWrapper {
    _burn(wrapper, amount);
  }
}
