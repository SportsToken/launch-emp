const Web3 = require('web3');


// Add Collateral Address
// AE token address - 0x805624d8a34473f24d66d74c2fb86400c90862a1


function getAbi(abiName) {
    const filePath = path.join("./", "contracts", `${abiName}.json`);
    const abiFile = JSON.parse(fs.readFileSync(filePath).toString());
    return abiFile.abi;
}

async function modifyUMAContracts() {

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
    const AddressWhiteList = new web3.eth.Contract(
        getAbi("AddressWhitelist"),
        "//-- AddressWhiteList --//"
    );



    // CALLING THE WEB3 CONTRACTS
    const { transactionHash } = await AddressWhiteList.methods.
}