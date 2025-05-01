import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { contractABI } from "./abi";
import { contractAddress } from "./contractAddress";

function App() {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [contracts, setContracts] = useState([]);
  const [government, setGovernment] = useState(null);

  useEffect(() => {
    loadBlockchainData();
  }, []);

  async function loadBlockchainData() {
    if (window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      await window.ethereum.request({ method: "eth_requestAccounts" });

      const signer = await provider.getSigner();
      const userAddress = await signer.getAddress();
      setAccount(userAddress);

      const govContract = new ethers.Contract(contractAddress, contractABI, signer);
      setContract(govContract);

      const govAddress = await govContract.government();
      setGovernment(govAddress);

      const count = Number(await govContract.contractCount());
      const all = [];
      for (let i = 0; i < count; i++) {
        const data = await govContract.contracts(i);
        all.push(data);
      }
      setContracts(all);
    }
  }

  async function createContract(e) {
    e.preventDefault();
    const supplier = e.target.supplier.value;
    const description = e.target.description.value;
    const amount = ethers.parseEther(e.target.amount.value);
    await contract.createContract(supplier, description, { value: amount });
    loadBlockchainData();
  }

  async function markCompleted(id) {
    await contract.markCompleted(id);
    loadBlockchainData();
  }

  async function releasePayment(id) {
    await contract.releasePayment(id);
    loadBlockchainData();
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Government Procurement DApp</h1>
      <p>Connected Account: <strong>{account}</strong></p>
      <p>Role: <strong>{account === government ? "Government" : "Supplier"}</strong></p>

      {account === government && (
        <form onSubmit={createContract}>
          <h2>Create Contract</h2>
          <input name="supplier" placeholder="Supplier Address" required />
          <input name="description" placeholder="Contract Description" required />
          <input name="amount" placeholder="ETH Amount" step="0.01" type="number" required />
          <button type="submit">Create Contract</button>
        </form>
      )}

      <h2>All Contracts</h2>
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>ID</th>
            <th>Supplier</th>
            <th>Description</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {contracts.map((c, i) => (
            <tr key={i}>
              <td>{c.id.toString()}</td>
              <td>{c.supplier}</td>
              <td>{c.description}</td>
              <td>{ethers.formatEther(c.amount)} ETH</td>
              <td>{["Created", "Completed", "Paid"][Number(c.status)]}</td>
              <td>
                {account === c.supplier && Number(c.status) === 0 && (
                  <button onClick={() => markCompleted(c.id)}>Mark Completed</button>
                )}
                {account === government && Number(c.status) === 1 && (
                  <button onClick={() => releasePayment(c.id)}>Release Payment</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
