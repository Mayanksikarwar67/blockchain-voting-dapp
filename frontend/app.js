const contractAddress = "0x877e43d99D6ec19a8C282240011A6b282aFB91b7"; // Replace with your deployed contract address

const contractABI = [{
  "inputs": [],
  "stateMutability": "nonpayable",
  "type": "constructor"
},
{
  "inputs": [],
  "name": "admin",
  "outputs": [
    {
      "internalType": "address",
      "name": "",
      "type": "address"
    }
  ],
  "stateMutability": "view",
  "type": "function",
  "constant": true
},
{
  "inputs": [
    {
      "internalType": "uint256",
      "name": "",
      "type": "uint256"
    }
  ],
  "name": "candidates",
  "outputs": [
    {
      "internalType": "uint256",
      "name": "id",
      "type": "uint256"
    },
    {
      "internalType": "string",
      "name": "name",
      "type": "string"
    },
    {
      "internalType": "uint256",
      "name": "voteCount",
      "type": "uint256"
    }
  ],
  "stateMutability": "view",
  "type": "function",
  "constant": true
},
{
  "inputs": [],
  "name": "candidatesCount",
  "outputs": [
    {
      "internalType": "uint256",
      "name": "",
      "type": "uint256"
    }
  ],
  "stateMutability": "view",
  "type": "function",
  "constant": true
},
{
  "inputs": [
    {
      "internalType": "address",
      "name": "",
      "type": "address"
    }
  ],
  "name": "hasVoted",
  "outputs": [
    {
      "internalType": "bool",
      "name": "",
      "type": "bool"
    }
  ],
  "stateMutability": "view",
  "type": "function",
  "constant": true
},
{
  "inputs": [
    {
      "internalType": "string",
      "name": "_name",
      "type": "string"
    }
  ],
  "name": "addCandidate",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
},
{
  "inputs": [
    {
      "internalType": "uint256",
      "name": "_candidateId",
      "type": "uint256"
    }
  ],
  "name": "vote",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
},
{
  "inputs": [
    {
      "internalType": "uint256",
      "name": "_id",
      "type": "uint256"
    }
  ],
  "name": "getCandidate",
  "outputs": [
    {
      "internalType": "uint256",
      "name": "",
      "type": "uint256"
    },
    {
      "internalType": "string",
      "name": "",
      "type": "string"
    },
    {
      "internalType": "uint256",
      "name": "",
      "type": "uint256"
    }
  ],
  "stateMutability": "view",
  "type": "function",
  "constant": true
}];

let web3;
let contract;

window.addEventListener("load", async () => {
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    await window.ethereum.request({ method: "eth_requestAccounts" });

    contract = new web3.eth.Contract(contractABI, contractAddress);
    loadCandidates();
  } else {
    alert("Please install MetaMask to use this app.");
  }
});

async function loadCandidates() {
  const count = await contract.methods.candidatesCount().call();
  const container = document.getElementById("candidates");
  container.innerHTML = ""; // Clear old content

  for (let i = 1; i <= count; i++) {
    const candidate = await contract.methods.getCandidate(i).call();

    const card = document.createElement("div");
    card.className = "candidate";
    card.innerHTML = `
      <h3>${candidate[1]}</h3>
      <p>Votes: ${candidate[2]}</p>
      <button onclick="vote(${candidate[0]})">Vote</button>
    `;

    container.appendChild(card);
  }
}


async function vote(id) {
  try {
    const cards = document.querySelectorAll(".candidate");
    cards.forEach(card => card.classList.remove("selected"));

    const selectedCard = Array.from(cards).find(card =>
      card.innerHTML.includes(`vote(${id})`)
    );
    if (selectedCard) selectedCard.classList.add("selected");

    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    await contract.methods.vote(id).send({ from: accounts[0] });

    alert("Vote cast successfully!");
    loadCandidates();
  } catch (err) {
    alert("Error voting: " + err.message);
  }
}



