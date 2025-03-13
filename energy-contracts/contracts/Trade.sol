// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract EnergyTrading {
    // Structure to represent an energy trade
    struct Trade {
        address producer;
        address consumer;
        uint256 energyAmount; // in kWh
        uint256 pricePerUnit; // in wei
        bool isCompleted;
    }

    // Events
    event EnergyListed(uint256 tradeId, address producer, uint256 energyAmount, uint256 pricePerUnit);
    event TradeExecuted(uint256 tradeId, address consumer, uint256 totalPrice);

    // Storage
    Trade[] public trades; // Array of all trades
    mapping(address => uint256[]) public tradesByProducer; // List of trades created by a producer
    mapping(address => uint256[]) public tradesByConsumer; // List of trades participated in by a consumer

    // Function to list energy for sale
    function listEnergy(uint256 energyAmount, uint256 pricePerUnit) external {
        require(energyAmount > 0, "Energy amount must be greater than 0");
        require(pricePerUnit > 0, "Price per unit must be greater than 0");

        trades.push(Trade({
            producer: msg.sender,
            consumer: address(0),
            energyAmount: energyAmount,
            pricePerUnit: pricePerUnit,
            isCompleted: false
        }));

        uint256 tradeId = trades.length - 1;
        tradesByProducer[msg.sender].push(tradeId);

        emit EnergyListed(tradeId, msg.sender, energyAmount, pricePerUnit);
    }

    // Function to buy energy
    function buyEnergy(uint256 tradeId) external payable {
        require(tradeId < trades.length, "Invalid trade ID");
        Trade storage trade = trades[tradeId];

        require(!trade.isCompleted, "Trade is already completed");
        require(trade.consumer == address(0), "Trade already has a consumer");
        uint256 totalPrice = trade.energyAmount * trade.pricePerUnit;
        require(msg.value == totalPrice, "Incorrect payment amount");

        // Mark the trade as completed
        trade.consumer = msg.sender;
        trade.isCompleted = true;

        // Transfer payment to the producer
        payable(trade.producer).transfer(msg.value);

        // Track the trade for the consumer
        tradesByConsumer[msg.sender].push(tradeId);

        emit TradeExecuted(tradeId, msg.sender, totalPrice);
    }

    // Function to get trade details
    function getTrade(uint256 tradeId) external view returns (
        address producer,
        address consumer,
        uint256 energyAmount,
        uint256 pricePerUnit,
        bool isCompleted
    ) {
        require(tradeId < trades.length, "Invalid trade ID");
        Trade storage trade = trades[tradeId];
        return (trade.producer, trade.consumer, trade.energyAmount, trade.pricePerUnit, trade.isCompleted);
    }

    // Function to get trades by producer
    function getTradesByProducer(address producer) external view returns (uint256[] memory) {
        return tradesByProducer[producer];
    }

    // Function to get trades by consumer
    function getTradesByConsumer(address consumer) external view returns (uint256[] memory) {
        return tradesByConsumer[consumer];
    }
}
