import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useMoonSDK } from './usemoonsdk'; // Adjust the path as necessary
import { EmailLoginInput, EmailSignupInput } from '@moonup/moon-api';

const SignupPage: React.FC = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [isConnected, setIsConnected] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showSignUp, setShowSignUp] = useState(false);

    const { moon, connect, createAccount, updateToken, initialize } = useMoonSDK();

    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    };

    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    };

    const handleConfirmPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setConfirmPassword(event.target.value);
    };

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

    return (
        <div className="flex flex-col justify-center items-center h-screen bg-gray-50 px-4">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Connect to Moon
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        {error && <span className="font-medium text-red-500">{error}</span>}
                    </p>
                </div>
                {!isConnected && (
                    <button
                        type="button"
                        className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#0d577c] hover:bg-[#10a8b6] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        // className="bg-[#0d577c] hover:bg-[#10a8b6] text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        onClick={handleInitializeAndConnect}
                    >
                        {loading ? 'Connecting...' : 'Initialize & Connect to Moon'}
                    </button>
                )}
                {isConnected && !showSignUp && (
                    <>
                        <input
                            type="email"
                            name="email"
                            value={email}
                            onChange={handleEmailChange}
                            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            placeholder="Email"
                        />
                        <input
                            type="password"
                            name="password"
                            value={password}
                            onChange={handlePasswordChange}
                            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            placeholder="Password"
                        />
                        <button
                            type="button"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#0d577c] hover:bg-[#10a8b6] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mt-4"
                            onClick={handleSignIn}
                        >
                            {loading ? 'Signing In...' : 'Sign In'}
                        </button>
                        <p className="text-center mt-4 cursor-pointer text-[#0d577c] hover:text-[#10a8b6]" onClick={() => setShowSignUp(true)}>

                            Don't have a Moon account? Sign Up Here
                        </p>
                    </>
                )}
                {showSignUp && (
                    <>
                        <input
                            type="email"
                            name="email"
                            value={email}
                            onChange={handleEmailChange}
                            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            placeholder="Email"
                        />
                        <input
                            type="password"
                            name="password"
                            value={password}
                            onChange={handlePasswordChange}
                            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="Password"
                        />
                        <input
                            type="password"
                            name="confirmPassword"
                            value={confirmPassword}
                            onChange={handleConfirmPasswordChange}
                            className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${passwordError ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                            placeholder="Confirm Password"
                        />
                        {passwordError && <p className="text-red-500 text-xs italic">{passwordError}</p>}
                        <button
                            type="button"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#0d577c] hover:bg-[#10a8b6] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mt-4"
                            onClick={handleSignUp}
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
