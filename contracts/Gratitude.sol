// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

interface IERC20 {
    function transfer(address to, uint256 value) external returns (bool);
    function transferFrom(address from, address to, uint256 value) external returns (bool);
}

contract Gratitude {
  event Send(address from, address to, string ipfsProof);
  struct Cert {
    address from;
    address token;
    uint256 amount;
    string content;
  }
  mapping (address => uint256) public recipients;
  mapping (address => mapping(uint256 => Cert)) public certs;

  function _record(address recipient, address token, uint256 amount, string memory content, address sender) private {
    uint256 recent = recipients[recipient];
    certs[recipient][recent] = Cert(
      sender, token, amount, content
    );
    recipients[recipient] =  recent + 1; // TODO: should I use counter?
  }

  function sendEther(address payable []  memory _recipients, 
    uint256[] memory values, string[] memory content) external payable {
    for (uint256 i = 0; i < _recipients.length; i++){
      _recipients[i].transfer(values[i]);
      emit Send(msg.sender, _recipients[i], content[i]);
      _record(_recipients[i], address(0), values[i], content[i], msg.sender);
    }
    uint256 balance = address (this).balance;
    if (balance > 0)
      payable(msg.sender).transfer(balance);
  }

  function sendToken(IERC20 token, address[] memory _recipients, uint256[] memory values, string[] memory content) external {
    uint256 total = 0;
    uint256 i = 0;
    for (i = 0; i < _recipients.length; i++)
      total += values[i];
    require(token.transferFrom(msg.sender, address(this), total));
    for (i = 0; i < _recipients.length; i++){
      require(token.transfer(_recipients[i], values[i]));
      emit Send(msg.sender, _recipients[i], content[i]);
      _record(_recipients[i], address(token), values[i], content[i], msg.sender);
    }
  }
}