export const CONTRACT_ADDRESS = "0xA44b7fe1e95Ff74e03faEc086021B7988BAB92Da"; // Replace with your actual contract address

export const CONTRACT_ABI = [
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tradeId",
        "type": "uint256"
      }
    ],
    "name": "buyEnergy",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "energyAmount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "pricePerUnit",
        "type": "uint256"
      }
    ],
    "name": "listEnergy",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "tradeId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "producer",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "energyAmount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "pricePerUnit",
        "type": "uint256"
      }
    ],
    "name": "EnergyListed",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "tradeId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "consumer",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "totalPrice",
        "type": "uint256"
      }
    ],
    "name": "TradeExecuted",
    "type": "event"
  }
]; 