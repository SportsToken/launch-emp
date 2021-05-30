const Web3 = require("web3");
const HDWalletProvider = require("@truffle/hdwallet-provider");
const { parseFixed } = require("@ethersproject/bignumber");
const fs = require('fs');
const path = require('path');
// Optional arguments:
// --url: node url, by default points at http://localhost:8545.
// --mnemonic: an account mnemonic you'd like to use. The script will default to using the node's unlocked accounts.
// Mandatory arguments:
// --gasprice: gas price to use in GWEI
// --priceFeedIdentifier: price identifier to use.
// --collateralAddress: collateral token address.
// --expirationTimestamp: timestamp that the contract will expire at.
// --syntheticName: long name.
// --syntheticSymbol: short name.
// --minSponsorTokens: minimum sponsor position size

// const argv = require("minimist")(process.argv.slice(), {
//   string: ["url", "mnemonic", "priceFeedIdentifier", "collateralAddress", "expirationTimestamp", "syntheticName", "syntheticSymbol", "minSponsorTokens", "libraryAddress"]
// });
// if (!argv.priceFeedIdentifier) throw "--priceFeedIdentifier required";
// // if (!argv.collateralAddress) throw "--collateralAddress required"; //This is hard coded
// if (!argv.expirationTimestamp) throw "--expirationTimestamp required";
// if (!argv.syntheticName) throw "--syntheticName required";
// if (!argv.syntheticSymbol) throw "--syntheticSymbol required";
// if (!argv.minSponsorTokens) throw "--minSponsorTokens required";
// if (!argv.gasprice) throw "--gasprice required (in GWEI)";
// if (typeof argv.gasprice !== "number") throw "--gasprice must be a number";
// if (argv.gasprice < 1 || argv.gasprice > 1000) throw "--gasprice must be between 1 and 1000 (GWEI)";
// const libraryAddress = argv.libraryAddress ? argv.libraryAddress : "0x0000000000000000000000000000000000000000";

function getAbi(abiName) {
    const filePath = path.join("./", "contracts", `${abiName}.json`);
    const abiFile = JSON.parse(fs.readFileSync(filePath).toString());
    return abiFile.abi;
}

// Wrap everything in an async function to allow the use of async/await.
export default async function deployAthlete(synthName, synthSymbol) {
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

  const empCreator = new web3.eth.Contract(
    getAbi("ExpiringMultiPartyCreator"),
    "0x35Cf5274c927d7F708465780cCbca38652996eDa"
  );

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

deployAthlete("TestLebron James", "tLBJ").catch((e) => {
  console.error(e);
  process.exit(1);
});