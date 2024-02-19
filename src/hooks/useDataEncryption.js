import CryptoJS from "crypto-js";

const useDataEncryption = () => {
  const encryptData = (value, password) => {
    try {
      const salt = CryptoJS.lib.WordArray.random(128 / 8);
      const key = CryptoJS.PBKDF2(password, salt, {
        keySize: 256 / 32,
        iterations: 10000,
      });

      const iv = CryptoJS.lib.WordArray.random(128 / 8);
      const encrypted = CryptoJS.AES.encrypt(JSON.stringify(value), key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
      }).toString();

      const result = salt.toString() + iv.toString() + encrypted;

      return result;
    } catch (error) {
      console.log(error.message);
    }
  };

  const decryptData = (encryptedData, password) => {
    try {
      const salt = CryptoJS.enc.Hex.parse(encryptedData.substring(0, 32));
      const iv = CryptoJS.enc.Hex.parse(encryptedData.substring(32, 64));
      const encrypted = encryptedData.substring(64);

      const key = CryptoJS.PBKDF2(password, salt, {
        keySize: 256 / 32,
        iterations: 10000,
      });
      const decrypted = CryptoJS.AES.decrypt(
        { ciphertext: CryptoJS.enc.Base64.parse(encrypted) },
        key,
        { iv: iv, mode: CryptoJS.mode.CBC }
      );

      if (!decrypted) {
        throw new Error("Failed to decrypt the message.");
      }
      if (!decrypted.sigBytes) {
        throw new Error(
          "Failed to decrypt the message. Authentication failed."
        );
      }
      const result = JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
      // const result = JSON.parse(CryptoJS.enc.Utf8.stringify(decrypted))

      if (typeof result === "undefined") {
        throw new Error("Failed to decrypt the message. Result is undefined.");
      }

      return result;
    } catch (error) {
      console.log(error.message);
    }
  };

  return {
    encryptData,
    decryptData,
  };
};

export default useDataEncryption;
