import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { usePhoneAuth } from '../../hooks/usePhoneAuth';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import toast from 'react-hot-toast';
import { loginUser } from '../../network/networkCalls';

const Login = () => {
  // const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState(''); // Add error state
  const navigate = useNavigate();

  const {
    phoneNumber,
    otp,
    setOtp,
    step,
    loading,
    countdown,
    handlePhoneNumberChange,
    handleOTPChange,
    sendOTP,
    verifyOTP,
    resetForm,
    resendOTP,
  } = usePhoneAuth({
    onSuccess: () => {
      try{

        const data = loginUser( phoneNumber.substring(1, phoneNumber.length))  
        navigate('/home');
        
        }catch(e){
            setError("Something went wrong")
        }
    },
    onError: (errorMessage) => {
      toast.error(errorMessage);
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear any previous errors

    // Validate phone number
   
    if (phoneNumber===undefined || phoneNumber==="" || phoneNumber.length<13) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    // Send OTP
    sendOTP();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md md:max-w-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">{`${step === 'PHONE' ? "Login":"Verify Phone"}`}</h2>
        {step === 'PHONE' ? (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700">Phone</label>
              <PhoneInput
                international
                defaultCountry="IN"
                value={phoneNumber}
                onChange={handlePhoneNumberChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
              disabled={loading}
            >
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </form>
        ) : (
          <div>
            <div className="mb-6 ">
              <p className="text-center text-gray-700">Code has been sent to {phoneNumber}</p>
            </div>
            <div className="mb-4 flex justify-center">
              {[...Array(6)].map((_, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  value={otp[index] || ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^[0-9]*$/.test(value)) {
                      setOtp((prevOtp) => {
                        const newOtp = prevOtp.slice(0, index) + value + prevOtp.slice(index + 1);
                       
                        return newOtp;
                      });
                      if (index < 5) {
                        document.getElementById(`otp-${index + 1}`).focus();
                      }
                    }
                  }}
                  onKeyUp={(e) => {
                    if (e.key === 'Backspace' && !otp[index]) {
                      setOtp((prevOtp) => prevOtp.slice(0, index) + prevOtp.slice(index + 1));
                      if (index > 0) {
                        document.getElementById(`otp-${index - 1}`).focus();
                      }
                    }
                  }}
                  id={`otp-${index}`}
                  className={` w-10 h-10 mx-1 text-xl  md:w-12 md:h-12 md:mx-2 text-center md:text-2xl border rounded-lg focus:outline-none focus:border-blue-500 `}
                  required
                />
              ))}
            </div>
            {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
            <button
              type="button"
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
              onClick={verifyOTP}
              disabled={loading}
            >
              {loading ? 'Verifying OTP...' : 'Verify'}
            </button>
            <p
              className={`mt-2 text-center ${countdown > 0 ? 'text-gray-500' : 'text-blue-500 cursor-pointer'}`}
              onClick={countdown > 0 ? undefined : resendOTP}
            >
              {countdown > 0 ? `Resend OTP in ${countdown}s` : 'Resend OTP'}
            </p>
            <p
              className="mt-2 text-center text-blue-500 cursor-pointer"
              onClick={resetForm}
            >
              Change Number
            </p>
          </div>
        )}
        <div id="recaptcha-container"></div>
      </div>
    </div>
  );
};

export default Login;
