// Reference: https://mui.com/material-ui/react-app-bar/#app-bar-with-responsive-menu

import AppBar from "@mui/material/AppBar";
import Container from "@mui/material/Container";
import Toolbar from "@mui/material/Toolbar";
import { Link, NavLink } from "react-router-dom";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import { useUser } from "../../contexts/UserContext";
import RedeemIcon from "@mui/icons-material/Redeem";
import "./NavBar.css";
import Badge from "@mui/material/Badge";
const pages = ["Dashboard", "Users", "Events", "Transactions", "Promotions"];
const settings = ["Profile", "Logout"];

export function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, logout } = useUser();
  const [avatar, setAvatar] = useState(null);

  useEffect(() => {
    if (user?.avatarUrl) {
      setAvatar(`${import.meta.env.VITE_BACKEND_URL}/${user.avatarUrl}`);
    } else {
      setAvatar("/default-avatar.png");
    }
  }, [user]);

  const handleOpenMenu = () => {
    setIsMenuOpen(true);
  };
  const handleCloseMenu = () => {
    setIsMenuOpen(false);
  };

  const handleOpenUserMenu = () => {
    setIsUserMenuOpen(true);
  };
  const handleCloseUserMenu = () => {
    setIsUserMenuOpen(false);
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl" className="nav-bar">
        <Toolbar disableGutters>
          <Box sx={{ display: { xs: "none", md: "flex" }, mr: 1 }}>
            <Link className="logo" to="/">
              <RedeemIcon />
              <b>Redeema</b>
            </Link>
          </Box>
          {user && (
            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <IconButton onClick={handleOpenMenu}>
                <MenuIcon />
              </IconButton>

              <Menu
                sx={{ mt: "45px", display: { xs: "flex", md: "none" } }}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                keepMounted
                open={isMenuOpen}
                onClose={handleCloseMenu}
              >
                <MenuItem>
                  <NavLink
                    to="/dashboard"
                    className={({ isActive, isPending }) =>
                      isPending ? "pending" : isActive ? "active" : ""
                    }
                  >
                    Dashboard
                  </NavLink>
                </MenuItem>
                {user.role === "manager" ||
                  (user.role === "superuser" && (
                    <MenuItem>
                      <NavLink
                        to="/users"
                        className={({ isActive, isPending }) =>
                          isPending ? "pending" : isActive ? "active" : ""
                        }
                      >
                        Users
                      </NavLink>
                    </MenuItem>
                  ))}
                <MenuItem>
                  <NavLink
                    to="/events"
                    className={({ isActive, isPending }) =>
                      isPending ? "pending" : isActive ? "active" : ""
                    }
                  >
                    Events
                  </NavLink>
                </MenuItem>
                {user.role !== "regular" && (
                  <MenuItem>
                    <NavLink
                      to="/transactions"
                      className={({ isActive, isPending }) =>
                        isPending ? "pending" : isActive ? "active" : ""
                      }
                    >
                      Transactions
                    </NavLink>
                  </MenuItem>
                )}
                <MenuItem>
                  <NavLink
                    to="/promotions"
                    className={({ isActive, isPending }) =>
                      isPending ? "pending" : isActive ? "active" : ""
                    }
                  >
                    Promotions
                  </NavLink>
                </MenuItem>
              </Menu>
            </Box>
          )}

          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {user && (
              <div className="links">
                <NavLink
                  to="/dashboard"
                  className={({ isActive, isPending }) =>
                    isPending ? "pending" : isActive ? "active" : ""
                  }
                >
                  Dashboard
                </NavLink>
                {(user.role === "manager" || user.role === "superuser") && (
                  <NavLink
                    to="/users"
                    className={({ isActive, isPending }) =>
                      isPending ? "pending" : isActive ? "active" : ""
                    }
                  >
                    Users
                  </NavLink>
                )}
                <NavLink
                  to="/events"
                  className={({ isActive, isPending }) =>
                    isPending ? "pending" : isActive ? "active" : ""
                  }
                >
                  Events
                </NavLink>
                {user.role !== "regular" && (
                  <NavLink
                    to="/transactions"
                    className={({ isActive, isPending }) =>
                      isPending ? "pending" : isActive ? "active" : ""
                    }
                  >
                    Transactions
                  </NavLink>
                )}
                <NavLink
                  to="/promotions"
                  className={({ isActive, isPending }) =>
                    isPending ? "pending" : isActive ? "active" : ""
                  }
                >
                  Promotions
                </NavLink>
              </div>
            )}
          </Box>
          {/* Profile */}
          <Box sx={{ flexGrow: 0, display: { xs: "flex", md: "none" } }}>
            {user ? (
              <div>
                <IconButton onClick={handleOpenUserMenu}>
                  {user.suspicious ? (
                    <Badge badgeContent={"!"} color="error">
                      <img src={avatar} className="profile-avatar" />
                    </Badge>
                  ) : (
                    <img src={avatar} className="profile-avatar" />
                  )}
                </IconButton>
                <Menu
                  sx={{ mt: "45px", display: { xs: "flex", md: "none" } }}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  open={isUserMenuOpen}
                  onClose={handleCloseUserMenu}
                >
                  <MenuItem>
                    <NavLink
                      to="/profile"
                      className={({ isActive, isPending }) =>
                        isPending ? "pending" : isActive ? "active" : ""
                      }
                    >
                      Profile
                    </NavLink>
                  </MenuItem>
                  <MenuItem>
                    <NavLink to="/" onClick={() => logout()}>
                      Logout
                    </NavLink>
                  </MenuItem>
                </Menu>
              </div>
            ) : (
              <div className="links">
                <NavLink to="/login" className="outline-button nav-button">
                  log in
                </NavLink>
                <NavLink to="/register" className="fill-button nav-button">
                  sign up
                </NavLink>
              </div>
            )}
          </Box>
          <Box sx={{ flexGrow: 0, display: { xs: "none", md: "flex" } }}>
            {user ? (
              <div className="links">
                <NavLink
                  to="/profile"
                  className={({ isActive, isPending }) =>
                    isPending ? "pending" : isActive ? "active" : ""
                  }
                >
                  {user.suspicious ? (
                    <Badge badgeContent={"!"} color="error">
                      <img src={avatar} className="profile-avatar" />
                    </Badge>
                  ) : (
                    <img src={avatar} className="profile-avatar" />
                  )}
                </NavLink>
                <NavLink to="/" onClick={() => logout()}>
                  Logout
                </NavLink>
              </div>
            ) : (
              <div className="links">
                <NavLink to="/login" className="outline-button nav-button">
                  log in
                </NavLink>
                <NavLink to="/register" className="fill-button nav-button">
                  sign up
                </NavLink>
              </div>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
