"use client";
import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";

const SellEnergy = () => {
  const [quantity, setQuantity] = useState(50);
  const [price, setPrice] = useState(0.12);
  const [energyType, setEnergyType] = useState('solar');
  const [location, setLocation] = useState('');
  const [myListings, setMyListings] = useState([]);

  // Energy types for dropdown
  const energyTypes = [
    { value: 'solar', label: 'Solar Energy' },
    { value: 'wind', label: 'Wind Energy' },
    { value: 'hydro', label: 'Hydroelectric' },
    { value: 'biomass', label: 'Biomass' },
    { value: 'geothermal', label: 'Geothermal' }
  ];

  // Load listings from localStorage on component mount
  useEffect(() => {
    const savedListings = localStorage.getItem('energyListings');
    if (savedListings) {
      setMyListings(JSON.parse(savedListings));
    }
  }, []);

  const handleCreateListing = (e) => {
    e.preventDefault();
    
    if (!location.trim()) {
      alert('Please enter a location');
      return;
    }

    const newListing = {
      id: Date.now().toString(), // Unique ID using timestamp
      tradeId: Date.now(), // For compatibility with marketplace
      quantity: quantity,
      energyAmount: quantity, // For compatibility with marketplace
      price: price.toFixed(2),
      energyType: energyType,
      location: location,
      status: "Active",
      period: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      created: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      producer: 'User Listing' // To identify user-created listings
    };

    const updatedListings = [newListing, ...myListings];
    setMyListings(updatedListings);
    
    // Save to localStorage
    localStorage.setItem('energyListings', JSON.stringify(updatedListings));
    
    // Reset form
    setQuantity(50);
    setPrice(0.12);
    setEnergyType('solar');
    setLocation('');
  };

  const handleRemoveListing = (id) => {
    const updatedListings = myListings.filter(listing => listing.id !== id);
    setMyListings(updatedListings);
    // Update localStorage
    localStorage.setItem('energyListings', JSON.stringify(updatedListings));
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-8">Sell Energy</h1>

      {/* Create New Listing */}
      <Card className="bg-white p-6 mb-8">
        <h2 className="text-xl font-semibold mb-6">Create New Listing</h2>
        <form onSubmit={handleCreateListing} className="space-y-6">
          {/* Energy Type Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Energy Type
            </label>
            <select
              value={energyType}
              onChange={(e) => setEnergyType(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md bg-white"
            >
              {energyTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Location Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter your location"
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          {/* Quantity Slider */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantity (MWH): {quantity}
            </label>
            <input
              type="range"
              min="0"
              max="1000"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-sm text-gray-600 mt-1">
              <span>0 MWH</span>
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
                <div className="space-y-2">
                  <p className="text-gray-600">
                    Energy Type: {energyTypes.find(t => t.value === listing.energyType)?.label}
                  </p>
                  <p className="text-gray-600">
                    Location: {listing.location}
                  </p>
                  <p className="text-gray-600">
                    Quantity: {listing.quantity.toLocaleString()} MWH
                  </p>
                  <p className="text-gray-600">
                    Created: {listing.created}
                  </p>
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