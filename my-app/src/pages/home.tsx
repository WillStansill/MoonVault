import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useApolloClient, gql } from '@apollo/client';

const Home: React.FC = () => {
    const [address, setAddress] = useState('');
    const [initialAddress, setInitialAddress] = useState(''); // Added to store the initial address
    const router = useRouter();
    const apolloClient = useApolloClient();
    const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
    const [showEmbeddedSandbox, setShowEmbeddedSandbox] = useState(false);

    useEffect(() => {
        const queryAddress = router.query.address as string | undefined;
        if (queryAddress) {
            setAddress(queryAddress);
            setInitialAddress(queryAddress); // Set the initial address
        }
    }, [router.query]);

    const toggleEmbeddedSandbox = () => {
        setShowEmbeddedSandbox(!showEmbeddedSandbox);
    };

    const fetchTransactions = async (address: string) => {
        const apiKey = 'Z6MIAMWBACBYRY95QIWHVJ4WD1NGP557Y8';
        const url = `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=desc&apikey=${apiKey}`;

        const response = await fetch(url);
        const data = await response.json();

        if (data.status !== '1') {
            throw new Error('Failed to fetch transactions');
        }

        return data.result;
    };

    const handleDisplayRecentTransactions = async () => {
        try {
            const transactions = await fetchTransactions(address);
            if (transactions.length === 0) {
                alert('No transactions found for this address.');
                return;
            }
            setRecentTransactions(transactions.slice(0, 100));
        } catch (error) {
            console.error('Failed to fetch recent transactions:', error);
            alert('Failed to fetch recent transactions. Check console for details.');
        }
    };

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

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAddress(event.target.value);
    };

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

    const attestationsToCSV = (attestations: any[]) => {
        const csvRows = [['Recipient', 'Transaction ID']];
        attestations.forEach(attestation => {
            csvRows.push([attestation.recipient, attestation.txid]);
        });
        return csvRows.map(e => e.join(',')).join('\n');
    };

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

    return (
        <div className="h-screen flex flex-col bg-white text-black" style={{
          // Your existing background image styles
          backgroundImage: "url('https://imgur.com/HbqRpmO.png')",
          backgroundSize: '50%',
          backgroundPosition: 'left top',
          backgroundRepeat: 'no-repeat',
          
        }}>
          {/* MoonVault header */}
          <div className="text-white text-center py-4 shadow-md" style={{ background: 'linear-gradient(90deg, #0d4770, #12dcdc)' }}>
            <h1 className="text-2xl font-bold">MoonVault</h1>
          </div>
      
          {/* Content */}
          <div className="flex flex-col items-center justify-center flex-grow" style={{ paddingLeft: '500px' }}>
            <div className="text-center my-4">
              <h2 className="text-lg">My Account Address: {initialAddress || "Not Available"}</h2>
            </div>
      
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
      
            <div className="mt-5">
              <button
                onClick={handleDisplayRecentTransactions}
                className="bg-[#0d577c] hover:bg-[#10a8b6] text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Display Recent Transactions
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
      
            {recentTransactions.length > 0 && (
              <div className="mt-5 w-full max-w-xl overflow-auto" style={{ maxHeight: '300px' }}>
                <h3 className="text-lg font-semibold">Recent Transactions</h3>
                <div className="mt-2 p-2 bg-white overflow-y-auto" style={{ border: '1px solid #e2e8f0', borderRadius: '8px' }}>
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
      
                            }

export default Home;
