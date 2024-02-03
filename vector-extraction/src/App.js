
import React, { useEffect } from 'react';
import { useMoonSDK } from './useMoonHook';

function App() {
    const { moon } = useMoonSDK();
    const [accounts, setAccounts] = React.useState([]);
    useEffect(() => {
        const fetchAccount = async () => {
            try {
                const accounts = await moon.getAccountsSDK().listAccounts();
                console.log(accounts);
            } catch (error) {
                console.error(`Error: ${error}`);
            }
        };
        fetchAccount();
    }, [moon]);
    return (
        <div className="App">
            <h1> Connect Your Wallet</h1>
            <button>Download</button>
        </div>
    );
}

export default App;
