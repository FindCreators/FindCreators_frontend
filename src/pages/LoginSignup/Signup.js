import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter, useNavigate } from 'react-router';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { usePhoneAuth } from '../../hooks/usePhoneAuth';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import toast from 'react-hot-toast';
import { createUser, validateNewEmailorPhone } from '../../network/networkCalls';

const Signup = () => {
  const [mode, setMode] = useState('creator');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(''); // Add error state
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
    handleOTPChange,
    sendOTP,
    verifyOTP,
    resetForm,
    resendOTP,
  } = usePhoneAuth({
    onSuccess: () => {
        formData.phone = phoneNumber.substring(1, phoneNumber.length)
        try{
        const data = createUser(mode,formData)  
        navigate('/home');
        
        }catch(e){
            setError("Something went wrong")
        }
       // Navigate to dashboard or any other page after successful signup
    },
    onError: (errorMessage) => {
      toast.error(errorMessage);
    }
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear any previous errors

    // Validate phone number
    if (phoneNumber===undefined || phoneNumber==="" || phoneNumber.length<13) {

      setError('Please enter a valid 10-digit phone number');
      return;
    }

    // Validate email and phone
    try{
        const validationResponse = await validateNewEmailorPhone({
            entity: mode,
            email: formData.email,
            phone: phoneNumber.substring(1, phoneNumber.length),
          });
          if (validationResponse.error) {
            setError(validationResponse.error);
            return;
          }
          sendOTP();
      
    }catch(e){
        setError("Something went wrong");
    }
    
  };

  useEffect(() => {
    if (mode === 'creator') {
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        password: '',
      });
    } else {
      setFormData({
        companyName: '',
        email: '',
        phone: '',
        password: '',
      });
    }
  }, [mode]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md md:max-w-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">{`${step==='PHONE'?"Sign Up":"Verify Phone"}`}</h2>
        {step === 'PHONE' && (
          <div className="flex justify-center mb-6">
            <button
              className={`px-4 py-2 rounded-l ${mode === 'creator' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              onClick={() => setMode('creator')}
            >
              Creator
            </button>
            <button
              className={`px-4 py-2 rounded-r ${mode === 'brand' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              onClick={() => setMode('brand')}
            >
              Brand
            </button>
          </div>
        )}
        {step === 'PHONE' ? (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700">{mode === 'creator' ? 'Full Name' : 'Company Name'}</label>
              <input
                type="text"
                name={mode === 'creator' ? 'fullName' : 'companyName'}
                value={mode === 'creator' ? formData.fullName : formData.companyName}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                required
              />
            </div>
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
            <div className="mb-4 relative">
              <label className="block text-gray-700">Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-10 text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
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
        ) :(
            <div>
              <div className="mb-6 ">
                <p className="text-gray-700 text-center ">Code has been sent to {phoneNumber}</p>
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
                       
                        if (index < 5 && value!='' ) {
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
        <div id="recaptcha-container" ref={recaptchaRef}></div>
      </div>
    </div>
  );
};

export default Signup;
