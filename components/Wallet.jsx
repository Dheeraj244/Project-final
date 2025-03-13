"use client";
import { set } from "mongoose";
import { useState } from "react";

const Wallet = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const connectWallet = async () => {
    console.log("Requesting Access");

    if (window.ethereum) {
      console.log("MetaMask is installed!");

      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        console.log(accounts);
        setIsConnected(true);
        setWalletAddress(accounts[0]);
      } catch (error) {
        console.log("eroor connecting to the metamask wallet", error);
      }
    } else {
      console.log("MetaMask is not installed");
    }
  };
  return (
    <button
      className="bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600 transition"
      onClick={connectWallet}
    >
      {isConnected ? walletAddress : "Connect Wallet"}
    </button>
  );
};

export default Wallet;
