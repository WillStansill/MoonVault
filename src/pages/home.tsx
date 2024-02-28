import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useApolloClient, gql } from '@apollo/client';

// Component to fetch and display crypto prices in a scrolling ticker
const CryptoPricesTicker = () => {
    // State to hold prices of various cryptocurrencies
    const [prices, setPrices] = useState({ BTC: '', ETH: '', BNB: '', OP: '', ARB: 'N/A' });

    useEffect(() => {
        // Fetches crypto prices from CoinGecko API on component mount
        const fetchPrices = async () => {
            try {
                const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,binancecoin,optimism&vs_currencies=usd');
                const data = await response.json();
                setPrices({
                    BTC: data.bitcoin.usd,
                    ETH: data.ethereum.usd,
                    BNB: data.binancecoin.usd,
                    OP: data.optimism.usd,
                });
            } catch (error) {
                console.error('Failed to fetch crypto prices:', error);
            }
        };

        fetchPrices();
    }, []);

    // Render the ticker with fetched prices
    return (
        <div className="crypto-ticker bg-gray-800 text-white py-2 text-center">
            <marquee>
                BTC: ${prices.BTC} | ETH: ${prices.ETH} | BNB: ${prices.BNB} | OP: ${prices.OP}
            </marquee>
        </div>
    );
};

// Main Home component
const Home: React.FC = () => {
    // State for storing user input and fetched transactions
    const [address, setAddress] = useState('');
    const [initialAddress, setInitialAddress] = useState('');
    const router = useRouter();
    const apolloClient = useApolloClient();
    const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
    const [showEmbeddedSandbox, setShowEmbeddedSandbox] = useState(false);
    const [showTransactions, setShowTransactions] = useState(false);
    const [isLoadingTransactions, setIsLoadingTransactions] = useState(false);

    // Effect to read address from URL query and set it to state
    useEffect(() => {
        const queryAddress = router.query.address as string | undefined;
        if (queryAddress) {
            setAddress(queryAddress);
            setInitialAddress(queryAddress);
        }
    }, [router.query]);

    // Toggle visibility of an embedded sandbox (not used in provided code)
    const toggleEmbeddedSandbox = () => {
        setShowEmbeddedSandbox(!showEmbeddedSandbox);
    };

    // Fetches transactions for a given address using Etherscan API
    const fetchTransactions = async (address: string) => {
      setIsLoadingTransactions(true);
      try {
          const apiKey = 'Z6MIAMWBACBYRY95QIWHVJ4WD1NGP557Y8';
          const url = `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=desc&apikey=${apiKey}`;

          const response = await fetch(url);
          const data = await response.json();

          if (data.status !== '1') {
              throw new Error('Failed to fetch transactions');
          }

          return data.result;
      } finally {
          setIsLoadingTransactions(false);
      }
  };

  // Handles input change to update the address state
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(event.target.value);
    setShowTransactions(false); // Resetting to hide transactions
};

    // Displays recent transactions for the address
    const handleDisplayRecentTransactions = async () => {
      setShowTransactions(false); 
        try {
            const transactions = await fetchTransactions(address);
            if (transactions.length === 0) {
                alert('No transactions found for this address.');
                return;
            }
            setRecentTransactions(transactions.slice(0, 100));
            setShowTransactions(true);
        } catch (error) {
            console.error('Failed to fetch recent transactions:', error);
            alert('Failed to fetch recent transactions. Check console for details.');
        }
    };
    const handleHideTransactions = () => {
      setShowTransactions(false);
      setRecentTransactions([]);
  };

    // Converts transactions to CSV format
    const transactionsToCSV = (transactions: any[]) => {
        const csvRows = [
            ['Transaction Hash', 'Method ID', 'From', 'To', 'Value (ETH)'],
        ];

        transactions.forEach(tx => {
            const methodId = tx.input.startsWith('0x') && tx.input.length >= 10 ? tx.input.substring(0, 10) : 'N/A';
            const valueInEth = Number(tx.value) / 1e18;
            csvRows.push([
                tx.hash,
                methodId,
                tx.from,
                tx.to,
                valueInEth.toFixed(18),
            ]);
        });

        return csvRows.map(e => e.join(',')).join('\n');
    };

    // Handles input change to update the address state
    
    // Downloads transactions or attestations as a CSV file
    const downloadCSV = (csvString: string, filename: string) => {
        const blob = new Blob([csvString], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(url);
        a.remove();
    };

    // Initiates download of transactions CSV
    const handleDownloadClick = async () => {
        try {
            const transactions = await fetchTransactions(address);
            if (transactions.length === 0) {
                alert('No transactions found for this address.');
                return;
            }
            const csvString = transactionsToCSV(transactions.slice(0, 100));
            downloadCSV(csvString, `${address}_transactions.csv`);
        } catch (error) {
            console.error('Failed to download transactions:', error);
            alert('Failed to download transactions. No attestation transactions found on Ethereum main-net in this address.');
        }
    };

    // Similar to transactions CSV, for attestations (not used in provided code)
    const attestationsToCSV = (attestations: any[]) => {
        const csvRows = [['Recipient', 'Transaction ID']];
        attestations.forEach(attestation => {
            csvRows.push([attestation.recipient, attestation.txid]);
        });
        return csvRows.map(e => e.join(',')).join('\n');
    };

    // Initiates download of attestations CSV
    const handleAttestationDownload = async () => {
        try {
            const { data } = await apolloClient.query({
                query: gql`
                    query Attestations($where: AttestationWhereInput) {
                        attestations(where: $where) {
                            recipient
                            txid
                        }
                    }
                `,
                variables: {
                    where: {
                        attester: {
                            equals: address
                        }
                    }
                }
            });

            if (data && data.attestations && data.attestations.length > 0) {
                const csvString = attestationsToCSV(data.attestations);
                downloadCSV(csvString, `${address}_attestations.csv`);
            } else {
                alert('No attestations found in this address on Sepolia testnet.');
            }
        } catch (error) {
            console.error('Failed to download attestations:', error);
            alert('Failed to download attestations. Check console for details.');
        }
    };

    // Render the main component
    return (
      <div className="h-screen flex flex-col bg-white text-black" style={{
        backgroundImage: "url('https://imgur.com/HbqRpmO.png')",
        backgroundSize: '44%',
        backgroundPosition: 'left bottom',
        backgroundRepeat: 'no-repeat',
      }}>
        {/* Header section with MoonVault title */}
        <div className="text-white text-center py-4 shadow-md" style={{ background: 'linear-gradient(90deg, #0d4770, #12dcdc)' }}>
          <h1 className="text-2xl font-bold">MoonVault</h1>
        </div>
        {/* Crypto prices ticker displayed below the title */}
        <CryptoPricesTicker />
        {/* Main content area */}
        <div className="flex flex-col items-center justify-center flex-grow" style={{ paddingLeft: '500px' }}>
          {/* Display of the queried or entered account address */}
          <div className="text-center my-4">
            <h2 className="text-lg">My Account Address: {initialAddress || "Not Available"}</h2>
          </div>
          {/* Input for entering a new address */}
          <p className="text-lg mb-4">What address do you want the data from?</p>
          <div className="flex items-center justify-center w-full max-w-md mb-4 rounded overflow-hidden shadow-md">
            <input
              type="text"
              placeholder="Enter a Wallet Address"
              value={address}
              onChange={handleInputChange}
              className="w-full py-2 px-4 bg-white focus:outline-none text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          {/* Buttons to trigger various actions */}
          <div className="mt-5">
          <button
            onClick={handleDisplayRecentTransactions}
            disabled={isLoadingTransactions}
            className={`bg-[#0d577c] hover:bg-[#10a8b6] text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${isLoadingTransactions ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isLoadingTransactions ? 'Loading...' : 'Display Recent Transactions'}
          </button>
          </div>
          <div className="mt-5">
            <button
              onClick={handleDownloadClick}
              className="bg-[#0d577c] hover:bg-[#10a8b6] text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Download Transactions as CSV
            </button>
          </div>
          <div className="mt-5">
            <button
              onClick={handleAttestationDownload}
              className="bg-[#0d577c] hover:bg-[#10a8b6] text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Download Attestations as CSV
            </button>
          </div>
          {/* Section to display fetched transactions */}
          {showTransactions && recentTransactions.length > 0 && (
            <div className="mt-5 w-full max-w-xl overflow-auto" style={{ maxHeight: '300px', position: 'relative' }}>
              <h3 className="text-lg font-semibold sticky top-0 bg-white p-2 flex justify-between items-center" style={{ zIndex: 1 }}>
                <span>Recent Transactions</span>
                <button
                  onClick={handleHideTransactions}
                  className="bg-[#0d577c] hover:bg-[#10a8b6] text-white font-bold py-2 px-4 rounded-md ml-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Collapse Transactions
                </button>
              </h3>
              <div className="p-2 bg-white overflow-y-auto" style={{ border: '1px solid #e2e8f0', borderRadius: '8px', marginTop: '32px' }}>
                {recentTransactions.map((transaction, index) => (
                  <div key={index} className="mt-2 border-b border-gray-200 pb-2">
                    <p><strong>Hash:</strong> {transaction.hash}</p>
                    <p><strong>Method ID:</strong> {transaction.input.startsWith('0x') && transaction.input.length >= 10 ? transaction.input.substring(0, 10) : 'N/A'}</p>
                    <p><strong>From:</strong> {transaction.from}</p>
                    <p><strong>To:</strong> {transaction.to}</p>
                    <p><strong>Value:</strong> {Number(transaction.value) / 1e18} ETH</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
  );
  
  
};

export default Home;
