import React, { createContext, useState, useContext, useEffect } from "react";
import CryptoJS from "crypto-js";

const DataContext = createContext();

export const usedata = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem("currentUser");
    return saved ? JSON.parse(saved) : null;
  });
  const [registerData, setRegisterData] = useState(() => {
    const stored = localStorage.getItem("registerData");
    return stored ? JSON.parse(stored) : [];
  });
  const tempMode = localStorage.getItem("theme")
    ? localStorage.getItem("theme")
    : "light";
  const [theme, setTheme] = useState(tempMode);

  useEffect(() => {
    localStorage.setItem("theme", theme);

    document.documentElement.classList.remove("light", "dark", "blue");

    if (theme === "light") document.documentElement.classList.add("light");
    if (theme === "dark") document.documentElement.classList.add("dark");
    if (theme === "blue") document.documentElement.classList.add("blue");
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("registerData", JSON.stringify(registerData));
  }, [registerData]);

  const login = (userObj) => {
    const users = localStorage.getItem("registerData");
    if (!users) return false;

    const parsedUsers = JSON.parse(users);

    let foundUser = null;

    for (const u of parsedUsers) {
      let decryptedPassword = "";

      try {
        if (u.password) {
          const bytes = CryptoJS.AES.decrypt(u.password, "my-secret-key");
          decryptedPassword = bytes.toString(CryptoJS.enc.Utf8);
        }
      } catch (err) {
        console.error("Decrypt error: ", err);
        continue;
      }

      if (!decryptedPassword) decryptedPassword = u.password;

      if (
        u.email === userObj.emailId &&
        decryptedPassword === userObj.password
      ) {
        foundUser = u;
        break;
      }
    }

    if (foundUser) {
      localStorage.setItem("currentUser", JSON.stringify(foundUser));
      setCurrentUser(foundUser);
      return true;
    }

    return false;
  };

  const register = (userObj) => {
    const userExist = registerData.find((u) => u.email === userObj.email);

    if (userExist) return false;

    const encryptedPass = CryptoJS.AES.encrypt(
      userObj.password,
      "my-secret-key"
    ).toString();

    const newUser = {
      ...userObj,
      password: encryptedPass,
      confirmPassword: undefined,
    };

    setRegisterData([...registerData, newUser]);
    localStorage.setItem("currentUser", JSON.stringify(newUser));
    setCurrentUser(newUser);
    return true;
  };
  const logout = () => {
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
  };
  const handleThemeToggle = (mode) => {
    setTheme(mode);
  };
  const updateCurrentUser = (updatedUser) => {
    setCurrentUser(updatedUser);
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));

    const updatedRegisterData = registerData.map((u) =>
      u.email === updatedUser.email ? { ...u, ...updatedUser } : u
    );

    setRegisterData(updatedRegisterData);
    localStorage.setItem("registerData", JSON.stringify(updatedRegisterData));
  };

  return (
    <DataContext.Provider
      value={{
        currentUser,
        login,
        register,
        logout,
        handleThemeToggle,
        updateCurrentUser,
        theme,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export default DataProvider;
