const Web3 = require('web3');
const HDWalletProvider = require("@truffle/hdwallet-provider");
const _rpcURL = "https://data-seed-prebsc-1-s1.binance.org:8545/";
const _wsURL = "wss://testnet-dex.binance.org/api/";

// WEB3 DETAILS
const hdwalletOptions = {
    mnemonic: {
      phrase: "off neither whip umbrella skill monitor wall cup style fatal device month",
    },
    providerOrUrl: url,
    addressIndex: 0, // Change this to use the nth account.
  };

const web3 = new Web3(new HDWalletProvider(hdwalletOptions));
const { toWei, utf8ToHex, padRight } = web3.utils;
const accounts = await web3.eth.getAccounts();
if (!accounts || accounts.length === 0)
  throw "No accounts. Must provide mnemonic or node must have unlocked accounts.";
const account = accounts[0];
const networkId = 97; // BSC-Testnet address
const decimasl = 18;

function getAbi(abiName) {
    const filePath = path.join("./", "contracts", `${abiName}.json`);
    const abiFile = JSON.parse(fs.readFileSync(filePath).toString());
    return abiFile.abi;
}
function getAddress(abiName)
{
    const filePath = path.join("./", "contracts", `${abiName}.json`);
    
}

function whitelistTokenAddress(tknAddress)
{
    const AddressWhitelist = new web3.eth.COntract();
}