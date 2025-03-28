import { useEffect, useState } from "react";
import { getAuthToken } from "../utils/auth";
import styles from "./FriendsList.module.css";

const FriendsList = () => {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAll, setShowAll] = useState(false);

  const token = getAuthToken();

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await fetch(
          "http://localhost:5001/friend-request/list",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // Ensure token is stored in localStorage
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch friends");
        }

        const data = await response.json();
        setFriends(data.friends);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFriends();
  }, [token]);

  if (loading) return <p className={styles.message}>Loading friends...</p>;
  if (error) return <p className={styles.message}>Error: {error}</p>;
  if (friends.length === 0)
    return <p className={styles.message}>No friends found</p>;

  const visibleFriends = showAll ? friends : friends.slice(0, 6);

  return (
    <section className={styles.friendsSection}>
      <h2 className={styles.friendsHeading}>Friends</h2>
      <div className={styles.friendsContainer}>
        {visibleFriends.map((friend) => (
          <div key={friend.id} className={styles.friendCard}>
            <img
              src={friend.avatar || "/default-avatar.png"}
              alt={`${friend.name}'s Avatar`}
              className={styles.avatar}
            />
            <h3>{friend.name}</h3>
            <p className={styles.since}>
              Friends since:{" "}
              {new Date(friend.friendshipSince).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>

      {!showAll && friends.length > 6 && (
        <button
          className={styles.showAllButton}
          onClick={() => setShowAll(true)}
        >
          See All Friends
        </button>
      )}
    </section>
  );
};

export default FriendsList;
