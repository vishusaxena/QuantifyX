import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { usedata } from "../context/dataContext";
import { Eye, EyeOff } from "lucide-react";
import logo from "../assets/login-image.png";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const RegisterPage = () => {
  const { t } = useTranslation();

  const inputsField = [
    {
      label: t("registerPage.labelName"),
      type: "text",
      placeholder: t("registerPage.placeholderName"),
      maxLength: 50,
      name: "name",
    },
    {
      label: t("registerPage.labelEmail"),
      type: "email",
      placeholder: t("registerPage.placeholderEmail"),
      maxLength: 50,
      name: "email",
    },
    {
      label: t("registerPage.labelPhone"),
      type: "text",
      placeholder: t("registerPage.placeholderPhone"),
      maxLength: 10,
      name: "phoneNo",
    },
    {
      label: t("registerPage.labelPassword"),
      type: "password",
      placeholder: t("registerPage.placeholderPassword"),
      maxLength: 50,
      name: "password",
    },
    {
      label: t("registerPage.labelConfirmPassword"),
      type: "password",
      placeholder: t("registerPage.placeholderConfirmPassword"),
      maxLength: 50,
      name: "confirmPassword",
    },
  ];

  const defaultData = {
    name: "",
    email: "",
    phoneNo: "",
    password: "",
    confirmPassword: "",
  };

  const [formData, setFormData] = useState(defaultData);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();
  const { register } = usedata();
  const inputRefs = useRef({});
  const buttonRef = useRef(null);

  const notify = () => toast(t("registerPage.successRegister"));

  useEffect(() => {
    inputRefs.current["name"]?.focus();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
      userExists: "",
    }));
  };

  const validate = () => {
    let newErrors = {};

    if (!formData.name.trim())
      newErrors.name = t("registerPage.errNameRequired");

    if (!formData.email.trim()) {
      newErrors.email = t("registerPage.errEmailRequired");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t("registerPage.errEmailInvalid");
    }

    if (!formData.phoneNo.trim()) {
      newErrors.phoneNo = t("registerPage.errPhoneRequired");
    } else if (!/^[6-9][0-9]{9}$/.test(formData.phoneNo)) {
      newErrors.phoneNo = t("registerPage.errPhoneInvalid");
    }

    if (!formData.password.trim()) {
      newErrors.password = t("registerPage.errPasswordRequired");
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = t("registerPage.errConfirmRequired");
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t("registerPage.errPasswordMismatch");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = () => {
    if (!validate()) return;

    const success = register(formData);

    if (success) {
      navigate("/");
      notify();
    } else {
      setErrors((prev) => ({
        ...prev,
        userExists: t("registerPage.userExists"),
      }));
    }
  };

  const handleKeyDown = (e, nextFieldName) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (nextFieldName && inputRefs.current[nextFieldName]) {
        inputRefs.current[nextFieldName].focus();
      } else {
        buttonRef.current?.focus();
      }
    }
  };

  const getPasswordStrength = (pwd) => {
    if (!pwd) return "";

    const strong = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
    const medium = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;

    if (strong.test(pwd)) return t("registerPage.passwordStrengthStrong");
    if (medium.test(pwd)) return t("registerPage.passwordStrengthMedium");
    return t("registerPage.passwordStrengthWeak");
  };

  const strength = getPasswordStrength(formData.password);

  return (
    <div className="w-screen h-screen flex justify-center items-center dark:bg-[#0a0f24] blue:bg-[#121212]">
      <div className="md:w-[80%] lg:w-[80%] flex p-3">
        <div className="hidden md:flex justify-center w-[30%] bg-linear-to-br from-indigo-500 to-indigo-600 text-white">
          <img src={logo} alt="login" className="w-full drop-shadow-2xl" />
        </div>

        <div className="lg:w-[70%] w-full h-full px-2">
          <div className="w-full px-2">
            <h2 className="text-3xl font-semibold text-start mb-6 text-gray-800 dark:text-gray-200 blue:text-white">
              {t("registerPage.title")}
            </h2>

            {errors.userExists && (
              <p className="text-center text-red-500 mb-2 dark:text-gray-200 blue:text-white">
                {errors.userExists}
              </p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 w-full px-2">
              {inputsField.map((item, i) => (
                <div key={i} className="relative w-full">
                  <label className="text-sm font-medium text-gray-700 mb-1 block dark:text-gray-200 blue:text-white">
                    {item.label}
                  </label>

                  <input
                    className={`w-full py-2 px-3 mb-2 rounded-lg border dark:text-gray-100 blue:text-white ${
                      errors[item.name]
                        ? "border-red-500"
                        : "border-blue-700 focus:border-indigo-500"
                    } outline-none text-gray-900`}
                    type={
                      item.name === "password"
                        ? showPassword
                          ? "text"
                          : "password"
                        : item.name === "confirmPassword"
                        ? showConfirmPassword
                          ? "text"
                          : "password"
                        : item.type
                    }
                    placeholder={item.placeholder}
                    maxLength={item.maxLength}
                    name={item.name}
                    value={formData[item.name]}
                    onChange={handleChange}
                    ref={(el) => (inputRefs.current[item.name] = el)}
                    onKeyDown={(e) =>
                      handleKeyDown(e, inputsField[i + 1]?.name)
                    }
                  />

                  {["password", "confirmPassword"].includes(item.name) && (
                    <span
                      className="absolute right-3 top-[38px] cursor-pointer text-gray-500"
                      onClick={() =>
                        item.name === "password"
                          ? setShowPassword((p) => !p)
                          : setShowConfirmPassword((p) => !p)
                      }
                    >
                      {item.name === "password" ? (
                        showPassword ? (
                          <Eye size={20} />
                        ) : (
                          <EyeOff size={20} />
                        )
                      ) : showConfirmPassword ? (
                        <Eye size={20} />
                      ) : (
                        <EyeOff size={20} />
                      )}
                    </span>
                  )}

                  {item.name === "password" && formData.password && (
                    <p
                      className={`text-xs mt-1 ${
                        strength === t("registerPage.passwordStrengthStrong")
                          ? "text-green-600"
                          : strength ===
                            t("registerPage.passwordStrengthMedium")
                          ? "text-orange-500"
                          : "text-red-500"
                      }`}
                    >
                      {t("registerPage.passwordStrengthLabel")}: {strength}
                    </p>
                  )}

                  {item.name === "confirmPassword" &&
                    formData.confirmPassword &&
                    formData.password === formData.confirmPassword && (
                      <p className="text-xs text-green-600 mt-1">
                        {t("registerPage.passwordsMatch")}
                      </p>
                    )}

                  {errors[item.name] && (
                    <p className="text-xs text-red-500 mt-1 dark:text-gray-200 blue:text-white">
                      {errors[item.name]}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <button
              className="px-7 mx-2 rounded-[5px] light:bg-linear-to-r light:from-[#3b82f6] light:to-[#2563eb] hover:bg-indigo-700 light:text-white py-2 font-semibold text-lg transition blue:bg-[#f7f75b] blue:hover:bg-[#f2f21b] blue:text-black"
              onClick={handleRegister}
              ref={buttonRef}
            >
              {t("registerPage.buttonSignup")}
            </button>

            <p className="text-center mt-4 text-gray-600 dark:text-gray-200 blue:text-white">
              {t("registerPage.alreadyHaveAccount")}{" "}
              <Link to="/login" className="text-indigo-600 font-semibold">
                {t("registerPage.signin")}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
