# Challenge
- Accessing all the certificate attestation (NFT minting) done by an address on the BlockBadge site.

# Solution
- A download button on the BlockBadge site utilizing the Moon APIs to access and store all the data.
- Use the Moon API and Moon Data to extract account details and corresponding 'Attest'method transactions made by that account.
![image](https://github.com/0xBcamp/Hobbes-janus-dragon/assets/44200959/20ecc679-e748-4435-8909-5a896fb44a71)

- Basic proof of concept can look something simple like below. The button would simply save all of the data into a CSV and download it to the users machine:
![image](https://github.com/0xBcamp/Hobbes-janus-dragon/assets/44200959/35af4f0b-6824-4997-b881-d76a043830f7)


# Why it Matters
- Saves time for addresses that issue certificates to be able to quickly extract data into a CSV format.
- Leverage data to better understand gaps in the program for which certificates are being issues.

Testing