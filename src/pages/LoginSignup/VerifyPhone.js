import React from "react";

const VerifyPhone = ({
  phoneNumber,
  otp,
  setOtp,
  error,
  verifyOTP,
  loading,
  countdown,
  resendOTP,
  resetForm,
}) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg inline-block">
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
                    prevOtp.slice(0, index) + value + prevOtp.slice(index + 1);
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
            Verifying...
          </span>
        ) : (
          "Verify OTP"
        )}
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
          {countdown > 0 ? `Resend code in ${countdown}s` : "Resend code"}
        </button>

        <button
          onClick={resetForm}
          className="block w-full text-sm text-blue-600 hover:text-blue-700"
        >
          Change phone number
        </button>
      </div>
    </div>
  );
};

export default VerifyPhone;
