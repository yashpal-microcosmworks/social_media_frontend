import { getAuthToken } from "../utils/auth";

const commentHandler = async (postId, comment) => {
  const token = getAuthToken();
  try {
    const response = await fetch(`http://localhost:5001/comments/${postId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content: comment }),
    });

    if (!response.ok) {
      throw new Error("Failed to post comment");
    }

    const newComment = await response.json();
    return newComment;
  } catch (error) {
    console.error("Error posting comment:", error);
    return null;
  }
};

export default commentHandler;
