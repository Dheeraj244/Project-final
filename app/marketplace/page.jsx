"use client";
import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { useRouter } from 'next/navigation';
import Web3 from 'web3';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../config/contractConfig';

export default function Marketplace() {
  const router = useRouter();
  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [walletAddress, setWalletAddress] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [sortOrder, setSortOrder] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showBlockchainDetails, setShowBlockchainDetails] = useState(false);
  const [networkInfo, setNetworkInfo] = useState(null);
  const [contractInfo, setContractInfo] = useState(null);

  // State code to full name mapping
  const stateNames = {
    'AL': 'Alabama',
    'AK': 'Alaska',
    'AZ': 'Arizona',
    'AR': 'Arkansas',
    'CA': 'California',
    'CO': 'Colorado',
    'CT': 'Connecticut',
    'DE': 'Delaware',
    'FL': 'Florida',
    'GA': 'Georgia',
    'HI': 'Hawaii',
    'ID': 'Idaho',
    'IL': 'Illinois',
    'IN': 'Indiana',
    'IA': 'Iowa',
    'KS': 'Kansas',
    'KY': 'Kentucky',
    'LA': 'Louisiana',
    'ME': 'Maine',
    'MD': 'Maryland',
    'MA': 'Massachusetts',
    'MI': 'Michigan',
    'MN': 'Minnesota',
    'MS': 'Mississippi',
    'MO': 'Missouri',
    'MT': 'Montana',
    'NE': 'Nebraska',
    'NV': 'Nevada',
    'NH': 'New Hampshire',
    'NJ': 'New Jersey',
    'NM': 'New Mexico',
    'NY': 'New York',
    'NC': 'North Carolina',
    'ND': 'North Dakota',
    'OH': 'Ohio',
    'OK': 'Oklahoma',
    'OR': 'Oregon',
    'PA': 'Pennsylvania',
    'RI': 'Rhode Island',
    'SC': 'South Carolina',
    'SD': 'South Dakota',
    'TN': 'Tennessee',
    'TX': 'Texas',
    'UT': 'Utah',
    'VT': 'Vermont',
    'VA': 'Virginia',
    'WA': 'Washington',
    'WV': 'West Virginia',
    'WI': 'Wisconsin',
    'WY': 'Wyoming',
    'DC': 'District of Columbia'
  };

  // Function to get full state name
  const getFullStateName = (stateCode) => {
    return stateNames[stateCode] || stateCode;
  };

  // Function to initialize Web3 and Contract
  const initializeWeb3 = async () => {
    try {
      if (window.ethereum) {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);
        
        const contractInstance = new web3Instance.eth.Contract(
          CONTRACT_ABI,
          CONTRACT_ADDRESS
        );
        setContract(contractInstance);
        
        const accounts = await web3Instance.eth.getAccounts();
        setWalletAddress(accounts[0]);
        
        return web3Instance;
      }
      throw new Error('Please install MetaMask');
    } catch (error) {
      console.error('Error initializing Web3:', error);
      throw error;
    }
  };

  // Function to connect MetaMask
  const connectWallet = async () => {
    try {
      setIsConnecting(true);
      await initializeWeb3();
      await fetchBlockchainDetails();
    } catch (error) {
      console.error('Error connecting wallet:', error);
      alert('Failed to connect wallet: ' + error.message);
    } finally {
      setIsConnecting(false);
    }
  };

  // Function to fetch blockchain details
  const fetchBlockchainDetails = async () => {
    if (!web3 || !contract || !walletAddress) {
      console.log('Web3 not initialized yet');
      return;
    }

    try {
      console.log('Fetching blockchain details...');

      const network = await web3.eth.getChainId();
      console.log('Network ID:', network);
      
      const networkName = getNetworkName(network);
      console.log('Network Name:', networkName);
      
      const balance = await web3.eth.getBalance(walletAddress);
      const balanceInEth = web3.utils.fromWei(balance, 'ether');
      console.log('Balance:', balanceInEth);
      
      const gasPrice = await web3.eth.getGasPrice();
      const gasPriceGwei = web3.utils.fromWei(gasPrice, 'gwei');
      console.log('Gas Price:', gasPriceGwei);

      let totalTrades = '0';
      try {
        totalTrades = await contract.methods.getTotalTrades().call();
        console.log('Total Trades:', totalTrades);
      } catch (error) {
        console.error('Error fetching total trades:', error);
      }

      setNetworkInfo({
        chainId: network,
        networkName,
        balance: parseFloat(balanceInEth).toFixed(4),
        gasPrice: parseFloat(gasPriceGwei).toFixed(2),
      });

      setContractInfo({
        address: CONTRACT_ADDRESS,
        totalTrades: totalTrades,
      });

      console.log('Blockchain details fetched successfully');
    } catch (error) {
      console.error('Error fetching blockchain details:', error);
      console.error('Failed to fetch blockchain details:', error.message);
    }
  };

  // Add helper function to get network name
  const getNetworkName = (chainId) => {
    const networks = {
      1: 'Ethereum Mainnet',
      3: 'Ropsten Testnet',
      4: 'Rinkeby Testnet',
      5: 'Goerli Testnet',
      42: 'Kovan Testnet',
      56: 'Binance Smart Chain',
      137: 'Polygon Mainnet',
      80001: 'Polygon Mumbai',
    };
    return networks[chainId] || `Chain ID: ${chainId}`;
  };

  // Function to handle search and sort
  const handleSearchAndSort = (newSearchTerm = searchTerm, newSortOrder = sortOrder) => {
    let result = [...listings];
    if (newSearchTerm) {
      const searchLower = newSearchTerm.toLowerCase();
      result = result.filter(listing => 
        listing.location.toLowerCase().includes(searchLower) ||
        (listing.energyType && listing.energyType.toLowerCase().includes(searchLower))
      );
    } else {
      result = result.slice(0, 6);
    }

    if (newSortOrder) {
      result.sort((a, b) => {
        const priceA = parseFloat(a.price);
        const priceB = parseFloat(b.price);
        return newSortOrder === 'low' ? priceA - priceB : priceB - priceA;
      });
    } else {
      result.sort((a, b) => a.location.localeCompare(b.location));
    }

    setFilteredListings(result);
  };

  // Function to handle search
  const handleSearch = (term) => {
    setSearchTerm(term);
    handleSearchAndSort(term, sortOrder);
  };

  // Function to handle sort
  const handleSort = (order) => {
    setSortOrder(order);
    handleSearchAndSort(searchTerm, order);
  };

  // Modify fetchListings to include user listings
  const fetchListings = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get user listings from localStorage
      const savedListings = localStorage.getItem('energyListings');
      const userListings = savedListings ? JSON.parse(savedListings) : [];

      // Get API listings
      const apiKey = process.env.NEXT_PUBLIC_EIA_API_KEY;
      if (!apiKey) {
        throw new Error('API key is not configured. Please check your .env.local file.');
      }

      const apiUrl = `https://api.eia.gov/v2/electricity/retail-sales/data/?api_key=${apiKey}&frequency=monthly&data[0]=price&data[1]=sales&sort[0][column]=period&sort[0][direction]=desc&length=100`;
      
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Response:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText
        });
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      if (!data || !data.response || !data.response.data || data.response.data.length === 0) {
        throw new Error('No data received from API');
      }

      // Group by state and get latest price for each
      const stateMap = new Map();
      data.response.data.forEach(item => {
        if (item.price && item.price > 0 && item.stateid) {
          const existingState = stateMap.get(item.stateid);
          if (!existingState || new Date(item.period) > new Date(existingState.period)) {
            stateMap.set(item.stateid, item);
          }
        }
      });

      const apiListings = Array.from(stateMap.values())
        .map((item, index) => ({
          id: `api-${index}`,
          tradeId: index,
          price: parseFloat(item.price).toFixed(2),
          energyAmount: Math.round(item.sales || 1000),
          location: getFullStateName(item.stateid),
          stateCode: item.stateid,
          period: new Date(item.period).toLocaleDateString('en-US', {
            month: 'short',
            year: 'numeric'
          }),
          producer: 'EIA Data',
          energyType: 'grid' // Default type for API listings
        }));

      // Combine and sort all listings
      const allListings = [...userListings, ...apiListings];
      allListings.sort((a, b) => a.location.localeCompare(b.location));

      // Store all listings
      setListings(allListings);
      setFilteredListings(allListings.slice(0, 6));
      setError(null);

    } catch (err) {
      console.error('Error fetching listings:', err);
      setListings([]);
      setFilteredListings([]);
      setError(err.message || 'Unable to fetch energy listings. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Function to get trade details
  const getTradeDetails = async (tradeId) => {
    try {
      const trade = await contract.methods.getTrade(tradeId).call();
      return {
        producer: trade.producer,
        consumer: trade.consumer,
        energyAmount: trade.energyAmount,
        pricePerUnit: web3.utils.fromWei(trade.pricePerUnit, 'ether'),
        isCompleted: trade.isCompleted
      };
    } catch (error) {
      console.error('Error getting trade details:', error);
      return null;
    }
  };

  // Function to get user's trade history
  const getMyTrades = async () => {
    try {
      if (!contract || !walletAddress) return [];
      
      // Get trades where user is consumer
      const myPurchases = await contract.methods.getTradesByConsumer(walletAddress).call();
      
      // Get details for each trade
      const tradeDetails = await Promise.all(
        myPurchases.map(tradeId => getTradeDetails(tradeId))
      );

      return tradeDetails.filter(trade => trade !== null);
    } catch (error) {
      console.error('Error getting trade history:', error);
      return [];
    }
  };

  // Function to handle energy purchase
  const handleBuyEnergy = async (listing) => {
    try {
      if (!walletAddress) {
        await connectWallet();
        return;
      }

      if (!contract) {
        throw new Error('Smart contract not initialized');
      }

      // Convert price to Wei (use actual listing price)
      const priceInWei = web3.utils.toWei(listing.price.toString(), 'ether');

      console.log('Preparing transaction:', {
        from: walletAddress,
        value: priceInWei,
        listingId: listing.tradeId
      });

      // Add pending transaction
      const pendingTx = {
        id: Date.now(),
        tradeId: listing.tradeId,
        amount: listing.energyAmount,
        price: listing.price,
        location: listing.location,
        status: 'pending',
        timestamp: new Date().toLocaleString(),
        from: walletAddress
      };
      setTransactions(prev => [pendingTx, ...prev]);

      try {
        // Get the current gas price
        const gasPrice = await web3.eth.getGasPrice();
        
        // Estimate gas for the transaction
        const gasEstimate = await contract.methods.buyEnergy(listing.tradeId)
          .estimateGas({
            from: walletAddress,
            value: priceInWei
          })
          .catch(() => 300000); // Fallback gas limit if estimation fails

        // Send transaction with estimated gas
        const transaction = await contract.methods.buyEnergy(listing.tradeId)
          .send({
            from: walletAddress,
            value: priceInWei,
            gasPrice: gasPrice,
            gas: Math.min(gasEstimate * 1.2, 500000) // Add 20% buffer, cap at 500k
          });

        console.log('Transaction successful:', transaction);

        // Update transaction status to success
        setTransactions(prev => prev.map(tx => 
          tx.id === pendingTx.id 
            ? {
                ...tx,
                status: 'success',
                hash: transaction.transactionHash
              }
            : tx
        ));

        alert('Energy purchase successful! Transaction hash: ' + transaction.transactionHash);
        await fetchListings();

      } catch (txError) {
        console.error('Transaction error:', txError);
        
        // Update transaction status to failed
        setTransactions(prev => prev.map(tx => 
          tx.id === pendingTx.id 
            ? {
                ...tx,
                status: 'failed',
                error: txError.message
              }
            : tx
        ));

        // Show error message
        if (txError.code === 4001) {
          alert('Transaction was rejected by user.');
        } else {
          alert('Transaction failed: ' + txError.message);
        }
      }

    } catch (error) {
      console.error('Error in handleBuyEnergy:', error);
      alert('Failed to process transaction: ' + error.message);
    }
  };

  // Add useEffect to fetch listings
  useEffect(() => {
    fetchListings();
  }, []);

  // Add useEffect for blockchain details
  useEffect(() => {
    if (showBlockchainDetails && walletAddress && web3 && contract) {
      console.log('Triggering blockchain details fetch');
      fetchBlockchainDetails();
    }
  }, [showBlockchainDetails, walletAddress, web3, contract]);

  // Add network change listener
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('chainChanged', async () => {
        if (showBlockchainDetails) {
          await fetchBlockchainDetails();
        }
        window.location.reload();
      });
      window.ethereum.on('accountsChanged', async () => {
        if (showBlockchainDetails) {
          await fetchBlockchainDetails();
        }
        window.location.reload();
      });
    }
  }, [showBlockchainDetails]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin h-8 w-8 border-4 border-black rounded-full border-t-transparent"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">{error}</div>
    );
  }

  // Add blockchain details panel render function
  const renderBlockchainDetails = () => {
    if (!showBlockchainDetails) return null;

    if (!networkInfo || !contractInfo) {
      return (
        <div className="bg-white rounded-lg shadow-sm mb-8 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Blockchain Details</h2>
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin h-6 w-6 border-4 border-blue-500 rounded-full border-t-transparent"></div>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-lg shadow-sm mb-8 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Blockchain Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Network Information</h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Network: <span className="font-medium text-gray-900">{networkInfo.networkName}</span>
              </p>
              <p className="text-sm text-gray-600">
                Chain ID: <span className="font-medium text-gray-900">{networkInfo.chainId}</span>
              </p>
              <p className="text-sm text-gray-600">
                Balance: <span className="font-medium text-gray-900">{networkInfo.balance} ETH</span>
              </p>
              <p className="text-sm text-gray-600">
                Gas Price: <span className="font-medium text-gray-900">{networkInfo.gasPrice} Gwei</span>
              </p>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Contract Information</h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Contract Address: <span className="font-medium text-gray-900">{contractInfo.address}</span>
              </p>
              <p className="text-sm text-gray-600">
                Total Trades: <span className="font-medium text-gray-900">{contractInfo.totalTrades}</span>
              </p>
              <p className="text-sm text-gray-600">
                Your Address: <span className="font-medium text-gray-900">{walletAddress}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Energy Marketplace</h1>
            <p className="text-gray-600 mt-2">Browse and purchase renewable energy</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => fetchListings()}
              className="px-6 py-2 bg-white text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              Refresh Listings
            </button>
            {!walletAddress ? (
              <button
                onClick={connectWallet}
                disabled={isConnecting}
                className="px-6 py-2 bg-[#0f172a] text-white rounded-lg hover:bg-[#1e293b] transition-colors disabled:opacity-50"
              >
                {isConnecting ? 'Connecting...' : 'Connect Wallet'}
              </button>
            ) : (
              <>
                <span className="text-sm text-gray-600">
                  {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                </span>
                <button
                  onClick={() => setShowBlockchainDetails(!showBlockchainDetails)}
                  className="px-6 py-2 bg-[#1e293b] text-white rounded-lg hover:bg-[#334155] transition-colors"
                >
                  {showBlockchainDetails ? 'Hide Details' : 'Blockchain Details'}
                </button>
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className="px-6 py-2 bg-white text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                >
                  {showHistory ? 'Hide History' : 'Show History'}
                </button>
              </>
            )}
          <button
            onClick={() => router.push('/profile')}
              className="px-6 py-2 bg-[#0f172a] text-white rounded-lg hover:bg-[#1e293b] transition-colors"
          >
            Back to Profile
          </button>
        </div>
        </div>

        {/* Blockchain Details Panel */}
        {renderBlockchainDetails()}

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-8">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Search by location or energy type..."
              className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
            />
            <select 
              className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={sortOrder}
              onChange={(e) => handleSort(e.target.value)}
            >
              <option value="">Sort by Price</option>
              <option value="low">Lowest First</option>
              <option value="high">Highest First</option>
            </select>
          </div>
        </div>

        {/* Listings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredListings.length > 0 ? (
            filteredListings.map((listing) => (
            <Card key={listing.id} className="bg-white overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-6">
                  <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-start mb-4">
                  <div>
                        <h3 className="text-xl font-semibold text-gray-900">{listing.location}</h3>
                        <p className="text-sm text-gray-600">Producer: {listing.producer}</p>
                        <p className="text-sm text-gray-600">Energy Type: {listing.energyType || 'Not specified'}</p>
                        <p className="text-sm text-gray-600">Period: {listing.period}</p>
                  </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-green-600">${listing.price}</p>
                        <p className="text-sm text-gray-500">per kWh</p>
                        <p className="text-sm text-gray-600 mt-2">{listing.energyAmount.toLocaleString()} MWH</p>
                </div>
                  </div>
                    <div className="mt-4">
                      <button
                        onClick={() => handleBuyEnergy(listing)}
                        disabled={!walletAddress}
                        className="w-full px-6 py-2 bg-[#0f172a] text-white rounded-lg hover:bg-[#1e293b] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Buy Energy
                      </button>
                  </div>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="col-span-3 text-center text-gray-500">No listings found.</div>
          )}
                </div>

        {/* Transaction History */}
        {transactions.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm mb-8 overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center cursor-pointer" onClick={() => setShowHistory(!showHistory)}>
              <h2 className="text-lg font-semibold text-gray-900">Transaction History</h2>
              <button className="text-gray-500 hover:text-gray-700">
                {showHistory ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                )}
              </button>
            </div>
            {showHistory && (
              <div className="divide-y divide-gray-200">
                {transactions.map((tx) => (
                  <div key={tx.id} className="p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-900">
                          {tx.amount} kWh from {tx.location}
                        </p>
                        <p className="text-sm text-gray-500">
                          Price: ${tx.price} per kWh
                        </p>
                        <p className="text-sm text-gray-500">
                          {tx.timestamp}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          tx.status === 'success' 
                            ? 'bg-green-100 text-green-800'
                            : tx.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                        </span>
                        {tx.hash && (
                          <a
                            href={`https://etherscan.io/tx/${tx.hash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 text-sm"
                          >
                            View on Etherscan
                          </a>
                        )}
                      </div>
                    </div>
                    {tx.error && (
                      <div className="mt-3 p-3 bg-red-50 rounded-md">
                        <p className="text-sm font-medium text-red-800">Error Details:</p>
                        <pre className="mt-1 text-sm text-red-600 whitespace-pre-wrap break-words font-mono">
                          {tx.error}
                        </pre>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 