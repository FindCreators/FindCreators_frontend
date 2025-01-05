import { useState, useEffect, useRef } from "react";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../configs/firebaseConfig";
import toast from "react-hot-toast";
import {
  loginFailure,
  loginStart,
  loginSuccess,
} from "../redux/slices/authSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../redux/actions/authActions";
import { logout } from "../network/apiClient";

export const usePhoneAuth = ({ onSuccess, onError, isSignup = false } = {}) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("PHONE");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const recaptchaVerifierRef = useRef(null);
  const timerRef = useRef(null); // Add timer reference

  // Handle countdown timer
  useEffect(() => {
    if (countdown > 0) {
      timerRef.current = setInterval(() => {
        setCountdown((prevCount) => {
          if (prevCount <= 1) {
            clearInterval(timerRef.current);
            return 0;
          }
          return prevCount - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [countdown]);

  useEffect(() => {
    initializeRecaptcha();
    return () => {
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const initializeRecaptcha = async () => {
    try {
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }

      const verifier = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "invisible",
        callback: () => console.log("reCAPTCHA verified"),
        "expired-callback": () => {
          setError("reCAPTCHA expired. Please try again.");
          initializeRecaptcha();
        },
      });

      await verifier.render();
      window.recaptchaVerifier = verifier;
      recaptchaVerifierRef.current = verifier;
    } catch (error) {
      setError(
        "Error initializing verification system. Please refresh the page."
      );
    }
  };

  const handlePhoneNumberChange = (value) => {
    setPhoneNumber(value);
    setError("");
  };

  const handleLogout = () => {
    dispatch(logout());
    logout();
    navigate("/login", { replace: true });
  };

  const sendOTP = async (phoneNumber) => {
    setLoading(true);
    setError("");

    try {
      if (!window.recaptchaVerifier) {
        await initializeRecaptcha();
      }

      const formattedPhoneNumber = phoneNumber.startsWith("+")
        ? phoneNumber
        : `+${phoneNumber}`;

      const confirmationResult = await signInWithPhoneNumber(
        auth,
        formattedPhoneNumber,
        window.recaptchaVerifier
      );
      window.confirmationResult = confirmationResult;
      setCountdown(30); // Reset countdown to 30 seconds
      setStep("OTP");
      toast.success("OTP sent successfully!");
    } catch (error) {
      const errorMessage =
        error.code === "auth/invalid-phone-number"
          ? "Invalid phone number format."
          : error.code === "auth/too-many-requests"
          ? "Too many attempts. Please try again later."
          : "Error sending OTP. Please try again.";
      setError(errorMessage);
      onError?.(errorMessage);
      await initializeRecaptcha();
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async (e) => {
    e?.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (!otp || otp.length !== 6) {
        throw new Error("Please enter a valid 6-digit OTP");
      }

      if (!window.confirmationResult) {
        throw new Error("OTP session expired. Please request a new OTP");
      }

      const result = await window.confirmationResult.confirm(otp);
      if (result.user) {
        if (isSignup) {
          const savedData = JSON.parse(localStorage.getItem("signupData"));
          if (!savedData) throw new Error("Signup data not found");
          onSuccess?.(savedData);
        } else {
          onSuccess?.(result.user);
        }
        // toast.success("Phone number verified successfully!");
      }
    } catch (error) {
      const errorMessage =
        error.code === "auth/invalid-verification-code"
          ? "Invalid OTP. Please try again."
          : error.message;
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const resendOTP = async () => {
    if (countdown > 0) return; // Prevent resending if countdown is active
    setOtp("");
    await sendOTP(phoneNumber); // This will reset the countdown internally
  };

  const resetForm = () => {
    setStep("PHONE");
    setError("");
    setOtp("");
    setPhoneNumber("");
    setCountdown(0);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    initializeRecaptcha();
  };

  return {
    phoneNumber,
    setPhoneNumber,
    otp,
    setOtp,
    step,
    setStep,
    error,
    loading,
    countdown,
    handlePhoneNumberChange,
    sendOTP,
    verifyOTP,
    resetForm,
    resendOTP,
  };
};
