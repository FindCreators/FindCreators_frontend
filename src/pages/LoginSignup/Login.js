import React, { useState } from "react";
import { useNavigate } from "react-router";
import { usePhoneAuth } from "../../hooks/usePhoneAuth";
import PhoneInput from "react-phone-number-input";
import { useDispatch } from "react-redux";
import "react-phone-number-input/style.css";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { login } from "../../redux/actions/authActions";

const Login = () => {
  const [error, setError] = useState("");
  // const navigate = useNavigate();
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
    resetForm,
    resendOTP,
  } = usePhoneAuth({
    onSuccess: async () => {
      try {
        const response = await dispatch(login(phoneNumber.substring(1)));
        if (response.profile.type === "creator") {
          // navigate("/creator");
        } else if (response.profile.type === "brand") {
          // navigate("/brand");
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
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-blue-600 to-blue-800 p-12 text-white justify-center items-center">
        <div className="max-w-md">
          <h1 className="text-4xl font-bold mb-6">Welcome Back!</h1>
          <p className="text-xl mb-8">
            Connect with top brands and create amazing content together.
          </p>
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="bg-blue-500 p-2 rounded-full mr-4">
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
              <span>Access exclusive brand collaborations</span>
            </div>
            <div className="flex items-center">
              <div className="bg-blue-500 p-2 rounded-full mr-4">
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
              <span>Grow your influence</span>
            </div>
            <div className="flex items-center">
              <div className="bg-blue-500 p-2 rounded-full mr-4">
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
              <span>Quick and secure payments</span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">
              {step === "PHONE" ? "Sign In" : "Verify Phone"}
            </h2>
            <p className="text-gray-600 mt-2">
              {step === "PHONE"
                ? "Welcome back! Please sign in to continue."
                : "Almost there! Please verify your phone."}
            </p>
          </div>

          {step === "PHONE" ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <div className="flex items-center border border-gray-300 rounded-lg shadow-sm hover:border-blue-400 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all">
                  <div className="pl-3 pr-2 flex items-center bg-gray-100 rounded-l-lg"></div>
                  <PhoneInput
                    international
                    defaultCountry="IN"
                    value={phoneNumber}
                    onChange={handlePhoneNumberChange}
                    className="*:outline-none w-full px-4 py-3 rounded-r-lg focus:outline-none"
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-50 text-red-500 px-4 py-2 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Sending OTP...
                  </span>
                ) : (
                  "Send OTP"
                )}
              </button>

              <div className="mt-6 text-center text-sm">
                <span className="text-gray-600">Don't have an account? </span>
                <Link
                  to="/signup"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Sign up
                </Link>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="text-center">
                <div className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg inline-block mb-6">
                  Code sent to {phoneNumber}
                </div>
              </div>

              <div className="flex justify-center space-x-3">
                {[...Array(6)].map((_, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength="1"
                    value={otp[index] || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^[0-9]*$/.test(value)) {
                        setOtp((prevOtp) => {
                          const newOtp =
                            prevOtp.slice(0, index) +
                            value +
                            prevOtp.slice(index + 1);
                          return newOtp;
                        });
                        if (index < 5 && value) {
                          document.getElementById(`otp-${index + 1}`)?.focus();
                        }
                      }
                    }}
                    onKeyUp={(e) => {
                      if (e.key === "Backspace" && !otp[index]) {
                        if (index > 0) {
                          document.getElementById(`otp-${index - 1}`)?.focus();
                        }
                      }
                    }}
                    id={`otp-${index}`}
                    className="w-12 h-12 text-center text-xl border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>

              <div className="space-y-3 text-center">
                <button
                  onClick={countdown > 0 ? undefined : resendOTP}
                  className={`text-sm ${
                    countdown > 0
                      ? "text-gray-400"
                      : "text-blue-600 hover:text-blue-700"
                  }`}
                >
                  {countdown > 0
                    ? `Resend code in ${countdown}s`
                    : "Resend code"}
                </button>

                <button
                  onClick={resetForm}
                  className="block w-full text-sm text-blue-600 hover:text-blue-700"
                >
                  Change phone number
                </button>
              </div>
            </div>
          )}
          <div id="recaptcha-container"></div>
        </div>
      </div>
    </div>
  );
};

export default Login;
