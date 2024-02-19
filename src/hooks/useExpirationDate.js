import { useState } from "react";

const useExpirationDate = () => {
  const [expired, setExpired] = useState(false);

  const checkExpiryDate = (expirationTime) => {
    const expirationTimestamp = Date.parse(expirationTime);

    // console.log(expirationTimestamp, Date.now());

    if (isNaN(expirationTimestamp)) {
      console.error("Invalid expirationTime format");
      return;
    }

    if (expirationTimestamp < Date.now().toString()) {
      console.log(`expired at ${expirationTime}`);
      setExpired(true);
    } else {
      console.log(`Not expired`);
    }
  };

  return {
    checkExpiryDate,
    expired,
    setExpired,
  };
};

export default useExpirationDate;
