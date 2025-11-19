const baseURL = import.meta.env.VITE_BACKEND_URL;

// For GET /promotions
export async function getAllPromotions(authToken) {
    const res = await fetch(`${baseURL}/promotions`, {
        method: "GET",
        headers: { 
            "Content-Type": "application/json", 
            Authorization: `Bearer ${authToken}`,
        },
    });

    if (!res.ok) {
        const error = await res.json();
        console.log(error.error);
        throw new Error(error.Error);
    }

    return res.json();
}

// For GET /promotions/:promotionId
export async function getPromotionById(authToken, promotionId) {
    const res = await fetch(`${baseURL}/promotions/${promotionId}`, {
        method: "GET",
        headers: { 
            "Content-Type": "application/json", 
            Authorization: `Bearer ${authToken}`,
        },
    });

    if (!res.ok) {
        const error = await res.json();
        console.log(error.error);
        throw new Error(error.Error);
    }

    return res.json();
}

// For POST /promotions
export async function createPromotion(authToken, promotionData) {
    const res = await fetch(`${baseURL}/promotions`, {
        method: "POST",
        headers: { 
            "Content-Type": "application/json", 
            Authorization: `Bearer ${authToken}`,
        },
        body:JSON.stringify(promotionData),
    });

    if (!res.ok) {
        const error = await res.json();
        console.log(error.error);
        throw new Error(error.Error);
    }

    return res.json();
}

// For PUT /promotions/:promotionId
export async function updatePromotion(authToken, promotionId, promotionData) {
    const res = await fetch(`${baseURL}/promotions/${promotionId}`, {
        method: "PUT",
        headers: { 
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`, 
        },
        body:JSON.stringify(promotionData),
    });

    if (!res.ok) {
        const error = await res.json();
        console.log(error.error);
        throw new Error(error.Error);
    }

    return res.json();
}

// For DELETE /promotions/:promotionId
export async function deletePromotion(authToken, promotionId) {
    const res = await fetch(`${baseURL}/promotions/${promotionId}`, {
        method: "DELETE",
        headers: { 
            "Content-Type": "application/json", 
            Authorization: `Bearer ${authToken}`,
        },
    });

    if (!res.ok) {
        const error = await res.json();
        console.log(error.error);
        throw new Error(error.Error);
    }

    return;
}

