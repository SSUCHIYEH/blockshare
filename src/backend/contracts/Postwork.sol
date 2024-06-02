// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

import "hardhat/console.sol";

interface IERC20 {
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function approve(address spender, uint256 amount) external returns (bool);
    function transfer(address to, uint256 amount) external returns (bool);
}

contract Postwork is ReentrancyGuard {
    address payable tokenOwner;
    IERC20 public token;
    uint public itemCount; 
    uint public price = 1;
    uint256 public rewardAmount = 1 * (10**18);

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
        address indexed owner,
        bool member
    );
    event Liked(
        uint itemId,
        address indexed nft,
        uint tokenId,
        address payable owner,
        address indexed liker
    );

    event Twit(
        uint itemId,
        address indexed nft,
        uint tokenId,
        address payable owner,
        address indexed titter
    );

    event Record(
        uint time,
        address indexed owner,
        address indexed trigger,
        string state
    );

    constructor(address tokenAddress) {
        token = IERC20(tokenAddress);
        tokenOwner = payable(msg.sender);
    }

    // Make item to offer on the marketplace
    function postItem(bool member,IERC721 _nft, uint _tokenId) external nonReentrant {
        // increment itemCount
        itemCount ++;

        items[itemCount] = Item (
            itemCount,
            _nft,
            _tokenId,
            payable(msg.sender),
            false
        );

        emit Posted(
            itemCount,
            address(_nft),
            _tokenId,
            msg.sender,
            member
        );
    }

    // function postItem(uint _itemId) external payable nonReentrant {

    //     Item storage item = items[_itemId];
    //     require(_itemId > 0 && _itemId <= itemCount, "item doesn't exist");
    //     require(!item.sold, "item already sold");
    //     // update item to sold
    //     item.owner = payable(msg.sender);
    //     item.sold = true;
    //     // transfer nft to buyer
    //     item.nft.transferFrom(address(this), msg.sender, item.tokenId);

    //     emit Posted(
    //         _itemId,
    //         address(item.nft),
    //         item.tokenId,
    //         msg.sender
    //     );
    // }

    function likeItem(uint _itemId) public {

        Item storage item = items[_itemId];

        emit Liked(
            _itemId,
            address(item.nft),
            item.tokenId,
            item.owner,
            msg.sender
        );

        emit Record(
            block.timestamp,
            item.owner,
            msg.sender,
            'like'
        );
    }

    function airdrop() external payable nonReentrant {
        token.transferFrom(tokenOwner,msg.sender, rewardAmount);
    }
}
