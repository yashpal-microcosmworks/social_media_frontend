import { useEffect, useState } from "react";
import { getAuthToken } from "../utils/auth";
import styles from "./FriendsList.module.css";

const FriendsList = () => {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const token = getAuthToken();
        const response = await fetch(
          "http://localhost:5001/friend-request/list",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        if (data.friends) setFriends(data.friends);
      } catch (error) {
        console.error("Error fetching friends:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFriends();
  }, []);

  const removeFriend = async (friendId) => {
    try {
      const token = getAuthToken();
      const response = await fetch(
        `http://localhost:5001/friend-request/remove/${friendId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      await response.json();
      if (response.ok) {
        setFriends(friends.filter((friend) => friend.id !== friendId));
      }
    } catch (error) {
      console.error("Error removing friend:", error);
    }
  };

  if (loading) return <div className={styles.loading}>Loading friends...</div>;
  if (friends.length === 0)
    return <div className={styles.noFriends}>No friends found.</div>;

  return (
    <div className={styles.friendsContainer}>
      {friends.map((friend) => (
        <div key={friend.id} className={styles.friendCard}>
          <img
            src={friend.avatar || "/default-avatar.png"}
            alt={friend.name}
            className={styles.avatar}
          />
          <div className={styles.friendInfo}>
            <h4 className={styles.friendName}>{friend.name}</h4>
            <p className={styles.friendSince}>
              Friends since:{" "}
              {new Date(friend.friendshipSince).toLocaleDateString()}
            </p>
          </div>
          <button
            className={styles.removeButton}
            onClick={() => removeFriend(friend.id)}
          >
            Remove Friend
          </button>
        </div>
      ))}
    </div>
  );
};

export default FriendsList;
