import { useEffect } from "react";

const exampleData = [];

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
  const [data, setData] = useState([]);
  const [selectedData, setSelectedData] = useState([]);

  useEffect(() => {
    // ffetch all the data
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
