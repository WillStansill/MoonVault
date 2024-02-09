import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const Home: React.FC = () => {
    const [address, setAddress] = useState('');
    const router = useRouter();

    useEffect(() => {
        // Check if the address query parameter exists and set it
        if(router.query.address) {
            setAddress(router.query.address as string);
        }
    }, [router.query]);

    const placeholder = 'Enter a Wallet Address';

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAddress(event.target.value);
    };

    return (
        <div className="h-screen flex flex-col bg-gray-50 text-gray-900">
            {/* Navbar */}
            <div className="bg-indigo-600 text-white text-center py-4 shadow-md">
                <h1 className="text-2xl font-bold">MoonVault</h1>
            </div>

            {/* Display the address if it exists */}
            {address && (
                <div className="text-center my-4">
                    <h2 className="text-lg">Your Address: {address}</h2>
                </div>
            )}

            {/* Search bar and Download button container */}
            <div className="flex flex-col items-center justify-center flex-grow">
                {/* Search bar */}
                <div className="flex items-center justify-center w-full max-w-md mb-4 rounded overflow-hidden shadow-md">
                    <input
                        type="text"
                        placeholder={placeholder}
                        value={address}
                        onChange={handleInputChange}
                        className="w-full py-2 px-4 bg-white focus:outline-none text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
                
                {/* Download button */}
                <div className="mt-5">
                    <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                        Download Data as CSV
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Home;
