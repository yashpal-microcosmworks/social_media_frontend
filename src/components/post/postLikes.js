import { getAuthToken } from "../utils/auth";
import { fetchPosts } from "../Home/postService";

const handleLike = async (postId, reactionType, setPostDetails) => {
  const token = getAuthToken();
  try {
    const response = await fetch(`http://localhost:5001/post-likes/${postId}`, {
      method: "POST",
      body: JSON.stringify({ reactionType }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch updated post");
    }

    const data = await fetchPosts();

    setPostDetails(data);
  } catch (error) {
    console.error("Error handling like:", error);
  }
};

export default handleLike;
