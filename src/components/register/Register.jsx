import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import RegisterImg from "../../assets/register.jpg";
import styles from "./Register.module.css";

const Register = () => {
  const [email, setEmail] = useState("");
  const [loading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:5001/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong!"); // Handle server errors
      }

      navigate("/verify", { state: { email } });
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.left}>
        <img src={RegisterImg} alt="Welcome" className={styles.image} />
      </div>

      <div className={styles.right}>
        <h2 className={styles.title}>Register</h2>
        <form onSubmit={handleRegister} className={styles.form}>
          <input
            type="email"
            className={styles.input}
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {errorMsg && <p className={styles.errorMsg}>{errorMsg}</p>}
          <button type="submit" className={styles.registerButton}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
        <p className={styles.login}>
          Already have an account? <Link to="/">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
