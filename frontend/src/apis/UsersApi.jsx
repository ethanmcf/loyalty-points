const baseURL = import.meta.env.VITE_BACKEND_URL;

// /users/me/transactions
// create a new redemption transaction
export async function createTransaction(authToken, type, amount, remark) {
    const res = await fetch(`${baseURL}/users/me/transactions`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
            type, amount, remark
        }),
    });

    if (!res.ok) {
        const error = await res.json();
        console.log("Error:", error.error);
        throw new Error(err.error);
    }

    return res.json();
}

// /users/me/transactions
export async function getMyTransactions(authToken, type, relatedId, promotionId, amount, operator, page, limit) {
    const res = await fetch(`${baseURL}/users/me/transactions&type=${type}&relatedId=${relatedId}&promotionId=${promotionId}&amount=${amount}&operator=${operator}&page=${page}&limit=${limit}`, {
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

// /users/:userId/transactions
// create a new transfer transaction between the current logged-in user and the user specified by userId
export async function createTransferTransaction(authToken, userId, type, amount, remark) {
    const res = await fetch(`${baseURL}/users/${userId}/transactions`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
            type, amount, remark
        }),
    });

    if (!res.ok) {
        const error = await res.json();
        console.log("Error:", error.error);
        throw new Error(err.error);
    }

    return res.json();
}