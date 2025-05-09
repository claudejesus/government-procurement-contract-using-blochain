


// import React, { useEffect, useState, useMemo } from "react";
// import { ethers } from "ethers";
// import { contractABI } from "./abi";
// import { contractAddress } from "./contractAddress";
// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// function App() {
//   const [account, setAccount] = useState(null);
//   const [contract, setContract] = useState(null);
//   const [contracts, setContracts] = useState([]);
//   const [government, setGovernment] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [activeTab, setActiveTab] = useState("all");
//   const [setShowCancelModal] = useState(false);

//   useEffect(() => {
//     loadBlockchainData();
//   }, []);

//   async function loadBlockchainData() {
//     try {
//       setLoading(true);
//       setError(null);

//       if (!window.ethereum) throw new Error("Please install MetaMask");

//       const provider = new ethers.BrowserProvider(window.ethereum);
//       await window.ethereum.request({ method: "eth_requestAccounts" });
//       const signer = await provider.getSigner();
//       const userAddress = await signer.getAddress();
//       setAccount(userAddress);

//       const govContract = new ethers.Contract(contractAddress, contractABI, signer);
//       setContract(govContract);

//       const govAddress = await govContract.government();
//       setGovernment(govAddress);

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
//       await loadBlockchainData();
//       e.target.reset();
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
//       await loadBlockchainData();
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   }

//   async function approveContract(id) {
//     try {
//       setLoading(true);
//       const tx = await contract.approveContract(id);
//       await tx.wait();
//       await loadBlockchainData();
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
//       await loadBlockchainData();
//       setShowCancelModal(false);
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
//       await loadBlockchainData();
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   }

//   const statusBadge = (status) => {
//     const map = {
//       0: { text: "Created", class: "bg-primary" },
//       1: { text: "Completed", class: "bg-warning text-dark" },
//       2: { text: "Verified", class: "bg-info" },
//       3: { text: "Paid", class: "bg-success" },
//       4: { text: "Cancelled", class: "bg-danger" }
//     };
//     return <span className={`badge ${map[status]?.class}`}>{map[status]?.text}</span>;
//   };

//   const filteredContracts = useMemo(() => {
//     return contracts.filter(c => {
//       const isGov = account?.toLowerCase() === government?.toLowerCase();
//       const isMine = c.supplier.toLowerCase() === account?.toLowerCase();
//       if (!isGov && !isMine) return false;
//       const s = Number(c.status);
//       if (activeTab === "all") return true;
//       if (activeTab === "created") return s === 0;
//       if (activeTab === "completed") return s === 1;
//       if (activeTab === "verified") return s === 2;
//       if (activeTab === "paid") return s === 3;
//       return true;
//     });
//   }, [contracts, account, government, activeTab]);

//   return (
//     <div className="container mt-4">
//       <h2 className="text-center">Government Procurement DApp</h2>
//       <p className="text-center small">Logged in as: {account}</p>

//       {error && <div className="alert alert-danger">{error}</div>}

//       {account === government && (
//         <form onSubmit={createContract} className="card card-body mb-3">
//           <h5>Create New Contract</h5>
//           <input type="text" name="supplier" placeholder="Supplier address" className="form-control mb-2" required />
//           <input type="text" name="description" placeholder="Description" className="form-control mb-2" required />
//           <input type="number" name="amount" placeholder="Amount in ETH" className="form-control mb-2" step="0.01" required />
//           <button className="btn btn-primary" disabled={loading}>{loading ? 'Creating...' : 'Create Contract'}</button>
//         </form>
//       )}

//       <div className="mb-3">
//         {['all', 'created', 'completed', 'verified', 'paid'].map(tab => (
//           <button
//             key={tab}
//             className={`btn btn-sm me-1 ${activeTab === tab ? 'btn-primary' : 'btn-outline-primary'}`}
//             onClick={() => setActiveTab(tab)}
//           >
//             {tab.charAt(0).toUpperCase() + tab.slice(1)}
//           </button>
//         ))}
//       </div>

//       <div className="table-responsive">
//         <table className="table table-bordered">
//           <thead>
//             <tr>
//               <th>#</th>
//               <th>Description</th>
//               <th>Supplier</th>
//               <th>Status</th>
//               <th>Amount</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredContracts.map((c, i) => (
//               <tr key={i}>
//                 <td>{i}</td>
//                 <td>{c.description}</td>
//                 <td>{c.supplier}</td>
//                 <td>{statusBadge(Number(c.status))}</td>
//                 <td>{ethers.formatEther(c.amount)} ETH</td>
//                 <td>
//                   {Number(c.status) === 0 && account === government && (
//                     <>
//                       <button className="btn btn-success btn-sm me-1" onClick={() => approveContract(i)}>Approve</button>
//                       <button className="btn btn-danger btn-sm" onClick={() => cancelContract(i)}>Cancel</button>
//                     </>
//                   )}
//                   {Number(c.status) === 1 && account === government && (
//                     <button className="btn btn-info btn-sm" onClick={() => releasePayment(i)}>Release</button>
//                   )}
//                   {Number(c.status) === 0 && account !== government && (
//                     <button className="btn btn-warning btn-sm" onClick={() => markCompleted(i)}>Mark Completed</button>
//                   )}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

// export default App;


// import React, { useEffect, useState } from "react";
// import { ethers } from "ethers";
// import { contractABI } from "./abi";
// import { contractAddress } from "./contractAddress";
// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap/dist/js/bootstrap.bundle.min.js';

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
//         throw new Error("Please install MetaMask to use this application");
//       }

//       const provider = new ethers.BrowserProvider(window.ethereum);
//       await window.ethereum.request({ method: "eth_requestAccounts" });

//       const signer = await provider.getSigner();
//       const userAddress = await signer.getAddress();
//       setAccount(userAddress);

//       const govContract = new ethers.Contract(contractAddress, contractABI, signer);
//       setContract(govContract);

//       const govAddress = await govContract.government();
//       setGovernment(govAddress);

//       const count = Number(await govContract.contractCount());
//       const all = [];
//       for (let i = 0; i < count; i++) {
//         const data = await govContract.contracts(i);
//         all.push(data);
//       }
//       setContracts(all);
//     } catch (err) {
//       console.error(err);
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
//       await loadBlockchainData();
//       e.target.reset();
//     } catch (err) {
//       console.error(err);
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
//       await loadBlockchainData();
//     } catch (err) {
//       console.error(err);
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
//       await loadBlockchainData();
//     } catch (err) {
//       console.error(err);
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
//       await loadBlockchainData();
//       setShowCancelModal(false);
//     } catch (err) {
//       console.error(err);
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
//       await loadBlockchainData();
//     } catch (err) {
//       console.error(err);
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   }

//   const filteredContracts = contracts.filter(contract => {
//     if (activeTab === "all") return true;
//     if (activeTab === "created") return Number(contract.status) === 0;
//     if (activeTab === "completed") return Number(contract.status) === 1;
//     if (activeTab === "verified") return Number(contract.status) === 2;
//     if (activeTab === "paid") return Number(contract.status) === 3;
//     return true;
//   });

//   const statusBadge = (status) => {
//     const statusMap = {
//       0: { text: "Created", class: "bg-primary" },
//       1: { text: "Completed", class: "bg-warning text-dark" },
//       2: { text: "Verified", class: "bg-info" },
//       3: { text: "Paid", class: "bg-success" },
//       4: { text: "Cancelled", class: "bg-danger" }
//     };
  
//     const statusInfo = statusMap[Number(status)];
  
//     if (!statusInfo) {
//       return <span className="badge bg-secondary">Unknown</span>;
//     }
  
//     return <span className={`badge ${statusInfo.class}`}>{statusInfo.text}</span>;
//   };

//   const handleCancelClick = (id) => {
//     setSelectedContractId(id);
//     setShowCancelModal(true);
//   };

//   return (
//     <div className="min-vh-100 d-flex flex-column bg-light" style={{ padding: '0 15px' }}>
//       {/* Cancel Confirmation Modal */}
//       <div className={`modal fade ${showCancelModal ? 'show d-block' : ''}`} tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
//         <div className="modal-dialog modal-dialog-centered">
//           <div className="modal-content">
//             <div className="modal-header">
//               <h5 className="modal-title">Confirm Cancellation</h5>
//               <button type="button" className="btn-close" onClick={() => setShowCancelModal(false)}></button>
//             </div>
//             <div className="modal-body">
//               <p>Are you sure you want to cancel this contract?</p>
//               <p className="fw-bold">This action cannot be undone.</p>
//             </div>
//             <div className="modal-footer">
//               <button 
//                 type="button" 
//                 className="btn btn-secondary" 
//                 onClick={() => setShowCancelModal(false)}
//                 disabled={loading}
//               >
//                 No, Go Back
//               </button>
//               <button 
//                 type="button" 
//                 className="btn btn-danger" 
//                 onClick={() => cancelContract(selectedContractId)}
//                 disabled={loading}
//               >
//                 {loading ? (
//                   <>
//                     <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
//                     Processing...
//                   </>
//                 ) : 'Yes, Cancel Contract'}
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Header */}
//       <header className="mb-3 text-center">
//         <h1 className="h3 fw-bold text-primary mb-1">Government Procurement DApp</h1>
//         <p className="small text-muted">A decentralized application for transparent government procurement processes</p>
//       </header>

//       {/* Main Content */}
//       <div className="flex-grow-1">
//         {/* Connection Status Card */}
//         <div className="card shadow-sm mb-3">
//           <div className="card-body p-2">
//             <div className="d-flex flex-column flex-md-row justify-content-between align-items-center">
//               <div className="mb-1 mb-md-0 text-center text-md-start">
//                 <h5 className="card-title mb-1 small">Account Information</h5>
//                 <p className="mb-0 small">
//                   <span className="text-muted">Connected as:</span> 
//                   <strong className="text-truncate d-inline-block ms-1" style={{maxWidth: "335px"}}>
//                     {account || "Not connected"}
//                   </strong>
//                 </p>
//               </div>
//               <span className={`badge ${account === government ? "bg-success" : "bg-info"}`}>
//                 {account === government ? "Government" : "Supplier"}
//               </span>
//             </div>
//             {error && (
//               <div className="alert alert-danger mt-2 mb-0 p-2 small">
//                 <i className="bi bi-exclamation-triangle-fill me-2"></i>
//                 {error}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Contracts Section */}
//         <div className="row g-2">
//           {account === government && (
//             <div className="col-lg-3">
//               <div className="card shadow-sm h-100">
//                 <div className="card-header bg-primary text-white p-2">
//                   <h5 className="mb-0 small">Create New Contract</h5>
//                 </div>
//                 <div className="card-body p-2">
//                   <form onSubmit={createContract}>
//                     <div className="mb-2">
//                       <label htmlFor="supplier" className="form-label small">Supplier Address</label>
//                       <input 
//                         type="text" 
//                         className="form-control form-control-sm" 
//                         id="supplier" 
//                         name="supplier" 
//                         placeholder="0x...." 
//                         required 
//                       />
//                     </div>
//                     <div className="mb-2">
//                       <label htmlFor="description" className="form-label small">Description</label>
//                       <textarea 
//                         className="form-control form-control-sm" 
//                         id="description" 
//                         name="description" 
//                         rows="2" 
//                         required
//                       ></textarea>
//                     </div>
//                     <div className="mb-2">
//                       <label htmlFor="amount" className="form-label small">Amount (ETH)</label>
//                       <div className="input-group input-group-sm">
//                         <input 
//                           type="number" 
//                           className="form-control" 
//                           id="amount" 
//                           name="amount" 
//                           step="0.01" 
//                           min="0.01" 
//                           placeholder="0.00" 
//                           required 
//                         />
//                         <span className="input-group-text">ETH</span>
//                       </div>
//                     </div>
//                     <button type="submit" className="btn btn-primary btn-sm w-100 mt-1" disabled={loading}>
//                       {loading ? (
//                         <>
//                           <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
//                           Processing...
//                         </>
//                       ) : "Create Contract"}
//                     </button>
//                   </form>
//                 </div>
//               </div>
//             </div>
//           )}

//           <div className={account === government ? "col-lg-9" : "col-12"}>
//             <div className="card shadow-sm">
//               <div className="card-header bg-white p-2 d-flex flex-column flex-md-row justify-content-between align-items-center">
//                 <h5 className="mb-1 mb-md-0 small">Contracts</h5>
//                 <div className="btn-group btn-group-sm" role="group">
//                   <button 
//                     type="button" 
//                     className={`btn ${activeTab === "all" ? "btn-primary" : "btn-outline-primary"}`}
//                     onClick={() => setActiveTab("all")}
//                   >
//                     All
//                   </button>
//                   <button 
//                     type="button" 
//                     className={`btn ${activeTab === "created" ? "btn-primary" : "btn-outline-primary"}`}
//                     onClick={() => setActiveTab("created")}
//                   >
//                     Created
//                   </button>
//                   <button 
//                     type="button" 
//                     className={`btn ${activeTab === "completed" ? "btn-primary" : "btn-outline-primary"}`}
//                     onClick={() => setActiveTab("completed")}
//                   >
//                     Completed
//                   </button>
//                   <button 
//                     type="button" 
//                     className={`btn ${activeTab === "verified" ? "btn-primary" : "btn-outline-primary"}`}
//                     onClick={() => setActiveTab("verified")}
//                   >
//                     Verified
//                   </button>
//                   <button 
//                     type="button" 
//                     className={`btn ${activeTab === "paid" ? "btn-primary" : "btn-outline-primary"}`}
//                     onClick={() => setActiveTab("paid")}
//                   >
//                     Paid
//                   </button>
//                 </div>
//               </div>
//               <div className="card-body p-0">
//                 {loading ? (
//                   <div className="text-center py-3">
//                     <div className="spinner-border spinner-border-sm text-primary" role="status">
//                       <span className="visually-hidden">Loading...</span>
//                     </div>
//                     <p className="mt-2 small">Loading contracts...</p>
//                   </div>
//                 ) : filteredContracts.length === 0 ? (
//                   <div className="text-center py-3">
//                     <i className="bi bi-file-earmark-text fs-4 text-muted"></i>
//                     <p className="mt-2 small text-muted">No contracts found</p>
//                   </div>
//                 ) : (
//                   <div className="table-responsive">
//                     <table className="table table-sm table-hover mb-0">
//                       <thead className="table-light">
//                         <tr>
//                           <th className="small">ID</th>
//                           <th className="small">Supplier</th>
//                           <th className="small">Description</th>
//                           <th className="small">Amount</th>
//                           <th className="small">Status</th>
//                           <th className="small">Actions</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {filteredContracts.map((c, i) => (
//                           <tr key={i}>
//                             <td className="align-middle small">{c.id.toString()}</td>
//                             <td className="align-middle small text-truncate" style={{maxWidth: "170px"}}>
//                               <span className="d-md-none text-muted">Supplier: </span>
//                               {c.supplier}
//                             </td>
//                             <td className="align-middle small">
//                               <span className="d-md-none text-muted">Desc: </span>
//                               {c.description.length > 40 ? `${c.description.substring(0, 40)}...` : c.description}
//                             </td>
//                             <td className="align-middle small">
//                               <span className="d-md-none text-muted">Amt: </span>
//                               <span className="fw-bold">{ethers.formatEther(c.amount)} ETH</span>
//                             </td>
//                             <td className="align-middle">
//                               {statusBadge(c.status)}
//                             </td>
//                             <td className="align-middle">
//                               <div className="d-flex gap-1">
//                                 {account === government && Number(c.status) === 1 && (
//                                   <button 
//                                     className="btn btn-info btn-sm" 
//                                     onClick={() => approveContract(c.id)}
//                                     disabled={loading}
//                                   >
//                                     <span className="d-none d-md-inline">Verify</span>
//                                     <span className="d-md-none">✓</span>
//                                   </button>
//                                 )}
//                                 {account === government && (Number(c.status) === 0 || Number(c.status) === 1) && (
//                                   <button 
//                                     className="btn btn-danger btn-sm" 
//                                     onClick={() => handleCancelClick(c.id)}
//                                     disabled={loading}
//                                   >
//                                     <span className="d-none d-md-inline">Cancel</span>
//                                     <span className="d-md-none">×</span>
//                                   </button>
//                                 )}
//                                 {account === government && Number(c.status) === 2 && (
//                                   <button 
//                                     className="btn btn-success btn-sm" 
//                                     onClick={() => releasePayment(c.id)}
//                                     disabled={loading}
//                                   >
//                                     <span className="d-none d-md-inline">Pay</span>
//                                     <span className="d-md-none">$</span>
//                                   </button>
//                                 )}
//                                 {account === c.supplier && Number(c.status) === 0 && (
//                                   <>
//                                     <button 
//                                       className="btn btn-warning btn-sm" 
//                                       onClick={() => markCompleted(c.id)}
//                                       disabled={loading}
//                                     >
//                                       <span className="d-none d-md-inline">Complete</span>
//                                       <span className="d-md-none">✓</span>
//                                     </button>
//                                     <button 
//                                       className="btn btn-danger btn-sm" 
//                                       onClick={() => handleCancelClick(c.id)}
//                                       disabled={loading}
//                                     >
//                                       <span className="d-none d-md-inline">Cancel</span>
//                                       <span className="d-md-none">×</span>
//                                     </button>
//                                   </>
//                                 )}
//                               </div>
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Footer */}
//       <footer className="mt-auto py-2 text-center">
//         <p className="text-muted mb-1 small">Government Procurement DApp</p>
//         <p className="small text-muted">Ensure you're connected to the correct network</p>
//       </footer>
//     </div>
//   );
// }

// export default App;



import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { contractABI } from "./abi";
import { contractAddress } from "./contractAddress";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

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
        throw new Error("Please install MetaMask");
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const userAddress = await signer.getAddress();
      setAccount(userAddress);

      const govContract = new ethers.Contract(contractAddress, contractABI, signer);
      setContract(govContract);

      const govAddr = await govContract.government();
      setGovernment(govAddr);

      const count = Number(await govContract.contractCount());
      const all = [];
      for (let i = 0; i < count; i++) {
        const data = await govContract.contracts(i);
        all.push(data);
      }
      setContracts(all);
    } catch (err) {
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
      e.target.reset();
      loadBlockchainData();
    } catch (err) {
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
      loadBlockchainData();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function approveContract(id) {
    try {
      setLoading(true);
      const tx = await contract.verifyContract(id);
      await tx.wait();
      loadBlockchainData();
    } catch (err) {
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
      loadBlockchainData();
    } catch (err) {
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
      loadBlockchainData();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const handleCancelClick = (id) => {
    setSelectedContractId(id);
    setShowCancelModal(true);
  };

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
    return <span className={`badge ${statusInfo?.class}`}>{statusInfo?.text || "Unknown"}</span>;
  };

  return (
    <div className="container py-4">
      <h2 className="mb-3">Government Procurement DApp</h2>

      <div className="mb-3">
        <strong>Account:</strong> {account} <br />
        <strong>Role:</strong> {account === government ? "Government" : "Supplier"}
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {account === government && (
        <form onSubmit={createContract} className="mb-4">
          <input name="supplier" placeholder="Supplier Address" className="form-control mb-2" required />
          <input name="description" placeholder="Description" className="form-control mb-2" required />
          <input name="amount" placeholder="ETH Amount" type="number" step="0.01" className="form-control mb-2" required />
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Creating..." : "Create Contract"}
          </button>
        </form>
      )}

      <div className="btn-group mb-3">
        {["all", "created", "completed", "verified", "paid", "cancelled"].map(tab => (
          <button
            key={tab}
            className={`btn ${activeTab === tab ? "btn-primary" : "btn-outline-primary"}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : filteredContracts.length === 0 ? (
        <p>No contracts found.</p>
      ) : (
        <table className="table table-bordered table-sm">
          <thead>
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
                <td>{c.supplier}</td>
                <td>{c.description}</td>
                <td>{ethers.formatEther(c.amount)} ETH</td>
                <td>{statusBadge(c.status)}</td>
                <td>
                  {account === c.supplier && Number(c.status) === 0 && (
                    <button className="btn btn-warning btn-sm me-1" onClick={() => markCompleted(c.id)} disabled={loading}>
                      Complete
                    </button>
                  )}
                  {account === government && Number(c.status) === 1 && (
                    <button className="btn btn-info btn-sm me-1" onClick={() => approveContract(c.id)} disabled={loading}>
                      Verify
                    </button>
                  )}
                  {account === government && Number(c.status) === 2 && (
                    <button className="btn btn-success btn-sm me-1" onClick={() => releasePayment(c.id)} disabled={loading}>
                      Pay
                    </button>
                  )}
                  {(account === government || account === c.supplier) && Number(c.status) < 3 && (
                    <button className="btn btn-danger btn-sm" onClick={() => handleCancelClick(c.id)} disabled={loading}>
                      Cancel
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Cancel Confirmation Modal */}
      <div className={`modal fade ${showCancelModal ? "show d-block" : ""}`} style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Confirm Cancellation</h5>
              <button type="button" className="btn-close" onClick={() => setShowCancelModal(false)}></button>
            </div>
            <div className="modal-body">
              Are you sure you want to cancel this contract?
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowCancelModal(false)}>No</button>
              <button className="btn btn-danger" onClick={() => cancelContract(selectedContractId)} disabled={loading}>
                {loading ? "Cancelling..." : "Yes, Cancel"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
