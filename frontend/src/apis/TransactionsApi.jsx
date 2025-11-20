const baseURL = import.meta.env.VITE_BACKEND_URL;

// /transactions/:transactionId/suspicious, patch
export async function markTransactionSuspicious(authToken, transactionId, suspicious) {
    const res = await fetch(`${baseURL}/transactions/${transactionId}/suspicious`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
            suspicious: suspicious
        }),
    });

    if (!res.ok) {
        const error = await res.json();
        console.log("Error:", error.error);
        throw new Error(err.error);
    }

    return res.json();
}

// transactions/:transactionsId/processed
// Set a redemption transaction as being completed
export async function setTransactionCompleted(authToken, transactionsId, processed) {
    const res = await fetch(`${baseURL}/transactions/${transactionsId}/processed`, {
       method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
            processed
        }),
    });

    if (!res.ok) {
        const error = await res.json();
        console.log("Error:", error.error);
        throw new Error(err.error);
    }

    return res.json();
}

// transactions/:transactionId
// GET a specific transactions Id
export async function getTransaction(authToken, transactionId) {
    const res = await fetch(`${baseURL}/transactions/${transactionId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
        },
    });

    if (!res.ok) {
        const error = await res.json();
        console.log("Error:", error.error);
        throw new Error(err.error);
    }

    return res.json();
}

// /transactions
// return a new purchase/adjustment transaction (POST)
// body has: utorid, type, spent, amount, promotionIds, remark, relatedId
export async function createNewTransaction(authToken, utorid, type, spent, amount, promotionIds, remark, relatedId) {
    const res = await fetch(`${baseURL}/transactions`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ utorid, type, spent, amount, promotionIds, remark, relatedId}),
    });

    if (!res.ok) {
        const error = await res.json();
        console.log("Error:", error.error);
        throw new Error(err.error);
    }

    return res.json();
}

// /transactions
// get a list of transactions
export async function getTransactions(authToken, name, createdBy, suspicious, promotionalId, type, relatedId, amount, operator, page = 10, limit = 10) {
    const res = await fetch(`${baseURL}/transactions?$name=${name}&createdBy=${createdBy}&suspicious=${suspicious}&promotionalId=${promotionalId}&type=${type}&relatedId=${relatedId}&amount=${amount}&operator=${operator}&page=${page}&limit=${limit}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
        },
    });

    if (!res.ok) {
        const error = await res.json();
        console.log("Error:", error.error);
        throw new Error(err.error);
    }

    return res.json();
}