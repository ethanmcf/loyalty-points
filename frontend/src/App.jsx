import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { UserProvider, useUser } from "./contexts/UserContext";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Landing from "./pages/Landing/Landing";
import { Layout } from "./components/layout/Layout";
import Profile from "./pages/Profile/Profile";
import Reset from "./pages/Reset/Reset";

function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            {/* Public routes that redirect to profile if user is logged in */}
            <Route index element={<LandingPageRedirect />} />
            <Route
              path="/register"
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              }
            />
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />

            {/* Protected routes that need authentication, redirect to login page */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/users"
              element={
                <ProtectedRoute>
                  <div>Users Page</div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/events"
              element={
                <ProtectedRoute>
                  <div>Events Page</div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/transactions"
              element={
                <ProtectedRoute>
                  <div>Transactions Page</div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/promotions"
              element={
                <ProtectedRoute>
                  <div>Promotions Page</div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/events/:eventId"
              element={
                <ProtectedRoute>
                  <div>Event Details Page</div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/transactions/:transactionId"
              element={
                <ProtectedRoute>
                  <div>Transaction Details Page</div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/promotions/:promotionId"
              element={
                <ProtectedRoute>
                  <div>Promotion Details Page</div>
                </ProtectedRoute>
              }
            />
            {/* Both protected and unprotected */}
            <Route path="/reset" element={<Reset />} />
            {/* Catch-all route for 404 */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </UserProvider>
    </BrowserRouter>
  );
}

// If user is logged in, redirect "/" to profile page
function LandingPageRedirect() {
  const { user } = useUser();
  return user ? <Navigate to="/profile" replace /> : <Landing />;
}

// Public routes, only non logged in users can access. Redirect to profile if already logged in
function PublicRoute({ children }) {
  const { user } = useUser();
  return user ? <Navigate to="/profile" replace /> : children;
}

// Protected routes, only logged in users can access, redirect to login if not authenticated
function ProtectedRoute({ children }) {
  const { user, loading } = useUser();
  if (loading) {
    return <div>Loading - temporary if we add skeleton loading</div>;
  }
  return user ? children : <Navigate to="/login" replace />;
}

export default App;
