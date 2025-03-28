import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import VerifyImage from "../../assets/verify.jpg";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import styles from "./VerifyAccount.module.css";

function VerifyAccount() {
  const { setAuthStatus } = useAuth();
  const [OTP, setOtp] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes timer
  const [otpExpired, setOtpExpired] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || "";

  useEffect(() => {
    if (!email) {
      navigate("/register");
    }

    // Start countdown timer
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setOtpExpired(true); // Mark OTP as expired
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [email, navigate]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMessage("");

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:5001/verifyaccount", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          OTP,
          firstName,
          lastName,
          password,
          confirmPassword,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Something went wrong!");
      }

      const expiryTime = Date.now() + data.expiry;
      setAuthStatus(data.token, expiryTime);

      navigate("/home");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    setResendLoading(true);
    setError("");
    setSuccessMessage("");
    setOtpExpired(false);
    setTimeLeft(180);

    try {
      const response = await fetch(
        "http://localhost:5001/verifyaccount/resend",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to resend OTP!");
      }

      setSuccessMessage("OTP resent successfully! Check your email.");
    } catch (error) {
      setError(error.message);
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.imageContainer}>
        <img src={VerifyImage} alt="Verify Account" className={styles.image} />
      </div>

      <div className={styles.container}>
        <h2 className={styles.title}>Verify Your Account</h2>
        <p className={styles.info}>
          OTP sent to <strong>{email}</strong>
        </p>

        <p className={styles.timer}>
          Time left:{" "}
          {otpExpired ? (
            <span className={styles.expired}>OTP expired</span>
          ) : (
            formatTime(timeLeft)
          )}
        </p>

        <form onSubmit={handleVerify} className={styles.form}>
          <input
            type="text"
            placeholder="Enter OTP"
            value={OTP}
            onChange={(e) => setOtp(e.target.value)}
            required
            className={styles.input}
          />
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            className={styles.input}
          />
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            className={styles.input}
          />

          <div className={styles.passwordContainer}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={styles.input}
            />
            <span
              className={styles.eyeIcon}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <div className={styles.passwordContainer}>
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className={styles.input}
            />
            <span
              className={styles.eyeIcon}
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          {error && <p className={styles.error}>{error}</p>}
          {successMessage && <p className={styles.success}>{successMessage}</p>}
          <button type="submit" disabled={loading} className={styles.button}>
            {loading ? "Verifying..." : "Verify"}
          </button>
        </form>

        <button
          type="button"
          disabled={resendLoading}
          onClick={resendOtp}
          className={`${styles.resendButton} ${
            resendLoading ? styles.disabled : ""
          }`}
        >
          {resendLoading ? "Resending OTP..." : "Resend OTP"}
        </button>
      </div>
    </div>
  );
}

export default VerifyAccount;
