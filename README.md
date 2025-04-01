# 🌕 MoonVault: Blockchain Data Aggregation Platform

## Overview
**MoonVault** is a cutting-edge blockchain data aggregation tool developed in collaboration with Moon Wallet. It efficiently indexes Ethereum Attestation Service (EAS) attestations and transaction data using Apollo GraphQL, providing users with real-time insights and structured blockchain data. 

## 🚀 Features
- **Ethereum Attestation Service (EAS) Integration**: Fetch and index attestation data.
- **Real-Time Crypto Pricing**: Uses CoinGecko API for up-to-date market prices.
- **Transaction History Retrieval**: Leverages the Etherscan API for accurate on-chain transaction data.
- **CSV Export**: Enables users to download transaction and attestation history in a structured format.
- **Seamless UI**: Built with React.js for an intuitive and responsive user experience.
- **Smart Contract Testing**: Foundry integration ensures reliable and efficient contract execution.

## 🛠 Tech Stack
- **Frontend**: React.js, Moon SDK
- **Backend & Data Layer**: Apollo GraphQL, Ethereum Attestation Service (EAS), Etherscan API, CoinGecko API
- **Smart Contracts**: Solidity, Foundry

## 📂 Project Structure
```
MoonVault/
│── src/                 # Frontend React components
│── contracts/           # Solidity smart contracts
│── scripts/             # Deployment and data-fetching scripts
│── test/                # Foundry smart contract tests
│── public/              # Static assets
│── README.md            # Project documentation
```

## 🏗 Deployment Guide
### **1️⃣ Clone the Repository**
```bash
git clone https://github.com/yourusername/moonvault.git
cd moonvault
```
### **2️⃣ Install Dependencies**
```bash
npm install
```
### **3️⃣ Run Development Server**
```bash
npm run dev
```
The site will be available at `http://localhost:3000/`.

### **4️⃣ Deploy Smart Contracts**
```bash
forge script script/Deploy.s.sol --rpc-url <NETWORK_RPC> --private-key <YOUR_PRIVATE_KEY> --broadcast
```

## 🔬 Testing & Security
- **Foundry Testing**: Ensures contract security and functionality.
- **GraphQL Query Validation**: Ensures reliable attestation and transaction data retrieval.
- **API Rate Limits Handling**: Optimized calls to CoinGecko and Etherscan APIs for efficiency.

## 🏆 Achievements
- **2nd Place** at BCamp, outperforming 6 other teams despite being the smallest.
- **Diplomat Award** for exceptional project execution and collaboration.

## 📬 Contact
📧 Email: willstansill@gmail.com  
💼 LinkedIn: [linkedin.com/in/will-stansill](https://linkedin.com/in/will-stansill)  
🐙 GitHub: [github.com/yourusername](https://github.com/yourusername)  

---
**Simplifying blockchain data with innovation and efficiency.** 🌍
