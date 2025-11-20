import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { UserProvider, useUser } from "./contexts/UserContext";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Landing from "./pages/Landing/Landing";
import { Layout } from "./components/layout/Layout";

function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<LandingPageRedirect />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/users" element={<Login />} />
            <Route path="/events" element={<Login />} />
            <Route path="/profile" element={<div>Profile Page</div>} />
            <Route path="/transactions" element={<Login />} />
            <Route path="/promotions" element={<Login />} />
            <Route
              path="/events/:eventId"
              element={<div>Event Details Page</div>}
            />
            <Route
              path="/transactions/:transactionId"
              element={<div>Transactions Details Page</div>}
            />
            <Route
              path="/promotions/:promotionId"
              element={<div>Promotions Details Page</div>}
            />
          </Route>
        </Routes>
      </UserProvider>
    </BrowserRouter>
  );
}

// If user is logged in, redirect "/" to profile page
function LandingPageRedirect() {
  const { user } = useUser();
  return user ? <Navigate to="/profile" /> : <Landing />;
}

export default App;
