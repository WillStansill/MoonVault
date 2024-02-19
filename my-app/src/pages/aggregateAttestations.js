query Attestations($where: AttestationWhereInput) {
    attestations(where: $where) {
      recipient
    }
  },
          variables: {
    "where": {
      "attester": {
        "equals": null
      }
    }
  }