// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

import "hardhat/console.sol";

contract Authwork is ReentrancyGuard {

    // Variables
    address payable public immutable feeAccount; // the account that receives fees
    uint public immutable feePercent; // the fee percentage on sales 
    uint public itemCount; 

    struct Item {
        uint itemId;
        IERC721 nft;
        uint tokenId;
        address payable owner;
        bool sold;
    }

    // itemId -> Item
    mapping(uint => Item) public items;

    event Register(
        uint itemId,
        address indexed nft,
        uint tokenId,
        address indexed owner
    );

    event Follow(
        address indexed fans,
        address indexed follow
    );

    event Record(
        uint time,
        address indexed owner,
        address indexed trigger,
        string state
    );

    event Member(
        address indexed creator,
        address indexed fans
    );

    constructor(uint _feePercent) {
        feeAccount = payable(msg.sender);
        feePercent = _feePercent;
    }

    // Make item to offer on the marketplace
    function makeItem(IERC721 _nft, uint _tokenId) external nonReentrant {
        itemCount ++;
        // transfer nft
        _nft.transferFrom(msg.sender, address(this), _tokenId);
        // add new item to items mapping
        items[itemCount] = Item (
            itemCount,
            _nft,
            _tokenId,
            payable(msg.sender),
            false
        );
    }

    function RegisterItem(uint _itemId) external payable nonReentrant {
        Item storage item = items[_itemId];
        require(_itemId > 0 && _itemId <= itemCount, "item doesn't exist"); 
        item.nft.transferFrom(address(this), msg.sender, item.tokenId);
        item.owner = payable(msg.sender);
        item.sold = true;

        emit Register(
            _itemId,
            address(item.nft),
            item.tokenId,
            msg.sender
        );
    }

    function FollowAuth(address user) public returns (bool) {
        emit Follow(
            msg.sender,
            user
        );
        emit Record(
            block.timestamp,
            user,
            msg.sender,
            'follow'
        );
        return(true);
    }

    function Subscribe(address user) public returns (bool) {
        emit Member(
            msg.sender,
            user
        );
        emit Record(
            block.timestamp,
            user,
            msg.sender,
            'subscrib'
        );
        return(true);
    }
}
