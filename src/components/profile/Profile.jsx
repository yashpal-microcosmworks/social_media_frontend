import { useEffect, useState } from "react";
import { fetchUserProfile } from "./userProfile";
import FriendsList from "./FriendsList";
import styles from "./Profile.module.css"; // Importing module CSS

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserProfile = async () => {
      const profileData = await fetchUserProfile();
      if (profileData) setUser(profileData);
      setLoading(false);
    };

    getUserProfile();
  }, []);

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (!user) return <div className={styles.error}>Failed to load profile.</div>;

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileCard}>
        <img src={user.avatar} alt="Profile Avatar" className={styles.avatar} />
        <h2 className={styles.name}>
          {user.firstName} {user.lastName}
        </h2>
        <p className={styles.email}>{user.email}</p>

        <span
          className={`${styles.status} ${
            user.isActive ? styles.active : styles.inactive
          }`}
        >
          {user.isActive ? "Active" : "Inactive"}
        </span>
      </div>
      <FriendsList />
    </div>
  );
};

export default Profile;
