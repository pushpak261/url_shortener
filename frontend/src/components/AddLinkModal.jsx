import React, { useState } from "react";
import { createLink } from "../api";

export default function AddLinkModal({ onClose, onCreated }) {
  const [url, setUrl] = useState("");
  const [code, setCode] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    const res = await createLink({ url, code });

    if (res.error) {
      alert(res.error);
      return;
    }

    onCreated();
    onClose();
  }

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h3>Create Short Link</h3>

        <form onSubmit={handleSubmit}>
          <label>URL</label>
          <input
            type="text"
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />

          <label>Custom Code (optional)</label>
          <input
            type="text"
            placeholder="6-8 characters"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />

          <button type="submit">Create</button>
          <button className="secondary" type="button" onClick={onClose}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}
