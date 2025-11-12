import { useState } from "react";
import { BrowserRouter, Routes, Link, Route, NavLink } from "react-router-dom";
import { Dashboard } from "./pages/Dashboard/Dashboard";
import { UserProvider } from "./contexts/UserContext";
import "./App.css";
import { Navbar } from "./components/navbar/NavBar";

function App() {
  // Reference: https://reactrouter.com/api/components/NavLink
  return (
    <div className="App">
      <UserProvider>
        <Navbar />
      </UserProvider>
    </div>
  );
}

export default App;
