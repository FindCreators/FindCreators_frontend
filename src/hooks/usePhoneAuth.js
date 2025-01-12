import { useState, useEffect, useRef } from "react";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../configs/firebaseConfig";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
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
  const timerRef = useRef(null);
  const recaptchaContainerRef = useRef(null);

  useEffect(() => {
    // Create recaptcha container if it doesn't exist
    if (!document.getElementById("recaptcha-container")) {
      recaptchaContainerRef.current = document.createElement("div");
      recaptchaContainerRef.current.id = "recaptcha-container";
      document.body.appendChild(recaptchaContainerRef.current);
    }

    initializeRecaptcha();

    return () => {
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      // Clean up recaptcha container
      if (recaptchaContainerRef.current) {
        document.body.removeChild(recaptchaContainerRef.current);
      }
    };
  }, []);

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

  const initializeRecaptcha = async () => {
    try {
      // Clear existing recaptcha instance
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }

      // Ensure container exists
      const container = document.getElementById("recaptcha-container");
      if (!container) {
        throw new Error("Recaptcha container not found");
      }

      const verifier = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "invisible",
        callback: () => {
          console.log("reCAPTCHA verified");
        },
        "expired-callback": () => {
          setError("reCAPTCHA expired. Please try again.");
          initializeRecaptcha();
        },
      });

      await verifier.render();
      window.recaptchaVerifier = verifier;
      recaptchaVerifierRef.current = verifier;
    } catch (error) {
      console.error("Error initializing reCAPTCHA:", error);
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

  const sendOTP = async () => {
    if (!phoneNumber) {
      setError("Phone number is required.");
      toast.error("Phone number is required.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Ensure recaptcha is initialized
      if (!window.recaptchaVerifier) {
        await initializeRecaptcha();
      }

      const formattedPhoneNumber = phoneNumber.startsWith("+")
        ? phoneNumber
        : `+${phoneNumber}`;

      const verifier = window.recaptchaVerifier;
      if (!verifier) {
        throw new Error("Verification system not initialized");
      }

      const confirmationResult = await signInWithPhoneNumber(
        auth,
        formattedPhoneNumber,
        verifier
      );

      window.confirmationResult = confirmationResult;
      setCountdown(30);
      setStep("OTP");
      toast.success("OTP sent successfully!");
    } catch (error) {
      console.error("Error sending OTP:", error);

      let errorMessage = "Error sending OTP. Please try again.";
      if (error.code === "auth/invalid-phone-number") {
        errorMessage =
          "Invalid phone number. Please enter a valid phone number.";
      } else if (error.code === "auth/too-many-requests") {
        errorMessage = "Too many attempts. Please try again later.";
      }

      setError(errorMessage);
      toast.error(errorMessage);

      // Attempt to reinitialize recaptcha
      try {
        await initializeRecaptcha();
      } catch (recaptchaError) {
        console.error("Error reinitializing reCAPTCHA:", recaptchaError);
      }
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
    if (countdown > 0) return;
    setOtp("");
    await sendOTP();
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
