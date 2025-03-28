import { getAuthToken } from "../utils/auth";

export const fetchPosts = async () => {
  try {
    const token = getAuthToken();
    const response = await fetch("http://localhost:5001/posts", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json(); // Parse the response

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch posts"); // Use backend message if available
    }

    return data;
  } catch (err) {
    console.error("Error fetching posts:", err);
    return { error: err.message, posts: [] };
  }
};

export const createPost = async (formData) => {
  try {
    const token = getAuthToken();
    const response = await fetch("http://localhost:5001/posts/upload", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`, // Ensure user is authenticated
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to create post");
    }

    return await response.json();
  } catch (err) {
    console.error("Error creating post:", err);
  }
};
