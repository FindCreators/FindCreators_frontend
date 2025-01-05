import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { usePhoneAuth } from "../../hooks/usePhoneAuth";
import PhoneInput from "react-phone-number-input";
import { useDispatch } from "react-redux";
import "react-phone-number-input/style.css";
import toast from "react-hot-toast";
import { login } from "../../redux/actions/authActions";
import CustomSpinner from "../../components/common/CustomSpinner";

const Login = () => {
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    phoneNumber,
    setPhoneNumber,
    otp,
    setOtp,
    step,
    setStep,
    loading,
    countdown,
    handlePhoneNumberChange,
    sendOTP,
    verifyOTP,
    resendOTP,
  } = usePhoneAuth({
    onSuccess: async (user) => {
      try {
        const cleanPhone = phoneNumber.substring(1); // Remove the + prefix
        const response = await dispatch(login(cleanPhone));

        if (!response?.profile?.type) {
          throw new Error("Invalid user type");
        }

        toast.success("Login successful!");
        navigate(`/${response.profile.type}`);
      } catch (error) {
        console.error("Login error:", error);
        setError(error.message || "Login failed");
        toast.error(error.message || "Login failed");
      }
    },
    onError: (errorMessage) => {
      toast.error(errorMessage);
      setError(errorMessage);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    // Remove non-digit characters and ensure the number starts with +91
    const cleanNumber = phoneNumber.replace(/\D/g, "");

    // Check if the number starts with 91 and has exactly 12 digits (+91 + 10 digits)
    if (!cleanNumber.startsWith("91") || cleanNumber.length !== 12) {
      setError("Please enter a valid 10-digit phone number with +91 prefix");
      return;
    }

    // Send the full number with +91 prefix to the API
    sendOTP(`+${cleanNumber}`); // Ensure the +91 prefix is included
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      {/* Left Section */}
      <div className="w-full md:w-1/2 bg-gradient-to-br from-blue-600 to-blue-800 text-white flex items-center justify-center p-6 md:p-12">
        <div className="max-w-md text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Welcome Back!</h1>
          <p className="text-base md:text-xl mb-6">
            Connect with top brands and create amazing content together.
          </p>
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="bg-blue-500 p-2 rounded-full mr-3">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <span className="text-sm md:text-base">
                Access exclusive brand collaborations
              </span>
            </div>
            <div className="flex items-center">
              <div className="bg-blue-500 p-2 rounded-full mr-3">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </div>
              <span className="text-sm md:text-base">Grow your influence</span>
            </div>
            <div className="flex items-center">
              <div className="bg-blue-500 p-2 rounded-full mr-3">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <span className="text-sm md:text-base">
                Quick and secure payments
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
              {step === "PHONE" ? "Sign In" : "Verify Phone"}
            </h2>
            <p className="text-sm md:text-base text-gray-600 mt-1">
              {step === "PHONE"
                ? "Welcome back! Please sign in to continue."
                : "Almost there! Please verify your phone."}
            </p>
          </div>

          {step === "PHONE" ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <PhoneInput
                  international
                  defaultCountry="IN"
                  value={phoneNumber || ""}
                  onChange={(value) => {
                    const cleanNumber = (value || "").replace(/\D/g, "");

                    if (
                      cleanNumber.startsWith("91") &&
                      cleanNumber.length <= 12
                    ) {
                      setPhoneNumber(`+${cleanNumber}`);
                    }
                  }}
                  className=" *:outline-none w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-200"
                />
              </div>

              {error && (
                <div className="bg-red-50 text-red-500 px-4 py-2 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 flex items-center justify-center"
              >
                {loading ? (
                  <CustomSpinner color="#ffffff" size={20} />
                ) : (
                  "Send OTP"
                )}
              </button>
            </form>
          ) : (
            <div className="space-y-4">
              <p className="text-center text-gray-600">
                Code sent to {phoneNumber}{" "}
                <button
                  onClick={() => {
                    setOtp("");
                    handlePhoneNumberChange("");
                    setStep("PHONE");
                  }}
                  className="text-blue-600 hover:text-blue-700 underline transition-colors duration-200"
                >
                  Change Number
                </button>
              </p>

              <div className="flex justify-center space-x-2">
                {[...Array(6)].map((_, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength="1"
                    value={otp[index] || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^[0-9]*$/.test(value)) {
                        setOtp(
                          (prevOtp) =>
                            prevOtp.slice(0, index) +
                            value +
                            prevOtp.slice(index + 1)
                        );
                        if (index < 5 && value) {
                          document.getElementById(`otp-${index + 1}`)?.focus();
                        }
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Backspace" || e.key === "Delete") {
                        if (index > 0 && !otp[index]) {
                          document.getElementById(`otp-${index - 1}`)?.focus();
                        }
                      }
                    }}
                    id={`otp-${index}`}
                    className="w-10 h-10 text-center text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-200"
                  />
                ))}
              </div>

              {error && (
                <div className="bg-red-50 text-red-500 px-4 py-2 rounded-lg text-sm text-center">
                  {error}
                </div>
              )}

              <button
                onClick={verifyOTP}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 flex items-center justify-center"
              >
                {loading ? (
                  <CustomSpinner color="#ffffff" size={20} />
                ) : (
                  "Verify OTP"
                )}
              </button>
            </div>
          )}

          <div className="text-center mt-4">
            <button
              onClick={resendOTP}
              disabled={countdown > 0 || loading}
              className={`text-sm ${
                countdown > 0
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-blue-600 hover:text-blue-700"
              } transition-colors duration-200`}
            >
              {countdown > 0 ? `Resend code in ${countdown}s` : "Resend code"}
            </button>
          </div>

          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-blue-600 hover:text-blue-700 transition-colors duration-200"
              >
                Sign Up
              </Link>
            </p>
          </div>

          <div id="recaptcha-container"></div>
        </div>
      </div>
    </div>
  );
};

export default Login;
