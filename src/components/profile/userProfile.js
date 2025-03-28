import { getAuthToken } from "../utils/auth";

export const fetchUserProfile = async () => {
  const token = getAuthToken();

  try {
    const response = await fetch("http://localhost:5001/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user profile");
    }

    const data = await response.json();
    return data.user; // Extract user object
  } catch (error) {
    console.error("Error fetching profile:", error);
    return null;
  }
};
