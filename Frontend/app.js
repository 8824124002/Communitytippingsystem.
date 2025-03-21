// Initialize Web3 and contract details
let web3;
let contract;
let account;
const contractAddress = "0xF39aDe3CBe0EE51A1A551adC01c598aa8F440251";  // Replace with the deployed contract address
const contractABI = [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "recipient",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "TipSent",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "balances",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "changeOwner",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "user",
				"type": "address"
			}
		],
		"name": "checkBalance",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "recipient",
				"type": "address"
			}
		],
		"name": "tip",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "withdraw",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}

];

window.addEventListener('load', async () => {
    // Check if Web3 is injected (MetaMask)
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' });

        const networkId = await web3.eth.net.getId();
        contract = new web3.eth.Contract(contractABI, contractAddress);

        account = (await web3.eth.getAccounts())[0];

        // Set the default account in the UI
        document.getElementById('balance').textContent = await getBalance(account);
    } else {
        alert("Please install MetaMask to use this feature");
    }
});

// Get balance of a specific address
async function getBalance(address) {
    return await contract.methods.checkBalance(address).call();
}

// Send Tip
document.getElementById('tipButton').addEventListener('click', async () => {
    const recipientAddress = document.getElementById('recipientAddress').value;
    const tipAmount = document.getElementById('tipAmount').value;

    if (!recipientAddress || !tipAmount) {
        alert("Please fill in all fields.");
        return;
    }

    try {
        const tx = await contract.methods.tip(recipientAddress).send({
            from: account,
            value: web3.utils.toWei(tipAmount, 'ether')
        });
        alert(`Tip sent to ${recipientAddress} successfully!`);
    } catch (error) {
        console.error(error);
        alert("An error occurred while sending the tip.");
    }
});

// Withdraw Funds
document.getElementById('withdrawButton').addEventListener('click', async () => {
    try {
        const tx = await contract.methods.withdraw().send({ from: account });
        alert("Withdrawal successful!");
        document.getElementById('balance').textContent = await getBalance(account);
    } catch (error) {
        console.error(error);
        alert("An error occurred while withdrawing funds.");
    }
});

// Check balance
document.getElementById('checkBalanceButton').addEventListener('click', async () => {
    const balance = await getBalance(account);
    document.getElementById('balance').textContent = web3.utils.fromWei(balance, 'ether');
});
