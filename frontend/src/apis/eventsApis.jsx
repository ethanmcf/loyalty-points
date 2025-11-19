const baseURL = import.meta.env.VITE_BACKEND_URL;

export async function joinEventLoggedIn(authToken, eventId) {
    const res = await fetch(`${baseURL}/events/${eventId}/guests/me`, {
        method: "POST",
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

export async function leaveEvent(authToken, eventId) {
    const res = await fetch(`${baseURL}/events/${eventId}/guests/me`, {
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

export async function removeGuest(authToken, eventId, userId) {
    const res = await fetch(`${baseURL}/events/${eventId}/guests/${userId}`, {
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