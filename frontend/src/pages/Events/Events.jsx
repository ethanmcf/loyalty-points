import { useUser } from "../../contexts/UserContext";
import { DataTable } from "../../components/data-table/DataTable";
import { AddEventsDialog } from "../../components/addDialogs/AddEventsDialog"; 
import "./Events.css"; 

export function Events() {
    const { user } = useUser();

    return (
        <div id="events-page">
            <div className="table-page-header">
                <h2>Events</h2>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        gap: "1rem",
                    }}
                >
                    <AddEventsDialog />
                    
                </div>
            </div>

            <DataTable 
                baseURL="/events" 
                role={user?.role} 
            />
        </div>
    );
}