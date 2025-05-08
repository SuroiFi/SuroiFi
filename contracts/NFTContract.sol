// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract SuroiFiNFT is ERC721, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    // NFT metadata structure
    struct NFTMetadata {
        string name;
        string description;
        string imageURI;
        string nftType;  // weapon, armor, etc.
        string rarity;   // common, rare, epic, legendary
        uint256 mintPrice;
        bool isListed;
        uint256 listPrice;
    }

    // Mapping from token ID to metadata
    mapping(uint256 => NFTMetadata) public nftMetadata;

    // Events
    event NFTMinted(uint256 tokenId, address owner, string nftType, string rarity);
    event NFTListed(uint256 tokenId, uint256 price);
    event NFTSold(uint256 tokenId, address seller, address buyer, uint256 price);

    constructor() ERC721("SuroiFi Game Items", "SUROIFI") {}

    // Mint new NFT
    function mintNFT(
        address recipient,
        string memory name,
        string memory description,
        string memory imageURI,
        string memory nftType,
        string memory rarity,
        uint256 mintPrice
    ) public payable returns (uint256) {
        require(msg.value >= mintPrice, "Insufficient payment");

        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();

        _mint(recipient, newTokenId);

        nftMetadata[newTokenId] = NFTMetadata({
            name: name,
            description: description,
            imageURI: imageURI,
            nftType: nftType,
            rarity: rarity,
            mintPrice: mintPrice,
            isListed: false,
            listPrice: 0
        });

        emit NFTMinted(newTokenId, recipient, nftType, rarity);
        return newTokenId;
    }

    // List NFT for sale
    function listNFT(uint256 tokenId, uint256 price) public {
        require(_exists(tokenId), "NFT does not exist");
        require(ownerOf(tokenId) == msg.sender, "Not the owner");
        require(price > 0, "Price must be greater than 0");

        nftMetadata[tokenId].isListed = true;
        nftMetadata[tokenId].listPrice = price;

        emit NFTListed(tokenId, price);
    }

    // Purchase listed NFT
    function purchaseNFT(uint256 tokenId) public payable {
        require(_exists(tokenId), "NFT does not exist");
        require(nftMetadata[tokenId].isListed, "NFT not listed for sale");
        require(msg.value >= nftMetadata[tokenId].listPrice, "Insufficient payment");

        address seller = ownerOf(tokenId);
        require(seller != msg.sender, "Cannot buy your own NFT");

        // Transfer NFT ownership
        _transfer(seller, msg.sender, tokenId);

        // Update listing status
        nftMetadata[tokenId].isListed = false;
        nftMetadata[tokenId].listPrice = 0;

        // Transfer payment to seller
        payable(seller).transfer(msg.value);

        emit NFTSold(tokenId, seller, msg.sender, msg.value);
    }

    // Get NFT metadata
    function getNFTMetadata(uint256 tokenId) public view returns (NFTMetadata memory) {
        require(_exists(tokenId), "NFT does not exist");
        return nftMetadata[tokenId];
    }
}