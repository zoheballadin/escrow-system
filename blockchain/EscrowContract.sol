// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract EscrowContract {
    enum Status {
        Created,
        Locked,
        Released,
        Dispute
    }

    struct Transaction {
        address buyer;
        address seller;
        uint256 amount;
        uint256 disputeDeadline;
        Status status;
        string disputeReasonIPFS;
    }

    mapping(bytes32 => Transaction) private transactions;
    mapping(bytes32 => mapping(address => bool)) private signatures;

    event TransactionCreated(
        bytes32 transactionId,
        address buyer,
        address seller,
        uint256 amount
    );
    event TransactionLocked(bytes32 transactionId);
    event TransactionReleased(bytes32 transactionId);
    event TransactionDispute(bytes32 transactionId, string disputeReasonIPFS);
    event TransactionResolved(bytes32 transactionId, address winner);
    event SignatureAdded(bytes32 transactionId, address signer);

    modifier onlyBuyer(bytes32 transactionId) {
        require(
            msg.sender == transactions[transactionId].buyer,
            "Only the buyer can call this function."
        );
        _;
    }

    modifier onlySeller(bytes32 transactionId) {
        require(
            msg.sender == transactions[transactionId].seller,
            "Only the seller can call this function."
        );
        _;
    }

    modifier inStatus(bytes32 transactionId, Status _status) {
        require(
            transactions[transactionId].status == _status,
            "Transaction status does not match."
        );
        _;
    }

    modifier notInStatus(bytes32 transactionId, Status _status) {
        require(
            transactions[transactionId].status != _status,
            "Transaction status does not match."
        );
        _;
    }

    function createTransaction(
        bytes32 transactionId,
        address _seller
    ) external payable {
        require(
            transactions[transactionId].status == Status.Created,
            "Transaction already exists or is not in the correct status."
        );
        require(msg.value > 0, "Invalid amount.");

        Transaction memory transaction = Transaction({
            buyer: msg.sender,
            seller: _seller,
            amount: msg.value,
            disputeDeadline: 0,
            status: Status.Created,
            disputeReasonIPFS: ""
        });

        transactions[transactionId] = transaction;

        signatures[transactionId][msg.sender] = true;
        emit SignatureAdded(transactionId, msg.sender);

        emit TransactionCreated(transactionId, msg.sender, _seller, msg.value);
    }

    function addSignature(bytes32 transactionId) external {
        Transaction storage transaction = transactions[transactionId];
        require(
            transaction.status == Status.Created ||
                transaction.status == Status.Locked,
            "Transaction status does not allow adding signatures."
        );
        require(
            !signatures[transactionId][msg.sender],
            "Signature already added."
        );

        signatures[transactionId][msg.sender] = true;
        emit SignatureAdded(transactionId, msg.sender);

        if (
            signatures[transactionId][transaction.buyer] &&
            signatures[transactionId][transaction.seller] &&
            transaction.status == Status.Created
        ) {
            transaction.disputeDeadline = block.timestamp + 300;
            transaction.status = Status.Locked;
            emit TransactionLocked(transactionId);
        }
    }

    function lockTransaction(
        bytes32 transactionId,
        uint256 disputeDuration
    )
        external
        inStatus(transactionId, Status.Created)
        onlyBuyer(transactionId)
    {
        require(disputeDuration > 0, "Invalid dispute duration.");

        require(
            signatures[transactionId][transactions[transactionId].seller],
            "Seller has not signed the transaction."
        );

        Transaction storage transaction = transactions[transactionId];
        transaction.disputeDeadline = block.timestamp + disputeDuration;
        transaction.status = Status.Locked;

        emit TransactionLocked(transactionId);
    }

    function releaseTransaction(
        bytes32 transactionId
    ) external inStatus(transactionId, Status.Locked) onlyBuyer(transactionId) {
        Transaction storage transaction = transactions[transactionId];
        require(
            signatures[transactionId][transaction.seller],
            "Seller has not signed the transaction."
        );

        transaction.status = Status.Released;

        payable(transaction.seller).transfer(transaction.amount);

        emit TransactionReleased(transactionId);
    }

    function forceReleaseAfterDeadline(
        bytes32 transactionId
    )
        external
        inStatus(transactionId, Status.Locked)
        onlySeller(transactionId)
    {
        Transaction storage transaction = transactions[transactionId];

        // Check if dispute window has passed
        require(
            block.timestamp > transaction.disputeDeadline,
            "Dispute window not over yet."
        );

        // Release funds to seller
        transaction.status = Status.Released;
        payable(transaction.seller).transfer(transaction.amount);

        emit TransactionReleased(transactionId);
    }

    function getTransactionStatus(
        bytes32 transactionId
    ) external view returns (Status) {
        return transactions[transactionId].status;
    }
}
