import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { usePhoneAuth } from "../../hooks/usePhoneAuth";
import toast from "react-hot-toast";
import {
  createUser,
  validateNewEmailorPhone,
} from "../../network/networkCalls";
import SignupForm from "./SignupForm";
import VerifyPhone from "./VerifyPhone";

const Signup = () => {
  const [mode, setMode] = useState("creator");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const recaptchaRef = useRef(null);

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
        formData.phone = phoneNumber.substring(1);
        await createUser(mode, formData);
        navigate("/home");
      } catch (e) {
        setError("Something went wrong");
      }
    },
    onError: (errorMessage) => {
      toast.error(errorMessage);
    },
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!phoneNumber || phoneNumber.length < 13) {
      setError("Please enter a valid phone number");
      return;
    }

    try {
      const validationResponse = await validateNewEmailorPhone({
        entity: mode,
        email: formData.email,
        phone: phoneNumber.substring(1),
      });

      if (validationResponse.error) {
        setError(validationResponse.error);
        return;
      }
      sendOTP();
    } catch (e) {
      setError("Something went wrong");
    }
  };

  useEffect(() => {
    setFormData(
      mode === "creator"
        ? {
            fullName: "",
            email: "",
            phone: "",
            password: "",
          }
        : {
            companyName: "",
            email: "",
            phone: "",
            password: "",
          }
    );
  }, [mode]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="md:w-1/2 bg-gradient-to-br from-blue-600 to-blue-800 p-6 md:p-12 text-white flex flex-col justify-center items-center">
        <div className="max-w-md text-center">
          <h1 className="text-4xl font-bold mb-6">Join Our Community</h1>
          <p className="text-xl mb-8">
            {mode === "creator"
              ? "Connect with leading brands and monetize your influence"
              : "Find the perfect creators for your brand campaigns"}
          </p>

          <div className="space-y-4">
            {mode === "creator" ? (
              <>
                <div className="flex items-center justify-center">
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
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <span>Monetize your influence</span>
                </div>
                <div className="flex items-center justify-center">
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
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                  <span>Connect with top brands</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center justify-center">
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
                        d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <span>Post collaboration opportunities</span>
                </div>
                <div className="flex items-center justify-center">
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
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  </div>
                  <span>Track campaign performance</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">
              {step === "PHONE" ? "Create Account" : "Verify Phone"}
            </h2>
            <p className="text-gray-600 mt-2">
              {step === "PHONE"
                ? "Let's get started with your account"
                : "Almost there! Please verify your phone."}
            </p>
          </div>

          {step === "PHONE" && (
            <div className="mb-8">
              <div className="flex rounded-lg bg-gray-100 p-1">
                <button
                  className={`flex-1 py-3 rounded-md transition-all ${
                    mode === "creator" ? "bg-white shadow-sm" : ""
                  }`}
                  onClick={() => setMode("creator")}
                >
                  Creator
                </button>
                <button
                  className={`flex-1 py-3 rounded-md transition-all ${
                    mode === "brand" ? "bg-white shadow-sm" : ""
                  }`}
                  onClick={() => setMode("brand")}
                >
                  Brand
                </button>
              </div>
            </div>
          )}

          {step === "PHONE" ? (
            <SignupForm
              mode={mode}
              setMode={setMode}
              formData={formData}
              handleChange={handleChange}
              phoneNumber={phoneNumber}
              handlePhoneNumberChange={handlePhoneNumberChange}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              error={error}
              handleSubmit={handleSubmit}
              loading={loading}
            />
          ) : (
            <VerifyPhone
              phoneNumber={phoneNumber}
              otp={otp}
              setOtp={setOtp}
              error={error}
              verifyOTP={verifyOTP}
              loading={loading}
              countdown={countdown}
              resendOTP={resendOTP}
              resetForm={resetForm}
            />
          )}

          <div className="text-center text-sm mt-4">
            <span className="text-gray-600">Already have an account? </span>
            <Link
              to="/login"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Sign in
            </Link>
          </div>
          <div id="recaptcha-container" ref={recaptchaRef}></div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
