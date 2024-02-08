import './App.css';
import React, { useState, useEffect } from 'react';
import { Network, Alchemy, AssetTransfersCategory } from 'alchemy-sdk';

const settings = {
    apiKey: 'oQZtTKVOPzM6X3uPtFkGMitn27M2FbcR',
    network: Network.ETH_SEPOLIA,
};

const alchemy = new Alchemy(settings);

const App = () => {
    const [showButtons, setShowButtons] = useState(false);

    const handleConnectClick = () => {
        setShowButtons(true);
    };

    const downloadTransactionsAsCSV = async () => {
        const csvData = await fetchData();
        const blob = new Blob([csvData], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'transactions.csv'; // Name of the file to be downloaded
        document.body.appendChild(link); // Required for Firefox
        link.click();
        document.body.removeChild(link); // Clean up
    };

    const fetchData = async () => {
        const toAddress = "0x9dFd8Db866D6f4311DCa0741dE9eef23643DC8b4"; // Example toAddress, replace with your target address

        try {
            const response = await alchemy.core.getAssetTransfers({
                fromBlock: "0x0",
                toAddress: toAddress,
                category: [AssetTransfersCategory.EXTERNAL],
            });

            // Format data as CSV
            let csvContent = "Transaction Hash,Block Number,from,to,value\n";
            response.transfers.forEach(transfer => {
                csvContent += `${transfer.hash},${transfer.blockNum},${transfer.from},${transfer.to},${transfer.value}\n`;
            });

            return csvContent;
        } catch (error) {
            console.error("Failed to fetch transaction data:", error);
            return "Failed to fetch data";
        }
    };

    return (
        <div className="App">
            <header className="App-header">
                <h1 className="App-title">Moon Vault Data Extraction</h1>
            </header>
            <main className="App-content">
                {!showButtons && (
                    <button className="connect-button" onClick={handleConnectClick}>Connect Your Moon Wallet</button>
                )}
                {showButtons && (
                    <div className="fade-in">
                        <button className="auth-button">Sign Up</button>
                        <button className="auth-button">Sign In</button>
                        <button className="download-button" onClick={downloadTransactionsAsCSV}>Download Transactions</button>
                    </div>
                )}
            </main>
        </div>
    );
};

export default App;

// const main = async () => {
//     // Assign the contract address to a variable
//     let toAddress = "0x9dFd8Db866D6f4311DCa0741dE9eef23643DC8b4";

//     // The response fetches the transactions for the specified addresses.
//     let response = await alchemy.core.getAssetTransfers({
//         fromBlock: "0x0",
//         fromAddress: "0x944Cd97fCFa1ABCf974455521B787757A7463fdC",
//         toAddress: toAddress,
//         excludeZeroValue: true,
//         category: [AssetTransfersCategory.EXTERNAL],
//     });

//     // Logging the response to the console
//     console.log(response);
// };

// main();

// // Adjusted fetchData function to use Alchemy SDK for fetching transaction data
// const fetchData = async () => {
//     const toAddress = "0x9dFd8Db866D6f4311DCa0741dE9eef23643DC8b4"; // Example toAddress, replace with your target address

//     try {
//         const response = await alchemy.core.getAssetTransfers({
//             fromBlock: "0x0",
//             toAddress: toAddress,
//             category: [AssetTransfersCategory.EXTERNAL],
//         });

//         // Format data as CSV
//         let csvContent = "transactionHash,blockNumber,from,to,value\n";
//         response.transfers.forEach(transfer => {
//             csvContent += `${transfer.hash},${transfer.blockNum},${transfer.from},${transfer.to},${transfer.value}\n`;
//         });

//         return csvContent;
//     } catch (error) {
//         console.error("Failed to fetch transaction data:", error);
//         return "Failed to fetch data";
//     }
// };



// const App = () => {
//     const [showButtons, setShowButtons] = useState(false);

//     const handleConnectClick = () => {
//         setShowButtons(true);
//     };

//     const downloadTransactionsAsCSV = async () => {
//         // Placeholder for your transaction fetching and CSV formatting logic
//         const csvData = await fetchData();
//         const blob = new Blob([csvData], { type: 'text/csv' });
//         const url = URL.createObjectURL(blob);
//         const link = document.createElement('a');
//         link.href = url;
//         link.download = 'transactions.csv'; // Name of the file to be downloaded
//         document.body.appendChild(link); // Required for Firefox
//         link.click();
//         document.body.removeChild(link); // Clean up
//     };

//     // Placeholder function for fetching and formatting data
//     // You need to implement the logic to fetch transaction data from the blockchain and format it as CSV
//     const fetchData = async () => {
//         // Example CSV content - replace with your actual data fetching and formatting
//         const csvContent = "transactionId,timestamp,value\n" +
//                            "tx123,2021-01-01 00:00:00,100\n" +
//                            "tx456,2021-01-02 00:00:00,150";
//         return csvContent;
//     };

//     return (
//         <div className="App">
//             <header className="App-header">
//                 <h1 className="App-title">Moon Vault Data Extraction</h1>
//             </header>
//             <main className="App-content">
//                 {!showButtons && (
//                     <button className="connect-button" onClick={handleConnectClick}>Connect Your Moon Wallet</button>
//                 )}
//                 {showButtons && (
//                     <div className="fade-in">
//                         <button className="auth-button">Sign Up</button>
//                         <button className="auth-button">Sign In</button>
//                         <button className="download-button" onClick={downloadTransactionsAsCSV}>Download Transactions</button>
//                     </div>
//                 )}
//             </main>
//         </div>
//     );
// };

// export default App;