import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useUser } from "../../contexts/UserContext";


export function Dashboard() {
  const navigate = useNavigate();

  // get user info
  const { user } = useUser();
 

  return (
    <div>
      <div>
        <h1>Dashboard</h1>
        <p>
          Hi { user.name }!
        </p>
        <div>
          place filters here
        </div>
        <div>
          place table here
        </div>
        <div>
          Points: { user.points }
        </div>
      </div>
    </div>
  );
}

export default Dashboard;