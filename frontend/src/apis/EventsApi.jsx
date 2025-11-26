// Reference: https://www.freecodecamp.org/news/make-api-calls-in-javascript/
const baseURL = import.meta.env.VITE_BACKEND_URL;

/**
 * @returns a list of the events with the defined variables applied
 * @note The filters that can be used are: name, location, started, ended, showFull, page, limit
 *
 * @param {string} [name]
 * @param {string} [location]
 * @param {boolean} [started]
 * @param {boolean} [ended]
 * @param {boolean} [showFull]
 * @param {number} [page] Must be a positive integer, default is 1
 * @param {number} [limit] Must be a positive integer, default is 10
 * @param {number} [published] // only accessible by the manager or higher
 * @param {string} authToken The Authorization Token
 */
export async function getAllEvents(
  name,
  location,
  started,
  ended,
  showFull,
  page,
  limit,
  published,
  authToken
) {
  // depends on the role
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
  };

  // TODO: figure out what port we have it on

  // Reference: https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams/append
  const params = new URLSearchParams();

  if (name) {
    params.append("name", name);
  }

  if (location) {
    params.append("location", location);
  }

  if (started) {
    params.append("started", started);
  }

  if (ended) {
    params.append("ended", ended);
  }

  if (showFull) {
    params.append("showFull", showFull);
  }

  if (published) {
    params.append("published", published);
  }

  if (page) {
    params.append("page", page);
  }

  if (limit) {
    params.append("limit", limit);
  }

  const url = `${baseURL}/events?${params.toString()}`;

  try {
    const allEventsResponse = await fetch(url, requestOptions);

    if (!allEventsResponse.ok) {
      console.error("Error occured: ", allEventsResponse.status);
    }

    const eventsJSON = await allEventsResponse.json();
    return eventsJSON;
  } catch (error) {
    console.error("Error: ", error);
  }
}

/**
 * @description
 * Creates a Create a new point-earning event.
 *
 * @param {string} name The name of the Event
 * @param {string} description The description of the event
 * @param {string} location The location of the event
 * @param {string} startTime Must be in ISO 8601 Format
 * @param {string} endTime Must be in ISO 8601 Format
 * @param {string | null} capacity Must be null if not a valid number
 * @param {number} points Must be a positive Integer
 * @param {string} authToken The Authorization Token
 *
 * @returns The status code of the call and the response body.
 */
export async function postNewEvent(
  name,
  description,
  location,
  startTime,
  endTime,
  capacity,
  points,
  authToken
) {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify({
      name,
      description,
      location,
      startTime,
      endTime,
      capacity,
      points,
    }),
  };

  // TODO: figure out what port we have it on
  const url = `${baseURL}/events/`;
  try {
    const newEventResponse = await fetch(url, requestOptions);

    if (!newEventResponse.ok) {
      console.error("Error occured: ", newEventResponse.status);
    }

    const newEventJSON = await newEventResponse.json();
    return newEventJSON;
  } catch (error) {
    console.error("Error: ", error);
  }
}

/**
 * @method GET
 * @param {number} eventId The Id of the event we want to retrieve
 * @returns Status code and response body.
 *
 * @note regular user cannot see the following information: the points allocated to the event, or the list of guests
 */
export async function getSingleEvent(eventId, authToken) {
  // depends on the role
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`, //TODO: we need to find some other way to get this
    },
  };
  const url = `${baseURL}/events/${eventId}`;
  try {
    const allEventsResponse = await fetch(url, requestOptions);

    if (!allEventsResponse.ok) {
      console.error("Error occured: ", allEventsResponse.status);
    }

    const eventsJSON = await allEventsResponse.json();
    return eventsJSON;
  } catch (error) {
    console.error("Error: ", error);
  }
}

export async function patchSingleEvent(
  eventId,
  name,
  description,
  location,
  startTime,
  endTime,
  capacity,
  points,
  published,
  authToken
) {
  const requestOptions = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`, //TODO: we need to find some other way to get this
    },
    body: JSON.stringify({
      name,
      description,
      location,
      startTime,
      endTime,
      capacity,
      points,
      published,
    }),
  };
  const url = `${baseURL}/events/${eventId}`;
  const allEventsResponse = await fetch(url, requestOptions);

  const eventsJSON = await allEventsResponse.json();
  if (!allEventsResponse.ok) {
    console.error("Error occured: ", eventsJSON.error);
    throw new Error(eventsJSON.error);
  }
  return eventsJSON;
}

/**
 * @method DELETE
 * @param {number} eventId
 */
export async function deleteSingleEvent(eventId, authToken) {
  // depends on the role
  const requestOptions = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`, //TODO: we need to find some other way to get this
    },
  };
  const url = `${baseURL}/events/${eventId}`;
  try {
    const allEventsResponse = await fetch(url, requestOptions);

    if (!allEventsResponse.ok) {
      console.error("Error occured: ", allEventsResponse.status);
    }

    const eventsJSON = await allEventsResponse.json();
    return eventsJSON;
  } catch (error) {
    console.error("Error: ", error);
  }
}

/**
 * @method POST
 * @description
 * Add an organizer to this event
 *
 * @param {number} eventId
 * @param {number} utorid
 * @returns
 */
export async function postOrganizerToEvent(eventId, utorid, authToken) {
  // depends on the role
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`, //TODO: we need to find some other way to get this
    },
    body: JSON.stringify({
      utorid,
    }),
  };
  const url = `${baseURL}/events/${eventId}/organizers`;
  const allEventsResponse = await fetch(url, requestOptions);
  const eventsJSON = await allEventsResponse.json();
  if (!allEventsResponse.ok) {
    console.error("Error occured: ", eventsJSON.error);
    throw new Error(eventsJSON.error);
  }
  return eventsJSON;
}

/**
 *
 * @param {number} eventId
 * @param {number} userId
 * @returns
 */
export async function deleteOrganizerFromEvent(eventId, userId, authToken) {
  // depends on the role
  const requestOptions = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`, //TODO: we need to find some other way to get this
    },
  };
  const url = `${baseURL}/events/${eventId}/organizers/${userId}`;
  const res = await fetch(url, requestOptions);

  const eventsJSON = await res.json();
  if (!res.ok) {
    throw new Error(eventsJSON.error);
  }

  return eventsJSON; // expected should be no content
}

/**
 *
 * @param {number} eventId
 * @param {number} utorid
 */
export async function postGuestToEvent(eventId, utorid, authToken) {
  // depends on the role
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`, //TODO: we need to find some other way to get this
    },
    body: JSON.stringify({
      utorid,
    }),
  };
  const url = `${baseURL}/events/${eventId}/guests`;
  const allEventsResponse = await fetch(url, requestOptions);
  const eventsJSON = await allEventsResponse.json();
  if (!allEventsResponse.ok) {
    console.error("Error occured: ", eventsJSON.error);
    throw new Error(eventsJSON.error);
  }

  return eventsJSON;
}

// Join event as a guest
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

// Remove logged in user from event
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
    throw new Error(error.error);
  }

  return; // expected should be no content
}

// Delete a user from an event
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
    throw new Error(error.error);
  }

  return; // expected should be no content
}

// Create a new reward transaction for an event
export async function createEventTransaction(authToken, eventId, eventData) {
  const res = await fetch(`${baseURL}/events/${eventId}/transactions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify(eventData),
  });

  if (!res.ok) {
    const error = await res.json();
    console.log(error.error);
    throw new Error(error.error);
  }

  return res.json();
}
