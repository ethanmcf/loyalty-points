import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "./contexts/UserContext";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Landing from "./pages/Landing/Landing";
import { Layout } from "./components/layout/Layout";

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Landing />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/users" element={<Login />} />
            <Route path="/events" element={<Login />} />
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
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
