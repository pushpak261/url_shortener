const BASE_URL = import.meta.env.VITE_BASE_URL;

export async function getAllLinks() {
  const res = await fetch(`${BASE_URL}/api/links`);
  return res.json();
}

export async function createLink(data) {
  const res = await fetch(`${BASE_URL}/api/links`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function getLinkStats(code) {
  const res = await fetch(`${BASE_URL}/api/links/${code}`);
  return res.json();
}

export async function deleteLink(code) {
  const res = await fetch(`${BASE_URL}/api/links/${code}`, {
    method: "DELETE",
  });
  return res.json();
}
