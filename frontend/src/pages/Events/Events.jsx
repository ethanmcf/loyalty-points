import { useEffect } from "react";

const exampleData = {
  count: 5,
  results: [
    {
      id: 1,
      name: "Event 1",
      location: "BA 2250",
      startTime: "2025-11-10T09:00:00Z",
      endTime: "2025-11-10T17:00:00Z",
      capacity: 200,
      pointsRemain: 500,
      pointsAwarded: 0,
      published: false,
      numGuests: 0,
    },
    {
      id: 2,
      name: "Event 2",
      location: "SF 2250",
      startTime: "2025-11-10T09:00:00Z",
      endTime: "2025-11-10T17:00:00Z",
      capacity: null,
      pointsRemain: 500,
      pointsAwarded: 0,
      published: true,
      numGuests: 12,
    },
  ],
};
/**
 * TODO USECASES - Events (45 marks)
 * Event Management (15 marks):
 * - Managers can create, update, and delete events.
 * - Managers can add event organizers.
 * - Event organizers can update events.
 * - Event Listing (15 marks):
 * - All logged in users can view the list of events.
 * RSVP and Attendance (10 marks):
 * - Users can RSVP to events.
 * - Managers and event organizers can add guests to an event.
 * - Managers can remove guests from an event.
 * Point Allocation (5 marks):
 * - Managers and event organizers can award points to guests.
 *
 * @returns
 */
export function Events() {
  // step 1: get the role -> if the role is regular, only show published events
  let role;

  // data
  const [count, setCount] = useState(); // total number of events retrieved
  const [data, setData] = useState([]);
  const [selectedData, setSelectedData] = useState([]);

  // filters -> undefined means that we are not using the filter
  const [name, setName] = useState();
  const [location, setLocation] = useState();
  const [started, setStarted] = useState();
  const [ended, setEnded] = useState();
  const [showFull, setShowFull] = useState();
  const [published, setPublished] = useState(); // only accessible by manager

  // pagination
  const [page, setPage] = useState(1); // Index starts at 1
  const [limit, setLimit] = useState(10); // default starts at 10

  useEffect(() => {
    // fetch all the data (rn its going to use example data);
  }, []);

  return (
    <div>
      <div>
        <h1>Events</h1>
        <p>
          Here is the content for the board, this will look different for every
          type of interface
        </p>
      </div>
    </div>
  );
}
