"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loadingSignup, setLoadingSignup] = useState(false);
  const [loadingRedirect, setLoadingRedirect] = useState(false);
  const [loadingOtp, setLoadingOtp] = useState(false);
  const [showOtpForm, setShowOtpForm] = useState(false);
  const router = useRouter();

  const handleRedirect = async (e) => {
    e.preventDefault();
    setLoadingRedirect(true);
    router.push("/auth/login");
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!username || !name || !password || !email || username.trim() === "" || name.trim() === "" || password.trim() === "" || email.trim() === "") {
      setMessage("");
      return setError("Fill all the fields");
    }
    if (username.includes(" ") || password.includes(" ") || email.includes(" ")) {
      setMessage("");
      return setError("Spaces are not allowed in username, password, or email");
    }

    setLoadingSignup(true);

    try {
      const response = await axios.post("http://localhost:8000/auth/signup", { username, name, password, email });
      if (response.data === "OTP sent to your mail") {
        setShowOtpForm(true);
        setError("");
        setMessage(response.data);
      } else {
        setError(response.data);
        setMessage("");
      }
    } catch (error) {
      setError("An error occurred");
      setMessage("");
    } finally {
      setLoadingSignup(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    if (!otp || otp.trim() === "") {
      return setError("Please enter the OTP");
    }

    setLoadingOtp(true);

    try {
      const response = await axios.post("http://localhost:8000/auth/verifyOtp", { username, otp }, {withCredentials: true});
      if (response.data === "Account created successfully.") {
        setMessage(response.data + ", please wait...");
        setError("");
        router.push("/dashboard");
      } else {
        setError(response.data);
        setMessage("");
      }
    } catch (error) {
      setError("An error occurred while verifying OTP");
      setMessage("");
    } finally {
      setLoadingOtp(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-center">
        <div className="card shadow-lg" style={{ maxWidth: "400px", width: "100%" }}>
          <div className="card-body">
            <div className="text-center" style={{ backgroundColor: '#343a40', padding: '20px', borderRadius: '0.5rem' }}>
              <h1 className='text-white mb-0'>Nixty Bank</h1>
            </div>
            {!showOtpForm ? (
              <>
                <h3 className="text-center mb-4 mt-4">Sign Up</h3>
                <form>
                  <div className="mb-3">
                    <label className="form-label">Enter your Name</label>
                    <input
                      value={name}
                      type="text"
                      onChange={(e) => setName(e.target.value)}
                      className="form-control"
                      placeholder="Name here"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Enter your Username</label>
                    <input
                    value={username}
                      type="text"
                      onChange={(e) => setUsername(e.target.value)}
                      className="form-control"
                      placeholder="Username here"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Enter your Email</label>
                    <input
                    value={email}
                      type="email"
                      onChange={(e) => setEmail(e.target.value)}
                      className="form-control"
                      placeholder="Email here"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="form-label">Enter your Password</label>
                    <input
                    value={password}
                      type="password"
                      onChange={(e) => setPassword(e.target.value)}
                      className="form-control"
                      placeholder="Password here"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    onClick={handleSignup}
                    className="btn btn-primary w-100"
                    disabled={loadingSignup}
                  >
                    {loadingSignup ? (
                      <div className="d-flex align-items-center">
                        <div className="spinner-border spinner-border-sm text-white me-2" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                        Signing Up...
                      </div>
                    ) : (
                      "Sign Up"
                    )}
                  </button>
                  <p className="mt-3 text-center">
                    Already have an account? 
                    <a
                      href="#"
                      onClick={handleRedirect}
                      className="link-primary ms-2"
                      style={{ pointerEvents: loadingRedirect ? 'none' : 'auto' }}
                    >
                      {loadingRedirect ? (
                        <div className="spinner-border spinner-border-sm" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                      ) : (
                        "Login"
                      )}
                    </a>
                  </p>
                  <span className="text-danger d-block text-center">{error}</span>
                  <span className="text-success d-block text-center">{message}</span>
                </form>
              </>
            ) : (
              <>
                <h3 className="text-center mb-4 mt-4">Enter OTP</h3>
                <form>
                  <div className="mb-3">
                    <label className="form-label">Enter the OTP sent to your Email</label>
                    <input
                      value={otp}
                      type="text"
                      onChange={(e) => setOtp(e.target.value)}
                      className="form-control"
                      placeholder="OTP here"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    onClick={handleOtpSubmit}
                    className="btn btn-primary w-100"
                    disabled={loadingOtp}
                  >
                    {loadingOtp ? (
                      <div className="d-flex align-items-center">
                        <div className="spinner-border spinner-border-sm text-white me-2" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                        Verifying...
                      </div>
                    ) : (
                      "Verify OTP"
                    )}
                  </button>
                  <span className="text-danger d-block text-center">{error}</span>
                  <span className="text-success d-block text-center">{message}</span>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
