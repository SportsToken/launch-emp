const Web3 = require('web3');

function getAbi(abiName) {
    const filePath = path.join("./", "contracts", `${abiName}.json`);
    const abiFile = JSON.parse(fs.readFileSync(filePath).toString());
    return abiFile.abi;
}

// function UMAGovernance() {

//  const umaGovernance = new Web3.eth.Contract(getAbi(""));   
// }


// Step 1 new Player Proposed on snapshot


// Step 2 Players with most votes get listed

// Step 3 Create emp for new player with staking

// step 4 mint player tokens into holding wallet