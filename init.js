const Web3 = require('web3');
const HDWalletProvider = require("@truffle/hdwallet-provider");
const _rpcURL = "https://data-seed-prebsc-1-s1.binance.org:8545/";
const { parseFixed } = require("@ethersproject/bignumber");
const _wsURL = "wss://testnet-dex.binance.org/api/";
const path = require('path');
const fs = require('fs');


// WEB3 DETAILS

const url = "https://data-seed-prebsc-1-s1.binance.org:8545/"; //Defaults to BSC-Testnet
const hdwalletOptions = {
    mnemonic: {
      phrase: "off neither whip umbrella skill monitor wall cup style fatal device month",
    },
    providerOrUrl: url,
    addressIndex: 0, // Change this to use the nth account.
  };

const web3 = new Web3(new HDWalletProvider(hdwalletOptions));
const { toWei, utf8ToHex, padRight } = web3.utils;
const accounts = web3.eth.getAccounts();
if (!accounts || accounts.length === 0)
  throw "No accounts. Must provide mnemonic or node must have unlocked accounts.";
const account = accounts[0];
const networkId = 97; // BSC-Testnet address
const decimasl = 18;

function getAbi(abiName) {
    const filePath = path.join("./", "contracts", `${abiName}.json`);
    const abiFile = JSON.parse(fs.readFileSync(filePath).toString());
    return abiFile["abi"];
}
function getAddress(abiName)
{
    const filePath = path.join("./", "contracts", `${abiName}.json`);
    const abiFile = JSON.parse(fs.readFileSync(filePath).toString());
    return abiFile["networks"]["97"]["address"];
}

async function getContract(contractName)
{
    const contract = new web3.eth.Contract(
      getAbi(`${contractName}`),
      getAddress(`${contractName}`)
    );
    return contract;
}

  // Transaction parameters
const transactionOptions = {
  gas: 6721975, // 12MM is very high. Set this lower if you only have < 2 ETH or so in your wallet.
  gasPrice: 50 * 1000000000, // gasprice arg * 1 GWEI
  from: account,
};


async function deployAthlete(synthName, synthSymbol) {
  const url = "https://data-seed-prebsc-1-s1.binance.org:8545/"; //Defaults to BSC-Testnet

  // See HDWalletProvider documentation: https://www.npmjs.com/package/@truffle/hdwallet-provider.
  const hdwalletOptions = {
    mnemonic: {
      phrase: "off neither whip umbrella skill monitor wall cup style fatal device month",
    },
    providerOrUrl: url,
    addressIndex: 0, // Change this to use the nth account.
  };

  // Initialize web3 with an HDWalletProvider if a mnemonic was provided. Otherwise, just give it the url.
  const web3 = new Web3(new HDWalletProvider(hdwalletOptions));
  const { toWei, utf8ToHex, padRight } = web3.utils;

  const accounts = await web3.eth.getAccounts();
  if (!accounts || accounts.length === 0)
    throw "No accounts. Must provide mnemonic or node must have unlocked accounts.";
  const account = accounts[0];
  const networkId = 97; // BSC-Testnet address

  // Grab collateral decimals.
  const decimals = "18";


  // EMP Parameters. Pass in arguments to customize these.
  const empParams = {
    expirationTimestamp: "1624982379", // Timestamp that the contract will expire at.
    collateralAddress: "0x805624d8a34473f24d66d74c2fb86400c90862a1", // AE Testnet token address.
    priceFeedIdentifier: padRight(utf8ToHex("USDETH"), 64), // Price identifier to use.
    syntheticName: synthName, // Long name.
    syntheticSymbol: synthSymbol, // Short name.
    collateralRequirement: { rawValue: toWei("1.25") }, // 125% collateral req.
    disputeBondPercentage: { rawValue: toWei("0.1") }, // 10% dispute bond.
    sponsorDisputeRewardPercentage: { rawValue: toWei("0.05") }, // 5% reward for sponsors who are disputed invalidly
    disputerDisputeRewardPercentage: { rawValue: toWei("0.2") }, // 20% reward for correct disputes.
    minSponsorTokens: { rawValue: parseFixed("1000", decimals) }, // Minimum sponsor position size = 1,000 tokens
    liquidationLiveness: 7200, // 2 hour liquidation liveness.
    withdrawalLiveness: 7200, // 2 hour withdrawal liveness.
    financialProductLibraryAddress: "0x0000000000000000000000000000000000000000", // Default to 0x0 if no address is passed.
  };

  const empCreator = await getContract("ExpiringMultiPartyCreator");

  // Transaction parameters
  const transactionOptions = {
    gas: 6721975, // 12MM is very high. Set this lower if you only have < 2 ETH or so in your wallet.
    gasPrice: 50 * 1000000000, // gasprice arg * 1 GWEI
    from: account,
  };

  // Simulate transaction to test before sending to the network.
  console.log("Simulating Deployment...");
  const address = await empCreator.methods.createExpiringMultiParty(empParams).call(transactionOptions);
  console.log("Simulation successful. Expected Address:", address);

  // Since the simulated transaction succeeded, send the real one to the network.
  const { transactionHash } = await empCreator.methods.createExpiringMultiParty(empParams).send(transactionOptions);
  console.log("Deployed in transaction:", transactionHash);
  process.exit(0);
}



// Execution

(async () => {
  const Governer = await getContract("Governor").catch((e) => {
    console.error(e);
    process.exit(1);
  });
  const AddressWhiteList = await getContract("AddressWhitelist").catch((e) => {
    console.error(e);
    process.exit(1);
  });


  AddressWhiteList.methods.addToWhitelist("0xE4225DBc27eFF3EecfaC7396ACceDFD4996E8f10");
  
  deployAthlete("TestLebron James", "tLBJ").catch((e) => {
    console.error(e);
    process.exit(1);
  });

})();