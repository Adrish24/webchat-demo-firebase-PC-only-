import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

const SignIn = () => {
  const [phoneNumber, setPhoneNumber] = useState("+91");
  const { sendCode } = useAuth();

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    await sendCode(phoneNumber);
  };

  // Function to handle phone number input change
  const handlePhoneNumberChange = (e) => {
    let sanitizedValue = e.target.value.replace(/[^0-9+]/g, "");

    // Ensure the plus sign is at the beginning
    if (sanitizedValue.startsWith("+")) {
      sanitizedValue = "+" + sanitizedValue.slice(1).replace(/\+/g, "");
    } else {
      sanitizedValue = sanitizedValue.replace(/\+/g, "");
    }

    setPhoneNumber(sanitizedValue);
  };

  return (
    <div className="bg-neutral-900 m-auto w-[300px] p-8 rounded-md">
      <h1 className="text-neutral-50 mb-8 text-[24px]">Sign In</h1>
      <form className="flex flex-col" onSubmit={handleSubmit}>
        {/* Phone number input */}
        <span className="bg-neutral-400 px-2 py-1 rounded-sm mb-8">
          <input
            type="text"
            value={phoneNumber}
            className="w-full bg-transparent placeholder:text-neutral-900 border-none outline-none"
            placeholder="Enter your number..."
            onChange={handlePhoneNumberChange}
          />
        </span>
        {/* Submit button */}
        <button type="submit" className="bg-neutral-300 px-2 py-1 rounded-md">
          Send OTP
        </button>
      </form>
      {/* Container for reCAPTCHA */}
      <div id="recaptcha-container"></div>
    </div>
  );
};

export default SignIn;
