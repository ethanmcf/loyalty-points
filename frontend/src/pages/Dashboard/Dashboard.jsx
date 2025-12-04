import "./Dashboard.css";
import { useState } from "react";
import { useUser } from "../../contexts/UserContext";
import { getUserTier } from "../../apis/UsersApi";
import Popover from "@mui/material/Popover";
import { useEffect } from "react";
import { LoadData } from "./LoadData";
import RequestEventAccessButton from "../../components/actionDialogs/RequestAccessToEventDialog";

export function Dashboard() {

  // get user info
  const { user } = useUser();
  const [userTier, setUserTier] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state

  // Tier configuration
  const tierConfig = {
    platinum: {
      color: "#cfddfcff",
      displayName: "Platinum",
      emoji: "💎",
      benefits: ["Invite to exclusive Platinum members event"],
    },
    gold: {
      color: "#FFD700",
      displayName: "Gold",
      emoji: "🥇",
      benefits: ["Invite to exclusive Gold members event"],
    },
    silver: {
      color: "#C0C0C0",
      displayName: "Silver",
      emoji: "🥈",
      benefits: ["Invite to exclusive Silver members event"],
    },
    bronze: {
      color: "#CD7F32",
      displayName: "Bronze",
      emoji: "🥉",
      benefits: ["None, progress to a higher tier to gain benefits!"],
    },
  };

  // Fetching the Tier of the user
  useEffect(() => {
    const fetchTier = async () => {
      try {
        const res = await getUserTier(localStorage.token);
        setUserTier(res);
      } catch (error) {
        // set a default tier
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

  const currentTier = userTier
    ? tierConfig[userTier.tier] || tierConfig.bronze
    : tierConfig.bronze;

  return (
    <div>
      <div className="dashboard-container">
        <div className="title-container">
          <h2>Dashboard</h2>
          <div className="user-info">
            <h3>Hi {user.name}!</h3>
            {!loading && userTier && user.role === "regular" && (
              <div className="membership" onMouseEnter={handleEnter}
                onMouseLeave={handleLeave}>
                <span
                  className="tier-badge"
                  style={{
                    backgroundColor: currentTier.color,
                    color:
                      userTier.tier === "silver" || userTier.tier === "platinum"
                        ? "#333"
                        : "#fff",
                  }}
                >
                  {currentTier.displayName}
                </span>

                {/* Reference: https://mui.com/material-ui/react-popover/ */}
                <Popover
                  open={open}
                  anchorEl={anchorEl}
                  onClose={handleLeave}
                  anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                  transformOrigin={{ vertical: "top", horizontal: "center" }}
                  sx={{
                    "& .MuiPopover-paper": {
                      marginTop: "8px",
                      borderRadius: "12px",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                      overflow: "hidden",
                    },
                  }}
                >
                  <div className="popover-content"
                    style={{
                      background: `linear-gradient(135deg, ${currentTier.color}22 0%, ${currentTier.color}11 100%)`,
                    }}
                  >
                    <div className="tier-header"
                      style={{
                        borderBottom: `2px solid ${currentTier.color}`,
                      }}
                    >
                      <span style={{ fontSize: "1.5rem" }}>
                        {currentTier.emoji}
                      </span>
                      <h4
                        style={{
                          color: "#333",
                        }}
                      >
                        {currentTier.displayName} Member
                      </h4>
                    </div>

                    <div className="tier-main">
                      <div className="future-tier">
                        <strong style={{ color: "#333" }}>Next Tier:</strong>
                        <div>
                          {userTier.pointsToNext > 0
                            ? `${userTier.pointsToNext} points to go`
                            : "Max Tier Reached!"}
                        </div>
                      </div>

                      <div className="tier-benefits">
                      <strong style={{ color: "#333" }}>Benefits:</strong>
                      <ul>
                        {currentTier.benefits.map((benefit, index) => (
                          <li key={index}>{benefit}</li>
                        ))}
                      </ul>
                    </div>
                    {userTier !== 'bronze' && <RequestEventAccessButton tier={userTier} token={localStorage.token} utorid={user.utorid}/>}
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
