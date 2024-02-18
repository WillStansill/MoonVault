import React from 'react';
import { ApolloSandbox } from '@apollo/sandbox/react';

export function EmbeddedSandbox() {
  return (
    <ApolloSandbox
      initialEndpoint='https://sepolia.easscan.org/graphql'
      initialState={{
        document: `query Attestations($where: AttestationWhereInput) {
  attestations(where: $where) {
    recipient
  }
}`,
        variables: {
  "where": {
    "attester": {
      "equals": "0xB0739AaF97B5F12D3529ec6C109fbE1A9c9F6bAe"
    }
  }
},
        headers: {},
        includeCookies: false
      }}
    />
  );
}
