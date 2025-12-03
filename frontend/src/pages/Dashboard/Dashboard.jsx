import "./Dashboard.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useUser } from "../../contexts/UserContext";
import RegularDashboard from "./RegularDashboard";
import ManagerDashboard from "./ManagerDashboard";
import CashierDashboard from "./CashierDashboard";
import { getUserTier } from "../../apis/UsersApi";
import Popover from "@mui/material/Popover";
import { useEffect } from "react";
import { getMyTransactions } from "../../apis/UsersApi";
import { LoadData } from './LoadData'; 


export function Dashboard() {
  const navigate = useNavigate();

  // get user info
  const { user } = useUser();
  const [roleView, setRoleView] = useState(user.role);
  const [userTier, setUserTier] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state


  // Tier configuration
  const tierConfig = {
    platinum: { color: "#cfddfcff", 
      displayName: "Platinum", 
      emoji: "💎",
      benefits: [
      "15% off every transaction",
      "Invite to exclusive platinum members event"
    ] },
    gold: { color: "#FFD700", 
      displayName: "Gold", 
      emoji: "🥇",
      benefits: [
      "10% off every transaction"
    ]},
    silver: { color: "#C0C0C0", 
      displayName: "Silver", 
      emoji: "🥈",
      benefits: [
        "One-time 40% discount on any transaction"
    ]},
    bronze: { color: "#CD7F32", 
      displayName: "Bronze", 
      emoji: "🥉",
      benefits: [
      "One-time 10% discount on transactions of $30+"
    ]}
  };

  // Fetching the Tier of the user
  useEffect(() => {
    const fetchTier = async () => {
      try {
        const res = await getUserTier(localStorage.token);
        console.log("TIER RESULT:", res);
        setUserTier(res);
      } catch (error) {
        console.error("Failed to fetch tier:", error);
        // Optionally set a default tier
        setUserTier({ tier: "bronze" });
      } finally {
        setLoading(false);
      }
    };

    fetchTier();
  }, []);

  const [anchorEl, setAnchorEl] = useState(null);
  const handleEnter = (e) => setAnchorEl(e.currentTarget);
  const handleLeave = () => setAnchorEl(null);
  const open = Boolean(anchorEl);

  const currentTier = userTier ? (tierConfig[userTier.tier] || tierConfig.bronze) : tierConfig.bronze;


  return (
    <div>
      <div className="dashboard-container">
        <div className="title-container">
          <h2>Dashboard</h2>
          <div className="user-info">
            <h3>
              Hi { user.name }!
            </h3>
            {!loading && userTier && user.role === "regular" && (
            <div className="membership">
            <span 
                className="tier-badge"
                onMouseEnter={handleEnter}
                onMouseLeave={handleLeave}
                style={{
                  backgroundColor: currentTier.color,
                  color: userTier.tier === "silver" || userTier.tier === "platinum" ? "#333" : "#fff",
                  fontWeight: "bold",
                  fontSize: "0.75rem",
                  padding: "4px 12px",
                  borderRadius: "12px",
                  cursor: "pointer"
                }}
              >
                {currentTier.displayName}
              </span>

              <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleLeave}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                transformOrigin={{ vertical: "top", horizontal: "center" }}
                sx={{
                  pointerEvents: "none",
                  "& .MuiPopover-paper": {
                    marginTop: "8px",
                    borderRadius: "12px",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                    overflow: "hidden"
                  }
                }}
              >
                <div style={{
                  background: `linear-gradient(135deg, ${currentTier.color}22 0%, ${currentTier.color}11 100%)`,
                  padding: "1.5rem",
                  minWidth: "250px"
                }}>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    marginBottom: "1rem",
                    borderBottom: `2px solid ${currentTier.color}`,
                    paddingBottom: "0.75rem"
                  }}>
                    <span style={{ fontSize: "1.5rem" }}>{currentTier.emoji}</span>
                    <h4 style={{ 
                      margin: 0, 
                      fontSize: "1.25rem",
                      fontWeight: "600",
                      color: "#333"
                    }}>
                      {currentTier.displayName} Member
                    </h4>
                  </div>
                  
                  <div style={{ 
                    display: "flex", 
                    flexDirection: "column", 
                    gap: "0.75rem",
                    fontSize: "0.9rem",
                    color: "#555"
                  }}>
                    <div style={{
                      background: "white",
                      padding: "0.75rem",
                      borderRadius: "8px",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
                    }}>
                      <strong style={{ color: "#333" }}>Next Tier:</strong>
                      <div style={{ marginTop: "0.25rem" }}>
                        {userTier.pointsToNext > 0
                        ? `${userTier.pointsToNext} points to go`
                        : "Max Tier Reached!"}
                      </div>
                    </div>
                    
                    {/* <div style={{
                      background: "white",
                      padding: "0.75rem",
                      borderRadius: "8px",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
                    }}>
                      <strong style={{ color: "#333" }}>Benefits:</strong>
                      <ul style={{ 
                        margin: "0.5rem 0 0 0", 
                        paddingLeft: "1.25rem",
                        lineHeight: "1.6"
                      }}>
                        {currentTier.benefits.map((benefit, index) => (
                          <li key={index}>{benefit}</li>
                        ))}
                      </ul>
                    </div> */}
                  </div>
                </div>
              </Popover>
            </div>
          )}
          </div>
        </div>
        <LoadData />
      
      </div>
    </div>
  );
}

export default Dashboard;