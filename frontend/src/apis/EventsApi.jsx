// Reference: https://www.freecodecamp.org/news/make-api-calls-in-javascript/

/**
 *
 * @returns a list of the events with the defined variables applied
 * @note The filters that can be used are: name, location, started, ended, showFull, page, limit
 */

/**
 *
 * @param {string} [name]
 * @param {string} [location]
 * @param {boolean} [started]
 * @param {boolean} [ended]
 * @param {boolean} [showFull]
 * @param {number} [page] Must be a positive integer, default is 1
 * @param {number} [limit] Must be a positive integer, default is 10
 * @param {number} [published] // only accessible by the manager or higher
 * @returns
 */
export async function getAllEvents(
  name,
  location,
  started,
  ended,
  showFull,
  page,
  limit,
  published
) {
  // depends on the role
  const requestOptions = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${apiKey}`, //TODO: we need to find some other way to get this
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

  const url = `localhost:8000/events?${params.toString()}`;

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
 *
 * @returns The status code of the call and the response body.
 *
 * @example
 * // successful creation
 * 201 Created on success
 * {
 *  "id": 1,
 *  "name": "Event 1",
 *  "description": "A simple event",
 *  "location": "BA 2250",
 *  "startTime": "2025-11-10T09:00:00Z",
 *  "endTime": "2025-11-10T17:00:00Z",
 *  "capacity": 200, "pointsRemain": 500,
 *  "pointsAwarded": 0, "published": false,
 *  "organizers": [],
 *  "guests": []
 * }
 */
export async function postNewEvent(
  name,
  description,
  location,
  startTime,
  endTime,
  capacity,
  points
) {
  // depends on the role
  const requestOptions = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`, //TODO: we need to find some other way to get this
    },
    body: {
      name,
      description,
      location,
      startTime,
      endTime,
      capacity,
      points,
    },
  };

  // TODO: figure out what port we have it on
  const url = "localhost:8000/events/";
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
export async function getSingleEvent(eventId) {
  // depends on the role
  const requestOptions = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${apiKey}`, //TODO: we need to find some other way to get this
    },
  };
  const url = `localhost:8000/events/${eventId}`;
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
  published
) {
  const requestOptions = {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${apiKey}`, //TODO: we need to find some other way to get this
    },
    body: {
      name,
      description,
      location,
      startTime,
      endTime,
      capacity,
      points,
      published,
    },
  };
  const url = `localhost:8000/events/${eventId}`;
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
 * @method DELETE
 * @param {number} eventId
 */
export async function deleteSingleEvent(eventId) {
  // depends on the role
  const requestOptions = {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${apiKey}`, //TODO: we need to find some other way to get this
    },
  };
  const url = `localhost:8000/events/${eventId}`;
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
export async function postOrganizerToEvent(eventId, utorid) {
  // depends on the role
  const requestOptions = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`, //TODO: we need to find some other way to get this
    },
    body: {
      utorid,
    },
  };
  const url = `localhost:8000/events/${eventId}/organizers`;
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
 *
 * @param {number} eventId
 * @param {number} userId
 * @returns
 */
export async function deleteOrganizerFromEvent(eventId, userId) {
  // depends on the role
  const requestOptions = {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${apiKey}`, //TODO: we need to find some other way to get this
    },
  };
  const url = `localhost:8000/events/${eventId}/organizers/${userId}`;
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
 *
 * @param {number} eventId
 * @param {number} utorid
 */
export async function postGuestToEvent(eventId, utorid) {
  // depends on the role
  const requestOptions = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`, //TODO: we need to find some other way to get this
    },
    body: {
      utorid,
    },
  };
  const url = `localhost:8000/events/${eventId}/guests`;
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
