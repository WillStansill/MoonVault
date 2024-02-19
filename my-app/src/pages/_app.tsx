import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from '@apollo/client';
import client from './apolloClient';

export default function App({ Component, pageProps }: AppProps) {
  return <ApolloProvider client={client}><Component {...pageProps} /></ApolloProvider>
}
