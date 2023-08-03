// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

interface IERC20 {
    function transfer(address to, uint256 amount) external view returns (bool);

    function balanceOf(address account) external view returns (uint256);

    event Transfer(address indexed from, address indexed to, uint256 value);
}

contract Faucet {
    event deposit(address indexed _from, uint256 _amount);
    event Withdrawal(address indexed _to, uint256 indexed _amount);

    address payable public immutable Owner;
    IERC20 public token;
    uint256 private maxDrip = 100e18;
    uint256 public lockTime = 1 minutes;

    mapping(address => uint256) nextAccessTime;

    constructor(address _tokenAddress) {
        Owner = payable(msg.sender);
        token = IERC20(_tokenAddress);
    }

    modifier dripCompliance() {
        require(msg.sender != address(0));
        require(
            token.balanceOf(address(this)) >= maxDrip,
            "Insufficient balance in the faucet to drip"
        );
        require(
            block.timestamp >= nextAccessTime[msg.sender],
            "Insufficent time elapsed for withdrawal"
        );
        _;
    }

    modifier onlyOwner() {
        require(msg.sender == Owner, "Only Owner can call this function");
        _;
    }

    function drip() public dripCompliance {
        nextAccessTime[msg.sender] = block.timestamp + lockTime;
        token.transfer(msg.sender, maxDrip);
    }

    function getBalance() public view returns (uint256) {
        return token.balanceOf(address(this));
    }

    function updateLockTime(uint256 _lockTime) public onlyOwner {
        uint256 newLockTime = _lockTime * 1 minutes;
        lockTime = newLockTime;
    }

    function setmaxDrip(uint256 _amount) public onlyOwner {
        uint256 amount = _amount * (10 ** 18);
        maxDrip = amount;
    }

    function withdrawal() public onlyOwner {
        require(
            token.balanceOf(address(this)) > 0,
            "Can't withdraw from Zero balance"
        );
        token.transfer(msg.sender, token.balanceOf(address(this)));
        emit Withdrawal(msg.sender, token.balanceOf(address(this)));
    }

    receive() external payable {
        emit deposit(msg.sender, msg.value);
    }
}
