// import React, { useEffect } from 'react';
import './App.css';
import React, { useState } from 'react';
import { Network, Alchemy, AssetTransfersCategory } from 'alchemy-sdk';

const settings = {
    apiKey: 'oQZtTKVOPzM6X3uPtFkGMitn27M2FbcR',
    network: Network.ETH_SEPOLIA,
};

const alchemy = new Alchemy(settings);

const main = async () => {
    // Assign the contract address to a variable
    let toAddress = "0x9dFd8Db866D6f4311DCa0741dE9eef23643DC8b4";

    // The response fetches the transactions for the specified addresses.
    let response = await alchemy.core.getAssetTransfers({
        fromBlock: "0x0",
        fromAddress: "0x944Cd97fCFa1ABCf974455521B787757A7463fdC",
        toAddress: toAddress,
        excludeZeroValue: true,
        category: [AssetTransfersCategory.EXTERNAL],
    });

    // Logging the response to the console
    console.log(response);
};

main();

// const App = () => {
//     return (
//         <div className="App">
//             <h1>Connect Your Wallet</h1>
//             <button>Download</button>
//         </div>
//     );
// };

const App = () => {
    // State to control the visibility of the buttons
    const [showButtons, setShowButtons] = useState(false);

    const handleConnectClick = () => {
        setShowButtons(true);
    };

    return (
        <div className="App" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <h1>Moon Vault Data Extraction</h1>
            {!showButtons && (
                <button onClick={handleConnectClick}>Connect Your Moon Wallet</button>
            )}
            {showButtons && (
                <div className="fade-in">
                    <button>Sign Up</button>
                    <button>Sign In</button>
                </div>
            )}
        </div>
    );
};

export default App;