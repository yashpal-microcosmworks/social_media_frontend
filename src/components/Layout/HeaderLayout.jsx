import { Link, Outlet, useLocation } from "react-router-dom";
import { AiFillHome } from "react-icons/ai";
import { FaUserFriends, FaUser } from "react-icons/fa";
import styles from "./HeaderLayout.module.css";

function HeaderLayout() {
  const location = useLocation();

  return (
    <>
      <div className={styles.homeContainer}>
        <header className={styles.header}>
          <div className={styles.logo}>Connectify</div>
          <nav className={styles.navIcons}>
            <Link
              to="/home"
              className={`${styles.iconLink} ${
                location.pathname === "/home" ? styles.active : ""
              }`}
            >
              <AiFillHome className={styles.icon} />
              <span className={styles.iconText}>Home</span>
            </Link>
            <Link
              to="/home/friends"
              className={`${styles.iconLink} ${
                location.pathname === "/home/friends" ? styles.active : ""
              }`}
            >
              <FaUserFriends className={styles.icon} />
              <span className={styles.iconText}>Friends</span>
            </Link>
            <Link
              to="/home/profile"
              className={`${styles.iconLink} ${
                location.pathname === "/home/profile" ? styles.active : ""
              }`}
            >
              <FaUser className={styles.icon} />
              <span className={styles.iconText}>Profile</span>
            </Link>
          </nav>
        </header>
      </div>
      <main>
        <Outlet />
      </main>
    </>
  );
}

export default HeaderLayout;
