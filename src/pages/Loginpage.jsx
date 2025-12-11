import React, { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { usedata } from "../context/dataContext";
import { Eye, EyeOff } from "lucide-react";
import logo from "../assets/login-image.png";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const Loginpage = () => {
  const { t } = useTranslation();

  const defaultData = {
    emailId: "",
    password: "",
  };

  const [formData, setFormData] = useState(defaultData);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const inputRefs = useRef({});
  const buttonRef = useRef(null);
  const { login } = usedata();

  const notify = () => toast(t("loginPage.loginSuccess"));

  useEffect(() => {
    inputRefs.current["emailId"]?.focus();
  }, []);

  const inputsField = [
    {
      type: "email",
      placeholder: t("loginPage.emailId"),
      maxLength: 50,
      name: "emailId",
    },
    {
      type: "password",
      placeholder: t("loginPage.password"),
      maxLength: 50,
      name: "password",
    },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setErrors((prev) => ({
      ...prev,
      [name]: "",
      invalidCredentials: "",
    }));
    setFormData({ ...formData, [name]: value });
  };

  const validate = () => {
    let newErrors = {};

    if (!formData.emailId.trim()) {
      newErrors.emailId = t("loginPage.emailRequired");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailId)) {
      newErrors.emailId = t("loginPage.invalidEmailFormat");
    }

    if (!formData.password.trim()) {
      newErrors.password = t("loginPage.passwordRequired");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogIn = () => {
    if (!validate()) return;

    const success = login(formData);

    if (success) {
      notify();
      navigate("/");
    } else {
      setErrors({
        ...errors,
        invalidCredentials: t("loginPage.invalidCredentials"),
      });
    }
  };

  const handleKeyDown = (e, nextFieldName) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (nextFieldName) {
        inputRefs.current[nextFieldName]?.focus();
      } else {
        buttonRef.current?.focus();
      }
    }
  };

  return (
    <div className="w-screen h-screen flex light:bg-white dark:bg-[#0a0f24] blue:bg-[#121212] justify-center">
      <div className="lg:w-[50%] md:w-[50%] w-full flex flex-col justify-center lg:px-20 md:px-20 px-3  light:text-black dark:text-gray-300 blue:text-white">
        <h2 className="text-xl font-bold mb-8 dark:text-gray-200 blue:text-white">
          {t("loginPage.title")}
        </h2>

        <h1 className="text-4xl font-bold mb-2 whitespace-pre-line">
          {t("loginPage.welcomeHeadline")}
        </h1>

        <p className="text-gray-500 mb-6 dark:text-gray-300">
          {t("loginPage.welcomeText")}
        </p>

        {errors.invalidCredentials && (
          <span className="text-red-500 dark:text-cyan-200 mb-2">
            {errors.invalidCredentials}
          </span>
        )}

        {inputsField.map((item, i) => (
          <div key={i} className=" md:w-[90%] lg:w-[90%] mt-3 relative">
            <input
              className="w-full py-3 px-3 mb-3 rounded-xl border-2 light:border-blue-400 
                         light:text-black dark:text-gray-200 
                         placeholder-gray-400 dark:placeholder-gray-300
                         blue:text-white blue:bg-[#2e2e2e] blue:border-[#555]"
              type={
                item.name === "password" && showPassword ? "text" : item.type
              }
              placeholder={item.placeholder}
              maxLength={item.maxLength}
              name={item.name}
              value={formData[item.name] || ""}
              onChange={handleChange}
              ref={(el) => (inputRefs.current[item.name] = el)}
              onKeyDown={(e) => handleKeyDown(e, inputsField[i + 1]?.name)}
            />

            {item.name === "password" && (
              <span
                className="absolute right-3 top-4 cursor-pointer"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? (
                  <Eye
                    opacity={0.6}
                    className="dark:text-gray-200 light:text-indigo-500"
                  />
                ) : (
                  <EyeOff
                    opacity={0.6}
                    className="dark:text-gray-200 light:text-indigo-500"
                  />
                )}
              </span>
            )}

            {errors[item.name] && (
              <p className="text-red-500 text-[10px] px-1 dark:text-cyan-200 blue:text-white">
                {errors[item.name]}
              </p>
            )}
          </div>
        ))}

        <button
          className="mt-6 light:bg-linear-to-r light:from-[#3b82f6] light:to-[#2563eb] light:text-white py-2 px-4 font-semibold 
                     rounded-xl md:w-[90%] lg:w-[90%] text-lg
                     light:hover:bg-indigo-700
                     blue:bg-[#f7f75b] blue:hover:bg-[#f2f21b] blue:text-black"
          onClick={handleLogIn}
          ref={buttonRef}
        >
          {t("loginPage.loginButton")}
        </button>

        <span className="mt-4 dark:text-gray-200">
          {t("loginPage.dontHaveAccount")}{" "}
          <Link to="/register">
            <span className="text-indigo-500 dark:text-cyan-200 blue:text-[#4077d1]">
              {t("loginPage.createAccount")}
            </span>
          </Link>
        </span>

        <span className="mt-4 dark:text-gray-200">
          <Link to="/forgotpassword">
            <span className="text-indigo-500 dark:text-cyan-200 blue:text-[#4077d1]">
              {t("loginPage.forgotPassword")}
            </span>
          </Link>
        </span>
      </div>

      <div className="w-[40%] hidden md:flex items-center justify-center p-10">
        <img src={logo} alt="login" className="w-[90%] drop-shadow-2xl" />
      </div>
    </div>
  );
};

export default Loginpage;
