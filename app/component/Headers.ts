export function getAuthHeaders() {
  const tokenname = String(process.env.NEXT_PUBLIC_TOKEN_NAME);
  const token = localStorage.getItem(tokenname);

  return {
    Authorization: `Bearer ${token}`,
  };
}
