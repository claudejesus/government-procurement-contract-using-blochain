# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a Hardhat Ignition module that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat ignition deploy ./ignition/modules/GovernmentProcurement.js
```
this file used to run backend part 
terminer 1:  >npx hardhat clean > npx hardhat compile > npx hardhat test   > npx hardhat node
terminer 2:   npx hardhat run scripts/deploy.js --network localhost or  
>  sudo npm install --save-dev @nomicfoundation/hardhat-toolbox
terminer 3: in frontend folder : npm install or sudo npm install  Next  > npm run dev or npm start



## backend  created ++++++++

mkdir fertilizer-tracker
cd fertilizer-tracker
npm init -y
npm install --save-dev hardhat
npx hardhat
npm install --save-dev @nomicfoundation/hardhat-toolbox
add hardhat.config.js
create contracts/FertilizerTracker.sol
create scripts/deploy.js
## runninf++++  termine 1
npm init -y
npm install express dotenv cors ethers
npx hardhat compile
npx hardhat node
# Open new terminal 2
npx hardhat run scripts/deploy.js --network localhost

# Open new terminal 3

## frontend creation ===================================

npm create vite@latest frontend -- --template react
cd frontend
npm install
npm install ethers
npm run dev
=================================


my
 ## Government Procurement DApp ##

<h1>This smart contract outlines a basic procurement process where the government can initiate a contract, the supplier can mark it as completed, and the government can release payment once the contract is verified as completed
</h1>
