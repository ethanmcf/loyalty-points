import { useEffect, useState } from "react";
import "./Event.css";
import { useParams } from "react-router-dom";
import { getSingleEvent, patchSingleEvent } from "../../apis/EventsApi";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import Button from "@mui/material/Button";
import { SimpleTable } from "../../components/simple-table/SimpleTable";
import { AddOrganizerInput } from "./pieces/AddOrganizerInput";
import { AddGuestInput } from "./pieces/AddGuestInput";
import dayjs from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import Alert from "@mui/material/Alert";
import { AwardAllGuestButton } from "./pieces/AwardAllGuestButton";
import { DataTable } from "../../components/data-table/DataTable";

/**
 * I need to be able to
 * - patch and event
 * - view the details about an event
 */

export function Event() {
  const { eventId } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");
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
    guests: [{ id: 2, utorid: "janedoe1", name: "Jane Doe" }],
  });
  const [oldEventData, setOldEventData] = useState({
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
    guests: [{ id: 2, utorid: "janedoe1", name: "Jane Doe" }],
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const formJson = {
      ...Object.fromEntries(formData.entries()),
      published: formData.get("published") === "on",
    };
    console.log(formJson.startTime);
    const isoStartTime = dayjs(
      formJson.startTime,
      "MM/DD/YYYY hh:mm A"
    ).toISOString();
    const isoEndTime = dayjs(
      formJson.endTime,
      "MM/DD/YYYY hh:mm A"
    ).toISOString();

    const oldStartTime = new Date(oldEventData.startTime);
    const newStartTime = new Date(isoStartTime);
    const oldEndTime = new Date(oldEventData.endTime);
    const newEndTime = new Date(isoEndTime);

    try {
      const res = await patchSingleEvent(
        eventId,
        formJson.name === oldEventData.name ? null : formJson.name,
        formJson.description === oldEventData.description
          ? null
          : formJson.description,
        formJson.location === oldEventData.location ? null : formJson.location,
        oldStartTime.toISOString() === newStartTime.toISOString()
          ? null
          : isoStartTime,
        oldEndTime.toISOString() === newEndTime.toISOString()
          ? null
          : isoEndTime,
        Number(formJson.capacity) === Number(oldEventData.capacity) ||
          formJson.capacity === ""
          ? null
          : Number(formJson.capacity),
        Number(formJson.points) ===
          Number(oldEventData.pointsAwarded + oldEventData.pointsRemain)
          ? null
          : Number(formJson.points),
        formJson.published ? true : null,
        localStorage.token
      );
    } catch (error) {
      setError(error.message);
    }

    // if successful
    setIsEditing(false);
  };

  const handleSetToEdit = (e) => {
    e.preventDefault();
    setIsEditing(true);
  };

  return (
    <div id="event-details-page">
      <h2>Event Details page</h2>
      {eventData && (
        <>
          <div className="header">
            <h3>General Data</h3>
            <div>
              {!error ? null : <Alert severity="error">{error}</Alert>}
              {isEditing ? (
                <Button type="submit" form="event-info-form">
                  Save
                </Button>
              ) : (
                <Button type="button" form="" onClick={handleSetToEdit}>
                  Edit
                </Button>
              )}
            </div>
          </div>
          <form
            onSubmit={handleSubmit}
            id="event-info-form"
            className="event-form"
          >
            <TextField
              id="name"
              name="name"
              label="Event Name"
              value={eventData.name}
              onChange={(e) =>
                setEventData({ ...eventData, name: e.target.value })
              }
              required
              disabled={!isEditing}
            />
            <TextField
              id="description"
              name="description"
              label="Event Description"
              value={eventData.description}
              onChange={(e) =>
                setEventData({ ...eventData, description: e.target.value })
              }
              required
              disabled={!isEditing}
            />
            <TextField
              id="location"
              name="location"
              label="Location"
              value={eventData.location}
              required
              disabled={!isEditing}
            />
            <TextField
              id="capacity"
              name="capacity"
              label="Capacity"
              value={eventData.capacity}
              required
              disabled={!isEditing}
            />

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["DateTimePicker"]}>
                <DateTimePicker
                  disabled={!isEditing}
                  name="startTime"
                  label="Start Time"
                  value={dayjs(eventData.startTime)}
                  onChange={(e) =>
                    setEventData({
                      ...eventData,
                      startTime: dayjs(e),
                    })
                  }
                />
              </DemoContainer>
            </LocalizationProvider>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["DateTimePicker"]}>
                <DateTimePicker
                  disabled={!isEditing}
                  name="endTime"
                  label="End Time"
                  value={dayjs(eventData.endTime)}
                  onChange={(e) =>
                    setEventData({
                      ...eventData,
                      endTime: dayjs(e),
                    })
                  }
                />
              </DemoContainer>
            </LocalizationProvider>
            <TextField
              id="points"
              name="points"
              label="Points"
              value={eventData.pointsAwarded + eventData.pointsRemain}
              required
              disabled={!isEditing}
            />
            <FormControlLabel
              control={
                <Switch
                  id="published"
                  name="published"
                  checked={eventData.published}
                  onChange={(e) =>
                    setEventData({ ...eventData, published: e.target.value })
                  }
                />
              }
              label="Published"
              disabled={!isEditing}
            />
          </form>
          <h3>Organizers</h3>
          <AddOrganizerInput />
          <SimpleTable type={"organizers"} data={eventData.organizers} />
          <h3>Guests</h3>
          <AddGuestInput guestList={eventData.guests} />
          <SimpleTable type={"guests"} data={eventData.guests} />
          <h3>Transactions</h3>
          <DataTable baseURL="/transactions?type=event" />
          <p> add table that lists transaction history here</p>
        </>
      )}
    </div>
  );
}
