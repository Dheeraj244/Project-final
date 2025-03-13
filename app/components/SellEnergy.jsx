"use client";
import { useState } from 'react';
import { Card } from "@/components/ui/card";
import Link from 'next/link';

const SellEnergy = () => {
  const [quantity, setQuantity] = useState(50);
  const [price, setPrice] = useState(0.12);
  const [myListings, setMyListings] = useState([]);

  const handleCreateListing = (e) => {
    e.preventDefault();
    const newListing = {
      id: myListings.length + 1,
      quantity: quantity,
      price: price.toFixed(2),
      status: "Active",
      created: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    };
    setMyListings([newListing, ...myListings]);
    // Reset form
    setQuantity(50);
    setPrice(0.12);
  };

  const handleRemoveListing = (id) => {
    setMyListings(myListings.filter(listing => listing.id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Sell Energy</h1>
        <Link 
          href="/profile" 
          className="px-4 py-2 bg-[#0f172a] text-white rounded-md hover:bg-[#1e293b] transition-colors"
        >
          Back to Profile
        </Link>
      </div>

      {/* Create New Listing */}
      <Card className="bg-white p-6 mb-8">
        <h2 className="text-xl font-semibold mb-6">Create New Listing</h2>
        <form onSubmit={handleCreateListing} className="space-y-6">
          {/* Quantity Slider */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantity (MWH): {quantity}
            </label>
            <input
              type="range"
              min="10"
              max="1000"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-sm text-gray-600 mt-1">
              <span>10 MWH</span>
              <span>1000 MWH</span>
            </div>
          </div>

          {/* Price Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price per kWH ($)
            </label>
            <input
              type="number"
              min="0.01"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#0f172a] text-white py-3 rounded-md hover:bg-[#1e293b] transition-colors"
          >
            Create Listing
          </button>
        </form>
      </Card>

      {/* My Listings */}
      <div>
        <h2 className="text-xl font-semibold mb-4">My Listings</h2>
        <div className="space-y-4">
          {myListings.map((listing) => (
            <Card key={listing.id} className="bg-white p-6">
              <div className="flex justify-between items-start">
                <div>
                  <div className="space-y-2">
                    <p className="text-gray-600">
                      Quantity: {listing.quantity.toLocaleString()} MWH
                    </p>
                    <p className="text-gray-600">
                      Created: {listing.created}
                    </p>
                  </div>
                </div>
                <div className="text-right space-y-3">
                  <p className="text-xl font-bold">
                    ${listing.price}/kWH
                  </p>
                  <div className="flex flex-col gap-2 text-center">
                    <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                      {listing.status}
                    </span>
                    <button
                      onClick={() => handleRemoveListing(listing.id)}
                      className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm hover:bg-red-200 transition-colors"
                    >
                      Remove
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
};

export default SellEnergy; 