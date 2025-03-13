import { useEffect, useState } from 'react';

export default function TestPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('Initializing...');

  useEffect(() => {
    const testApi = async () => {
      try {
        setStatus('Starting API test...');
        const API_KEY = process.env.NEXT_PUBLIC_EIA_API_KEY;
        console.log('API Key starts with:', API_KEY?.substring(0, 5));

        // Simpler API endpoint
        const url = `https://api.eia.gov/v2/electricity/retail-sales/data/?api_key=${API_KEY}`;
        
        setStatus('Fetching data...');
        console.log('Testing URL:', url);
        
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
          mode: 'cors',
        });

        setStatus(`Response received. Status: ${response.status}`);
        
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`API Error (${response.status}): ${errorText}`);
        }

        const result = await response.json();
        console.log('API Response:', result);
        setData(result);
        setStatus('Data loaded successfully');
      } catch (e) {
        console.error('Error details:', e);
        setError(e.message);
        setStatus('Error occurred');
      } finally {
        setLoading(false);
      }
    };

    testApi();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">API Test Page</h1>
      
      <div className="mb-4 p-2 bg-gray-100 rounded">
        <strong>Status:</strong> {status}
      </div>
      
      <div className="mb-4 p-2 bg-blue-50 rounded">
        <h2 className="font-bold">API Key Info:</h2>
        <p>Check the console to verify your API key is loaded correctly.</p>
      </div>
      
      {loading && (
        <div className="mb-4 p-2 bg-yellow-50 rounded">
          <p>Loading... Please check browser console for details.</p>
        </div>
      )}
      
      {error && (
        <div className="text-red-500 mb-4">
          <h2 className="font-bold">Error:</h2>
          <pre className="bg-red-50 p-2 rounded mt-2 whitespace-pre-wrap">
            {error}
          </pre>
        </div>
      )}
      
      {data && (
        <div>
          <h2 className="text-xl mb-2">API Response:</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-[500px] whitespace-pre-wrap">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}

      <div className="mt-4 text-sm text-gray-600">
        <p>Check the browser console (F12) for more detailed information.</p>
      </div>
    </div>
  );
} 