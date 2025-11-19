import React, { useEffect, useState } from "react";
import { getAllLinks, deleteLink } from "../api";
import AddLinkModal from "./AddLinkModal";

export default function Dashboard() {
  const [links, setLinks] = useState([]);
  const [showModal, setShowModal] = useState(false);

  async function loadLinks() {
    const res = await getAllLinks();
    setLinks(res.links || []);
  }

  async function handleDelete(code) {
    if (!confirm("Delete this link?")) return;
    await deleteLink(code);
    loadLinks();
  }

  useEffect(() => {
    loadLinks();
  }, []);

  return (
    <div className="dashboard">
      <div className="top-bar">
        <h2>Your Links</h2>
        <button onClick={() => setShowModal(true)}>+ Add Link</button>
      </div>

      <table className="link-table">
        <thead>
          <tr>
            <th>Short Code</th>
            <th>Original URL</th>
            <th>Clicks</th>
            <th>Last Clicked</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {links.map((l) => (
            <tr key={l.code}>
              <td>
                <a href={`http://localhost:5000/${l.code}`} target="_blank">
                  {l.code}
                </a>
              </td>
              <td>{l.url}</td>
              <td>{l.clicks}</td>
              <td>{l.lastClicked ? new Date(l.lastClicked).toLocaleString() : "—"}</td>
              <td>
                <a href={`/stats/${l.code}`} className="btn-small">Stats</a>
                <button className="btn-small danger" onClick={() => handleDelete(l.code)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && <AddLinkModal onClose={() => setShowModal(false)} onCreated={loadLinks} />}
    </div>
  );
}
