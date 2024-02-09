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
    const [signupSuccess, setSignupSuccess] = useState(false);
    const [signInSuccess, setSignInSuccess] = useState(false);
    const [authenticatedAddress, setAuthenticatedAddress] = useState('');
    const [isConnected, setIsConnected] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { moon, connect, createAccount, disconnect, updateToken, initialize } = useMoonSDK();

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
            setError('Error connecting to Moon. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSignup = async () => {
        try {
            setLoading(true);
            setError(null);

            if (password !== confirmPassword) {
                setPasswordError('Passwords do not match');
                return;
            }

            const signupRequest: EmailSignupInput = { email, password };
            const signupResponse = await moon?.getAuthSDK().emailSignup(signupRequest);
            setSignupSuccess(true);
			router.push(`/home?address=${encodeURIComponent(authenticatedAddress)}`);
		} catch (error) {
            setError('Error signing up. Please try again.');
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
            setSignInSuccess(true);
            setAuthenticatedAddress(newAccount.data.data.address);
			router.push(`/home?address=${encodeURIComponent(newAccount.data.data.address)}`);
		} catch (error) {
            setError('Error signing in. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleDisconnect = async () => {
        try {
            setLoading(true);
            await disconnect();
            setIsConnected(false);
        } catch (error) {
            setError('Error disconnecting from Moon. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col justify-center items-center h-screen bg-gray-50 px-4">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        {isConnected ? (signupSuccess || signInSuccess) ? 'Welcome to Your Moon Account' : 'Create Your Moon Account' : 'Connect to Moon'}
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        {error && <span className="font-medium text-red-500">{error}</span>}
                    </p>
                </div>
                {!isConnected && (
                    <button
                        type="button"
                        className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        onClick={handleInitializeAndConnect}
                    >
                        {loading ? 'Connecting...' : 'Initialize & Connect to Moon'}
                    </button>
                )}

                {isConnected && !signupSuccess && !signInSuccess && (
                    <>
                        <div className="mt-8">
                            <div className="rounded-md shadow-sm">
                                <div>
                                    <input
                                        type="email"
                                        name="email"
                                        value={email}
                                        onChange={handleEmailChange}
                                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                        placeholder="Email"
                                    />
                                </div>
                                <div className="-space-y-px">
                                    <input
                                        type="password"
                                        name="password"
                                        value={password}
                                        onChange={handlePasswordChange}
                                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
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
                                </div>
                            </div>
                            <div className="mt-6">
                                <button
                                    type="button"
                                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    onClick={handleSignup}
                                >
                                    {loading ? 'Signing Up...' : 'Sign Up'}
                                </button>
                            </div>
                        </div>
                        <div className="mt-6">
                            <div className="rounded-md shadow-sm">
                                <div>
                                    <button
                                        type="button"
                                        className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        onClick={handleSignIn}
                                    >
                                        {loading ? 'Signing In...' : 'Sign In'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {signInSuccess && isConnected && (
                    <div className="text-center">
                        <p className="text-lg font-medium text-gray-900">Authenticated Address: {authenticatedAddress}</p>
                        <button
                            type="button"
                            className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            onClick={handleDisconnect}
                        >
                            {loading ? 'Disconnecting...' : 'Disconnect from Moon'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SignupPage;
