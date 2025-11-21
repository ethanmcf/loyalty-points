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

export async function registerSelf(name, email, password) {
  // Create unique utorid
  let utorid = "";
  const names = name.split(" ");

  if (names.length === 1) {
    utorid += names[0].slice(0, 6);
  } else {
    const [first, last] = names;
    utorid += first.slice(0, 3);
    utorid += last.slice(0, 3);
  }

  const left = 8 - utorid.length;
  for (let i = 0; i < left; i++) {
    utorid += Math.floor(Math.random() * 10);
  }
  utorid = utorid.toLocaleLowerCase();

  const res = await fetch(`${baseURL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      utorid,
      name,
      email,
      password,
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error);
  }
  return res.json(); // resetToken, expiresAt
}
