import { useState, useEffect } from "react";
import { fetchPosts, createPost } from "./postService";
import PostList from "../post/PostList";
import styles from "./Home.module.css";

function Home() {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState("");
  const [files, setFiles] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const getPosts = async () => {
      const data = await fetchPosts();

      if (data.error) {
        setError(data.error);
      } else {
        setPosts(data);
      }
    };
    getPosts();
  }, []);

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("content", content);
    if (files) {
      for (let i = 0; i < files.length; i++) {
        formData.append("files", files[i]);
      }
    }

    try {
      await createPost(formData);

      const updatedPosts = await fetchPosts();

      setPosts(updatedPosts);
      setContent("");
      setFiles(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.homeContainer}>
      <main className={styles.mainContent}>
        {/* Post Form */}
        <form onSubmit={handlePostSubmit} className={styles.postForm}>
          <textarea
            className={styles.textarea}
            placeholder="Write something..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
          <div className={styles.buttonContainer}>
            <input
              type="file"
              multiple
              onChange={(e) => setFiles(e.target.files)}
              className={styles.fileInput}
            />
            <button
              type="submit"
              disabled={loading}
              className={styles.postButton}
            >
              {loading ? "Posting..." : "Post Something"}
            </button>
          </div>
          {error ? <p>{error}</p> : null}
        </form>
      </main>

      {/* Posts Section - Separate from Form */}
      <div className={styles.postsContainer}>
        {posts.length > 0 ? <PostList key={posts} posts={posts} /> : null}
      </div>
    </div>
  );
}

export default Home;
