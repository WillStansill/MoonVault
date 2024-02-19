import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ApolloSandbox } from '@apollo/sandbox';
import { EmbeddedSandbox } from './EmbeddedSandbox';
import starsImage from '../images/stars.png';

const Home: React.FC = () => {
    const [showEmbeddedSandbox, setShowEmbeddedSandbox] = useState(false);
    const [address, setAddress] = useState('');
    const [recentTransactions, setRecentTransactions] = useState<any[]>([]); // State to store recent transactions
    const router = useRouter();

    useEffect(() => {
        // Automatically set address from URL query parameters if present
        const queryAddress = router.query.address as string | undefined;
        if (queryAddress) {
            setAddress(queryAddress);
        }
    }, [router.query]);

    const toggleEmbeddedSandbox = () => {
        setShowEmbeddedSandbox(!showEmbeddedSandbox);
        console.log(showEmbeddedSandbox);
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAddress(event.target.value);
    };

    const fetchTransactions = async (address: string) => {
        const apiKey = 'Z6MIAMWBACBYRY95QIWHVJ4WD1NGP557Y8';
        // Adjusted the sort parameter to "desc" to fetch transactions in descending order
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
            // Store only the most recent 100 transactions
            const recentTransactions = transactions.slice(0, 100);
            setRecentTransactions(recentTransactions);
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
            const csvRow = [
                tx.hash,
                methodId,
                tx.from,
                tx.to,
                valueInEth.toFixed(18),
            ];
            csvRows.push(csvRow);
        });

        return csvRows.map(e => e.join(',')).join('\n');
    };

    const downloadCSV = (csvString: string, filename: string) => {
        const blob = new Blob([csvString], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename || 'transactions.csv';
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(url);
        a.remove();
    };

    const handleDownloadClick = async () => {
        try {
            const csvString = transactionsToCSV(recentTransactions);
            downloadCSV(csvString, `${address}_transactions.csv`);
        } catch (error) {
            console.error('Failed to download transactions:', error);
            alert('Failed to download transactions. Check console for details.');
        }
    };

    return (
        <div className="h-screen flex flex-col bg-gray-50 text-gray-900" >
            <div className="bg-indigo-600 text-white text-center py-4 shadow-md">
                <h1 className="text-2xl font-bold">MoonVault</h1>
            </div>

            <div className="text-center my-4">
                <h2 className="text-lg">Your Address: {address || "Not Available"}</h2>
            </div>

        


            <div className="flex flex-col items-center justify-center flex-grow">
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
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        Display Recent Transactions
                    </button>
                </div>

                <div className="mt-5">
                    <button
                        onClick={handleDownloadClick}
                        disabled={recentTransactions.length === 0} // Disable button if there are no recent transactions
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        Download Data as CSV
                    </button>
                </div>

                {/* Display recent transactions in a scrollable text box */}
                <div className="mt-5 max-h-48 overflow-y-auto border border-gray-300 rounded-md p-2">
                    {recentTransactions.map((transaction, index) => (
                        <div key={index}>
                            <p>Transaction Hash: {transaction.hash}</p>
                            <p>Method ID: {transaction.input.startsWith('0x') && transaction.input.length >= 10 ? transaction.input.substring(0, 10) : 'N/A'}</p>
                            <p>From: {transaction.from}</p>
                            <p>To: {transaction.to}</p>
                            <p>Value (ETH): {Number(transaction.value) / 1e18}</p>
                            <hr className="my-2" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Home;