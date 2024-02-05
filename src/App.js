import React, { useEffect } from 'react';

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

const App = () => {
    return (
        <div className="App">
            <h1>Connect Your Wallet</h1>
            <button>Download</button>
        </div>
    );
};

export default App;