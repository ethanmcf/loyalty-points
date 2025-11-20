const baseURL = `${import.meta.env.VITE_BACKEND_URL}/auth`;

export async function login(utorid, password) {
  const res = await fetch(`${baseURL}/tokens`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      utorid,
      password,
    }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error);
  }
  return await res.json(); // authToken, expiresAt
}

export async function resetPassword(utorid, newPassword, resetToken) {
  console.log(
    utorid,
    newPassword,
    resetToken,
    `${baseURL}/tokens/${resetToken}`
  );
  const res = await fetch(`${baseURL}/resets/${resetToken}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      utorid,
      password: newPassword,
    }),
  });
  if (!res.ok) {
    const err = await res.json();
    console.log(err.error);
    throw new Error(err.error);
  }
}

export async function createNewResetToken(utorid) {
  const res = await fetch(`${baseURL}/resets`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      utorid,
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error);
  }
  return res.json(); // resetToken, expiresAt
}
