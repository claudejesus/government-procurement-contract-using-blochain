
// import React, { useEffect, useState } from "react";
// import { ethers } from "ethers";
// import { contractABI } from "./abi";
// import { contractAddress } from "./contractAddress";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "bootstrap/dist/js/bootstrap.bundle.min.js";

// function App() {
//   const [account, setAccount] = useState(null);
//   const [contract, setContract] = useState(null);
//   const [contracts, setContracts] = useState([]);
//   const [government, setGovernment] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [activeTab, setActiveTab] = useState("all");
//   const [showCancelModal, setShowCancelModal] = useState(false);
//   const [selectedContractId, setSelectedContractId] = useState(null);

//   useEffect(() => {
//     loadBlockchainData();
//   }, []);

//   async function loadBlockchainData() {
//     try {
//       setLoading(true);
//       setError(null);

//       if (!window.ethereum) {
//         throw new Error("Please install MetaMask");
//       }

//       const provider = new ethers.BrowserProvider(window.ethereum);
//       await provider.send("eth_requestAccounts", []);
//       const signer = await provider.getSigner();
//       const userAddress = await signer.getAddress();
//       setAccount(userAddress);

//       const govContract = new ethers.Contract(contractAddress, contractABI, signer);
//       setContract(govContract);

//       const govAddr = await govContract.government();
//       setGovernment(govAddr);

//       const count = Number(await govContract.contractCount());
//       const all = [];
//       for (let i = 0; i < count; i++) {
//         const data = await govContract.contracts(i);
//         all.push(data);
//       }
//       setContracts(all);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   }

//   async function createContract(e) {
//     e.preventDefault();
//     try {
//       setLoading(true);
//       const supplier = e.target.supplier.value;
//       const description = e.target.description.value;
//       const amount = ethers.parseEther(e.target.amount.value);
//       const tx = await contract.createContract(supplier, description, { value: amount });
//       await tx.wait();
//       e.target.reset();
//       loadBlockchainData();
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   }

//   async function markCompleted(id) {
//     try {
//       setLoading(true);
//       const tx = await contract.markCompleted(id);
//       await tx.wait();
//       loadBlockchainData();
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   }

//   async function approveContract(id) {
//     try {
//       setLoading(true);
//       const tx = await contract.verifyContract(id);
//       await tx.wait();
//       loadBlockchainData();
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   }

//   async function cancelContract(id) {
//     try {
//       setLoading(true);
//       const tx = await contract.cancelContract(id);
//       await tx.wait();
//       setShowCancelModal(false);
//       loadBlockchainData();
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   }

//   async function releasePayment(id) {
//     try {
//       setLoading(true);
//       const tx = await contract.releasePayment(id);
//       await tx.wait();
//       loadBlockchainData();
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   }

//   const handleCancelClick = (id) => {
//     setSelectedContractId(id);
//     setShowCancelModal(true);
//   };

//   const filteredContracts = contracts
//     .filter(c => {
//       return account === government || c.supplier.toLowerCase() === account.toLowerCase();
//     })
//     .filter(c => {
//       const status = Number(c.status);
//       if (activeTab === "all") return true;
//       if (activeTab === "created") return status === 0;
//       if (activeTab === "completed") return status === 1;
//       if (activeTab === "verified") return status === 2;
//       if (activeTab === "paid") return status === 3;
//       if (activeTab === "cancelled") return status === 4;
//       return true;
//     });

//   const statusBadge = (status) => {
//     const statusMap = {
//       0: { text: "Created", class: "bg-primary" },
//       1: { text: "Completed", class: "bg-warning text-dark" },
//       2: { text: "Verified", class: "bg-info" },
//       3: { text: "Paid", class: "bg-success" },
//       4: { text: "Cancelled", class: "bg-danger" }
//     };
//     const statusInfo = statusMap[Number(status)];
//     return <span className={`badge ${statusInfo?.class}`}>{statusInfo?.text || "Unknown"}</span>;
//   };

//   return (
//     <div className="container py-4">
//       <h2 className="mb-3">Government Procurement DApp</h2>

//       <div className="mb-3">
//         <strong>Account:</strong> {account} <br />
//         <strong>Role:</strong> {account === government ? "Government" : "Supplier"}
//       </div>

//       {error && <div className="alert alert-danger">{error}</div>}

//       {account === government && (
//         <form onSubmit={createContract} className="mb-4">
//           <input name="supplier" placeholder="Supplier Address" className="form-control mb-2" required />
//           <input name="description" placeholder="Description" className="form-control mb-2" required />
//           <input name="amount" placeholder="ETH Amount" type="number" step="0.01" className="form-control mb-2" required />
//           <button type="submit" className="btn btn-primary" disabled={loading}>
//             {loading ? "Creating..." : "Create Contract"}
//           </button>
//         </form>
//       )}

//       <div className="btn-group mb-3">
//         {["all", "created", "completed", "verified", "paid", "cancelled"].map(tab => (
//           <button
//             key={tab}
//             className={`btn ${activeTab === tab ? "btn-primary" : "btn-outline-primary"}`}
//             onClick={() => setActiveTab(tab)}
//           >
//             {tab.charAt(0).toUpperCase() + tab.slice(1)}
//           </button>
//         ))}
//       </div>

//       {loading ? (
//         <p>Loading...</p>
//       ) : filteredContracts.length === 0 ? (
//         <p>No contracts found.</p>
//       ) : (
//         <table className="table table-bordered table-sm">
//           <thead>
//             <tr>
//               <th>ID</th>
//               <th>Supplier</th>
//               <th>Description</th>
//               <th>Amount</th>
//               <th>Status</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredContracts.map((c) => (
//               <tr key={c.id.toString()}>
//                 <td>{c.id.toString()}</td>
//                 <td>{c.supplier}</td>
//                 <td>{c.description}</td>
//                 <td>{ethers.formatEther(c.amount)} ETH</td>
//                 <td>{statusBadge(c.status)}</td>
//                 <td>
//                   {account === c.supplier && Number(c.status) === 0 && (
//                     <button className="btn btn-warning btn-sm me-1" onClick={() => markCompleted(c.id)} disabled={loading}>
//                       Complete
//                     </button>
//                   )}
//                   {account === government && Number(c.status) === 1 && (
//                     <button className="btn btn-info btn-sm me-1" onClick={() => approveContract(c.id)} disabled={loading}>
//                       Verify
//                     </button>
//                   )}
//                   {account === government && Number(c.status) === 2 && (
//                     <button className="btn btn-success btn-sm me-1" onClick={() => releasePayment(c.id)} disabled={loading}>
//                       Pay
//                     </button>
//                   )}
//                   {(account === government || account === c.supplier) && Number(c.status) < 3 && (
//                     <button className="btn btn-danger btn-sm" onClick={() => handleCancelClick(c.id)} disabled={loading}>
//                       Cancel
//                     </button>
//                   )}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}

//       {/* Cancel Confirmation Modal */}
//       <div className={`modal fade ${showCancelModal ? "show d-block" : ""}`} style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
//         <div className="modal-dialog">
//           <div className="modal-content">
//             <div className="modal-header">
//               <h5 className="modal-title">Confirm Cancellation</h5>
//               <button type="button" className="btn-close" onClick={() => setShowCancelModal(false)}></button>
//             </div>
//             <div className="modal-body">
//               Are you sure you want to cancel this contract?
//             </div>
//             <div className="modal-footer">
//               <button className="btn btn-secondary" onClick={() => setShowCancelModal(false)}>No</button>
//               <button className="btn btn-danger" onClick={() => cancelContract(selectedContractId)} disabled={loading}>
//                 {loading ? "Cancelling..." : "Yes, Cancel"}
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default App;


import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { contractABI } from "./abi";
import { contractAddress } from "./contractAddress";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function App() {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [contracts, setContracts] = useState([]);
  const [government, setGovernment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedContractId, setSelectedContractId] = useState(null);

  useEffect(() => {
    loadBlockchainData();
  }, []);

  async function loadBlockchainData() {
    try {
      setLoading(true);
      setError(null);
      
      if (!window.ethereum) {
        throw new Error("Please install MetaMask to use this application");
      }

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
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function createContract(e) {
    e.preventDefault();
    try {
      setLoading(true);
      const supplier = e.target.supplier.value;
      const description = e.target.description.value;
      const amount = ethers.parseEther(e.target.amount.value);
      const tx = await contract.createContract(supplier, description, { value: amount });
      await tx.wait();
      await loadBlockchainData();
      e.target.reset();
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function markCompleted(id) {
    try {
      setLoading(true);
      const tx = await contract.markCompleted(id);
      await tx.wait();
      await loadBlockchainData();
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function verifyContract(id) {
    try {
      setLoading(true);
      const tx = await contract.verifyContract(id);
      await tx.wait();
      await loadBlockchainData();
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function cancelContract(id) {
    try {
      setLoading(true);
      const tx = await contract.cancelContract(id);
      await tx.wait();
      setShowCancelModal(false);
      await loadBlockchainData();
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function releasePayment(id) {
    try {
      setLoading(true);
      const tx = await contract.releasePayment(id);
      await tx.wait();
      await loadBlockchainData();
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // const filteredContracts = contracts.filter(contract => {
  //   if (activeTab === "all") return true;
  //   if (activeTab === "created") return Number(contract.status) === 0;
  //   if (activeTab === "completed") return Number(contract.status) === 1;
  //   if (activeTab === "verified") return Number(contract.status) === 2;
  //   if (activeTab === "paid") return Number(contract.status) === 3;
  //   if (activeTab === "cancelled") return Number(contract.status) === 4;
  //   return true;
  // });


  const filteredContracts = contracts
    .filter(c => {
      return account === government || c.supplier.toLowerCase() === account.toLowerCase();
    })
    .filter(c => {
      const status = Number(c.status);
      if (activeTab === "all") return true;
      if (activeTab === "created") return status === 0;
      if (activeTab === "completed") return status === 1;
      if (activeTab === "verified") return status === 2;
      if (activeTab === "paid") return status === 3;
      if (activeTab === "cancelled") return status === 4;
      return true;
    });

    
  const statusBadge = (status) => {
    const statusMap = {
      0: { text: "Created", class: "bg-primary" },
      1: { text: "Completed", class: "bg-warning text-dark" },
      2: { text: "Verified", class: "bg-info" },
      3: { text: "Paid", class: "bg-success" },
      4: { text: "Cancelled", class: "bg-danger" }
    };
    const statusInfo = statusMap[Number(status)];
    return <span className={`badge ${statusInfo.class}`}>{statusInfo.text}</span>;
  };

  const handleCancelClick = (id) => {
    setSelectedContractId(id);
    setShowCancelModal(true);
  };

  return (
    <div className="container-fluid py-4 bg-light min-vh-100">
      {/* Header */}
      <div className="row mb-4">
        <div className="col-12">
          <h1 className="text-center text-primary mb-3">
            Government Procurement DApp
          </h1>
          <p className="text-center text-muted">
            A decentralized application for transparent government procurement processes
          </p>
        </div>
      </div>

      {/* Account Info */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="card-title">Account Information</h5>
                  <p className="mb-1">
                    <strong>Connected as:</strong> {account || "Not connected"}
                  </p>
                </div>
                <span className={`badge ${account === government ? "bg-success" : "bg-info"}`}>
                  {account === government ? "Government" : "Supplier"}
                </span>
              </div>
              {error && (
                <div className="alert alert-danger mt-3">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  {error}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="row">
        {/* Create Contract Form (Government Only) */}
        {account === government && (
          <div className="col-lg-4 mb-4">
            <div className="card shadow-sm h-100">
              <div className="card-header bg-primary text-white">
                <h5 className="mb-0">Create New Contract</h5>
              </div>
              <div className="card-body">
                <form onSubmit={createContract}>
                  <div className="mb-3">
                    <label className="form-label">Supplier Address</label>
                    <input
                      type="text"
                      className="form-control"
                      name="supplier"
                      placeholder="0x..."
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      name="description"
                      rows="3"
                      required
                    ></textarea>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Amount (ETH)</label>
                    <div className="input-group">
                      <input
                        type="number"
                        className="form-control"
                        name="amount"
                        step="0.01"
                        min="0.01"
                        placeholder="0.00"
                        required
                      />
                      <span className="input-group-text">ETH</span>
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary w-100"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Creating...
                      </>
                    ) : (
                      "Create Contract"
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Contracts List */}
        <div className={account === government ? "col-lg-8" : "col-12"}>
          <div className="card shadow-sm">
            <div className="card-header bg-white">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Contracts</h5>
                <div className="btn-group" role="group">
                  {["all", "created", "completed", "verified", "paid", "cancelled"].map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      className={`btn btn-sm ${activeTab === tab ? "btn-primary" : "btn-outline-primary"}`}
                      onClick={() => setActiveTab(tab)}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="card-body">
              {loading ? (
                <div className="text-center py-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-2">Loading contracts...</p>
                </div>
              ) : filteredContracts.length === 0 ? (
                <div className="text-center py-4">
                  <i className="bi bi-file-earmark-text fs-1 text-muted"></i>
                  <p className="mt-2 text-muted">No contracts found</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead className="table-light">
                      <tr>
                        <th>ID</th>
                        <th>Supplier</th>
                        <th>Description</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredContracts.map((c) => (
                        <tr key={c.id.toString()}>
                          <td>{c.id.toString()}</td>
                          <td className="text-truncate" style={{maxWidth: "150px"}}>
                            {c.supplier}
                          </td>
                          <td>{c.description}</td>
                          <td>{ethers.formatEther(c.amount)} ETH</td>
                          <td>{statusBadge(c.status)}</td>
                          <td>
                            <div className="d-flex gap-1">
                              {account === c.supplier && Number(c.status) === 0 && (
                                <button
                                  className="btn btn-warning btn-sm"
                                  onClick={() => markCompleted(c.id)}
                                  disabled={loading}
                                >
                                  Complete
                                </button>
                              )}
                              {account === government && Number(c.status) === 1 && (
                                <button
                                  className="btn btn-info btn-sm"
                                  onClick={() => verifyContract(c.id)}
                                  disabled={loading}
                                >
                                  Verify
                                </button>
                              )}
                              {account === government && Number(c.status) === 2 && (
                                <button
                                  className="btn btn-success btn-sm"
                                  onClick={() => releasePayment(c.id)}
                                  disabled={loading}
                                >
                                  Pay
                                </button>
                              )}
                              {(account === government || account === c.supplier) && 
                                (Number(c.status) === 0 || Number(c.status) === 1) && (
                                <button
                                  className="btn btn-danger btn-sm"
                                  onClick={() => handleCancelClick(c.id)}
                                  disabled={loading}
                                >
                                  Cancel
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      <div className={`modal fade ${showCancelModal ? "show d-block" : ""}`} style={{backgroundColor: "rgba(0,0,0,0.5)"}}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Confirm Cancellation</h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowCancelModal(false)}
              ></button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to cancel this contract?</p>
              <p className="fw-bold">This action cannot be undone.</p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowCancelModal(false)}
              >
                No, Go Back
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => cancelContract(selectedContractId)}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-1"></span>
                    Cancelling...
                  </>
                ) : (
                  "Yes, Cancel Contract"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-5 pt-3 text-center text-muted">
        <p>Government Procurement DApp - Developed by claude</p>
      </footer>
    </div>
  );
}

export default App;