import React from "react";

export default function Header() {
  return (
    <header className="header">
      <h1 className="logo">TinyLink</h1>

      <input type="checkbox" id="menu-toggle" className="menu-toggle" />
      <label htmlFor="menu-toggle" className="hamburger">&#9776;</label>

      <nav className="nav-links">
        <a href="/">Dashboard</a>
      </nav>
    </header>
  );
}
