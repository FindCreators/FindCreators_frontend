import { useState, useEffect, useRef } from "react";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../configs/firebaseConfig";
import toast from "react-hot-toast";

export const usePhoneAuth = ({ onSuccess, onError } = {}) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("PHONE");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const recaptchaVerifierRef = useRef(null);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const initializeRecaptcha = async () => {
    try {
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
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
      console.error("reCAPTCHA initialization error:", error);
      setError(
        "Error initializing verification system. Please refresh the page."
      );
      onError?.("Error initializing verification system");
    }
  };

  useEffect(() => {
    initializeRecaptcha();
    return () => {
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }
    };
  }, []);

  const handlePhoneNumberChange = (value) => {
    setPhoneNumber(value);
    setError("");
  };

  const sendOTP = async (e) => {
    e?.preventDefault();
    setLoading(true);
    setError("");

    if (!phoneNumber || phoneNumber.length < 10) {
      setError("Please enter a valid phone number");
      setLoading(false);
      return;
    }

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
      setCountdown(30);
      setStep("OTP");
      toast.success("OTP sent successfully!");
    } catch (error) {
      console.error("Error sending OTP:", error);

      // Handle specific error cases
      let errorMessage = "Error sending OTP. Please try again.";
      if (error.code === "auth/invalid-phone-number") {
        errorMessage = "Invalid phone number format.";
      } else if (error.code === "auth/too-many-requests") {
        errorMessage = "Too many attempts. Please try again later.";
      }

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
        onSuccess?.();
        toast.success("Phone number verified successfully!");
      }
    } catch (error) {
      console.error("OTP verification error:", error);
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
    initializeRecaptcha();
  };

  return {
    phoneNumber,
    otp,
    setOtp,
    step,
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
