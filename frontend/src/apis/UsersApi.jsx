import { buildQuery } from "./utils/buildQuery";
const baseURL = `${import.meta.env.VITE_BACKEND_URL}/users`;

export async function changeMyPassword(authToken, oldPassword, newPassword) {
  const res = await fetch(`${baseURL}/me/password`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify({
      old: oldPassword,
      new: newPassword,
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error);
  }
}

export async function redeemMyPoints(authToken, amount, remark = null) {
  const res = await fetch(`${baseURL}/me/transactions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify({
      type: "redemption",
      amount,
      remark,
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error);
  }
  return res.json(); // transaction info
}

export async function getMyTransactions(
  authToken,
  updatedInfo = {} // map of optional fields: type, relatedId, promotionId, amount, operator, page, limit. ie {type: "type", etc}
) {
  const queryParams = buildQuery(updatedInfo);
  const res = await fetch(`${baseURL}/me/transactions?${queryParams}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error);
  }
  return res.json(); // transaction info
}

export async function updateMyInfo(
  authToken,
  updatedInfo // map of optional fields: name, email, birthday, avatar. ie {name: "name", etc}
) {
  const res = await fetch(`${baseURL}/me`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
    body: updatedInfo,
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error);
  }
  return res.json(); // User and upoated fields
}

export async function getMyInfo(authToken) {
  const res = await fetch(`${baseURL}/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error);
  }
  return res.json(); // user and related promotion info
}

export async function registerUser(authToken, utorid, name, email) {
  const res = await fetch(`${baseURL}/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify({
      utorid,
      name,
      email,
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error);
  }
  return res.json(); // new user info
}

export async function searchUsers(
  authToken,
  updatedInfo = {} // map of optional fields: name, role, verified, activated, page, limit. ie {name: "name", etc}
) {
  const queryParams = buildQuery(updatedInfo);
  const res = await fetch(`${baseURL}/?${queryParams}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error);
  }
  return res.json(); // list of users
}

export async function transferPointsToUser(
  authToken,
  userId,
  amount,
  remark = null
) {
  const res = await fetch(`${baseURL}/${userId}/transactions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify({
      type: "transfer",
      amount,
      remark,
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error);
  }
  return res.json(); // transaction info
}

export async function getUserById(authToken, userId) {
  const res = await fetch(`${baseURL}/${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error);
  }
  return res.json(); // user info and related promotions
}

export async function updateUserById(
  authToken,
  userId,
  updatedInfo = {} // map of optional fields: email, verified, suspicious, role. ie {role: "role", etc}
) {
  const res = await fetch(`${baseURL}/${userId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify(updatedInfo),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error);
  }
  return res.json(); // User and updated fields
}

/**
 * This function is used for the extra feature, the membership tierlist system.
 * It returns the tier of the current user.
 */
export async function getUserTier(authToken) {
  const res = await fetch(`${baseURL}/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error);
  }

  const data = await res.json();

  let tier;
  let pointsToNext;

  if (data.points >= 10000) {
    tier = "platinum";
    pointsToNext = 0; // Already at max tier
  } else if (data.points >= 6000) {
    tier = "gold";
    pointsToNext = 10000 - data.points; // Points needed for platinum
  } else if (data.points >= 2000) {
    tier = "silver";
    pointsToNext = 6000 - data.points; // Points needed for gold
  } else {
    tier = "bronze";
    pointsToNext = 2000 - data.points; // Points needed for silver
  }

  return {
    tier,
    pointsToNext,
    currentPoints: data.points,
  };
}
