// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

import "hardhat/console.sol";

contract Postwork is ReentrancyGuard {

    // Variables
    address payable public immutable feeAccount; // the account that receives fees
    uint public immutable feePercent; // the fee percentage on sales 
    uint public itemCount; 
    uint public price = 1;

    struct Item {
        uint itemId;
        IERC721 nft;
        uint tokenId;
        address payable owner;
        bool sold;
    }

    // itemId -> Item
    mapping(uint => Item) public items;

    event Posted(
        uint itemId,
        address indexed nft,
        uint tokenId,
        address indexed owner
    );
    event Liked(
        uint itemId,
        address indexed nft,
        uint tokenId,
        address indexed owner,
        address indexed liker
    );

    constructor(uint _feePercent) {
        feeAccount = payable(msg.sender);
        feePercent = _feePercent;
    }

    // Make item to offer on the marketplace
    function makeItem(IERC721 _nft, uint _tokenId) external nonReentrant {
        // increment itemCount
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

    function postItem(uint _itemId) external payable nonReentrant {

        Item storage item = items[_itemId];
        require(_itemId > 0 && _itemId <= itemCount, "item doesn't exist");
        require(!item.sold, "item already sold");
        // update item to sold
        item.owner = payable(msg.sender);
        item.sold = true;
        // transfer nft to buyer
        item.nft.transferFrom(address(this), msg.sender, item.tokenId);

        emit Posted(
            _itemId,
            address(item.nft),
            item.tokenId,
            msg.sender
        );
    }

    function likeItem(uint _itemId) external payable nonReentrant {

        Item storage item = items[_itemId];
        require(_itemId > 0 && _itemId <= itemCount, "item doesn't exist");
        // emit Bought event
        emit Liked(
            _itemId,
            address(item.nft),
            item.tokenId,
            item.owner,
            msg.sender
        );
    }
}
