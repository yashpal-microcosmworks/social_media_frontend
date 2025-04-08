import { useEffect, useState } from "react";
import { fetchUserProfile } from "./userProfile";
import { fetchPosts } from "../Home/postService";
import PostList from "../post/PostList";
import styles from "./Profile.module.css";
import FriendsList from "./FriendsList";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("about");
  const [posts, setPosts] = useState([]); // State to store posts
  const [postLoading, setPostLoading] = useState(false); // Loading state for posts

  useEffect(() => {
    const getUserProfile = async () => {
      const profileData = await fetchUserProfile();
      if (profileData) setUser(profileData);
      setLoading(false);
    };

    getUserProfile();
  }, []);

  useEffect(() => {
    if (activeTab === "posts") {
      const loadPosts = async () => {
        setPostLoading(true);
        const data = await fetchPosts();
        if (data) setPosts(data);
        setPostLoading(false);
      };
      loadPosts();
    }
  }, [activeTab]);

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (!user) return <div className={styles.error}>Failed to load profile.</div>;

  return (
    <div className={styles.profileContainer}>
      <div className={styles.avatarContainer}>
        <img
          src={user.avatar || "/default-avatar.png"}
          alt="Profile Avatar"
          className={styles.avatar}
        />
      </div>

      <h2 className={styles.name}>
        {user.firstName} {user.lastName}
      </h2>

      <div className={styles.navBar}>
        <button
          className={`${styles.navButton} ${
            activeTab === "about" ? styles.activeTab : ""
          }`}
          onClick={() => setActiveTab("about")}
        >
          About
        </button>
        <button
          className={`${styles.navButton} ${
            activeTab === "posts" ? styles.activeTab : ""
          }`}
          onClick={() => setActiveTab("posts")}
        >
          Posts
        </button>
        <button
          className={`${styles.navButton} ${
            activeTab === "friends" ? styles.activeTab : ""
          }`}
          onClick={() => setActiveTab("friends")}
        >
          Friends
        </button>
      </div>

      <div className={styles.content}>
        {activeTab === "about" && (
          <div className={styles.aboutSection}>
            <h3>About</h3>
            <div className={styles.userInfo}>
              <div className={styles.infoRow}>
                <span className={styles.label}>First Name:</span>
                <span className={styles.value}>{user.firstName}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.label}>Last Name:</span>
                <span className={styles.value}>{user.lastName}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.label}>Email:</span>
                <span className={styles.value}>{user.email}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.label}>Status:</span>
                <span
                  className={user.isActive ? styles.active : styles.inactive}
                >
                  {user.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </div>
        )}

        {activeTab === "posts" && (
          <div className={styles.postsSection}>
            <h3>Posts</h3>
            {postLoading ? <p>Loading posts...</p> : <PostList posts={posts} />}
          </div>
        )}

        {activeTab === "friends" && (
          <div className={styles.friendsSection}>
            <h3>Friends</h3>
            <FriendsList />
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
