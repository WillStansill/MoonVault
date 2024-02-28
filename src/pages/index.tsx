import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useMoonSDK } from './usemoonsdk'; // Adjust the path as necessary
import { EmailLoginInput, EmailSignupInput } from '@moonup/moon-api';

// The main component for handling user sign-up and sign-in
const SignupPage: React.FC = () => {
    // Hook to manipulate the URL and navigate programmatically
    const router = useRouter();

    // State hooks to manage form inputs and application state
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [isConnected, setIsConnected] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showSignUp, setShowSignUp] = useState(false);

    // Custom hook to interact with the Moon SDK
    const { moon, connect, createAccount, updateToken, initialize } = useMoonSDK();

    // Event handlers for form inputs
    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    };

    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    };

    const handleConfirmPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setConfirmPassword(event.target.value);
    };

    // Initialize and connect to Moon's service
    const handleInitializeAndConnect = async () => {
        try {
            setLoading(true);
            setError(null);
            await initialize();
            await connect();
            setIsConnected(true);
        } catch (error) {
            setError(`Error connecting to Moon: ${error.message}. Please try again.`);
        } finally {
            setLoading(false);
        }
    };

    // Handle the sign-in process
    const handleSignIn = async () => {
        try {
            setLoading(true);
            setError(null);

            const loginRequest: EmailLoginInput = { email, password };
            const loginResponse = await moon?.getAuthSDK().emailLogin(loginRequest);

            await updateToken(loginResponse.data.token, loginResponse.data.refreshToken);
            moon?.MoonAccount.setEmail(email);
            moon?.MoonAccount.setExpiry(loginResponse.data.expiry);

            const newAccount = await createAccount();
            router.push(`/home?address=${encodeURIComponent(newAccount.data.data.address)}`);
        } catch (error) {
            setError('Error signing in. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Handle the sign-up process
    const handleSignUp = async () => {
        if (password !== confirmPassword) {
            setPasswordError('Passwords do not match');
            return;
        }

        try {
            setLoading(true);
            setError(null);
            setPasswordError('');

            const signupRequest: EmailSignupInput = { email, password };
            await moon?.getAuthSDK().emailSignup(signupRequest);

            const newAccount = await createAccount();
            router.push(`/home?address=${encodeURIComponent(newAccount.data.data.address)}`);
        } catch (error) {
            setError('Error signing up. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // The component's render method
    return (
        <div className="flex flex-col justify-center items-center h-screen bg-gray-50 px-4">
            <div className="max-w-md w-full space-y-8">
                {/* Display connection status or error messages */}
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Connect to Moon
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        {error && <span className="font-medium text-red-500">{error}</span>}
                    </p>
                </div>
                {/* Conditionally render the connect button if not connected */}
                {!isConnected && (
                    <button
                        onClick={handleInitializeAndConnect}
                        className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#0d577c] hover:bg-[#10a8b6] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        {loading ? 'Connecting...' : 'Initialize & Connect to Moon'}
                    </button>
                )}
                {/* Render sign-in form if connected but not in sign-up mode */}
                {isConnected && !showSignUp && (
                    <>
                        <input
                            type="email"
                            name="email"
                            value={email}
                            onChange={handleEmailChange}
                            placeholder="Email"
                            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                        />
                        <input
                            type="password"
                            name="password"
                            value={password}
                            onChange={handlePasswordChange}
                            placeholder="Password"
                            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                        />
                        <button
                            onClick={handleSignIn}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#0d577c] hover:bg-[#10a8b6] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mt-4"
                        >
                            {loading ? 'Signing In...' : 'Sign In'}
                        </button>
                        <p
                            onClick={() => setShowSignUp(true)}
                            className="text-center mt-4 cursor-pointer text-[#0d577c] hover:text-[#10a8b6]"
                        >
                            Don't have a Moon account? Sign Up Here
                        </p>
                    </>
                )}
                {/* Render sign-up form if in sign-up mode */}
                {showSignUp && (
                    <>
                        <input
                            type="email"
                            name="email"
                            value={email}
                            onChange={handleEmailChange}
                            placeholder="Email"
                            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                        />
                        <input
                            type="password"
                            name="password"
                            value={password}
                            onChange={handlePasswordChange}
                            placeholder="Password"
                            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                        <input
                            type="password"
                            name="confirmPassword"
                            value={confirmPassword}
                            onChange={handleConfirmPasswordChange}
                            placeholder="Confirm Password"
                            className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${passwordError ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                        />
                        {passwordError && <p className="text-red-500 text-xs italic">{passwordError}</p>}
                        <button
                            onClick={handleSignUp}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#0d577c] hover:bg-[#10a8b6] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mt-4"
                        >
                            {loading ? 'Signing Up...' : 'Sign Up'}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default SignupPage;
