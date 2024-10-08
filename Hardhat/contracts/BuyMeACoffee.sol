// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

contract BuyMeACoffee {
    event NewMemo(address indexed from, uint256 timeStamp, string name, string message);

    struct Memo {
        address from;
        uint256 timeStamp;
        string name; // name of the buyer
        string message; // and their message for us
    }

    // This is us Owner of the contract (DEPLOYER) where the tips will go
    address payable owner;

    // then we will create the list of all the memos we received
    Memo[] memos;

    // for simplier contract the constructor is owner is msg.sender
    constructor() {
        owner = payable(msg.sender);
    }

    function getMemos() public view returns (Memo[] memory) {
        return memos;
    }

    function buyCoffee(string memory _name, string memory _message) public payable {
        require(msg.value > 0, "You need to pay more than 0");
        owner.transfer(msg.value);

        // for keeping records for buyers we push into the memos array
        memos.push(Memo({from: msg.sender, timeStamp: block.timestamp, name: _name, message: _message}));

        emit NewMemo(msg.sender, block.timestamp, _name, _message);
    }
}
