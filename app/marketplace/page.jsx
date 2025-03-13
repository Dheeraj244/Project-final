"use client";
import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { useRouter } from 'next/navigation';

export default function Marketplace() {
  const router = useRouter();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [walletAddress, setWalletAddress] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);

  // Function to connect MetaMask
  const connectWallet = async () => {
    try {
      setIsConnecting(true);
      if (!window.ethereum) {
        alert('Please install MetaMask to use this feature');
        return;
      }

      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setWalletAddress(accounts[0]);
    } catch (error) {
      console.error('Error connecting wallet:', error);
      alert('Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  // Function to handle energy purchase
  const handleBuyEnergy = async (listing) => {
    try {
      if (!window.ethereum) {
        alert('Please install MetaMask to make purchases');
        return;
      }

      if (!walletAddress) {
        await connectWallet();
      }

      // Convert price to Wei (assuming price is in USD, we'll use a simple conversion)
      // This is a simplified example - in a real app, you'd want to use proper price conversion
      const priceInWei = window.web3.utils.toWei(listing.price, 'ether');

      // Request transaction
      const transaction = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [{
          from: walletAddress,
          to: '0x...', // Replace with actual seller's wallet address
          value: priceInWei,
        }],
      });

      alert('Transaction initiated! Transaction hash: ' + transaction);
    } catch (error) {
      console.error('Error buying energy:', error);
      alert('Failed to initiate purchase');
    }
  };

  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        const API_KEY = process.env.NEXT_PUBLIC_EIA_API_KEY;
        
        const response = await fetch(
          `https://api.eia.gov/v2/electricity/retail-sales/data/?api_key=${API_KEY}&frequency=monthly&data[0]=price&sort[0][column]=period&sort[0][direction]=desc`,
          {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
            },
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch energy data');
        }

        const data = await response.json();
        
        // First filter listings with price > 0, then transform them
        const validListings = data.response.data.filter(item => 
          Number(item.price) > 0 && item.price !== null && item.price !== undefined
        );

        console.log('Filtered listings with price > 0:', validListings);

        const transformedListings = validListings
          .slice(0, 6)
          .map((item, index) => ({
            id: `${item.period}-${item.state || 'national'}-${index}`,
            price: Number(item.price).toFixed(2),
            location: item.state || 'National',
            period: new Date(item.period).toLocaleDateString('en-US', { 
              month: 'short',
              year: 'numeric'
            })
          }));

        console.log('Transformed listings:', transformedListings);

        setListings(transformedListings);
      } catch (err) {
        console.error('Error:', err);
        setError('Unable to load energy listings');
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-black rounded-full border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">{error}</div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Energy Prices</h1>
            <p className="text-gray-600 mt-2">View current energy prices by location</p>
          </div>
          <div className="flex gap-4">
            {!walletAddress ? (
              <button
                onClick={connectWallet}
                disabled={isConnecting}
                className="px-6 py-2 bg-[#0f172a] text-white rounded-lg hover:bg-[#1e293b] transition-colors disabled:opacity-50"
              >
                {isConnecting ? 'Connecting...' : 'Connect Wallet'}
              </button>
            ) : (
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">
                  {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                </span>
                <button
                  onClick={() => router.push('/profile')}
                  className="px-6 py-2 bg-white text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                >
                  Back to Profile
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-8">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Search by location..."
              className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Sort by Price</option>
              <option value="low">Lowest First</option>
              <option value="high">Highest First</option>
            </select>
          </div>
        </div>

        {/* Listings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <Card key={listing.id} className="bg-white overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-6">
                {/* Location and Period */}
                <div className="space-y-3 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="font-medium">{listing.location}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Period</p>
                    <p className="font-medium">{listing.period}</p>
                  </div>
                </div>

                {/* Price and Buy Button */}
                <div className="mt-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-600">Price per kWH</p>
                      <p className="text-2xl font-bold">${listing.price}</p>
                    </div>
                    <button
                      onClick={() => handleBuyEnergy(listing)}
                      disabled={!walletAddress}
                      className="px-6 py-2 bg-[#0f172a] text-white rounded-lg hover:bg-[#1e293b] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {walletAddress ? 'Buy Now' : 'Connect Wallet to Buy'}
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
} 