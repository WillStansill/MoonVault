import React, { useState } from 'react';

const App: React.FC = () => {
    const [address, setAddress] = useState('');
    const placeholder = address ? '' : 'Enter a Wallet Address';

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAddress(event.target.value);
    };

    return (
        <div className="h-screen flex flex-col bg-gray-900 text-white">
            {/* Navbar */}
            <div className="bg-gray-800 text-white text-center py-4">
                <h1 className="text-2xl font-bold">MoonVault</h1>
            </div>

            {/* Search bar and Download button container */}
            <div className="flex flex-col items-center justify-center flex-grow">
                {/* Search bar */}
                <div className="flex items-center justify-center w-1/2 mb-4 rounded overflow-hidden">
                    <input
                        type="text"
                        placeholder={placeholder}
                        value={address}
                        onChange={handleInputChange}
                        className="w-full py-2 px-4 bg-gray-800 focus:outline-none text-white"
                    />
                </div>
                
                {/* Download button */}
                <div className="mt-5">
                    <button className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded">
                        Download data to a CSV
                    </button>
                </div>
            </div>
        </div>
    );
};

export default App;
