"use client";
import { useState, useEffect } from 'react';
import EnergyCard from './EnergyCard';

export default function EnergyListings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        const API_KEY = process.env.NEXT_PUBLIC_EIA_API_KEY;
        
        const response = await fetch(
          `https://api.eia.gov/v2/electricity/retail-sales/data/?api_key=${API_KEY}&frequency=monthly&data[0]=price&data[1]=sales&sort[0][column]=period&sort[0][direction]=desc`,
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
        
        // Use the raw data directly
        const rawListings = data.response.data.slice(0, 6).map(item => ({
          ...item,
          period: new Date(item.period).toLocaleDateString('en-US', { 
            month: 'short',
            year: 'numeric'
          })
        }));

        setListings(rawListings);
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
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Energy Sales Data</h1>
      <div className="space-y-4">
        {listings.map((listing, index) => (
          <EnergyCard key={index} listing={listing} />
        ))}
      </div>
    </div>
  );
} 