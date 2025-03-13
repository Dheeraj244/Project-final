// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract EnergyTrading {
    struct EnergyListing {
        uint256 id;
        address seller;
        uint256 quantity;
        uint256 pricePerKWH;
        bool available;
    }

    mapping(uint256 => EnergyListing) public listings;
    uint256 public listingCount;

    event EnergyPurchased(
        uint256 listingId,
        address buyer,
        address seller,
        uint256 quantity,
        uint256 totalPrice
    );

    function purchaseEnergy(uint256 _listingId, uint256 _quantity) external payable {
        EnergyListing storage listing = listings[_listingId];
        require(listing.available, "Listing not available");
        require(_quantity <= listing.quantity, "Insufficient energy quantity");
        
        uint256 totalPrice = _quantity * listing.pricePerKWH;
        require(msg.value >= totalPrice, "Insufficient payment");

        listing.quantity -= _quantity;
        if (listing.quantity == 0) {
            listing.available = false;
        }

        payable(listing.seller).transfer(msg.value);

        emit EnergyPurchased(_listingId, msg.sender, listing.seller, _quantity, msg.value);
    }
} 