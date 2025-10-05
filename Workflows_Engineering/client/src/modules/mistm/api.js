const API = process.env.REACT_APP_MISTM_API_BASE_URL || 'http://localhost:5004/api';

export async function api(path, init) {
  // The API base URL already includes '/api', so we should not add '/api' again in the path
  // If path starts with '/api/', remove the '/api' part
  const normalizedPath = path.startsWith('/api/') ? path.substring(4) : path;
  const fullUrl = `${API}${normalizedPath}`;
  
  const res = await fetch(fullUrl, {
    headers: { 'Content-Type': 'application/json' },
    ...init
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}