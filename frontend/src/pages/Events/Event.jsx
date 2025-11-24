import { useEffect, useState } from "react";
import "./Event.css";
import { useParams } from "react-router-dom";
import { getSingleEvent } from "../../apis/EventsApi";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import Button from "@mui/material/Button";
import { SimpleTable } from "../../components/simple-table/SimpleTable";

/**
 * I need to be able to
 * - patch and event
 * - view the details about an event
 */

export function Event() {
  const { eventId } = useParams();
  const [eventData, setEventData] = useState({
    id: 1,
    name: "Event 1",
    description: "A simple event",
    location: "BA 2250",
    startTime: "2025-11-10T09:00:00Z",
    endTime: "2025-11-10T17:00:00Z",
    capacity: 200,
    pointsRemain: 500,
    pointsAwarded: 0,
    published: false,
    organizers: [{ id: 1, utorid: "johndoe1", name: "John Doe" }],
    guests: [],
  });

  const fetchData = async () => {
    try {
      const res = await getSingleEvent(eventId, localStorage.token);
      console.log(res);
    } catch (error) {
      console.error("error");
    }
  };
  useEffect(() => {
    console.log(eventId);
    fetchData();
  }, []);
  return (
    <div id="event-details-page">
      <h2>Event Details page</h2>
      {eventData && (
        <>
          <h3>General Data</h3>
          <form>
            <TextField id="name" label="Event Name" value={eventData.name} />
            <TextField
              id="description"
              label="Event Description"
              value={eventData.description}
            />
            <TextField
              id="location"
              label="Location"
              value={eventData.location}
            />
            <TextField
              id="capacity"
              label="Capacity"
              value={eventData.capacity}
            />
            <FormControlLabel
              control={<Switch checked={eventData.published} />}
              label="Published"
            />
          </form>
          <h3>Organizers</h3>
          <Button>Add Organizer</Button>
          <SimpleTable type={"organizers"} data={eventData.organizers} />
          <h3>Guests</h3>
          <Button>Add Guest</Button>
          <Button>RSVP Me</Button>
          <h3>Transactions</h3>
          <Button>Create A Transaction for this event</Button>
        </>
      )}
    </div>
  );
}
