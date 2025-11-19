import React, { useEffect, useState } from "react";
import { getLinkStats } from "../api";
import { useParams } from "react-router-dom";

export default function StatsPage() {
  const { code } = useParams();
  const [link, setLink] = useState(null);

  useEffect(() => {
    async function loadStats() {
      const res = await getLinkStats(code);
      if (res.error) {
        alert("Link not found");
        return;
      }
      setLink(res.link);
    }
    loadStats();
  }, [code]);

  if (!link) return <p>Loading...</p>;

  return (
    <div className="stats-page">
      <h2>Stats for: {link.code}</h2>

      <div className="stats-card">
        <p><strong>Original URL:</strong> {link.url}</p>
        <p><strong>Total Clicks:</strong> {link.clicks}</p>
        <p>
          <strong>Last Clicked:</strong>{" "}
          {link.lastClicked ? new Date(link.lastClicked).toLocaleString() : "Never"}
        </p>
        <p><strong>Created:</strong> {new Date(link.createdAt).toLocaleString()}</p>
      </div>

      <a className="btn" href="/">Back</a>
    </div>
  );
}
