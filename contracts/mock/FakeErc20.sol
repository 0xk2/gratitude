// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract FakeErc20 is ERC20 {
  constructor() ERC20("FakeErc20","FE20") {
  }

  function mint(address account, uint256 amount) public {
    _mint(account, amount);
  }
}