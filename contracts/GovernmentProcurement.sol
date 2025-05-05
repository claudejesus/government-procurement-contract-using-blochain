// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract GovernmentProcurement {

    address public government;

    enum Status { Created, Completed, Paid }

    struct Contract {
        uint id;
        address payable supplier;
        string description;
        uint amount;
        Status status;
    }

    uint public contractCount = 0;
    mapping(uint => Contract) public contracts;

    modifier onlyGovernment() {
        require(msg.sender == government, "Only government can perform this action");
        _;
    }

    modifier onlySupplier(uint contractId) {
        require(msg.sender == contracts[contractId].supplier, "Only assigned supplier can perform this action");
        _;
    }

    constructor() {
        government = msg.sender;
    }

    event ContractCreated(uint contractId, address supplier, uint amount);
    event ContractCompleted(uint contractId);
    event PaymentReleased(uint contractId, uint amount);

    // Government creates a new procurement contract
    function createContract(address payable supplier, string memory description) public payable onlyGovernment {
        require(msg.value > 0, "Must send funds with the contract");

        contracts[contractCount] = Contract({
            id: contractCount,
            supplier: supplier,
            description: description,
            amount: msg.value,
            status: Status.Created
        });

        emit ContractCreated(contractCount, supplier, msg.value);
        contractCount++;
    }

    // Supplier marks the contract as completed
    function markCompleted(uint contractId) public onlySupplier(contractId) {
        Contract storage c = contracts[contractId];
        require(c.status == Status.Created, "Contract must be in 'Created' status");

        c.status = Status.Completed;
        emit ContractCompleted(contractId);
    }

    // Government verifies and releases payment
    function releasePayment(uint contractId) public onlyGovernment {
        Contract storage c = contracts[contractId];
        require(c.status == Status.Completed, "Contract must be marked as completed");
        
        c.status = Status.Paid;
        c.supplier.transfer(c.amount);

        emit PaymentReleased(contractId, c.amount);
    }

    // Get contract status
    function getContractStatus(uint contractId) public view returns (Status) {
        return contracts[contractId].status;
    }
}