fs = require('fs');

Web3 = require('web3')
web3 = new Web3("http://localhost:8545")

bytecode = fs.readFileSync('Voting_sol_Voting.bin').toString()

abi = JSON.parse(fs.readFileSync('Voting_sol_Voting.abi').toString())

deployedContract = new web3.eth.Contract(abi)

listOfCandidates = ['Rama', 'Nick', 'Jose']

deployedContract.deploy({
    data: bytecode,
    arguments: [listOfCandidates.map(name => web3.utils.asciiToHex(name))]
}).send({
    from: '0xB7fd2f9CF208916CD3270dDb65E2E1F5449a47d1',
    gas: 1500000,
    gasPrice: web3.utils.toWei('0.00003', 'ether')
}).then((newContractInstance) => {
    deployedContract.options.address = newContractInstance.options.address
    console.log(newContractInstance.options.address)
});
