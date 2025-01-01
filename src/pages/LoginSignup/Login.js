import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePhoneAuth } from "../../hooks/usePhoneAuth";
import PhoneInput from "react-phone-number-input";
import { useDispatch } from "react-redux";
import "react-phone-number-input/style.css";
import toast from "react-hot-toast";
import { login } from "../../redux/actions/authActions";

const Login = () => {
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    phoneNumber,
    otp,
    setOtp,
    step,
    loading,
    countdown,
    handlePhoneNumberChange,
    sendOTP,
    verifyOTP,
    resendOTP,
  } = usePhoneAuth({
    onSuccess: async () => {
      try {
        const response = await dispatch(login(phoneNumber.substring(1)));
        if (response.profile.type === "creator") {
          navigate("/creator");
        } else if (response.profile.type === "brand") {
          navigate("/brand");
        } else {
          setError("Invalid user type");
        }
      } catch (error) {
        console.error("Login error:", error);
        setError(error.message);
      }
    },
    onError: (errorMessage) => {
      toast.error(errorMessage);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!phoneNumber || phoneNumber.length < 13) {
      setError("Please enter a valid phone number");
      return;
    }
    sendOTP();
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
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
        <div className="w-full max-w-md">
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
                  value={phoneNumber}
                  onChange={handlePhoneNumberChange}
                  className="  w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>
            </form>
          ) : (
            <div className="space-y-4">
              <p className="text-center text-gray-600">
                Code sent to {phoneNumber}
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
                    id={`otp-${index}`}
                    className="w-10 h-10 text-center text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
            </div>
          )}

          <div className="text-center mt-4">
            <button
              onClick={countdown > 0 ? undefined : resendOTP}
              className={`text-sm ${
                countdown > 0
                  ? "text-gray-400"
                  : "text-blue-600 hover:text-blue-700"
              }`}
            >
              {countdown > 0 ? `Resend code in ${countdown}s` : "Resend code"}
            </button>
          </div>
          <div id="recaptcha-container"></div>
        </div>
      </div>
    </div>
  );
};

export default Login;
