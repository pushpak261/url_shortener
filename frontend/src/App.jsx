import React from "react";
import { Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import StatsPage from "./components/StatsPage";

export default function App() {
  return (
    <div>
      <Header />

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/stats/:code" element={<StatsPage />} />

        {/* Fallback for unknown routes */}
        <Route path="*" element={<h2 style={{ padding: 20 }}>Page not found</h2>} />
      </Routes>
    </div>
  );
}
