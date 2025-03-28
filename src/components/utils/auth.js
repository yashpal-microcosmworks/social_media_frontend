export const getAuthToken = () => {
  return localStorage.getItem("token");
};

export const isTokenValid = () => {
  const token = localStorage.getItem("token");
  const expiryTime = localStorage.getItem("tokenExpiry");
  console.log("token");
  if (!token || !expiryTime) {
    return false;
  }

  const isExpired = Date.now() > parseInt(expiryTime, 10);
  console.log(isExpired);
  return !isExpired;
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("tokenExpiry");
};
