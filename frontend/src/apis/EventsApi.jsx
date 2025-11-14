// Reference: https://www.freecodecamp.org/news/make-api-calls-in-javascript/

/**
 *
 * @returns a list of the events with the defined variables applied
 *
 * @note The filters that can be used are: name, location, started, ended, showFull, page, limit
 */
export async function getAllEvents() {
  // depends on the role
  const requestOptions = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${apiKey}`, //TODO: we need to find some other way to get this
    },
  };

  // TODO: figure out what port we have it on
  const url = "localhost:8000/events/";
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
